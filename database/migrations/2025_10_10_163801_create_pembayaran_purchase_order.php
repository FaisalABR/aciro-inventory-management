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
        Schema::create('pembayaran_purchase_order', function (Blueprint $table) {
            $table->string('pembayaran_purchase_order_id')->primary();
            $table->string('purchase_order_id');
            $table->foreign('purchase_order_id')->references('purchase_order_id')->on('purchase_orders')->onDelete('cascade');
            $table->string('metode_pembayaran'); // transfer, tunai, dll
            $table->string('nama_bank')->nullable(); // opsional, auto dari supplier
            $table->string('nomor_rekening')->nullable();
            $table->decimal('jumlah', 15, 2);
            $table->string('bukti_pembayaran')->nullable(); // path file bukti bayar
            $table->text('catatan')->nullable();
            $table->date('tanggal_order');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembayaran_purchase_order');
    }
};
