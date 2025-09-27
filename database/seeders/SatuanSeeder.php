<?php

namespace Database\Seeders;

use App\Models\Satuan;
use Illuminate\Database\Seeder;

class SatuanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $satuan = [
            [
                'name'        => 'Karton',
                'code'        => 'CTN',
                'description' => 'Satuan untuk jumlah dalam kemasan kotak karton.',
            ],
            [
                'name'        => 'Lusin',
                'code'        => 'LSN',
                'description' => 'Satuan untuk jumlah yang setara dengan 12 buah.',
            ],
            [
                'name'        => 'Ball',
                'code'        => 'BALL',
                'description' => 'Satuan untuk jumlah dalam kemasan karung.',
            ],
        ];

        foreach ($satuan as $item) {
            Satuan::factory()->create($item);
        }
    }
}
