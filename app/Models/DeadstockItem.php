<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeadstockItem extends Model
{
    /** @use HasFactory<\Database\Factories\BarangFactory> */
    use HasFactory;

    protected static function booted(): void
    {
        static::creating(function ($model) {
            if (!$model->deadstock_item_id) {
                $lastDeadstockItem = DeadstockItem::orderBy('deadstock_item_id', 'desc')->first();
                if ($lastDeadstockItem) {
                    // Ambil angka terakhir, misal "USR_001" -> 1
                    $num = (int) substr($lastDeadstockItem->deadstock_item_id, 3);
                    $newNum = str_pad($num + 1, 7, '0', STR_PAD_LEFT);
                } else {
                    $newNum = "0000001";
                }
                $model->deadstock_item_id = "DSI" . $newNum;
            }
        });
    }

    protected $primaryKey = 'deadstock_item_id'; // nama field PK
    public $incrementing = false;      // bukan auto increment
    protected $keyType = 'string';


    protected $casts = [
        'itr' => 'float',

    ];

    protected $fillable = [
        'header_deadstock_id',
        'barang_id',
        'total_keluar',
        'persediaan_awal',
        'persediaan_akhir',
        'itr',
        'status',
        'tindakan'
    ];

    public function headerDeadstock()
    {
        return $this->belongsTo(HeaderDeadstock::class, 'header_deadstock_id', 'header_deadstock_id');
    }

    public function barang()
    {
        return $this->belongsTo(Barang::class, 'barang_id', 'barang_id');
    }
}
