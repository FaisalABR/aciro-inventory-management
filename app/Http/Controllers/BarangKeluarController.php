<?php

namespace App\Http\Controllers;

use App\Events\ROPNotification;
use App\Exceptions\Barang\BarangException;
use App\Jobs\SendWhatsappJob;
use App\Models\BarangKeluar;
use App\Models\BarangKeluarItem;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\Role;
use App\Models\Stock;
use App\Models\User;
use App\Services\BarangKeluarServiceInterface;
use App\Services\WhatsappServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class BarangKeluarController extends Controller
{
    private $barangKeluarService;
    private $whatsappService;

    public function __construct(
        BarangKeluarServiceInterface $barangKeluarService,
        WhatsappServiceInterface $whatsappService
    ) {
        $this->barangKeluarService = $barangKeluarService;
        $this->whatsappService     = $whatsappService;
    }

    public function index()
    {
        try {
            $barangKeluar = $this->barangKeluarService->getAll();

            return Inertia::render('PermintaanBarangKeluar/Index', [
                'data' => $barangKeluar,
            ]);
        } catch (\Exception $e) {
            return redirect('/barang-keluar')->with('error', $e->getMessage());
        }
    }

    public function showCreate()
    {
        $stockBarang  = Stock::with('barangs')->get();
        $optionBarang = $stockBarang->map(function ($stock) {
            return [
                'value'    => $stock->barangs->barang_id,
                'label'    => $stock->barangs->name . ($stock->quantity == 0 ? ' (habis)' : ''),
                'disabled' => $stock->quantity == 0,
            ];
        });

        return Inertia::render('PermintaanBarangKeluar/FormPermintaanBarangKeluar', [
            'isUpdate'     => false,
            'optionBarang' => $optionBarang,
        ]);
    }

    public function showDetail($uuid)
    {
        try {
            $data = $this->barangKeluarService->getBarangKeluarByUUID($uuid);

            return Inertia::render('PermintaanBarangKeluar/Detail', [
                'data' => $data,
            ]);
        } catch (BarangException $e) {
            return redirect('/barang-keluar')->with('error', $e->getMessage());
        } catch (\Exception $e) {
            return redirect('/barang-keluar')->with('error', 'Terjadi kesalahan pada server');
        }
    }

    public function create(Request $request)
    {
        $validated = $request->validate([
            'tanggal_keluar'    => 'required',
            'catatan'           => 'nullable',
            'items'             => 'required|array|min:1',
            'items.*.barang_id' => 'required|exists:barangs,barang_id',
            'items.*.quantity'  => 'required|integer|min:1',
        ]);

        $totalBarangKeluar = BarangKeluar::count();

        $permintaanBarangKeluar = BarangKeluar::create([
            'nomor_referensi' => sprintf('PBK-%s-%04d', now()->format('Ymd'), $totalBarangKeluar + 1),
            'tanggal_keluar'  => $validated['tanggal_keluar'],
            'catatan'         => $validated['catatan'] ?? '',
            'user_id'         => Auth::id(),
        ]);

        foreach ($validated['items'] as $item) {
            $permintaanBarangKeluar->items()->create($item);
        }


        $users    = User::whereHas('roles', function ($q) {
            $q->whereIn('name', ['kepala_gudang', 'kepala_toko']);
        })->get();

        foreach ($users as $user) {
            // Send whatsapp ke kepala toko dan kepala gudang
            SendWhatsappJob::dispatch($user->noWhatsapp, "Ada permintaan baru dengan nomor {$permintaanBarangKeluar->nomor_referensi} perlu diverifikasi!");
        }

        $roles = Role::whereIn('name', ['kepala_gudang', 'kepala_toko'])->get();
        foreach ($roles as $role) {
            // Send whatsapp ke kepala toko dan kepala gudang
            event(new ROPNotification("Ada permintaan baru dengan nomor {$permintaanBarangKeluar->nomor_referensi} perlu diverifikasi!", $role->name));
        }




        return redirect('/permintaan-barang-keluar')->with('success', 'Permintaan Barang Keluar berhasil ditambahkan!');
    }

    public function verifikasi($uuid)
    {
        $barangKeluar = BarangKeluar::where('uuid', $uuid)->first();

        if (Auth::user()->hasRole('kepala_toko')) {
            $barangKeluar->verifikasi_kepala_toko = true;
        }

        if (Auth::user()->hasRole('kepala_gudang')) {
            $barangKeluar->verifikasi_kepala_gudang = true;
        }

        if ($barangKeluar->verifikasi_kepala_gudang && $barangKeluar->verifikasi_kepala_toko) {
            $barangKeluar->status = 'Disetujui';
            $roles = Role::whereIn('name', ['staff_toko'])->get();
            foreach ($roles as $role) {
                // Send whatsapp ke kepala toko dan kepala gudang
                event(new ROPNotification("Permintaan dengan nomor {$barangKeluar->nomor_referensi} sudah disetujui semua!", $role->name));
            }
        } else {
            $barangKeluar->status = 'Disetujui sebagian';
        }

        $barangKeluar->save();

        return back()->with('success', 'Permintaan barang keluar disetujui');
    }

    public function tolak(Request $request, $uuid)
    {
        $barangKeluar = BarangKeluar::where('uuid', $uuid)->first();
        $alasan = $request->input("reason");


        if (Auth::user()->hasRole('kepala_toko')) {
            $barangKeluar->kepala_toko_menolak = true;
        }

        if (Auth::user()->hasRole('kepala_gudang')) {
            $barangKeluar->kepala_gudang_menolak = true;
        }


        $barangKeluar->status = "Ditolak";
        $barangKeluar->catatan_penolakan = $alasan;

        $barangKeluar->save();

        $roles = Role::whereIn('name', ['staff_toko'])->get();
        foreach ($roles as $role) {
            // Send whatsapp ke kepala toko dan kepala gudang
            event(new ROPNotification("Permintaan dengan nomor {$barangKeluar->nomor_referensi} ditolak!", $role->name));
        }


        return back()->with('success', 'Permintaan barang keluar ditolak');
    }

    public function checkROP(Request $request)
    {
        $items    = $request->all();
        $warnings = [];
        $errors   = [];

        foreach ($items as $item) {
            $barang = Stock::with('barangs')->where('barang_id', $item['barang_id'])->first();

            if (! $barang) {
                continue;
            }

            $sisa = $barang->quantity - $item['quantity'];

            if ($sisa < 0) {
                $errors[] = [
                    'barang_id' => $barang->stock_id,
                    'nama'      => $barang->barangs->name,
                    'stock'     => $barang->quantity,
                    'request'   => $item['quantity'],
                ];

                continue;
            }

            if ($sisa <= $barang->rop) {
                $warnings[] = [
                    'barang_id'        => $barang->stock_id,
                    'nama'             => $barang->barangs->name,
                    'stock'            => $barang->quantity,
                    'rop'              => $barang->rop,
                    'quantity_keluar'  => $item['quantity'],
                    'setelah_eksekusi' => $barang->quantity - $item['quantity'],
                ];
            }
        }

        return response()->json([
            'errors'      => $errors,
            'ropWarnings' => $warnings,
        ]);
    }

    public function indexEksekusi()
    {
        $barangKeluar = BarangKeluar::with(['items.barangs', 'user'])->whereIn('status', ['Disetujui', 'Dieksekusi'])->orderBy('created_at', 'desc')->get();

        return Inertia::render('BarangKeluar/Index', [
            'data' => $barangKeluar,
        ]);
    }

    public function checkExecute($uuid)
    {
        $barangKeluar = BarangKeluar::with('items.barangs')->where('uuid', $uuid)->firstOrFail(); // ambil 1 row saja;

        $warnings = [];

        foreach ($barangKeluar->items as $item) {
            $stock = Stock::where('barang_id', $item->barang_id)->first();

            if (! $stock) {
                $warnings[] = "Barang {$item->barangs->name} belum ada stok.";

                continue;
            }

            // cek stok minus
            if ($stock->quantity < $item->quantity) {
                $warnings[] = "Barang {$item->barangs->name} tidak cukup stok (tersedia {$stock->quantity}, diminta {$item->quantity})";
            }

            // cek ROP
            if (($stock->quantity - $item->quantity) <= $stock->rop) {
                $warnings[] = "Barang {$item->barangs->name} akan mencapai ROP (sisa setelah keluar: " . ($stock->quantity - $item->quantity) . ')';
            }
        }

        return response()->json([
            'warnings' => $warnings,
        ]);
    }

    public function execute($uuid)
    {
        $barangKeluar = BarangKeluar::with('items.barangs.supplier')->where('uuid', $uuid)->firstOrFail();

        if ($barangKeluar->status !== 'Disetujui') {
            return back()->withErrors(['msg' => 'Barang keluar belum diverifikasi']);
        }

        DB::transaction(function () use ($barangKeluar) {
            $messages = []; // kumpulkan pesan ROP
            $users    = User::whereHas('roles', function ($q) {
                $q->whereIn('name', ['kepala_gudang', 'kepala_toko']);
            })->get();

            foreach ($barangKeluar->items as $item) {
                $stock = Stock::where('barang_id', $item->barang_id)->first();

                if (! $stock || $stock->quantity < $item->quantity) {
                    throw new \Exception("Stok tidak mencukupi untuk {$item->barang->nama}");
                }

                $sisa            = $stock->quantity - $item->quantity;
                $stock->quantity = $sisa;

                if ($sisa <= $stock->rop) {
                    $stock->status_rop = 'Need Restock';
                }

                if ($sisa == 0) {
                    $stock->status_rop = 'Out Of Stock';
                }

                $stock->save();

                if ($sisa <= $stock->rop) {
                    $supplier = $item->barangs->supplier;
                    $totalPo  = PurchaseOrder::count();

                    $po = PurchaseOrder::where('supplier_id', $supplier->supplier_id)->where('status', 'BUTUH VERIFIKASI')->first();

                    if (!$po) {
                        $po = PurchaseOrder::create([
                            'nomor_referensi' => sprintf('PO-%s-%04d', now()->format('Ymd'), $totalPo + 1),
                            'tanggal_order'   => now(),
                            'supplier_id'     => $supplier->supplier_id,
                            'status'          => 'BUTUH VERIFIKASI',
                            'catatan'         => 'test',
                        ]);
                    }

                    PurchaseOrderItem::create([
                        'purchase_order_id' => $po->purchase_order_id,
                        'barang_id'         => $item->barang_id,
                        'quantity'          => $item->barangs->maximal_quantity,
                        'harga_beli'        => $item->barangs->hargaBeli,
                    ]);
                    event(new ROPNotification("Stok {$item->barangs->name} menyentuh ROP!", 'kepala_toko'));
                    event(new ROPNotification("Stok {$item->barangs->name} menyentuh ROP!", 'kepala_gudang'));
                    // tambahkan ke array, bukan langsung kirim
                    $messages[] = "Stok {$item->barangs->name} menyentuh ROP!";
                }

                // Update status barang keluar
                $barangKeluar->status = 'Dieksekusi';
                $barangKeluar->save();
            }

            if (! empty($messages)) {
                $text = implode("\n", $messages);
                foreach ($users as $user) {
                    // Send whatsapp ke kepala toko dan kepala gudang
                    SendWhatsappJob::dispatch($user->noWhatsapp, $text);
                }
            }
            event(new ROPNotification("Permintaan dengan nomor {$barangKeluar->nomor_referensi}, sudah dikeluarkan!", 'staff_toko'));
        });


        return redirect('/barang-keluar')->with('success', 'Barang keluar berhasil dieksekusi');
    }

    public function destroy($uuid)
    {
        $barangKeluar = BarangKeluar::where('uuid', $uuid)->first();

        try {
            BarangKeluarItem::where('barang_keluar_id', $barangKeluar->barang_keluar_id)->delete();

            $barangKeluar->delete();

            return back()->with('success', "Permintaan barang keluar berhasil dihapus!");
        } catch (\Exception $e) {
            Log::error("Gagal menghapus Permintaan barang keluar dengan ID {$uuid}" . $e->getMessage(), ['exception' => $e]);
            throw new BarangException('Terjadi kesalahan dalam menghapus Permintaan barang keluar. Silahkan coba lagi nanti');
        }
    }
}
