<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class BarangKeluar extends Model
{
    use HasFactory;

    protected static function booted(): void
    {
        static::creating(function ($model) {
            if (!$model->barang_keluar_id) {
                $lastBarangKeluar = BarangKeluar::orderBy('barang_keluar_id', 'desc')->first();
                if ($lastBarangKeluar) {
                    // Ambil angka terakhir, misal "USR_001" -> 1
                    $num = (int) substr($lastBarangKeluar->barang_keluar_id, 2);
                    $newNum = str_pad($num + 1, 7, '0', STR_PAD_LEFT);
                } else {
                    $newNum = "0000001";
                }
                $model->barang_keluar_id = "BK" . $newNum;
            }
        });

        static::creating(function ($model) {
            $model->uuid = (string) Str::uuid();
        });
    }

    protected $primaryKey = 'barang_keluar_id'; // nama field PK
    public $incrementing = false;      // bukan auto increment
    protected $keyType = 'string';


    protected $fillable = [
        'uuid',
        'nomor_referensi',
        'tanggal_keluar',
        'user_id',
        'catatan',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function items()
    {
        return $this->hasMany(BarangKeluarItem::class, 'barang_keluar_id', 'barang_keluar_id');
    }
}
