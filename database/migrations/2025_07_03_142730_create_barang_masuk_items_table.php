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
        Schema::create('barang_masuk_items', function (Blueprint $table) {
            $table->string('barang_masuk_item_id')->primary();
            $table->string('barang_masuk_id');
            $table->foreign('barang_masuk_id')->references('barang_masuk_id')->on('barang_masuks')->onDelete('cascade');
            $table->string('barang_id');
            $table->foreign('barang_id')->references('barang_id')->on('barangs')->onDelete('restrict');
            $table->integer('quantity');
            $table->decimal('harga_beli', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barang_masuk_items');
    }
};
