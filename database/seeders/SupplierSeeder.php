<?php

namespace Database\Seeders;

use App\Models\Supplier;
use Illuminate\Database\Seeder;

class SupplierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $suppliers = [
            [
                'uuid'          => 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
                'name'          => 'PT. Distributor Cepat',
                'contactPerson' => 'Budi Santoso',
                'noWhatsapp'    => '+6282110779970',
                'email'         => 'faisalabubakar92@gmail.com',
                'alamat'        => 'Jl. Merdeka No. 123',
                'kota'          => 'Jakarta',
            ],
            [
                'uuid'          => 'f1e2d3c4-b5a6-0987-6543-210fedcba987',
                'name'          => 'CV. Jaya Abadi Supplies',
                'contactPerson' => 'Siti Aminah',
                'noWhatsapp'    => '+6282110779970',
                'email'         => 'faisalabubakar92@gmail.com',
                'alamat'        => 'Jl. Pahlawan No. 45, Blok A',
                'kota'          => 'Surabaya',
            ],
            [
                'uuid'          => '1a2b3c4d-5e6f-7080-9101-112131415161',
                'name'          => 'Toko Sumber Rezeki',
                'contactPerson' => 'Ahmad Fauzi',
                'noWhatsapp'    => '+6282110779970',
                'email'         => 'faisalabubakar92@gmail.com',
                'alamat'        => 'Jl. Kenangan Indah Raya No. 7',
                'kota'          => 'Bandung',
            ],
        ];
        foreach ($suppliers as $supplier) {
            Supplier::factory()->create($supplier);
        }
    }
}
