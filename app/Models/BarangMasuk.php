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
            $model->uuid = (string) Str::uuid();
        });
    }

    protected $fillable = [
        'uuid',
        'nomor_referensi',
        'tanggal_masuk',
        'supplier_id',
        'catatan',
    ];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id', 'id');
    }
}
