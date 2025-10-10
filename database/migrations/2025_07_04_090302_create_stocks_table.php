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
        Schema::create('stocks', function (Blueprint $table) {
            $table->string('stock_id')->primary();
            $table->string('barang_id');
            $table->foreign('barang_id')->references('barang_id')->on('barangs')->onDelete('cascade')->onUpdate('cascade');
            $table->integer('quantity');
            $table->integer('potensi_penjualan');
            $table->decimal('itr', 10, 2)->nullable();
            $table->integer('rop');
            $table->enum('status_rop', [
                'In Stock',
                'Need Restock',
                'Out Of Stock',
            ]);
            $table->enum('status_itr', [
                'Fast Moving',
                'Slow Moving',
                'Deadstock',
            ])->nullable();
            $table->date('last_evaluated')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stocks');
    }
};
