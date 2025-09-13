<?php

namespace App\Http\Controllers;

use App\Services\SatuanServiceInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SatuanController extends Controller
{
    private $satuanService;

    public function __construct(SatuanServiceInterface $satuanService)
    {
        $this->satuanService = $satuanService;
    }

    public function index(Request $request)
    {
        $search = $request->input("search");
        $perPage = $request->input("per_page", 10);


        $satuan = $this->satuanService->getAll($search, $perPage);

        return Inertia::render('Master/Satuan/Index', [
            'data' => $satuan,
            'filters' => [
                "search" => $search,
            ],
            'message' => "Sukses mengirim data"
        ]);
    }

    public function showCreate()
    {
        return Inertia::render('Master/Satuan/FormSatuan', [
            "isUpdate" => false,
        ]);
    }

    public function showEdit($uuid)
    {
        $satuan = $this->satuanService->get($uuid);

        if (!$satuan) {
            return redirect()->back()->with("error", "Tidak ada satuan ini");
        }

        return Inertia::render('Master/Satuan/FormSatuan', [
            "isUpdate" => true,
            "data" => $satuan,
        ]);
    }


    public function create(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'code' => 'required',
            'description' => 'required',
        ]);

        $satuan = $this->satuanService->create($validated);

        if (!$satuan) {
            return redirect()->back()->with('error', 'Satuan gagal ditambahkan!');
        }

        return redirect('/master/satuan')->with('success', 'Satuan berhasil ditambahkan!');
    }

    public function destroy($uuid)
    {

        $result = $this->satuanService->delete($uuid);

        if (!$result) {
            return redirect()->back()->with('error', 'Satuan gagal dihapus!');
        }

        return redirect()->back()->with('success', 'Satuan berhasil dihapus!');
    }

    public function update(Request $request, $uuid)
    {
        $validated = $request->validate([
            'name' => 'required',
            'code' => 'required',
            'description' => 'required',
        ]);

        $result = $this->satuanService->update($validated, $uuid);
        if (!$result) {
            return redirect()->back()->with('error', 'Satuan gagal diperbaharui!');
        }

        return redirect('/master/satuan')->with('success', 'Satuan berhasil diperbaharui!');
    }
}
