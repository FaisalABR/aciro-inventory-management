<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            [
                "name" => "view-dashboard",
                "description" => "Buka Menu Dashboard",
            ],
            [
                "name" => "view-barang-masuk",
                "description" => "Buka Menu Barang Masuk",
            ],
            [
                "name" => "view-barang-keluar",
                "description" => "Buka Menu Barang Keluar",
            ],
            [
                "name" => "view-order",
                "description" => "Buka Menu Order",
            ],
            [
                "name" => "view-stock",
                "description" => "Buka Menu Stock Barang",
            ],
            [
                "name" => "view-laporan-deadstock",
                "description" => "Buka Menu Laporan Barang Deadstock",
            ],
            [
                "name" => "view-master",
                "description" => "Buka Menu Root Master Data",
            ],
            [
                "name" => "view-master-satuan",
                "description" => "Buka Menu Master Data Satuan",
            ],
            [
                "name" => "view-master-kategori",
                "description" => "Buka Menu Master Kategori",
            ],
            [
                "name" => "view-master-supplier",
                "description" => "Buka Menu Master Supplier",
            ],
            [
                "name" => "view-kelola-user",
                "description" => "Buka Menu Kelola User",
            ],
            [
                "name" => "view-master-barang",
                "description" => "Buka Menu Master Barang",
            ],
        ];

        foreach ($permissions as $permissionData) {
            Permission::factory()->create($permissionData);
        }
    }
}
