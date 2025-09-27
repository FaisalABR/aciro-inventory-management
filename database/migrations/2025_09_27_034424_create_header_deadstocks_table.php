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
        Schema::create('header_deadstocks', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            $table->string('nomor_referensi');
            $table->date('periode_mulai');
            $table->text('periode_akhir');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('header_deadstocks');
    }
};
