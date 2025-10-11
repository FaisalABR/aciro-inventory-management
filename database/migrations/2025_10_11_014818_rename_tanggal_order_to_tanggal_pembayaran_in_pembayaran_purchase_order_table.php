<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Jalankan migrasi.
     */
    public function up(): void
    {
        Schema::table('pembayaran_purchase_order', function (Blueprint $table) {
            $table->renameColumn('tanggal_order', 'tanggal_pembayaran');
        });
    }

    /**
     * Kembalikan perubahan (rollback).
     */
    public function down(): void
    {
        Schema::table('pembayaran_purchase_order', function (Blueprint $table) {
            $table->renameColumn('tanggal_pembayaran', 'tanggal_order');
        });
    }
};
