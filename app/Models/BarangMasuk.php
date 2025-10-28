<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class BarangMasuk extends Model
{
    /** @use HasFactory<\Database\Factories\BarangFactory> */
    use HasFactory;

    protected static function booted(): void
    {
        static::creating(function ($model) {
            if (!$model->barang_masuk_id) {
                $lastBarangMasuk = BarangMasuk::orderBy('barang_masuk_id', 'desc')->first();
                if ($lastBarangMasuk) {
                    // Ambil angka terakhir, misal "USR_001" -> 1
                    $num = (int) substr($lastBarangMasuk->barang_masuk_id, 2);
                    $newNum = str_pad($num + 1, 7, '0', STR_PAD_LEFT);
                } else {
                    $newNum = "0000001";
                }
                $model->barang_masuk_id = "BM" . $newNum;
            }
        });

        static::creating(function ($model) {
            $model->uuid = (string) Str::uuid();
        });
    }

    protected $primaryKey = 'barang_masuk_id'; // nama field PK
    public $incrementing = false;      // bukan auto increment
    protected $keyType = 'string';


    protected $fillable = [
        'uuid',
        'nomor_referensi',
        'tanggal_masuk',
        'supplier_id',
        'catatan',
    ];

    public function items()
    {
        return $this->hasMany(BarangMasukItem::class, 'barang_masuk_id', 'barang_masuk_id');
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id', 'supplier_id');
    }
}
