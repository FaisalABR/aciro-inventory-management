<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1️⃣ Hapus default & constraint enum lama
        DB::statement('ALTER TABLE purchase_orders ALTER COLUMN status DROP DEFAULT');

        // Coba drop constraint lama, abaikan error kalau belum ada
        try {
            DB::statement('ALTER TABLE purchase_orders DROP CONSTRAINT IF EXISTS purchase_orders_status_check');
        } catch (\Exception $e) {
            // ignore jika constraint belum pernah dibuat
        }

        // 2️⃣ Ubah kolom ke TEXT
        DB::statement('ALTER TABLE purchase_orders ALTER COLUMN status TYPE TEXT');

        // 3️⃣ Tambah constraint baru dengan value tambahan
        DB::statement("
            ALTER TABLE purchase_orders
            ADD CONSTRAINT purchase_orders_status_check
            CHECK (status IN (
                'DRAFT',
                'BUTUH VERIFIKASI',
                'VERIFIKASI SEBAGIAN',
                'TOLAK',
                'VERIFIKASI',
                'TERKIRIM',
                'TOLAK SUPPLIER',
                'KONFIRMASI SUPPLIER',
                'BARANG DIKIRIM',
                'MENUNGGU PEMBAYARAN'
            ))
        ");

        // 4️⃣ Tambahkan default lagi
        DB::statement("ALTER TABLE purchase_orders ALTER COLUMN status SET DEFAULT 'DRAFT'");
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE purchase_orders ALTER COLUMN status DROP DEFAULT');
        DB::statement('ALTER TABLE purchase_orders DROP CONSTRAINT IF EXISTS purchase_orders_status_check');
        DB::statement('ALTER TABLE purchase_orders ALTER COLUMN status TYPE TEXT');
        DB::statement("
            ALTER TABLE purchase_orders
            ADD CONSTRAINT purchase_orders_status_check
            CHECK (status IN (
                'DRAFT',
                'BUTUH VERIFIKASI',
                'VERIFIKASI SEBAGIAN',
                'TOLAK',
                'VERIFIKASI',
                'TERKIRIM',
                'TOLAK SUPPLIER',
                'KONFIRMASI SUPPLIER',
                'BARANG DIKIRIM'
            ))
        ");
        DB::statement("ALTER TABLE purchase_orders ALTER COLUMN status SET DEFAULT 'DRAFT'");
    }
};
