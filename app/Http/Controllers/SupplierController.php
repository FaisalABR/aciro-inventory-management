<?php

namespace App\Http\Controllers;

use App\Services\SupplierServiceInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupplierController extends Controller
{
    private $supplierService;

    public function __construct(SupplierServiceInterface $supplierService)
    {
        $this->supplierService = $supplierService;
    }

    public function index()
    {
        $satuan = $this->supplierService->getAll();

        return Inertia::render('Master/Supplier/Index', [
            'data' => $satuan,
            'message' => "Sukses mengirim data"
        ]);
    }

    public function showCreate()
    {
        return Inertia::render('Master/Supplier/FormSupplier', [
            "isUpdate" => false,
        ]);
    }

    public function showEdit($uuid)
    {
        $supplier = $this->supplierService->get($uuid);

        if (!$supplier) {
            return redirect()->back()->with("error", "Tidak ada satuan ini");
        }

        return Inertia::render('Master/Supplier/FormSupplier', [
            "isUpdate" => true,
            "data" => $supplier,
        ]);
    }


    public function create(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'contactPerson' => 'required',
            'noWhatsapp' => 'required',
            'email' => 'required',
            'alamat' => 'required',
            'kota' => 'required',
        ]);

        $satuan = $this->supplierService->create($validated);

        if (!$satuan) {
            return redirect()->back()->with('error', 'Supplier gagal ditambahkan!');
        }

        return redirect('/master/supplier')->with('success', 'Supplier berhasil ditambahkan!');
    }

    public function destroy($uuid)
    {

        $result = $this->supplierService->delete($uuid);

        if (!$result) {
            return redirect()->back()->with('error', 'Supplier gagal dihapus!');
        }

        return redirect()->back()->with('success', 'Supplier berhasil dihapus!');
    }

    public function update(Request $request, $uuid)
    {
        $validated = $request->validate([
            'name' => 'required',
            'contactPerson' => 'required',
            'noWhatsapp' => 'required',
            'email' => 'required',
            'alamat' => 'required',
            'kota' => 'required',
        ]);

        $result = $this->supplierService->update($validated, $uuid);
        if (!$result) {
            return redirect()->back()->with('error', 'Supplier gagal diperbaharui!');
        }

        return redirect('/master/supplier')->with('success', 'Supplier berhasil diperbaharui!');
    }
}
