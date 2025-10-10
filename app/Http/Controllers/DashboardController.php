<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\BarangKeluarItem;
use App\Models\BarangMasukItem;
use App\Models\PurchaseOrder;
use App\Models\Supplier;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $totalBarang       = Barang::count();
        $totalSupplier     = Supplier::count();
        $totalBarangMasuk  = BarangMasukItem::sum('quantity');
        $totalBarangKeluar = BarangKeluarItem::sum('quantity');
        $totalPO           = PurchaseOrder::count();
        $periodeMulai      = $request->input('periode_mulai')
            ? Carbon::parse($request->input('periode_mulai'))->startOfDay()
            : Carbon::now()->subMonth()->startOfDay(); // default 1 bulan lalu

        $periodeAkhir = $request->input('periode_akhir')
            ? Carbon::parse($request->input('periode_akhir'))->endOfDay()
            : Carbon::now()->endOfDay(); // default hari ini

        // Ambil semua barang
        $barangs = Barang::all();

        // Loop untuk hitung total barang masuk per barang
        $barangMasukGrafik = $barangs->map(function ($barang) use ($periodeMulai, $periodeAkhir) {
            $totalMasuk = BarangMasukItem::where('barang_id', $barang->barang_id)
                ->whereHas('barangMasuk', function ($q) use ($periodeMulai, $periodeAkhir) {
                    $q->whereBetween('tanggal_masuk', [$periodeMulai, $periodeAkhir]);
                })
                ->sum('quantity');

            return [
                'nama'  => $barang->name,
                'value' => $totalMasuk,
            ];
        });

        // Loop untuk hitung total barang masuk per barang
        $barangKeluarGrafik = $barangs->map(function ($barang) use ($periodeMulai, $periodeAkhir) {
            $totalMasuk = BarangKeluarItem::where('barang_id', $barang->barang_id)
                ->whereHas('barangKeluar', function ($q) use ($periodeMulai, $periodeAkhir) {
                    $q->whereBetween('tanggal_keluar', [$periodeMulai, $periodeAkhir]);
                })
                ->sum('quantity');

            return [
                'nama'  => $barang->name,
                'value' => $totalMasuk,
            ];
        });

        return Inertia::render('Dashboard', [
            'data' => [
                'cards' => [
                    [
                        'id'    => 1,
                        'title' => 'Total Barang',
                        'total' => $totalBarang,
                    ],
                    [
                        'id'    => 2,
                        'title' => 'Total Supplier',
                        'total' => $totalSupplier,
                    ],
                    [
                        'id'    => 3,
                        'title' => 'Total Barang Masuk',
                        'total' => $totalBarangMasuk,
                    ],
                    [
                        'id'    => 4,
                        'title' => 'Total Barang Keluar',
                        'total' => $totalBarangKeluar,
                    ],
                    [
                        'id'    => 5,
                        'title' => 'Total Barang PO',
                        'total' => $totalPO,
                    ],

                ],
                'graph' => [
                    'barangMasuk'  => $barangMasukGrafik,
                    'barangKeluar' => $barangKeluarGrafik,
                ],
            ],
        ]);
    }
}
