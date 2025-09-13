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
            // Sarah disign ke kepala gudang
            [
                'user_id' => 3,
                'role_id' => 3,
            ],
            // Michael disign ke kepala accounting
            [
                'user_id' => 4,
                'role_id' => 4,
            ],
            // Ayu disign ke kepala 
            [
                'user_id' => 5,
                'role_id' => 5,
            ],
            // David disign ke admin gudang
            [
                'user_id' => 6,
                'role_id' => 6,
            ],
            // Fatimah disign ke staff toko
            [
                'user_id' => 7,
                'role_id' => 7,
            ],
            // Rizky disign ke admin gudang
            [
                'user_id' => 8,
                'role_id' => 6,
            ],
            // Jessica disign ke staff toko
            [
                'user_id' => 9,
                'role_id' => 7,
            ],
            // Hiroshi disign ke admin gudang
            [
                'user_id' => 10,
                'role_id' => 6,
            ],
            // Maria disign ke staff toko
            [
                'user_id' => 11,
                'role_id' => 7,
            ],
            // Thomas disign ke staff toko
            [
                'user_id' => 12,
                'role_id' => 7,
            ],
        ];

        foreach ($userRoles as $userRole) {
            UserRole::factory()->create($userRole);
        }
    }
}
