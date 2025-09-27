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
                'barang_id'         => 1,
                'quantity'          => 0,
                'potensi_penjualan' => 0.0,
                'itr'               => null,
                'rop'               => 10,
                'status_rop'        => 'Out Of Stock',
                'status_itr'        => null,
                'last_evaluated'    => null,
            ],
            [
                'barang_id'         => 2,
                'quantity'          => 0,
                'potensi_penjualan' => 0.0,
                'itr'               => null,
                'rop'               => 10,
                'status_rop'        => 'Out Of Stock',
                'status_itr'        => null,
                'last_evaluated'    => null,
            ],
            [
                'barang_id'         => 3,
                'quantity'          => 0,
                'potensi_penjualan' => 0.0,
                'itr'               => null,
                'rop'               => 10,
                'status_rop'        => 'Out Of Stock',
                'status_itr'        => null,
                'last_evaluated'    => null,
            ],
            [
                'barang_id'         => 4,
                'quantity'          => 0,
                'potensi_penjualan' => 0.0,
                'itr'               => null,
                'rop'               => 10,
                'status_rop'        => 'Out Of Stock',
                'status_itr'        => null,
                'last_evaluated'    => null,
            ],
            [
                'barang_id'         => 5,
                'quantity'          => 0,
                'potensi_penjualan' => 0.0,
                'itr'               => null,
                'rop'               => 10,
                'status_rop'        => 'Out Of Stock',
                'status_itr'        => null,
                'last_evaluated'    => null,
            ],
            [
                'barang_id'         => 6,
                'quantity'          => 0,
                'potensi_penjualan' => 0.0,
                'itr'               => null,
                'rop'               => 10,
                'status_rop'        => 'Out Of Stock',
                'status_itr'        => null,
                'last_evaluated'    => null,
            ],
            [
                'barang_id'         => 7,
                'quantity'          => 0,
                'potensi_penjualan' => 0.0,
                'itr'               => null,
                'rop'               => 10,
                'status_rop'        => 'Out Of Stock',
                'status_itr'        => null,
                'last_evaluated'    => null,
            ],
            [
                'barang_id'         => 8,
                'quantity'          => 0,
                'potensi_penjualan' => 0.0,
                'itr'               => null,
                'rop'               => 10,
                'status_rop'        => 'Out Of Stock',
                'status_itr'        => null,
                'last_evaluated'    => null,
            ],
            [
                'barang_id'         => 9,
                'quantity'          => 0,
                'potensi_penjualan' => 0.0,
                'itr'               => null,
                'rop'               => 10,
                'status_rop'        => 'Out Of Stock',
                'status_itr'        => null,
                'last_evaluated'    => null,
            ],
            [
                'barang_id'         => 10,
                'quantity'          => 0,
                'potensi_penjualan' => 0.0,
                'itr'               => null,
                'rop'               => 10,
                'status_rop'        => 'Out Of Stock',
                'status_itr'        => null,
                'last_evaluated'    => null,
            ],
            [
                'barang_id'         => 11,
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
