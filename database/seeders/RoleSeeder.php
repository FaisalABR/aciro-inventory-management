<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            // id 1
            [
                'name'        => 'admin_sistem',
                'description' => 'Admin Sistem',
            ],
            // id 2
            [
                'name'        => 'kepala_toko',
                'description' => 'Kepala Toko',
            ],
            //  id 3
            [
                'name'        => 'kepala_gudang',
                'description' => 'Kepala Gudang',
            ],
            // id 4
            [
                'name'        => 'kepala_accounting',
                'description' => 'Kepala Accounting',
            ],
            //  id 5
            [
                'name'        => 'kepala_pengadaan',
                'description' => 'Kepala Pengadaan',
            ],
            // 1d 6
            [
                'name'        => 'admin_gudang',
                'description' => 'Admin Gudang',
            ],
            // id 7
            [
                'name'        => 'staff_toko',
                'description' => 'Staff Toko',
            ],
            // id 8
            [
                'name'        => 'staff_pengadaan',
                'description' => 'Staff Pengadaan',
            ],
        ];

        foreach ($roles as $roleData) {
            Role::factory()->create($roleData);
        }
    }
}
