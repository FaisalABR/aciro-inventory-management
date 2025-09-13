<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BarangKeluarItem extends Model
{
    /** @use HasFactory<\Database\Factories\BarangFactory> */
    use HasFactory;


    protected $casts = [
        'harga_jual' => 'float',

    ];

    protected $fillable = [
        'uuid',
        'barang_keluar_id',
        'barang_id',
        'quantity',
        'harga_jual',

    ];


    public function barangs()
    {
        return $this->belongsTo(Barang::class, 'barang_id', 'id');
    }
}
