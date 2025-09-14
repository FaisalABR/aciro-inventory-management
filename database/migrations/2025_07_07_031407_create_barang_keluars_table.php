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
        Schema::create('barang_keluars', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            $table->string('nomor_referensi');
            $table->date("tanggal_keluar");
            $table->foreignId('user_id')->constrained('users'); // staff peminta
            $table->enum('status', ['Menunggu Verifikasi', 'Disetujui sebagian', 'Disetujui', 'Ditolak'])->default('Menunggu Verifikasi');
            $table->boolean('verifikasi_kepala_toko')->default(false);
            $table->boolean('verifikasi_kepala_gudang')->default(false);
            $table->text('catatan');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barang_keluars');
    }
};
