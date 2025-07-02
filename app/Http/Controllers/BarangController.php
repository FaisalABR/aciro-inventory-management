<?php

namespace App\Http\Controllers;

use App\Exceptions\Barang\BarangAlreadyExistsException;
use App\Exceptions\Barang\BarangException;
use App\Services\BarangServiceInterface;
use App\Services\SatuanServiceInterface;
use App\Services\SupplierServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class BarangController extends Controller
{
    private $barangService;
    private $satuanService;
    private $supplierService;

    public function __construct(BarangServiceInterface $barangService, SatuanServiceInterface $satuanService, SupplierServiceInterface $supplierService)
    {
        $this->barangService = $barangService;
        $this->satuanService = $satuanService;
        $this->supplierService = $supplierService;
    }

    public function index()
    {
        try {
            $barang = $this->barangService->getAll();

            return Inertia::render('Master/Barang/Index', [
                'data' => $barang,
            ]);
        } catch (\Exception $e) {
            return redirect("/master/barang")->with('error', $e->getMessage());
        }
    }

    public function showCreate()
    {
        $optionSatuan = $this->satuanService->getOptions();
        $optionSupplier = $this->supplierService->getOptions();
        return Inertia::render('Master/Barang/FormBarang', [
            "isUpdate" => false,
            'optionSatuan' => $optionSatuan,
            'optionSupplier' => $optionSupplier,
        ]);
    }

    public function showEdit($uuid)
    {
        try {
            $barang = $this->barangService->getBarangByUUID($uuid);
            $optionSatuan = $this->satuanService->getOptions();
            $optionSupplier = $this->supplierService->getOptions();

            return Inertia::render('Master/Barang/FormBarang', [
                "isUpdate" => true,
                "data" => $barang,
                'optionSatuan' => $optionSatuan,
                'optionSupplier' => $optionSupplier,
            ]);
        } catch (BarangException $e) {
            return redirect("/master/barang")->with("error", $e->getMessage());
        } catch (\Exception $e) {
            return redirect("/master/barang")->with('error', 'Terjadi kesalahan server saat mengambil data barang.');
        }
    }


    public function create(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required',
                'supplier_id' => 'required',
                'satuan_id' => 'required',
                'hargaJual' => 'required',
                'hargaBeli' => 'required',
            ]);

            $this->barangService->create($validated);

            return redirect('/master/barang')->with('success', 'Barang berhasil ditambahkan!');
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
            $this->barangService->delete($uuid);
            return redirect()->back()->with('success', 'Barang berhasil dihapus!');
        } catch (BarangException $e) {
            return redirect()->back()->with('error', $e->getMessage());
        } catch (\Exception $e) {
            Log::error("Terjadi error tak terduga saat menghapus barang: " . $e->getMessage(), ['exception' => $e]);
            return redirect()->back()->with('error', 'Terjadi kesalahan server. Silakan coba lagi nanti.');
        }
    }

    public function update(Request $request, $uuid)
    {
        try {

            $validated = $request->validate([
                'name' => 'required',
                'supplier_id' => 'required',
                'satuan_id' => 'required',
                'hargaJual' => 'required',
                'hargaBeli' => 'required',
            ]);

            $result = $this->barangService->update($validated, $uuid);
            if (!$result) {
                return redirect()->back()->with('error', 'Barang gagal diperbaharui!');
            }

            return redirect('/master/barang')->with('success', 'Barang berhasil diperbaharui!');
        } catch (BarangAlreadyExistsException $e) {
            return redirect()->back()->with('error', $e->getMessage());
        } catch (BarangException $e) {
            return redirect()->back()->with('error', $e->getMessage());
        } catch (\Exception $e) {
            Log::error("Terjadi error tak terduga saat membuat barang: " . $e->getMessage(), ['exception' => $e]);
            return redirect()->back()->withInput()->with('error', 'Terjadi kesalahan server. Silakan coba lagi nanti.');
        }
    }
}
