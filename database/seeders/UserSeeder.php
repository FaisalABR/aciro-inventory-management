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
        ];

        foreach ($users as $user) {
            User::factory()->create($user);
        }
    }
}
