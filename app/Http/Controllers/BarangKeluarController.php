<?php

namespace App\Http\Controllers;

use App\Exceptions\Barang\BarangException;
use App\Services\BarangKeluarServiceInterface;
use App\Services\BarangServiceInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BarangKeluarController extends Controller
{
    private $barangKeluarService;
    private $barangService;


    public function __construct(
        BarangKeluarServiceInterface $barangKeluarService,
        BarangServiceInterface $barangService
    ) {
        $this->barangKeluarService = $barangKeluarService;
        $this->barangService = $barangService;
    }

    public function index()
    {
        try {
            $barangKeluar = $this->barangKeluarService->getAll();

            return Inertia::render('BarangKeluar/Index', [
                'data' => $barangKeluar,
            ]);
        } catch (\Exception $e) {
            return redirect("/barang-keluar")->with('error', $e->getMessage());
        }
    }

    public function showCreate()
    {
        $optionBarang = $this->barangService->getOptions();

        return Inertia::render('BarangKeluar/FormBarangKeluar', [
            "isUpdate" => false,
            'optionBarang' => $optionBarang,
        ]);
    }

    public function showDetail($uuid)
    {
        try {
            $data = $this->barangKeluarService->getBarangKeluarByUUID($uuid);

            return Inertia::render('BarangMasuk/Detail', [
                'data' => $data,
            ]);
        } catch (BarangException $e) {
            return redirect('/barang-keluar')->with("error", $e->getMessage());
        } catch (\Exception $e) {
            return redirect('/barang-keluar')->with('error', 'Terjadi kesalahan pada server');
        }
    }
}
