<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class HeaderDeadstock extends Model
{
    /** @use HasFactory<\Database\Factories\BarangFactory> */
    use HasFactory;

    protected static function booted(): void
    {
        static::creating(function ($model) {
            if (!$model->header_deadstock_id) {
                $lastHeaderDeadstock = HeaderDeadstock::orderBy('header_deadstock_id', 'desc')->first();
                if ($lastHeaderDeadstock) {
                    // Ambil angka terakhir, misal "USR_001" -> 1
                    $num = (int) substr($lastHeaderDeadstock->header_deadstock_id, 2);
                    $newNum = str_pad($num + 1, 7, '0', STR_PAD_LEFT);
                } else {
                    $newNum = "0000001";
                }
                $model->header_deadstock_id = "DS" . $newNum;
            }
        });

        static::creating(function ($model) {
            $model->uuid = (string) Str::uuid();
        });
    }

    protected $primaryKey = 'header_deadstock_id'; // nama field PK
    public $incrementing = false;      // bukan auto increment
    protected $keyType = 'string';

    protected $fillable = [
        'uuid',
        'nomor_referensi',
        'periode_mulai',
        'periode_akhir',
    ];

    public function items()
    {
        return $this->hasMany(DeadstockItem::class, 'header_deadstock_id', 'header_deadstock_id');
    }
}
