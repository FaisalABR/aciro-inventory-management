<?php

namespace App\Services;

use App\Exceptions\Barang\BarangException;
use App\Models\BarangKeluar;
use App\Models\BarangKeluarItem;
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
            $query = BarangKeluar::with('user')->select(
                'barang_keluar_id',
                'uuid',
                'nomor_referensi',
                'tanggal_keluar',
                'catatan',
                'status',
                'user_id',
                DB::raw('(SELECT COUNT (DISTINCT barang_id) FROM barang_keluar_items WHERE barang_keluar_id = barang_keluars.barang_keluar_id) as total_unique_items'),
                DB::raw('(SELECT SUM(quantity) FROM barang_keluar_items WHERE barang_keluar_id = barang_keluars.barang_keluar_id) as total_quantity'),
            );

            $formattedValue = $query->get()->map(function ($barangKeluar) {
                return [
                    'id'                 => $barangKeluar->barang_keluar_id,
                    'uuid'               => $barangKeluar->uuid,
                    'nomor_referensi'    => $barangKeluar->nomor_referensi,
                    'tanggal_keluar'     => $barangKeluar->tanggal_keluar,
                    'total_quantity'     => $barangKeluar->total_quantity,
                    'total_unique_items' => $barangKeluar->total_unique_items,
                    'status'             => $barangKeluar->status,
                    'user'               => [
                        'id'   => $barangKeluar->user->user_id,
                        'name' => $barangKeluar->user->name,
                    ],
                ];
            });

            return $formattedValue;
        } catch (\Exception $e) {
            Log::error('Gagal mendapatkan semua barang ' . $e->getMessage(), ['exception' => $e]);
            throw new BarangException('Terjadi kesalahan dalam server saat mendapatkan semua barang', 500);
        }
    }

    public function getBarangKeluarByUUID($uuid)
    {
        try {
            $barangKeluar = BarangKeluar::where('uuid', $uuid)->with('user')->firstOrFail();
            $barangItems  = BarangKeluarItem::where('barang_keluar_id', $barangKeluar->barang_keluar_id)->with(['barangs'])->get();

            $data = [
                'id'                       => $barangKeluar->barang_keluar_id,
                'uuid'                     => $barangKeluar->uuid,
                'nomor_referensi'          => $barangKeluar->nomor_referensi,
                'tanggal_keluar'           => $barangKeluar->tanggal_keluar,
                'catatan'                  => $barangKeluar->catatan,
                'status'                   => $barangKeluar->status,
                'verifikasi_kepala_toko'   => $barangKeluar->verifikasi_kepala_toko,
                'verifikasi_kepala_gudang' => $barangKeluar->verifikasi_kepala_gudang,
                'kepala_toko_menolak' => $barangKeluar->kepala_toko_menolak,
                'kepala_gudang_menolak' => $barangKeluar->kepala_gudang_menolak,
                'catatan_penolakan' => $barangKeluar->catatan_penolakan,
                'user'                     => [
                    'id'   => $barangKeluar->user->user_id,
                    'name' => $barangKeluar->user->name,
                ],
                'items' => $barangItems,
            ];

            return $data;
        } catch (\Exception $e) {
            Log::error('Gagal mendapatkan barang masuk dengan ID: ' . $e->getMessage(), ['exception' => $e]);
            throw new BarangException('Barang Masuk tidak ditemukan', 404);
        }
    }

    public function delete($uuid)
    {
        return 0;
    }
}
