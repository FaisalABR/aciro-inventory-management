<?php

namespace Database\Seeders;

use App\Models\Kategori;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class KategoriSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kategori = [
            // ID KTG0000001
            [
                'name'        => 'Sembako & Bahan Pokok',
                'code'        => 'BAHAN',
                'description' => 'Bahan pangan utama/pokok.',
            ],
            // ID KTG0000002
            [
                'name'        => 'Makanan Instan',
                'code'        => 'INSTAN',
                'description' => 'Makanan cepat saji.',
            ],
            // ID KTG0000003
            [
                'name'        => 'Minuman',
                'code'        => 'MINUM',
                'description' => 'Semua produk cairan siap konsumsi.',
            ],
            // ID KTG0000004
            [
                'name'        => 'Bumbu Dapur & Pelengkap',
                'code'        => 'BUMBU',
                'description' => 'Pemanis, penyedap, pelengkap masakan.',
            ],
            // ID KTG0000005
            [
                'name'        => 'Perawatan Diri & Kebersihan',
                'code'        => 'BERSIH',
                'description' => 'Non-makanan untuk kebersihan pribadi/rumah.',
            ],
        ];

        foreach ($kategori as $item) {
            Kategori::factory()->create($item);
        }
    }
}
