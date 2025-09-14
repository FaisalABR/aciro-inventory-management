<?php

namespace App\Http\Controllers;

use App\Exceptions\Barang\BarangAlreadyExistsException;
use App\Exceptions\Barang\BarangException;
use App\Services\BarangMasukServiceInterface;
use App\Services\BarangServiceInterface;
use App\Services\SupplierServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class BarangMasukController extends Controller
{
    private $barangMasukService;
    private $barangService;
    private $supplierService;

    public function __construct(
        BarangMasukServiceInterface $barangMasukService,
        BarangServiceInterface $barangService,
        SupplierServiceInterface $supplierService
    ) {
        $this->barangMasukService = $barangMasukService;
        $this->barangService = $barangService;
        $this->supplierService = $supplierService;
    }

    public function index()
    {
        try {
            $barangMasuk = $this->barangMasukService->getAll();

            return Inertia::render('BarangMasuk/Index', [
                'data' => $barangMasuk,
            ]);
        } catch (\Exception $e) {
            return redirect("/barang-masuk")->with('error', $e->getMessage());
        }
    }

    public function showCreate()
    {
        $optionBarang = $this->barangService->getOptions();
        $optionSupplier = $this->supplierService->getOptions();

        return Inertia::render('BarangMasuk/FormBarangMasuk', [
            "isUpdate" => false,
            'optionBarang' => $optionBarang,
            'optionSupplier' => $optionSupplier,
        ]);
    }

    public function showDetail($uuid)
    {
        try {
            $data = $this->barangMasukService->getBarangMasukByUUID($uuid);

            return Inertia::render('BarangMasuk/Detail', [
                'data' => $data,
            ]);
        } catch (BarangException $e) {
            return redirect('/barang-masuk')->with("error", $e->getMessage());
        } catch (\Exception $e) {
            return redirect('/barang-masuk')->with('error', 'Terjadi kesalahan pada server');
        }
    }


    public function create(Request $request)
    {
        try {
            $validated = $request->validate([
                'nomor_referensi' => 'required',
                'supplier_id' => 'required',
                'tanggal_masuk' => 'required',
                'catatan' => 'nullable',
                'items' => 'required|array|min:1',
                'items.*.barang_id' => 'required|exists:barangs,id',
                'items.*.quantity' => 'required|integer|min:1',
                'items.*.harga_beli' => 'required|numeric|min:0',
            ]);

            $this->barangMasukService->create($validated);

            return redirect('/barang-masuk')->with('success', 'Barang Masuk berhasil ditambahkan!');
        } catch (BarangAlreadyExistsException $e) {
            return redirect()->back()->with('error', $e->getMessage());
        } catch (BarangException $e) {
            return redirect()->back()->with('error', $e->getMessage());
        } catch (\Exception $e) {
            Log::error("Terjadi error tak terduga saat membuat barang: " . $e->getMessage(), ['exception' => $e]);
            return redirect()->back()->withInput()->with('error', 'Terjadi kesalahan server. Silakan coba lagi nanti.');
        }
    }

    public function destroy($uuid)
    {
        try {
            $this->barangMasukService->delete($uuid);
            return redirect()->back()->with('success', 'Barang berhasil dihapus!');
        } catch (BarangException $e) {
            return redirect()->back()->with('error', $e->getMessage());
        } catch (\Exception $e) {
            Log::error("Terjadi error tak terduga saat menghapus barang: " . $e->getMessage(), ['exception' => $e]);
            return redirect()->back()->with('error', 'Terjadi kesalahan server. Silakan coba lagi nanti.');
        }
    }
}
