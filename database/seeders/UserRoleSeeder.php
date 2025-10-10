<?php

namespace Database\Seeders;

use App\Models\UserRole;
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
                'user_id' => 'USR0000001',
                'role_id' => 1,
            ],
            // Kasim disign ke kepala Toko
            [
                'user_id' => 'USR0000002',
                'role_id' => 2,
            ],
            // Sarah disign ke kepala gudang
            [
                'user_id' => 'USR0000003',
                'role_id' => 3,
            ],
            // Michael disign ke kepala accounting
            [
                'user_id' => 'USR0000004',
                'role_id' => 4,
            ],
            // Ayu disign ke kepala
            [
                'user_id' => 'USR0000005',
                'role_id' => 5,
            ],
            // David disign ke admin gudang
            [
                'user_id' => 'USR0000006',
                'role_id' => 6,
            ],
            // Fatimah disign ke staff toko
            [
                'user_id' => 'USR0000007',
                'role_id' => 7,
            ],
            // Rizky disign ke admin gudang
            [
                'user_id' => 'USR0000008',
                'role_id' => 6,
            ],
            // Jessica disign ke staff toko
            [
                'user_id' => 'USR0000009',
                'role_id' => 7,
            ],
            // Hiroshi disign ke admin gudang
            [
                'user_id' => 'USR0000010',
                'role_id' => 6,
            ],
            // Maria disign ke staff toko
            [
                'user_id' => 'USR0000011',
                'role_id' => 7,
            ],
            // Thomas disign ke staff toko
            [
                'user_id' => 'USR0000012',
                'role_id' => 7,
            ],
        ];

        foreach ($userRoles as $userRole) {
            UserRole::factory()->create($userRole);
        }
    }
}
