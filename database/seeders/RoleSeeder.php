<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'super_admin',
                'description' => 'Super Admin',
            ],
            [
                'name' => 'kepala_toko',
                'description' => 'Kepala Toko',
            ],
            [
                'name' => 'kepala_gudang',
                'description' => 'Kepala Gudang',
            ],
            [
                'name' => 'admin_gudang',
                'description' => 'Admin Gudang',
            ],
            [
                'name' => 'kepala_accounting',
                'description' => 'Kepala Accounting',
            ],
        ];

        foreach ($roles as $roleData) {
            Role::factory()->create($roleData);
        }
    }
}
