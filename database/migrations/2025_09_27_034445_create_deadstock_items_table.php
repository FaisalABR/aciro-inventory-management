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
            $table->id();
            $table->foreignId('header_deadstock_id')->constrained('header_deadstocks')->onDelete('cascade');
            $table->foreignId('barang_id')->constrained('barangs')->onDelete('restrict');
            $table->integer('total_keluar');
            $table->integer('persediaan_awal');
            $table->integer('persediaan_akhir');
            $table->decimal('itr', 10, 2);
            $table->enum('status', [
                'Fast Moving',
                'Slow Moving',
                'Deadstock',
            ])->nullable();
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
