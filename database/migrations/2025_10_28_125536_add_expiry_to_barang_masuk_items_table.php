<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('barang_masuk_items', function (Blueprint $table) {
            // Tambahkan kolom setelah 'quantity' (opsional)
            $table->string('nomor_batch')->nullable()->after('quantity');
            $table->date('tanggal_expired')->nullable()->after('nomor_batch');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('barang_masuk_items', function (Blueprint $table) {
            $table->dropColumn('nomor_batch');
            $table->dropColumn('tanggal_expired');
        });
    }
};
