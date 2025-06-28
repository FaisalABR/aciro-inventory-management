<?php

namespace Database\Seeders;

use App\Models\UserRole;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userRoles = [ 
            // Admin di sign ke role super Admin
            [
                'user_id' => 1,
                'role_id' => 1,
            ],
            // Kasim disign ke kepala Toko
            [
                'user_id' => 2,
                'role_id' => 2,
            ],
        ];

        foreach($userRoles as $userRole) {
            UserRole::factory()->create($userRole);
        }
    }
}
