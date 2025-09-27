<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\BarangKeluar;
use App\Models\BarangKeluarItem;
use App\Models\BarangMasuk;
use App\Models\BarangMasukItem;
use App\Models\DeadstockItem;
use App\Models\HeaderDeadstock;
use App\Models\Stock;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HeaderDeadstockController extends Controller
{
    public function index()
    {
        $query = HeaderDeadstock::select(
            'id',
            'uuid',
            'nomor_referensi',
            'periode_mulai',
            'periode_akhir',
        );

        $formattedValue = $query->get()->map(function ($deadstock) {
            return [
                'id' => $deadstock->id,
                'uuid' => $deadstock->uuid,
                'nomor_referensi' => $deadstock->nomor_referensi,
                'periode_mulai' => $deadstock->periode_mulai,
                'periode_akhir' => $deadstock->periode_akhir,
            ];
        });

        return Inertia::render('LaporanDeadstock/Index', [
            'data' => $formattedValue,
        ]);
    }

    public function evaluasiITR(Request $request)
    {
        $periodeMulai = Carbon::parse($request->periode_mulai);
        $periodeAkhir = Carbon::parse($request->periode_akhir);

        $kalkulasiDeadstock = $this->kalkulasiDeadstock($periodeMulai, $periodeAkhir);
        // dd($kalkulasiDeadstock);

        if (count($kalkulasiDeadstock) == 0) {
            return redirect("/laporan-deadstocks")->with('error', 'Tidak ada stock yang dievaluasi');
        }

        $totalHeader = HeaderDeadstock::count();

        $headerDeadstock = HeaderDeadstock::create([
            'nomor_referensi' => sprintf('DS-%s-%04d', now()->format('Ymd'), $totalHeader + 1),
            'periode_mulai' => $periodeMulai,
            'periode_akhir' => $periodeAkhir,
        ]);

        $headerDeadstock->items()->createMany($kalkulasiDeadstock);

        return redirect('/laporan-deadstocks')->with('success', 'Laporan Deadstock Berhasil dibuat!');
    }

    public function showDetail(Request $request, $uuid) {}

    private function kalkulasiDeadstock($periodeMulai, $periodeAkhir)
    {
        $stocks = Stock::with('barangs')->get();
        $result = [];

        foreach ($stocks as $stock) {
            $barangId = $stock->barang_id;

            // Persediaan awal
            $masukSebelum = BarangMasuk::whereDate('tanggal_masuk', '<', $periodeMulai)
                ->with('items')
                ->get()
                ->flatMap->items
                ->where('barang_id', $barangId)
                ->sum('quantity');

            $keluarSebelum = BarangKeluar::whereDate('tanggal_keluar', '<', $periodeMulai)
                ->with('items')
                ->get()
                ->flatMap->items
                ->where('barang_id', $barangId)
                ->sum('quantity');

            $persediaanAwal = $masukSebelum - $keluarSebelum;

            // Persediaan akhir
            $masukSampai = BarangMasuk::whereDate('tanggal_masuk', '<=', $periodeAkhir)
                ->with('items')
                ->get()
                ->flatMap->items
                ->where('barang_id', $barangId)
                ->sum('quantity');

            $keluarSampai = BarangKeluar::whereDate('tanggal_keluar', '<=', $periodeAkhir)
                ->with('items')
                ->get()
                ->flatMap->items
                ->where('barang_id', $barangId)
                ->sum('quantity');

            $persediaanAkhir = $masukSampai - $keluarSampai;

            // Rata-rata persediaan
            $rataPersediaan = ($persediaanAwal + $persediaanAkhir) / 2;

            // Total keluar selama periode
            $totalKeluar = BarangKeluar::whereBetween('tanggal_keluar', [$periodeMulai, $periodeAkhir])
                ->with('items')
                ->get()
                ->flatMap->items
                ->where('barang_id', $barangId)
                ->sum('quantity');

            // Hitung ITR
            $ITR = $rataPersediaan > 0 ? $totalKeluar / $rataPersediaan : 0;


            // Tentukan status
            if ($ITR > 3) {
                $status = 'Fast Moving';
            } elseif ($ITR >= 1) {
                $status = 'Slow Moving';
            } else {
                $status = 'Deadstock';
            }

            // Simpan ke result array
            $result[] = [
                'barang_id' => $barangId,
                'nama_barang' => $stock->barangs->name ?? 'Unknown',
                'persediaan_awal' => $persediaanAwal,
                'persediaan_akhir' => $persediaanAkhir,
                'rata_persediaan' => $rataPersediaan,
                'total_keluar' => $totalKeluar,
                'itr' => $ITR,
                'status' => $status,
            ];

            // Update ke tabel stocks
            $stock->update([
                'itr' => $ITR,
                'status_itr' => $status,
                'last_evaluated' => now()->format('d-m-Y'),
            ]);
        }

        return $result;
    }
}
