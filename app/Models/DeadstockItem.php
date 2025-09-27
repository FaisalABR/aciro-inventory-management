<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeadstockItem extends Model
{
    /** @use HasFactory<\Database\Factories\BarangFactory> */
    use HasFactory;

    protected $casts = [
        'itr' => 'float',

    ];

    protected $fillable = [
        'uuid',
        'header_deadstock_id',
        'barang_id',
        'total_keluar',
        'persediaan_awal',
        'persediaan_akhir',
        'itr',
        'status',
    ];

    public function headerDeadstock()
    {
        return $this->belongsTo(HeaderDeadstock::class, 'header_deadstock_id', 'id');
    }

    public function barang()
    {
        return $this->belongsTo(Barang::class, 'barang_id', 'id');
    }
}
