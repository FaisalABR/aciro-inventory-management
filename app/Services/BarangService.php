<?php

namespace App\Services;

use App\Exceptions\Barang\BarangAlreadyExistsException;
use App\Exceptions\Barang\BarangException;
use App\Models\Barang;
use App\Models\Supplier;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

interface BarangServiceInterface
{
    public function create(array $data);
    public function getAll();
    public function getBarangByUUID($uuid);
    public function update($data, $uuid);
    public function delete($uuid);
    public function getOptions($supplier = null);
};

class BarangService implements BarangServiceInterface
{
    public function create(array $data)
    {
        if (Barang::where('name', $data['name'])->exists()) {
            throw new BarangAlreadyExistsException();
        }

        try {
            $barang = Barang::create($data);

            return $barang;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Gagal membuat barang" . $e->getMessage(), ['exception' => $e]);
            throw new BarangException("Terjadi masalah saat membuat barang. Silakan coba lagi nanti.", 500);
        }
    }

    public function getAll()
    {
        try {
            $data = Barang::with(['supplier', 'satuan'])->get();

            return $data;
        } catch (\Exception $e) {
            Log::error("Gagal mendapatkan semua barang " . $e->getMessage(), ['exception' => $e]);
            throw new BarangException("Terjadi kesalahan dalam server", 500);
        }
    }

    public function getBarangByUUID($uuid)
    {
        try {
            $barang = Barang::where('uuid', $uuid)->with(['supplier', 'satuan'])->firstOrFail();
            return $barang;
        } catch (\Exception $e) {
            Log::error("Gagal mendapatkan barang dengan ID: " . $e->getMessage(), ['exception' => $e]);
            throw new BarangException("Pengguna tidak ditemukan", 404);
        }
    }

    public function update($data, $uuid)
    {

        try {
            $barang = Barang::where('uuid', $uuid)->first();

            $barang->update($data);


            return true;
        } catch (\Exception $e) {
            Log::error("Gagal memperbaharui barang: " . $e->getMessage(), ['exception' => $e]);
            throw new BarangException("Terjadi masalah saat update pengguna. Silakan coba lagi nanti.", 500);
        }
    }

    public function delete($uuid)
    {
        $barang = Barang::where('uuid', $uuid)->first();

        if (!$barang) {
            throw new BarangException("Pengguna belum terdaftar");
        }

        try {
            $barang->delete();
            return true;
        } catch (\Exception $e) {
            Log::error("Gagal menghapus barang dengan ID {$uuid}" . $e->getMessage(), ['exception' => $e]);
            throw new BarangException("Terjadi kesalahan dalam menghapus barang. Silahkan coba lagi nanti");
        }
    }

    public function getOptions($supplier = null)
    {
        $data = $supplier
            ? Barang::where('supplier_id', $supplier)->get()
            : Barang::all();

        $options = $data->map(function ($barang) {
            return [
                'value' => $barang->id,
                'label' => $barang->name,
            ];
        });

        return $options;
    }
}
