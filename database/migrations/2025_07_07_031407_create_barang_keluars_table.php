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
            $table->string('barang_keluar_id')->primary();
            $table->uuid()->unique();
            $table->string('nomor_referensi');
            $table->date('tanggal_keluar');
            $table->string('user_id');
            $table->foreign('user_id')->references('user_id')->on('users')->onUpdate('cascade'); // staff peminta
            $table->enum('status', ['Menunggu Verifikasi', 'Disetujui sebagian', 'Disetujui', 'Ditolak', 'Dieksekusi'])->default('Menunggu Verifikasi');
            $table->boolean('verifikasi_kepala_toko')->default(false);
            $table->boolean('verifikasi_kepala_gudang')->default(false);
            $table->boolean('kepala_toko_menolak')->default(false);
            $table->boolean('kepala_gudang_menolak')->default(false);
            $table->text('catatan')->nullable();
            $table->text('catatan_penolakan')->nullable();
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
