<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{


    protected $fillable = [
        'barang_id',
        'quantity',
        'potensi_penjualan',
        'rop',
        'itr',
        'status_rop',
        'status_itr',
    ];

    public function barangs()
    {
        return $this->belongsTo(Barang::class, 'barang_id', 'id');
    }
}
