<?php

namespace App\Http\Controllers;

use App\Services\KategoriServiceInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KategoriController extends Controller
{
    private $kategoriService;

    public function __construct(KategoriServiceInterface $kategoriService)
    {
        $this->kategoriService = $kategoriService;
    }

    public function index(Request $request)
    {
        $search  = $request->input('search');
        $perPage = $request->input('per_page', 10);

        $kategori = $this->kategoriService->getAll($search, $perPage);

        return Inertia::render('Master/Kategori/Index', [
            'data'    => $kategori,
            'filters' => [
                'search' => $search,
            ],
            'message' => 'Sukses mengirim data',
        ]);
    }

    public function showCreate()
    {
        return Inertia::render('Master/Kategori/FormKategori', [
            'isUpdate' => false,
        ]);
    }

    public function showEdit($uuid)
    {
        $kategori = $this->kategoriService->get($uuid);

        if (! $kategori) {
            return redirect()->back()->with('error', 'Tidak ada kategori ini');
        }

        return Inertia::render('Master/Kategori/FormKategori', [
            'isUpdate' => true,
            'data'     => $kategori,
        ]);
    }

    public function create(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required',
            'code'        => 'required',
            'description' => 'required',
        ]);

        $kategori = $this->kategoriService->create($validated);

        if (! $kategori) {
            return redirect()->back()->with('error', 'kategori gagal ditambahkan!');
        }

        return redirect('/master/kategori')->with('success', 'kategori berhasil ditambahkan!');
    }

    public function destroy($uuid)
    {

        $result = $this->kategoriService->delete($uuid);

        if (! $result) {
            return redirect()->back()->with('error', 'Kategori gagal dihapus!');
        }

        return redirect()->back()->with('success', 'Kategori berhasil dihapus!');
    }

    public function update(Request $request, $uuid)
    {
        $validated = $request->validate([
            'name'        => 'required',
            'code'        => 'required',
            'description' => 'required',
        ]);

        $result = $this->kategoriService->update($validated, $uuid);
        if (! $result) {
            return redirect()->back()->with('error', 'Kategori gagal diperbaharui!');
        }

        return redirect('/master/kategori')->with('success', 'Kategori berhasil diperbaharui!');
    }
}
