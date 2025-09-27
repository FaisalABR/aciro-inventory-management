<?php

namespace App\Http\Controllers;

use App\Events\ROPNotification;
use App\Jobs\SendWhatsappJob;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\Supplier;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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
            'id',
            'uuid',
            'nomor_referensi',
            'tanggal_order',
            'supplier_id',
            'catatan',
            'status',
            DB::raw('(SELECT COUNT (DISTINCT barang_id) FROM purchase_order_items WHERE purchase_order_id = purchase_orders.id) as total_unique_items'),
            DB::raw('(SELECT SUM(quantity) FROM purchase_order_items WHERE purchase_order_id = purchase_orders.id) as total_quantity'),
        );

        $formattedValue = $query->get()->map(function ($purchaseOrder) {
            return [
                'id' => $purchaseOrder->id,
                'uuid' => $purchaseOrder->uuid,
                'nomor_referensi' => $purchaseOrder->nomor_referensi,
                'tanggal_order' => $purchaseOrder->tanggal_order,
                'total_quantity' => $purchaseOrder->total_quantity,
                'total_unique_items' => $purchaseOrder->total_unique_items,
                'status' => $purchaseOrder->status,
                'supplier' => [
                    'id'   => $purchaseOrder->supplier->id,
                    'name' => $purchaseOrder->supplier->name,
                ],
            ];
        });

        return Inertia::render('PurchaseOrder/Index', [
            'data' => $formattedValue,
        ]);
    }

    public function showEdit($uuid)
    {
        $po = PurchaseOrder::where('uuid', $uuid)->with(['supplier', 'items.barang'])->firstOrFail();
        $data = Supplier::all();

        $optionSupplier = $data->map(function ($supplier) {
            return [
                'value' => $supplier->id,
                'label' => $supplier->name,
            ];
        });

        return Inertia::render('PurchaseOrder/FormPurchase', [
            "isUpdate" => true,
            "data" => $po,
            'optionSupplier' => $optionSupplier,
        ]);
    }

    public function showDetail($uuid)
    {
        $po = PurchaseOrder::where('uuid', $uuid)->with('supplier')->firstOrFail();
        $poItems = PurchaseOrderItem::where('purchase_order_id', $po->id)->with(['barang'])->get();

        $data = [
            'id' => $po->id,
            'uuid' => $po->uuid,
            'nomor_referensi' => $po->nomor_referensi,
            'tanggal_order' => $po->tanggal_order,
            'catatan' => $po->catatan,
            'status' => $po->status,
            'verifikasi_kepala_toko' => $po->verifikasi_kepala_toko,
            'verifikasi_kepala_gudang' => $po->verifikasi_kepala_gudang,
            'verifikasi_kepala_pengadaan' => $po->verifikasi_kepala_pengadaan,
            'verifikasi_kepala_accounting' => $po->verifikasi_kepala_accounting,
            'supplier' => [
                "id" => $po->supplier->id,
                "name" => $po->supplier->name,
            ],
            'items' => $poItems,
        ];

        return Inertia::render('PurchaseOrder/Detail', [
            "data" => $data,
        ]);
    }

    public function create(Request $request)
    {
        $validated = $request->validate([
            'tanggal_order' => 'required',
            'catatan' => 'nullable',
            'supplier_id' => 'required',
            'items' => 'required|array|min:1',
            'items.*.barang_id' => 'required|exists:barangs,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.hargaBeli' => 'required|integer|min:1',
        ]);

        $totalPO = PurchaseOrder::count();
        $users = User::whereHas('roles', function ($q) {
            $q->whereIn('name', ['kepala_gudang', 'kepala_toko', 'kepala_pengadaan', 'kepala_accounting']);
        })->get();

        $PO = PurchaseOrder::create([
            'nomor_referensi' => sprintf('PO-%s-%04d', now()->format('Ymd'), $totalPO + 1),
            'tanggal_order' => $validated['tanggal_keluar'],
            'catatan' =>  $validated['catatan'] ?? '',
            'status' => 'BUTUH VERIFIKASI',
            'supplier_id' =>  $validated['supplier_id'] ?? '',
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
            event(new ROPNotification("PO dengan nomor {$PO->nomor_referensi}. Butuh verifikasi nih!", $user->roles->pluck('name')));
            SendWhatsappJob::dispatch($user->noWhatsapp, $text);
        }


        return redirect('/purchase-orders')->with('success', 'PO Berhasil Dibuat berhasil ditambahkan!');
    }

    public function update(Request $request, $uuid)
    {
        $validated = $request->validate([
            'tanggal_order' => 'required|date',
            'catatan' => 'nullable|string',
            'supplier_id' => 'required|exists:suppliers,id',
            'items' => 'required|array|min:1',
            'items.*.barang_id' => 'required|exists:barangs,id',
            'items.*.quantity' => 'required|integer|min:1',
            // 'items.*.harga_beli' => 'required|integer|min:1',
        ]);

        // Ambil PO berdasarkan UUID
        $PO = PurchaseOrder::where('uuid', $uuid)->firstOrFail();

        // Update PO
        $PO->update([
            'tanggal_order' => $validated['tanggal_order'],
            'catatan' => $validated['catatan'] ?? '',
            'status' => 'BUTUH VERIFIKASI',
            'supplier_id' => $validated['supplier_id'],
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
                'kepala_accounting'
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

    public function verifikasi(Request $request, $uuid)
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

        if ($PO->verifikasi_kepala_gudang && $PO->verifikasi_kepala_toko && $PO->verifikasi_kepala_pengadaan && $PO->verifikasi_kepala_pengadaan) {
            $PO->status = 'VERIFIKASI';

            if ($PO->status == 'VERIFIKASI') {
                $tanggal = Carbon::parse($PO->tanggal_order)->locale('id');
                $formatted = $tanggal->translatedFormat('l, d F Y');
                $text =   "
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
            }
        } else {
            $PO->status = 'VERIFIKASI SEBAGIAN';
        }

        $PO->save();

        return back()->with('success', 'Permintaan barang keluar disetujui');
    }
}
