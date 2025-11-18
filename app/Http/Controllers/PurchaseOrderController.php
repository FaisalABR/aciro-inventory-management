<?php

namespace App\Http\Controllers;

use App\Events\ROPNotification;
use App\Exceptions\Barang\BarangException;
use App\Jobs\SendWhatsappJob;
use App\Mail\NotifikasiPengirimanMail;
use App\Models\PembayaranPurchaseOrder;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\Role;
use App\Models\Supplier;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class PurchaseOrderController extends Controller
{
    protected $url;

    public function __construct()
    {
        $this->url = config('app.url');
    }

    public function index()
    {
        $query = PurchaseOrder::with('supplier')->select(
            'purchase_order_id',
            'uuid',
            'nomor_referensi',
            'tanggal_order',
            'supplier_id',
            'catatan',
            'status',
            DB::raw('(SELECT COUNT (DISTINCT barang_id) FROM purchase_order_items WHERE purchase_order_id = purchase_orders.purchase_order_id) as total_unique_items'),
            DB::raw('(SELECT SUM(quantity) FROM purchase_order_items WHERE purchase_order_id = purchase_orders.purchase_order_id) as total_quantity'),
            DB::raw('(SELECT SUM(quantity * harga_beli) FROM purchase_order_items WHERE purchase_order_id = purchase_orders.purchase_order_id) as total_pembelian')
        );

        $formattedValue = $query->orderBy('created_at', 'desc')->get()->map(function ($purchaseOrder) {
            return [
                'id'                 => $purchaseOrder->purchase_order_id,
                'uuid'               => $purchaseOrder->uuid,
                'nomor_referensi'    => $purchaseOrder->nomor_referensi,
                'tanggal_order'      => $purchaseOrder->tanggal_order,
                'total_quantity'     => $purchaseOrder->total_quantity,
                'total_unique_items' => $purchaseOrder->total_unique_items,
                'status'             => $purchaseOrder->status,
                'total_pembelian'   => $purchaseOrder->total_pembelian,
                'supplier'           => [
                    'id'   => $purchaseOrder->supplier->supplier_id,
                    'name' => $purchaseOrder->supplier->name,
                ],
            ];
        });

        return Inertia::render('PurchaseOrder/Index', [
            'data' => $formattedValue,
        ]);
    }

    public function showCreate()
    {
        $data = Supplier::all();

        $optionSupplier = $data->map(function ($supplier) {
            return [
                'value' => $supplier->supplier_id,
                'label' => $supplier->name,
            ];
        });

        return Inertia::render('PurchaseOrder/FormPurchase', [
            'isUpdate'       => false,
            'optionSupplier' => $optionSupplier,
        ]);
    }

    public function showEdit($uuid)
    {
        $po   = PurchaseOrder::where('uuid', $uuid)->with(['supplier', 'items.barang'])->firstOrFail();
        $data = Supplier::all();

        $optionSupplier = $data->map(function ($supplier) {
            return [
                'value' => $supplier->supplier_id,
                'label' => $supplier->name,
            ];
        });

        return Inertia::render('PurchaseOrder/FormPurchase', [
            'isUpdate'       => true,
            'data'           => $po,
            'optionSupplier' => $optionSupplier,
        ]);
    }

    public function showDetail($uuid)
    {
        $po      = PurchaseOrder::where('uuid', $uuid)->with('supplier')->firstOrFail();
        $poItems = PurchaseOrderItem::where('purchase_order_id', $po->purchase_order_id)->with('barang')->get();
        $pembayaranPO = PembayaranPurchaseOrder::where('purchase_order_id', $po->purchase_order_id)->get();
        $totalPembelian = $poItems->sum(function ($item) {
            return $item->harga_beli * ($item->quantity ?? 1);
        });

        $data = [
            'id'                           => $po->purchase_order_id,
            'uuid'                         => $po->uuid,
            'nomor_referensi'              => $po->nomor_referensi,
            'tanggal_order'                => $po->tanggal_order,
            'catatan'                      => $po->catatan,
            'status'                       => $po->status,
            'verifikasi_kepala_toko'       => $po->verifikasi_kepala_toko,
            'verifikasi_kepala_gudang'     => $po->verifikasi_kepala_gudang,
            'verifikasi_kepala_pengadaan'  => $po->verifikasi_kepala_pengadaan,
            'verifikasi_kepala_accounting' => $po->verifikasi_kepala_accounting,
            'kepala_toko_menolak'       => $po->kepala_toko_menolak,
            'kepala_gudang_menolak'     => $po->kepala_gudang_menolak,
            'kepala_pengadaan_menolak'  => $po->kepala_pengadaan_menolak,
            'kepala_accounting_menolak' => $po->kepala_accounting_menolak,
            'catatan_penolakan' => $po->catatan_penolakan,
            'catatan_penolakan_supplier' => $po->catatan_penolakan_supplier,
            'tanggal_sampai' => $po->tanggal_sampai,
            'pembayaran'                   => $pembayaranPO,
            'dokumen_pengiriman' => $po->dokumen_pengiriman,
            'total_pembelian' => $totalPembelian,
            'supplier'                     => [
                'id'   => $po->supplier->supplier_id,
                'name' => $po->supplier->name,
            ],
            'items' => $poItems,
        ];

        return Inertia::render('PurchaseOrder/Detail', [
            'data' => $data,
        ]);
    }

    public function create(Request $request)
    {
        $validated = $request->validate([
            'tanggal_order'     => 'required',
            'catatan'           => 'nullable',
            'supplier_id'       => 'required',
            'items'             => 'required|array|min:1',
            'items.*.barang_id' => 'required|exists:barangs,barang_id',
            'items.*.quantity'  => 'required|integer|min:1',
            'items.*.harga_beli' => 'required|integer|min:1',
        ]);

        $totalPO = PurchaseOrder::count();
        $users   = User::whereHas('roles', function ($q) {
            $q->whereIn('name', ['kepala_gudang', 'kepala_toko', 'kepala_pengadaan', 'kepala_accounting']);
        })->get();

        $PO = PurchaseOrder::create([
            'nomor_referensi' => sprintf('PO-%s-%04d', now()->format('Ymd'), $totalPO + 1),
            'tanggal_order'   => $validated['tanggal_order'],
            'catatan'         => $validated['catatan'] ?? '',
            'status'          => 'BUTUH VERIFIKASI',
            'supplier_id'     => $validated['supplier_id'] ?? '',
        ]);

        foreach ($validated['items'] as $item) {
            $PO->items()->create($item);
        }

        foreach ($users as $user) {
            // Send whatsapp ke kepala toko, kepala gudang, kepala accounting, dan kepala pengadaan
            // Format role agar jadi "Kepala Gudang" bukan "kepala_gudang"
            $roles = $user->roles->pluck('name')
                ->map(fn($r) => ucwords(str_replace('_', ' ', $r)))
                ->implode(', ');

            $text = "Halo {$user->name} ({$roles}), ada PO dengan nomor {$PO->nomor_referensi}. Butuh verifikasi nih.";
            event(new ROPNotification("PO dengan nomor {$PO->nomor_referensi}. Butuh verifikasi nih!", $user->roles->pluck('name')[0]));
            SendWhatsappJob::dispatch($user->noWhatsapp, $text);
        }

        return redirect('/purchase-orders')->with('success', 'PO Berhasil Dibuat berhasil ditambahkan!');
    }

    public function update(Request $request, $uuid)
    {
        $validated = $request->validate([
            'tanggal_order'     => 'required|date',
            'catatan'           => 'nullable|string',
            'supplier_id'       => 'required|exists:suppliers,supplier_id',
            'items'             => 'required|array|min:1',
            'items.*.barang_id' => 'required|exists:barangs,barang_id',
            'items.*.quantity'  => 'required|integer|min:1',
            'items.*.harga_beli' => 'required|integer|min:1',
        ]);

        // Ambil PO berdasarkan UUID
        $PO = PurchaseOrder::where('uuid', $uuid)->firstOrFail();

        // Update PO
        $PO->update([
            'tanggal_order' => $validated['tanggal_order'],
            'catatan'       => $validated['catatan'] ?? '',
            'status'        => 'BUTUH VERIFIKASI',
            'supplier_id'   => $validated['supplier_id'],
        ]);

        // Hapus items lama, buat ulang
        $PO->items()->delete();
        foreach ($validated['items'] as $item) {
            $PO->items()->create($item);
        }

        // Cari user dengan role terkait
        $users = User::whereHas('roles', function ($q) {
            $q->whereIn('name', [
                'kepala_gudang',
                'kepala_toko',
                'kepala_pengadaan',
                'kepala_accounting',
            ]);
        })->with('roles')->get();

        foreach ($users as $user) {
            $roles = $user->roles->pluck('name')
                ->map(fn($r) => ucwords(str_replace('_', ' ', $r)))
                ->implode(', ');

            $text = "Halo {$user->name} ({$roles}), ada PO dengan nomor {$PO->nomor_referensi}. Butuh verifikasi nih.";

            event(new ROPNotification("PO dengan nomor {$PO->nomor_referensi}. Butuh verifikasi nih!", $user->roles->pluck('name')[0]));
            // Kirim notifikasi (kalau perlu detail barang, bisa di-loop terpisah dari $validated['items'])
            SendWhatsappJob::dispatch($user->noWhatsapp, $text);
        }

        return redirect('/purchase-orders')->with('success', 'PO berhasil diperbarui!');
    }

    public function verifikasi($uuid)
    {
        $PO = PurchaseOrder::with('supplier')->where('uuid', $uuid)->first();

        if (Auth::user()->hasRole('kepala_toko')) {
            $PO->verifikasi_kepala_toko = true;
        }

        if (Auth::user()->hasRole('kepala_gudang')) {
            $PO->verifikasi_kepala_gudang = true;
        }

        if (Auth::user()->hasRole('kepala_accounting')) {
            $PO->verifikasi_kepala_accounting = true;
        }

        if (Auth::user()->hasRole('kepala_pengadaan')) {
            $PO->verifikasi_kepala_pengadaan = true;
        }

        if ($PO->verifikasi_kepala_gudang && $PO->verifikasi_kepala_toko && $PO->verifikasi_kepala_pengadaan && $PO->verifikasi_kepala_accounting) {
            $PO->status = 'VERIFIKASI';

            if ($PO->status == 'VERIFIKASI') {
                $tanggal   = Carbon::parse($PO->tanggal_order)->locale('id');
                $formatted = $tanggal->translatedFormat('l, d F Y');
                $text      = "
Halo {$PO->supplier->name},

Kami dari Koperasi Karya Bersama Aciro ingin melakukan pemesanan sesuai Purchase Order (PO):

Nomor PO   : {$PO->nomor_referensi}
Tanggal    : {$formatted}

Link Halaman PO:
{$this->url}:8000/suppliers/{$PO->uuid}/views

Mohon dapat dikonfirmasi dan diproses ketersediaannya.
Terima kasih atas kerjasamanya.

Hormat kami,
Tim Procurement Koperasi Karya Bersama Aciro
            ";

                SendWhatsappJob::dispatch($PO->supplier->noWhatsapp, $text);
                $PO->status = 'TERKIRIM';
                // Kirim email ke supplier
                // kirim email synchronous tapi aman
                try {
                    if ($PO->supplier && $PO->supplier->email) {
                        Mail::to($PO->supplier->email)->send(new NotifikasiPengirimanMail($PO));
                    }
                    $emailSuccess = true;
                } catch (\Exception $e) {
                    Log::error('Gagal kirim email PO ke supplier: ' . $e->getMessage());
                    $emailSuccess = false;
                }

                $PO->save();
                event(new ROPNotification("Purchase Order dengan nomor {$PO->nomor_referensi} sudah diverifikasi dan sudah terkirim!", 'admin_pengadaan'));
                // Pastikan selalu return responsenya
                if ($emailSuccess) {
                    return back()->with('success', 'Purchase Order berhasil diverifikasi dan email terkirim.');
                } else {
                    return back()->with('error', 'PO berhasil diverifikasi, tetapi email gagal dikirim.');
                }
            }
        } else {
            $PO->status = 'VERIFIKASI SEBAGIAN';
        }

        $PO->save();

        return back()->with('success', 'Purchase order berhasil disetujui');
    }

    public function tolak(Request $request, $uuid)
    {
        $po = PurchaseOrder::where('uuid', $uuid)->first();
        $alasan = $request->input("reason");


        if (Auth::user()->hasRole('kepala_toko')) {
            $po->kepala_toko_menolak = true;
        }

        if (Auth::user()->hasRole('kepala_gudang')) {
            $po->kepala_gudang_menolak = true;
        }


        if (Auth::user()->hasRole('kepala_accounting')) {
            $po->kepala_accounting_menolak = true;
        }



        if (Auth::user()->hasRole('kepala_pengadaan')) {
            $po->kepala_pengadaan_menolak = true;
        }



        $po->status = "TOLAK";
        $po->catatan_penolakan = $alasan;

        $po->save();

        $roles = Role::whereIn('name', ['staff_pengadaan'])->get();
        foreach ($roles as $role) {
            // Send whatsapp ke kepala toko dan kepala gudang
            event(new ROPNotification("Purchase Order dengan nomor {$po->nomor_referensi} ditolak!", $role->name));
        }


        return back()->with('success', 'Purchase Order ditolak');
    }

    public function tolakSupplier(Request $request, $uuid)
    {
        $po = PurchaseOrder::where('uuid', $uuid)->first();
        $alasan = $request->input("reason");


        $po->status = "TOLAK SUPPLIER";
        $po->catatan_penolakan_supplier = $alasan;

        $po->save();

        $roles = Role::whereIn('name', ['staff_pengadaan', 'kepala_gudang', 'kepala_pengadaan', 'kepala_toko', 'kepala_accounting'])->get();
        foreach ($roles as $role) {
            // Send whatsapp ke kepala toko dan kepala gudang
            event(new ROPNotification("Purchase Order dengan nomor {$po->nomor_referensi} ditolak supplier!", $role->name));
        }


        return back()->with('success', 'Purchase Order ditolak supplier');
    }

    public function showSupplierPortal($uuid)
    {
        $po      = PurchaseOrder::where('uuid', $uuid)->with('supplier')->firstOrFail();
        $poItems = PurchaseOrderItem::where('purchase_order_id', $po->purchase_order_id)->with(['barang'])->get();
        $pembayaranPO = PembayaranPurchaseOrder::where('purchase_order_id', $po->purchase_order_id)->get();

        $data = [
            'id'                           => $po->purchase_order_id,
            'uuid'                         => $po->uuid,
            'nomor_referensi'              => $po->nomor_referensi,
            'tanggal_order'                => $po->tanggal_order,
            'catatan'                      => $po->catatan,
            'status'                       => $po->status,
            'verifikasi_kepala_toko'       => $po->verifikasi_kepala_toko,
            'verifikasi_kepala_gudang'     => $po->verifikasi_kepala_gudang,
            'verifikasi_kepala_pengadaan'  => $po->verifikasi_kepala_pengadaan,
            'verifikasi_kepala_accounting' => $po->verifikasi_kepala_accounting,
            'catatan_penolakan_supplier'   => $po->catatan_penolakan_supplier,
            'pembayaran'                   => $pembayaranPO,
            'supplier'                     => [
                'id'   => $po->supplier->supplier_id,
                'name' => $po->supplier->name,
            ],
            'items' => $poItems,
        ];

        return Inertia::render('SupplierView/Index', [
            'data' => $data,
        ]);
    }

    public function konfirmasi($uuid)
    {
        $PO = PurchaseOrder::where('uuid', $uuid)->with('supplier')->firstOrFail();
        // Cari user dengan role terkait
        $users = User::whereHas('roles', function ($q) {
            $q->whereIn('name', [
                'kepala_toko',
                'kepala_pengadaan',
            ]);
        })->with('roles')->get();

        $tanggalSekarang = Carbon::parse(now())->locale('id');

        if ($PO->status === 'TERKIRIM') {
            $PO->status = 'MENUNGGU PEMBAYARAN';
            foreach ($users as $user) {
                $roles = $user->roles->pluck('name')
                    ->map(fn($r) => ucwords(str_replace('_', ' ', $r)))
                    ->implode(', ');

                $text = "Halo {$user->name} ({$roles}),PO dengan nomor {$PO->nomor_referensi}. Sudah dikonfirmasi oleh {$PO->supplier->name} pada {$tanggalSekarang} dan menunggu pembayaran.";

                event(new ROPNotification("PO dengan nomor {$PO->nomor_referensi}. Sudah dikonfirmasi oleh {$PO->supplier->name} pada {$tanggalSekarang} dan menunggu pembayaran.", $user->roles->pluck('name')[0]));
                // Kirim notifikasi (kalau perlu detail barang, bisa di-loop terpisah dari $validated['items'])
                SendWhatsappJob::dispatch($user->noWhatsapp, $text);
            }
        }
        $PO->save();

        $pesan = $PO->status === 'KONFIRMASI SUPPLIER'
            ? 'PO berhasil dikonfirmasi'
            : 'PO berhasil dikirim';

        return back()->with('success', $pesan);
    }

    public function konfirmasiSampai($uuid)
    {
        $po = PurchaseOrder::where('uuid', $uuid)->first();

        $po->status = "BARANG SAMPAI";
        $po->tanggal_sampai = now();

        $po->save();

        $roles = Role::whereIn('name', ['admin_gudang', 'kepala_gudang', 'kepala_toko'])->get();
        foreach ($roles as $role) {
            // Send whatsapp ke kepala toko dan kepala gudang
            event(new ROPNotification("Purchase Order dengan nomor {$po->nomor_referensi} sampai digudang!", $role->name));
        }


        return back()->with('success', 'Purchase Order telah sampai digudang!');
    }

    public function showDetailScan($uuid)
    {
        $po      = PurchaseOrder::where('uuid', $uuid)->with('supplier')->firstOrFail();
        $poItems = PurchaseOrderItem::where('purchase_order_id', $po->purchase_order_id)->with(['barang'])->get();

        $data = [
            'id'                           => $po->purchase_order_id,
            'uuid'                         => $po->uuid,
            'nomor_referensi'              => $po->nomor_referensi,
            'tanggal_order'                => $po->tanggal_order,
            'catatan'                      => $po->catatan,
            'status'                       => $po->status,
            'verifikasi_kepala_toko'       => $po->verifikasi_kepala_toko,
            'verifikasi_kepala_gudang'     => $po->verifikasi_kepala_gudang,
            'verifikasi_kepala_pengadaan'  => $po->verifikasi_kepala_pengadaan,
            'verifikasi_kepala_accounting' => $po->verifikasi_kepala_accounting,
            'supplier'                     => [
                'id'   => $po->supplier->supplier_id,
                'name' => $po->supplier->name,
            ],
            'items' => $poItems,
        ];

        return response()->json($data);
    }

    public function destroy($uuid)
    {
        $po = PurchaseOrder::where('uuid', $uuid)->first();


        try {
            PurchaseOrderItem::where('purchase_order_id', $po->purchase_order_id)->delete();

            $po->delete();

            return back()->with('success', "PO berhasil dihapus!");
        } catch (\Exception $e) {
            Log::error("Gagal menghapus PO dengan ID {$uuid}" . $e->getMessage(), ['exception' => $e]);
            throw new BarangException('Terjadi kesalahan dalam menghapus PO. Silahkan coba lagi nanti');
        }
    }

    public function saveDokumenPengiriman(Request $request, $uuid)
    {
        $validated = $request->validate([
            'dokumen_pengiriman' => 'nullable|file|mimes:jpg,png,pdf|max:2048',
        ]);

        $po = PurchaseOrder::where('uuid', $uuid)->first();


        if ($request->hasFile('dokumen_pengiriman')) {
            $validated['dokumen_pengiriman'] = $request->file('dokumen_pengiriman')->store('dokumen-pengiriman', 'public');
            $po->dokumen_pengiriman = $validated['dokumen_pengiriman'];
        }

        $po->status = "BARANG DIKIRIM";
        $po->save();

        return back()->with('success', "Dokumen berhasil diupload, barang sedang dikirim!");
    }
}
