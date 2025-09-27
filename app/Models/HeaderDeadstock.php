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
            $model->uuid = (string) Str::uuid();
        });
    }

    protected $fillable = [
        'uuid',
        'nomor_referensi',
        'periode_mulai',
        'periode_akhir',
    ];

    public function items()
    {
        return $this->hasMany(DeadstockItem::class);
    }
}
