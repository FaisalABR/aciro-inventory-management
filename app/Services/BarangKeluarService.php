<?php

namespace App\Services;

use App\Exceptions\Barang\BarangException;
use App\Models\BarangKeluar;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

interface BarangKeluarServiceInterface
{
    public function create(array $data);
    public function getAll();
    public function getBarangKeluarByUUID($uuid);
    public function delete($uuid);
}


class BarangKeluarService implements BarangKeluarServiceInterface
{
    public function create(array $data)
    {
        return 0;
    }

    public function getAll()
    {
        try {
            $query = BarangKeluar::select(
                'id',
                'uuid',
                'nomor_referensi',
                'catatan',
                DB::raw('(SELECT COUNT (DISTINCT barang_id) FROM barang_keluar_items WHERE barang_keluar_id = barang_keluars.id) as total_unique_items'),
                DB::raw('(SELECT SUM(quantity) FROM barang_keluar_items WHERE barang_keluar_id = barang_keluars.id) as total_quantity'),
                DB::raw('(SELECT SUM(quantity * harga_jual) FROM barang_keluar_items WHERE barang_keluar_id = barang_keluars.id) as total_penjualan')
            );

            $formattedValue = $query->get()->map(function ($barangKeluar) {
                return [
                    'id' => $barangKeluar->id,
                    'uuid' => $barangKeluar->uuid,
                    'nomor_referensi' => $barangKeluar->nomor_referensi,
                    'tanggal_keluar' => $barangKeluar->tanggal_keluar,
                    'total_quantity' => $barangKeluar->total_quantity,
                    'total_unique_items' => $barangKeluar->total_unique_items,
                    'total_penjualan' => $barangKeluar->total_penjualan,
                ];
            });

            return $formattedValue;
        } catch (\Exception $e) {
            Log::error("Gagal mendapatkan semua barang " . $e->getMessage(), ['exception' => $e]);
            throw new BarangException("Terjadi kesalahan dalam server saat mendapatkan semua barang", 500);
        }
    }
    public function getBarangKeluarByUUID($uuid)
    {
        return 0;
    }

    public function delete($uuid)
    {
        return 0;
    }
}
