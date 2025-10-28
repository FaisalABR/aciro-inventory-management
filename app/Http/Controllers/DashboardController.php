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
        $periodeMulai = $request->input('periode_mulai')
            ? Carbon::parse($request->input('periode_mulai'))->startOfDay()
            : null;

        $periodeAkhir = $request->input('periode_akhir')
            ? Carbon::parse($request->input('periode_akhir'))->endOfDay()
            : null;

        // Ambil semua barang
        $barangs = Barang::all();

        // Loop untuk hitung total barang masuk per barang
        $barangMasukGrafik = $barangs->map(function ($barang) use ($periodeMulai, $periodeAkhir) {
            $totalMasuk = BarangMasukItem::where('barang_id', $barang->barang_id)
                ->whereHas('barangMasuk', function ($q) use ($periodeMulai, $periodeAkhir) {
                    if ($periodeMulai && $periodeAkhir) {
                        $q->whereBetween('tanggal_masuk', [$periodeMulai, $periodeAkhir]);
                    }
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
                    if ($periodeMulai && $periodeAkhir) {
                        $q->whereBetween('tanggal_keluar', [$periodeMulai, $periodeAkhir]);
                    }
                })
                ->sum('quantity');

            return [
                'nama'  => $barang->name,
                'value' => $totalMasuk,
            ];
        });

        // Loop untuk hitung total barang masuk per barang
        $barangMasuk = $barangs->map(function ($barang) use ($periodeMulai, $periodeAkhir) {
            // Ambil semua item barang masuk untuk barang ini dalam periode
            $items = BarangMasukItem::where('barang_id', $barang->barang_id)
                ->with('barangMasuk')
                ->whereHas('barangMasuk', function ($q) use ($periodeMulai, $periodeAkhir) {
                    if ($periodeMulai && $periodeAkhir) {
                        $q->whereBetween('tanggal_masuk', [$periodeMulai, $periodeAkhir]);
                    }
                })
                ->get();

            // Kelompokkan berdasarkan tanggal_masuk dari relasi barangMasuk
            $groupedByDate = $items->groupBy(fn($item) => $item->barangMasuk->tanggal_masuk);

            // Bentuk array rincian per tanggal
            $rincianPerTanggal = $groupedByDate->map(function ($group, $tanggal) {
                return [
                    'tanggal' => $tanggal,
                    'jumlah'  => $group->sum('quantity'),
                ];
            })->values();

            return [
                'nama'                => $barang->name,
                'total_masuk'         => $items->sum('quantity'),
                'rincian_per_tanggal' => $rincianPerTanggal,
            ];
        });

        $barangKeluar = $barangs->map(function ($barang) use ($periodeMulai, $periodeAkhir) {
            // Ambil semua item barang masuk untuk barang ini dalam periode
            $items = BarangKeluarItem::where('barang_id', $barang->barang_id)
                ->with('barangKeluar')
                ->whereHas('barangKeluar', function ($q) use ($periodeMulai, $periodeAkhir) {
                    if ($periodeMulai && $periodeAkhir) {
                        $q->whereBetween('tanggal_keluar', [$periodeMulai, $periodeAkhir]);
                    }
                })
                ->get();

            // Kelompokkan berdasarkan tanggal_masuk dari relasi barangMasuk
            $groupedByDate = $items->groupBy(fn($item) => $item->barangKeluar->tanggal_keluar);

            // Bentuk array rincian per tanggal
            $rincianPerTanggal = $groupedByDate->map(function ($group, $tanggal) {
                return [
                    'tanggal' => $tanggal,
                    'jumlah'  => $group->sum('quantity'),
                ];
            })->values();

            return [
                'nama'                => $barang->name,
                'total_keluar'         => $items->sum('quantity'),
                'rincian_per_tanggal' => $rincianPerTanggal,
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
                'barangMasuk' => $barangMasuk,
                'barangKeluar' => $barangKeluar,
            ],
        ]);
    }
}
