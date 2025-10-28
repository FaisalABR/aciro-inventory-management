<?php

namespace App\Http\Controllers;

use App\Exceptions\Barang\BarangException;
use App\Models\BarangKeluar;
use App\Models\BarangMasuk;
use App\Models\BarangMasukItem;
use App\Models\DeadstockItem;
use App\Models\HeaderDeadstock;
use App\Models\Stock;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class HeaderDeadstockController extends Controller
{
    public function index()
    {
        $query = HeaderDeadstock::select(
            'header_deadstock_id',
            'uuid',
            'nomor_referensi',
            'periode_mulai',
            'periode_akhir',
        );

        $formattedValue = $query->orderBy('created_at', 'desc')->get()->map(function ($deadstock) {
            return [
                'id'              => $deadstock->header_deadstock_id,
                'uuid'            => $deadstock->uuid,
                'nomor_referensi' => $deadstock->nomor_referensi,
                'periode_mulai'   => $deadstock->periode_mulai,
                'periode_akhir'   => $deadstock->periode_akhir,
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
            return redirect('/laporan-deadstocks')->with('error', 'Tidak ada stock yang dievaluasi');
        }

        $totalHeader = HeaderDeadstock::count();

        $headerDeadstock = HeaderDeadstock::create([
            'nomor_referensi' => sprintf('DS-%s-%04d', now()->format('Ymd'), $totalHeader + 1),
            'periode_mulai'   => $periodeMulai,
            'periode_akhir'   => $periodeAkhir,
        ]);

        $headerDeadstock->items()->createMany($kalkulasiDeadstock);

        return redirect('/laporan-deadstocks')->with('success', 'Laporan Deadstock berhasil dibuat!');
    }

    public function showDetail($uuid)
    {
        $deadstock      = HeaderDeadstock::where('uuid', $uuid)->firstOrFail();
        $deadstockItems = DeadstockItem::where('header_deadstock_id', $deadstock->header_deadstock_id)->with(['barang'])->get();
        $tanggalDibuatDeadstock = $deadstock->created_at;
        $barangMendekatiExpired = BarangMasukItem::with('barangs')->whereBetween('tanggal_expired', [$tanggalDibuatDeadstock, $tanggalDibuatDeadstock->copy()->addDays((30))])->get();

        $data = [
            'id'                           => $deadstock->header_deadstock_id,
            'uuid'                         => $deadstock->uuid,
            'nomor_referensi'              => $deadstock->nomor_referensi,
            'periode_mulai'                => $deadstock->periode_mulai,
            'periode_akhir'                => Carbon::parse($deadstock->periode_akhir)->format('d-m-Y'),
            'created_at' => Carbon::parse($deadstock->created_at)->format('d-m-Y H:i:s'),
            'items' => $deadstockItems,
            'related_expired' => $barangMendekatiExpired,
        ];

        return Inertia::render('LaporanDeadstock/Detail', [
            'data' => $data,
        ]);
    }

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
                $tindakan = "Tidak Perlu Tindakan";
            } elseif ($ITR >= 1) {
                $status = 'Slow Moving';
                $tindakan = "Promo";
            } else {
                $status = 'Deadstock';
                $tindakan = "Promo/Bundling";
            }

            // Simpan ke result array
            $result[] = [
                'barang_id'        => $barangId,
                'nama_barang'      => $stock->barangs->name ?? 'Unknown',
                'persediaan_awal'  => $persediaanAwal,
                'persediaan_akhir' => $persediaanAkhir,
                'rata_persediaan'  => $rataPersediaan,
                'total_keluar'     => $totalKeluar,
                'itr'              => $ITR,
                'status'           => $status,
                'tindakan'         => $tindakan,
            ];

            // Update ke tabel stocks
            $stock->update([
                'itr'            => $ITR,
                'status_itr'     => $status,
                'last_evaluated' => now()->format('Y-m-d'),
            ]);
        }

        return $result;
    }

    public function destroy($uuid)
    {
        $headerDeadstock = HeaderDeadstock::where('uuid', $uuid)->first();


        try {
            DeadstockItem::where('header_deadstock_id', $headerDeadstock->header_deadstock_id)->delete();

            $headerDeadstock->delete();

            return back()->with('success', "PO berhasil dihapus!");
        } catch (\Exception $e) {
            Log::error("Gagal menghapus PO dengan ID {$uuid}" . $e->getMessage(), ['exception' => $e]);
            throw new BarangException('Terjadi kesalahan dalam menghapus Laporan Deadstock. Silahkan coba lagi nanti');
        }
    }
}
