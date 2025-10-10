<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            // id 1
            [
                'name'        => 'view-dashboard',
                'description' => 'Buka Menu Dashboard',
            ],
            //  id 2
            [
                'name'        => 'view-barang-masuk',
                'description' => 'Buka Menu Barang Masuk',
            ],
            // id 3
            [
                'name'        => 'view-barang-keluar',
                'description' => 'Buka Menu Barang Keluar',
            ],
            // id 4
            [
                'name'        => 'view-order',
                'description' => 'Buka Menu Order',
            ],
            // id 5
            [
                'name'        => 'view-stock',
                'description' => 'Buka Menu Stock Barang',
            ],
            // id 6
            [
                'name'        => 'view-laporan-deadstock',
                'description' => 'Buka Menu Laporan Barang Deadstock',
            ],
            // id 7
            [
                'name'        => 'view-master',
                'description' => 'Buka Menu Root Master Data',
            ],
            // id 8
            [
                'name'        => 'view-master-satuan',
                'description' => 'Buka Menu Master Data Satuan',
            ],
            // id 9
            [
                'name'        => 'view-master-kategori',
                'description' => 'Buka Menu Master Kategori',
            ],
            // id 10
            [
                'name'        => 'view-master-supplier',
                'description' => 'Buka Menu Master Supplier',
            ],
            // id 11
            [
                'name'        => 'view-kelola-user',
                'description' => 'Buka Menu Kelola User',
            ],
            // id 12
            [
                'name'        => 'view-master-barang',
                'description' => 'Buka Menu Master Barang',
            ],
            // id 13
            [
                'name'        => 'view-permintaan-barang-keluar',
                'description' => 'Buka Menu Permintaan Barang Keluar',
            ],
        ];

        foreach ($permissions as $permissionData) {
            Permission::factory()->create($permissionData);
        }
    }
}
