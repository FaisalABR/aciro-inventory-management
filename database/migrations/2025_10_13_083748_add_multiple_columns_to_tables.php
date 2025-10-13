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
            $table->boolean('verifikasi_kepala_toko')->default(false);
            $table->boolean('verifikasi_kepala_gudang')->default(false);
        });

        Schema::table('pembayaran_purchase_order', function (Blueprint $table) {
            $table->string('invoice_supplier')->nullable(); // path file invoice supplier
        });

        Schema::table('purchase_orders', function (Blueprint $table) {
            $table->string('dokumen_pengiriman')->nullable(); // path file dokumen pengiriman dari supplier
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('barang_masuks', function (Blueprint $table) {
            $table->dropColumn('verifikasi_kepala_toko');
            $table->dropColumn('verifikasi_kepala_gudang');
        });

        Schema::table('pembayaran_purchase_order', function (Blueprint $table) {
            $table->dropColumn('invoice_supplier');
        });

        Schema::create('purchase_orders', function (Blueprint $table) {
            $table->dropColumn('dokumen_pengiriman'); // path file bukti bayar
        });
    }
};
