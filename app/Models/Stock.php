<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    use HasFactory;

    protected static function booted(): void
    {
        static::creating(function ($model) {
            if (!$model->stock_id) {
                $lastStock = Stock::orderBy('stock_id', 'desc')->first();
                if ($lastStock) {
                    // Ambil angka terakhir, misal "USR_001" -> 1
                    $num = (int) substr($lastStock->stock_id, 3);
                    $newNum = str_pad($num + 1, 7, '0', STR_PAD_LEFT);
                } else {
                    $newNum = "0000001";
                }
                $model->stock_id = "STK" . $newNum;
            }
        });
    }

    protected $primaryKey = 'stock_id'; // nama field PK
    public $incrementing = false;      // bukan auto increment
    protected $keyType = 'string';

    protected $fillable = [
        'barang_id',
        'quantity',
        'potensi_penjualan',
        'rop',
        'itr',
        'status_rop',
        'status_itr',
        'last_evaluated'
    ];

    public function barangs()
    {
        return $this->belongsTo(Barang::class, 'barang_id', 'barang_id');
    }
}
