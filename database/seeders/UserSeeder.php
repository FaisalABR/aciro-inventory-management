<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name'       => 'Admin',
                'email'      => 'admin@mail.com',
                'noWhatsapp' => '0822136386576',
            ],
            [
                'name'       => 'Kasim',
                'email'      => 'kepalatoko@mail.com',
                'noWhatsapp' => '+6282110779970',
                'password'   => Hash::make('kepalatoko123'),
            ],
            [
                'name'       => 'Sarah Johnson',
                'email'      => 'kepalagudang@mail.com',
                'noWhatsapp' => '+6281316390503',
                'password'   => Hash::make('kepalagudang123'),
            ],
            [
                'name'       => 'Michael Chen',
                'email'      => 'kepalaaccounting@mail.com',
                'noWhatsapp' => '+6281318052763',
                'password'   => Hash::make('kepalaaccounting123'),
            ],
            [
                'name'       => 'Ayu Lestari',
                'email'      => 'kepalapengadaan@mail.com',
                'noWhatsapp' => '+6281284585573',
                'password'   => Hash::make('kepalapengadaan123'),
            ],
            [
                'name'       => 'Hiroshi Tanaka',
                'email'      => 'admingudang@mail.com',
                'noWhatsapp' => '083311133344',
                'password'   => Hash::make('admin123'),
            ],
            [
                'name'       => 'Thomas Müller',
                'email'      => 'stafftoko@mail.com',
                'noWhatsapp' => '085511155566',
                'password'   => Hash::make('toko1234'),
            ],
            [
                'name'       => 'Andreas',
                'email'      => 'staffpengadaan@mail.com',
                'noWhatsapp' => '085511155566',
                'password'   => Hash::make('pengadaan123'),
            ],
            [
                'name'       => 'Rudiger',
                'email'      => 'accounting@mail.com',
                'noWhatsapp' => '085511155566',
                'password'   => Hash::make('accounting123'),
            ],
        ];

        foreach ($users as $user) {
            User::factory()->create($user);
        }
    }
}
