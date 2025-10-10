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
        Schema::create('barangs', function (Blueprint $table) {
            $table->string('barang_id')->primary();
            $table->uuid()->unique();
            $table->string('name');
            $table->string('supplier_id');
            $table->foreign('supplier_id')
                ->references('supplier_id')->on('suppliers')
                ->onUpdate('cascade')
                ->onDelete('restrict');

            $table->string('satuan_id');
            $table->foreign('satuan_id')
                ->references('satuan_id')->on('satuans')
                ->onUpdate('cascade')
                ->onDelete('restrict');
            $table->decimal('hargaJual', 10, 2);
            $table->decimal('hargaBeli', 10, 2);
            $table->integer('maximal_quantity');
            $table->decimal('rata_rata_permintaan_harian', 10, 2)->nullable();
            $table->integer('leadtime')->nullable();
            $table->decimal('safety_stock', 10, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barangs');
    }
};
