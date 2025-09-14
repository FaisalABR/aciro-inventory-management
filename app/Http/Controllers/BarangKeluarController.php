<?php

namespace App\Http\Controllers;

use App\Exceptions\Barang\BarangException;
use App\Models\BarangKeluar;
use App\Models\Stock;
use App\Services\BarangKeluarServiceInterface;
use App\Services\BarangServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BarangKeluarController extends Controller
{
    private $barangKeluarService;

    public function __construct(
        BarangKeluarServiceInterface $barangKeluarService,
    ) {
        $this->barangKeluarService = $barangKeluarService;
    }

    public function index()
    {
        try {
            $barangKeluar = $this->barangKeluarService->getAll();

            return Inertia::render('PermintaanBarangKeluar/Index', [
                'data' => $barangKeluar,
            ]);
        } catch (\Exception $e) {
            return redirect("/barang-keluar")->with('error', $e->getMessage());
        }
    }

    public function showCreate()
    {
        $stockBarang = Stock::with('barangs')->get();
        $optionBarang = $stockBarang->map(function ($stock) {
            return [
                'value' => $stock->barangs->id,
                'label' => $stock->barangs->name . ($stock->quantity == 0 ? ' (habis)' : ''),
                'disabled' => $stock->quantity == 0,
            ];
        });

        return Inertia::render('PermintaanBarangKeluar/FormPermintaanBarangKeluar', [
            "isUpdate" => false,
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
            return redirect('/barang-keluar')->with("error", $e->getMessage());
        } catch (\Exception $e) {
            return redirect('/barang-keluar')->with('error', 'Terjadi kesalahan pada server');
        }
    }

    public function create(Request $request)
    {
        $validated = $request->validate([
            'tanggal_keluar' => 'required',
            'catatan' => 'nullable',
            'items' => 'required|array|min:1',
            'items.*.barang_id' => 'required|exists:barangs,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $totalBarangKeluar = BarangKeluar::count();

        $permintaanBarangKeluar = BarangKeluar::create([
            'nomor_referensi' => sprintf('PBK-%s-%04d', now()->format('Ymd'), $totalBarangKeluar + 1),
            'tanggal_keluar' => $validated['tanggal_keluar'],
            'catatan' =>  $validated['catatan'] ?? '',
            'user_id' => Auth::id(),
        ]);

        foreach ($validated['items'] as $item) {
            $permintaanBarangKeluar->items()->create($item);
        }

        return redirect('/permintaan-barang-keluar')->with('success', 'Permintaan Barang Keluar berhasil ditambahkan!');
    }

    public function verifikasi(Request $request, $uuid)
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
        } else {
            $barangKeluar->status = 'Disetujui sebagian';
        }

        $barangKeluar->save();

        return back()->with('success', 'Permintaan barang keluar disetujui');
    }
}
