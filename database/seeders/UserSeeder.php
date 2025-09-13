<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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
                'name' => 'Admin',
                'email' => 'admin@mail.com',
                'noWhatsapp' => '0822136386576',
            ],
            [
                'name' => 'Kasim',
                'email' => 'kepalatoko@mail.com',
                'noWhatsapp' => '08221312126576',
                'password' => Hash::make("kepalatoko123"),
            ],
            [
                'name'       => 'Sarah Johnson',
                'email'      => 'sarah@mail.com',
                'noWhatsapp' => '081234567890',
                'password'   => Hash::make('sarah123'),
            ],
            [
                'name'       => 'Michael Chen',
                'email'      => 'michael@mail.com',
                'noWhatsapp' => '085678912345',
                'password'   => Hash::make('michael123'),
            ],
            [
                'name'       => 'Ayu Lestari',
                'email'      => 'ayu@mail.com',
                'noWhatsapp' => '087712345678',
                'password'   => Hash::make('ayu123'),
            ],
            [
                'name'       => 'David Smith',
                'email'      => 'david@mail.com',
                'noWhatsapp' => '082198765432',
                'password'   => Hash::make('david123'),
            ],
            [
                'name'       => 'Fatimah Zahra',
                'email'      => 'fatimah@mail.com',
                'noWhatsapp' => '089876543210',
                'password'   => Hash::make('fatimah123'),
            ],
            [
                'name'       => 'Rizky Pratama',
                'email'      => 'rizky@mail.com',
                'noWhatsapp' => '081311112222',
                'password'   => Hash::make('rizky123'),
            ],
            [
                'name'       => 'Jessica Brown',
                'email'      => 'jessica@mail.com',
                'noWhatsapp' => '082211122233',
                'password'   => Hash::make('jessica123'),
            ],
            [
                'name'       => 'Hiroshi Tanaka',
                'email'      => 'hiroshi@mail.com',
                'noWhatsapp' => '083311133344',
                'password'   => Hash::make('hiroshi123'),
            ],
            [
                'name'       => 'Maria Gonzalez',
                'email'      => 'maria@mail.com',
                'noWhatsapp' => '084411144455',
                'password'   => Hash::make('maria123'),
            ],
            [
                'name'       => 'Thomas Müller',
                'email'      => 'thomas@mail.com',
                'noWhatsapp' => '085511155566',
                'password'   => Hash::make('thomas123'),
            ],
        ];

        foreach ($users as $user) {
            User::factory()->create($user);
        }
    }
}
