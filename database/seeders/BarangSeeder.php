<?php

namespace Database\Seeders;

use App\Models\Barang;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BarangSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $barang = [
            [
                'name'        => 'Indomie Soto',
                'supplier_id' => 1,
                'satuan_id'   => 1,
                'hargaJual'   => 200000.00,
                'hargaBeli'   => 150000.00,
            ],
            [
                'name'        => 'Beras Ramos 5kg',
                'supplier_id' => 2,
                'satuan_id'   => 1,
                'hargaJual'   => 75000.00,
                'hargaBeli'   => 68000.00,
            ],
            [
                'name'        => 'Gula Pasir 1kg',
                'supplier_id' => 3,
                'satuan_id'   => 2,
                'hargaJual'   => 15000.00,
                'hargaBeli'   => 13000.00,
            ],
            [
                'name'        => 'Minyak Goreng Bimoli 2L',
                'supplier_id' => 1,
                'satuan_id'   => 2,
                'hargaJual'   => 45000.00,
                'hargaBeli'   => 42000.00,
            ],
            [
                'name'        => 'Susu Ultra 1L',
                'supplier_id' => 2,
                'satuan_id'   => 2,
                'hargaJual'   => 18000.00,
                'hargaBeli'   => 16000.00,
            ],
            [
                'name'        => 'Kopi Kapal Api 380g',
                'supplier_id' => 3,
                'satuan_id'   => 2,
                'hargaJual'   => 35000.00,
                'hargaBeli'   => 31000.00,
            ],
            [
                'name'        => 'Teh Sosro Botol 1L',
                'supplier_id' => 1,
                'satuan_id'   => 2,
                'hargaJual'   => 12000.00,
                'hargaBeli'   => 10000.00,
            ],
            [
                'name'        => 'Sabun Lifebuoy 100g',
                'supplier_id' => 2,
                'satuan_id'   => 2,
                'hargaJual'   => 8000.00,
                'hargaBeli'   => 6000.00,
            ],
            [
                'name'        => 'Shampoo Sunsilk 170ml',
                'supplier_id' => 3,
                'satuan_id'   => 2,
                'hargaJual'   => 25000.00,
                'hargaBeli'   => 22000.00,
            ],
            [
                'name'        => 'Detergen Rinso 2kg',
                'supplier_id' => 1,
                'satuan_id'   => 1,
                'hargaJual'   => 38000.00,
                'hargaBeli'   => 34000.00,
            ],
            [
                'name'        => 'Tepung Terigu Segitiga Biru 1kg',
                'supplier_id' => 2,
                'satuan_id'   => 2,
                'hargaJual'   => 13000.00,
                'hargaBeli'   => 11000.00,
            ],
        ];


        foreach ($barang as $item) {
            Barang::factory()->create($item);
        }
    }
}
