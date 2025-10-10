<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BarangKeluarItem extends Model
{
    /** @use HasFactory<\Database\Factories\BarangFactory> */
    use HasFactory;

    protected static function booted(): void
    {
        static::creating(function ($model) {
            if (!$model->barang_keluar_item_id) {
                $lastBarangKeluarItem = BarangKeluarItem::orderBy('barang_keluar_item_id', 'desc')->first();
                if ($lastBarangKeluarItem) {
                    // Ambil angka terakhir, misal "USR_001" -> 1
                    $num = (int) substr($lastBarangKeluarItem->barang_keluar_item_id, 3);
                    $newNum = str_pad($num + 1, 7, '0', STR_PAD_LEFT);
                } else {
                    $newNum = "0000001";
                }
                $model->barang_keluar_item_id = "BKI" . $newNum;
            }
        });
    }

    protected $primaryKey = 'barang_keluar_item_id'; // nama field PK
    public $incrementing = false;      // bukan auto increment
    protected $keyType = 'string';

    protected $fillable = [
        'barang_keluar_id',
        'barang_id',
        'quantity',

    ];

    public function barangs()
    {
        return $this->belongsTo(Barang::class, 'barang_id', 'barang_id');
    }

    public function barangKeluar()
    {
        return $this->belongsTo(BarangKeluar::class, 'barang_keluar_id', 'barang_keluar_id');
    }
}
