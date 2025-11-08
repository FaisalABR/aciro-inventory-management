<?php

namespace Database\Seeders;

use App\Models\PermissionRole;
use Illuminate\Database\Seeder;

class PermissionRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissionRoles = [
            // role_id 1 memiliki permission_id 1 sampai 8
            [
                'role_id'       => 1,
                'permission_id' => 1,
            ],
            [
                'role_id'       => 1,
                'permission_id' => 2,
            ],
            [
                'role_id'       => 1,
                'permission_id' => 3,
            ],
            [
                'role_id'       => 1,
                'permission_id' => 4,
            ],
            [
                'role_id'       => 1,
                'permission_id' => 5,
            ],
            [
                'role_id'       => 1,
                'permission_id' => 6,
            ],
            [
                'role_id'       => 1,
                'permission_id' => 7,
            ],
            [
                'role_id'       => 1,
                'permission_id' => 8,
            ],
            [
                'role_id'       => 1,
                'permission_id' => 9,
            ],
            [
                'role_id'       => 1,
                'permission_id' => 10,
            ],
            [
                'role_id'       => 1,
                'permission_id' => 11,
            ],
            [
                'role_id'       => 1,
                'permission_id' => 12,
            ],
            [
                'role_id'       => 1,
                'permission_id' => 13,
            ],
            // role_id 2 memiliki permission_id 1 dan 5
            [
                'role_id'       => 2,
                'permission_id' => 1,
            ],
            [
                'role_id'       => 2,
                'permission_id' => 2,
            ],
            [
                'role_id'       => 2,
                'permission_id' => 3,
            ],
            [
                'role_id'       => 2,
                'permission_id' => 4,
            ],
            [
                'role_id'       => 2,
                'permission_id' => 5,
            ],
            [
                'role_id'       => 2,
                'permission_id' => 6,
            ],
            [
                'role_id'       => 2,
                'permission_id' => 8,
            ],
            [
                'role_id'       => 2,
                'permission_id' => 9,
            ],
            [
                'role_id'       => 2,
                'permission_id' => 10,
            ],
            [
                'role_id'       => 2,
                'permission_id' => 12,
            ],
            [
                'role_id'       => 2,
                'permission_id' => 13,
            ],
            // role_id 3 memiliki permission_id 1 dan 5
            [
                'role_id'       => 3,
                'permission_id' => 1,
            ],
            [
                'role_id'       => 3,
                'permission_id' => 2,
            ],
            [
                'role_id'       => 3,
                'permission_id' => 3,
            ],
            [
                'role_id'       => 3,
                'permission_id' => 4,
            ],
            [
                'role_id'       => 3,
                'permission_id' => 5,
            ],
            [
                'role_id'       => 3,
                'permission_id' => 6,
            ],
            [
                'role_id'       => 3,
                'permission_id' => 8,
            ],
            [
                'role_id'       => 3,
                'permission_id' => 9,
            ],
            [
                'role_id'       => 3,
                'permission_id' => 10,
            ],
            [
                'role_id'       => 3,
                'permission_id' => 12,
            ],
            [
                'role_id'       => 3,
                'permission_id' => 13,
            ],
            // role_id 4 memiliki permission_id 1 dan 5
            [
                'role_id'       => 4,
                'permission_id' => 1,
            ],
            [
                'role_id'       => 4,
                'permission_id' => 5,
            ],
            [
                'role_id'       => 4,
                'permission_id' => 4,
            ],
            // role_id 5 memiliki permission_id 1 dan 5
            [
                'role_id'       => 5,
                'permission_id' => 1,
            ],
            [
                'role_id'       => 5,
                'permission_id' => 5,
            ],
            [
                'role_id'       => 5,
                'permission_id' => 4,
            ],
            // role_id 6 memiliki permission_id 1 dan 5
            [
                'role_id'       => 6,
                'permission_id' => 2,
            ],
            [
                'role_id'       => 6,
                'permission_id' => 3,
            ],
            [
                'role_id'       => 6,
                'permission_id' => 5,
            ],
            [
                'role_id'       => 6,
                'permission_id' => 13,
            ],
            // role_id 7 memiliki permission_id 1 dan 5
            [
                'role_id'       => 7,
                'permission_id' => 5,
            ],
            [
                'role_id' => 7,
                'permission_id' => 13,
            ],
            // role staff pengadaan, lihat dashboard, stock barang, dan kelola purchase order

            [
                'role_id'       => 8,
                'permission_id' => 5,
            ],
            [
                'role_id' => 8,
                'permission_id' => 4,
            ],
            // role staff pengadaan, lihat dashboard, stock barang, dan kelola purchase order

            [
                'role_id'       => 9,
                'permission_id' => 5,
            ],
            [
                'role_id' => 9,
                'permission_id' => 4,
            ]



        ];

        foreach ($permissionRoles as $permissionRole) {
            PermissionRole::factory()->create($permissionRole);
        }
    }
}
