<?php

namespace App\Services;

use App\Events\ROPNotification;
use App\Exceptions\Barang\BarangException;
use App\Models\Barang;
use App\Models\BarangMasuk;
use App\Models\BarangMasukItem;
use App\Models\Role;
use App\Models\Stock;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

interface BarangMasukServiceInterface
{
    public function create(array $data);

    public function getAll();

    public function getBarangMasukByUUID($uuid);

    public function delete($uuid);
}

class BarangMasukService implements BarangMasukServiceInterface
{
    public function create(array $data)
    {
        try {
            $totalBarangMasuk = BarangMasuk::count();

            DB::beginTransaction();
            $barangMasuk = BarangMasuk::create([
                'nomor_referensi' => sprintf('BM-%s-%04d', now()->format('Ymd'), $totalBarangMasuk + 1),
                'tanggal_masuk'   => $data['tanggal_masuk'],
                'supplier_id'     => $data['supplier_id'],
                'catatan'         => $data['catatan'] ?? null,
            ]);

            foreach ($data['items'] as $item) {
                BarangMasukItem::create([
                    'barang_masuk_id' => $barangMasuk->barang_masuk_id,
                    'barang_id'       => $item['barang_id'],
                    'quantity'        => $item['quantity'],
                    'harga_beli'      => $item['harga_beli'],
                ]);

                $stockBarang = Stock::firstOrNew(['barang_id' => $item['barang_id']]);

                if (! $stockBarang->exists) {
                    $stockBarang->rop = 10;
                }

                $stockBarang->quantity += $item['quantity'];

                $barangMaster = Barang::find($item['barang_id']);
                if ($barangMaster) {
                    $stockBarang->potensi_penjualan = $barangMaster->hargaJual * $item['quantity'];
                }

                if ($stockBarang->quantity == 0) {
                    $stockBarang->status_rop = 'Out Of Stock';
                } elseif ($stockBarang->quantity > $stockBarang->rop) {
                    $stockBarang->status_rop = 'In Stock';
                } else {
                    $stockBarang->status_rop = 'Need Restock';
                }

                $stockBarang->save();
            }

            $roles = Role::whereIn('name', ['kepala_gudang', 'kepala_toko'])->get();
            foreach ($roles as $role) {
                // Send whatsapp ke kepala toko dan kepala gudang
                event(new ROPNotification("Ada barang masuk dengan nomor referensi {$barangMasuk->nomor_referensi}", $role->name));
            }
            DB::commit();



            return $barangMasuk;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Gagal membuat barang masuk' . $e->getMessage(), ['exception' => $e]);
            throw new BarangException('Terjadi masalah saat membuat barang masuk. Silakan coba lagi nanti.', 500);
        }
    }

    public function getAll()
    {
        try {
            $query = BarangMasuk::with(['supplier'])->select(
                'barang_masuk_id',
                'uuid',
                'nomor_referensi',
                'tanggal_masuk',
                'supplier_id',
                'catatan',
                DB::raw('(SELECT COUNT(DISTINCT barang_id) FROM barang_masuk_items WHERE barang_masuk_id = barang_masuks.barang_masuk_id) as total_unique_items'),
                DB::raw('(SELECT SUM(quantity) FROM barang_masuk_items WHERE barang_masuk_id = barang_masuks.barang_masuk_id) as total_quantity'),
                DB::raw('(SELECT SUM(quantity * harga_beli) FROM barang_masuk_items WHERE barang_masuk_id = barang_masuks.barang_masuk_id) as total_harga')
            );

            $formatted = $query->get()->map(function ($barangMasuk) {
                return [
                    'id'                 => $barangMasuk->barang_masuk_id,
                    'uuid'               => $barangMasuk->uuid,
                    'nomor_referensi'    => $barangMasuk->nomor_referensi,
                    'tanggal_masuk'      => $barangMasuk->tanggal_masuk,
                    'supplier_name'      => $barangMasuk->supplier->name,
                    'total_quantity'     => $barangMasuk->total_quantity,
                    'total_unique_items' => $barangMasuk->total_unique_items,
                    'total_harga'        => $barangMasuk->total_harga,
                ];
            });

            return $formatted;
        } catch (\Exception $e) {
            Log::error('Gagal mendapatkan semua barang ' . $e->getMessage(), ['exception' => $e]);
            throw new BarangException('Terjadi kesalahan dalam server saat mendapatkan semua barang', 500);
        }
    }

    public function getBarangMasukByUUID($uuid)
    {
        try {
            $barangMasuk = BarangMasuk::where('uuid', $uuid)->with(['supplier'])->firstOrFail();
            $barangItems = BarangMasukItem::where('barang_masuk_id', $barangMasuk->barang_masuk_id)->with(['barangs'])->get();

            $data = [
                'id'              => $barangMasuk->barang_masuk_id,
                'uuid'            => $barangMasuk->uuid,
                'nomor_referensi' => $barangMasuk->nomor_referensi,
                'tanggal_masuk'   => $barangMasuk->tanggal_masuk,
                'supplier'        => $barangMasuk->supplier->name,
                'catatan'         => $barangMasuk->catatan,
                'items'           => $barangItems,
            ];

            return $data;
        } catch (\Exception $e) {
            Log::error('Gagal mendapatkan barang masuk dengan ID: ' . $e->getMessage(), ['exception' => $e]);
            throw new BarangException('Barang Masuk tidak ditemukan', 404);
        }
    }

    public function delete($uuid)
    {
        $barangMasuk = BarangMasuk::where('uuid', $uuid)->first();

        if (! $barangMasuk) {
            throw new BarangException('Barang belum terdaftar');
        }

        try {
            $barangItems = BarangMasukItem::where('barang_masuk_id', $barangMasuk->barang_masuk_id)->get();

            foreach ($barangItems as $item) {
                $stockBarang = Stock::where('barang_id', $item['barang_id'])->first();

                $stockBarang->quantity -= $item['quantity'];

                $barangMaster = Barang::find($item['barang_id']);
                if ($barangMaster) {
                    $stockBarang->potensi_penjualan -= $barangMaster->hargaJual * $item['quantity'];
                }

                if ($stockBarang->quantity == 0) {
                    $stockBarang->status_rop = 'Out Of Stock';
                } elseif ($stockBarang->quantity > $stockBarang->rop) {
                    $stockBarang->status_rop = 'In Stock';
                } else {
                    $stockBarang->status_rop = 'Need Restock';
                }

                $stockBarang->save();
            }

            $barangMasuk->delete();

            return true;
        } catch (\Exception $e) {
            Log::error("Gagal menghapus barang masuk dengan ID {$uuid}" . $e->getMessage(), ['exception' => $e]);
            throw new BarangException('Terjadi kesalahan dalam menghapus barang. Silahkan coba lagi nanti');
        }
    }
}
