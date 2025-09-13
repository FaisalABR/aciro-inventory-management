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
            $table->id();
            $table->uuid()->unique();
            $table->string('nomor_referensi');
            $table->foreignId('supplier_id')->constrained('suppliers')->onDelete('restrict');
            $table->date('tanggal_order');
            $table->text('catatan');
            $table->enum('status', [
                'DRAFT',
                'NEED VERIFICATION',
                'SENT',
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
