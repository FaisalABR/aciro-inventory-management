<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BarangMasukItem extends Model
{
    /** @use HasFactory<\Database\Factories\BarangFactory> */
    use HasFactory;

    protected static function booted(): void
    {
        static::creating(function ($model) {
            if (!$model->barang_masuk_item_id) {
                $lastBarangMasukItem = BarangMasukItem::orderBy('barang_masuk_item_id', 'desc')->first();
                if ($lastBarangMasukItem) {
                    // Ambil angka terakhir, misal "USR_001" -> 1
                    $num = (int) substr($lastBarangMasukItem->barang_masuk_item_id, 3);
                    $newNum = str_pad($num + 1, 7, '0', STR_PAD_LEFT);
                } else {
                    $newNum = "0000001";
                }
                $model->barang_masuk_item_id = "BMI" . $newNum;
            }
        });
    }


    protected $primaryKey = 'barang_masuk_item_id'; // nama field PK
    public $incrementing = false;      // bukan auto increment
    protected $keyType = 'string';


    protected $casts = [
        'harga_beli' => 'float',

    ];

    protected $fillable = [
        'uuid',
        'barang_masuk_id',
        'barang_id',
        'quantity',
        'harga_beli',
        'tanggal_expired',
        'nomor_batch'
    ];

    public function barangs()
    {
        return $this->belongsTo(Barang::class, 'barang_id', 'barang_id');
    }

    public function barangMasuk()
    {
        return $this->belongsTo(BarangMasuk::class, 'barang_masuk_id', 'barang_masuk_id');
    }
}
