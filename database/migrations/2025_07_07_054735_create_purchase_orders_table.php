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
        Schema::create('purchase_orders', function (Blueprint $table) {
            $table->string('purchase_order_id')->primary();
            $table->uuid()->unique();
            $table->string('nomor_referensi');
            $table->string('supplier_id');
            $table->foreign('supplier_id')->references('supplier_id')->on('suppliers')->onDelete('restrict');
            $table->date('tanggal_order');
            $table->text('catatan')->nullable();
            $table->text('catatan_penolakan')->nullable();
            $table->text('catatan_penolakan_supplier')->nullable();
            $table->boolean('verifikasi_kepala_toko')->default(false);
            $table->boolean('verifikasi_kepala_gudang')->default(false);
            $table->boolean('verifikasi_kepala_accounting')->default(false);
            $table->boolean('verifikasi_kepala_pengadaan')->default(false);
            $table->boolean('kepala_toko_menolak')->default(false);
            $table->boolean('kepala_gudang_menolak')->default(false);
            $table->boolean('kepala_accounting_menolak')->default(false);
            $table->boolean('kepala_pengadaan_menolak')->default(false);
            $table->enum('status', [
                'DRAFT',
                'BUTUH VERIFIKASI',
                'VERIFIKASI SEBAGIAN',
                'TOLAK',
                'VERIFIKASI',
                'TERKIRIM',
                'TOLAK SUPPLIER',
                'KONFIRMASI SUPPLIER',
                'BARANG DIKIRIM',
            ])->default('DRAFT');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_orders');
    }
};
