<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            UserSeeder::class,
            RoleSeeder::class,
            PermissionSeeder::class,
            UserRoleSeeder::class,
            PermissionRoleSeeder::class,
            SatuanSeeder::class,
            SupplierSeeder::class,
            BarangSeeder::class,
            StockSeeder::class,
        ]);
    }
}
