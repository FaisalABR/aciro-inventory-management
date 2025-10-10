<?php

namespace Database\Seeders;

use App\Models\Stock;
use Illuminate\Database\Seeder;

class StockSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $stocks = [
            [
                'barang_id'         => 'BR0000001',
                'quantity'          => 0,
                'potensi_penjualan' => 0.0,
                'itr'               => null,
                'rop'               => 10,
                'status_rop'        => 'Out Of Stock',
                'status_itr'        => null,
                'last_evaluated'    => null,
            ],
            [
                'barang_id'         => 'BR0000002',
                'quantity'          => 0,
                'potensi_penjualan' => 0.0,
                'itr'               => null,
                'rop'               => 10,
                'status_rop'        => 'Out Of Stock',
                'status_itr'        => null,
                'last_evaluated'    => null,
            ],
            [
                'barang_id'         => 'BR0000003',
                'quantity'          => 0,
                'potensi_penjualan' => 0.0,
                'itr'               => null,
                'rop'               => 10,
                'status_rop'        => 'Out Of Stock',
                'status_itr'        => null,
                'last_evaluated'    => null,
            ],
            [
                'barang_id'         => 'BR0000004',
                'quantity'          => 0,
                'potensi_penjualan' => 0.0,
                'itr'               => null,
                'rop'               => 10,
                'status_rop'        => 'Out Of Stock',
                'status_itr'        => null,
                'last_evaluated'    => null,
            ],
            [
                'barang_id'         => 'BR0000005',
                'quantity'          => 0,
                'potensi_penjualan' => 0.0,
                'itr'               => null,
                'rop'               => 10,
                'status_rop'        => 'Out Of Stock',
                'status_itr'        => null,
                'last_evaluated'    => null,
            ],
            [
                'barang_id'         => 'BR0000006',
                'quantity'          => 0,
                'potensi_penjualan' => 0.0,
                'itr'               => null,
                'rop'               => 10,
                'status_rop'        => 'Out Of Stock',
                'status_itr'        => null,
                'last_evaluated'    => null,
            ],
            [
                'barang_id'         => 'BR0000007',
                'quantity'          => 0,
                'potensi_penjualan' => 0.0,
                'itr'               => null,
                'rop'               => 10,
                'status_rop'        => 'Out Of Stock',
                'status_itr'        => null,
                'last_evaluated'    => null,
            ],
            [
                'barang_id'         => 'BR0000008',
                'quantity'          => 0,
                'potensi_penjualan' => 0.0,
                'itr'               => null,
                'rop'               => 10,
                'status_rop'        => 'Out Of Stock',
                'status_itr'        => null,
                'last_evaluated'    => null,
            ],
            [
                'barang_id'         => 'BR0000009',
                'quantity'          => 0,
                'potensi_penjualan' => 0.0,
                'itr'               => null,
                'rop'               => 10,
                'status_rop'        => 'Out Of Stock',
                'status_itr'        => null,
                'last_evaluated'    => null,
            ],
            [
                'barang_id'         => 'BR0000010',
                'quantity'          => 0,
                'potensi_penjualan' => 0.0,
                'itr'               => null,
                'rop'               => 10,
                'status_rop'        => 'Out Of Stock',
                'status_itr'        => null,
                'last_evaluated'    => null,
            ],
            [
                'barang_id'         => 'BR0000011',
                'quantity'          => 0,
                'potensi_penjualan' => 0.0,
                'itr'               => null,
                'rop'               => 10,
                'status_rop'        => 'Out Of Stock',
                'status_itr'        => null,
                'last_evaluated'    => null,
            ],
        ];

        foreach ($stocks as $stock) {
            Stock::create($stock);
        }
    }
}
