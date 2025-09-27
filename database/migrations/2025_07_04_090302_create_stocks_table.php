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
            $table->id();
            $table->foreignId('barang_id')->constrained('barangs')->onDelete('restrict')->onUpdate('cascade');
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
