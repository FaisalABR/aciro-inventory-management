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
        Schema::create('deadstock_items', function (Blueprint $table) {
            $table->string('deadstock_item_id')->primary();
            $table->string('header_deadstock_id');
            $table->foreign('header_deadstock_id')->references('header_deadstock_id')->on('header_deadstocks')->onDelete('cascade');
            $table->string('barang_id');
            $table->foreign('barang_id')->references('barang_id')->on('barangs')->onDelete('restrict');
            $table->integer('total_keluar');
            $table->integer('persediaan_awal');
            $table->integer('persediaan_akhir');
            $table->decimal('itr', 10, 2);
            $table->enum('status', [
                'Fast Moving',
                'Slow Moving',
                'Deadstock',
            ])->nullable();
            $table->string('tindakan');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deadstock_items');
    }
};
