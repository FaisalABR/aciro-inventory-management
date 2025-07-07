<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BarangMasukItem extends Model
{
    /** @use HasFactory<\Database\Factories\BarangFactory> */
    use HasFactory;


    protected $casts = [
        'harga_beli' => 'float',

    ];

    protected $fillable = [
        'uuid',
        'barang_masuk_id',
        'barang_id',
        'quantity',
        'harga_beli',

    ];

    public function barangs()
    {
        return $this->belongsTo(Barang::class, 'barang_id', 'id');
    }
}
