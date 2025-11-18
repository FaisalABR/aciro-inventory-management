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
        Schema::table('barang_masuks', function (Blueprint $table) {
            $table->enum('status', ['Menunggu Verifikasi', 'Disetujui sebagian', 'Disetujui', 'Ditolak'])->default('Menunggu Verifikasi');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('barang_masuks', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
