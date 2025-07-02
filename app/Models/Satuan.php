<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;


class Satuan extends Model
{
    /** @use HasFactory<\Database\Factories\SatuanFactory> */
    use HasFactory;

    protected static function booted(): void
    {
        static::creating(function ($model) {
            $model->uuid = (string) Str::uuid();
        });
    }

    protected $fillable = [
        'uuid',
        'name',
        'code',
        'description',
    ];

    public function barangs()
    {
        return $this->hasMany(Barang::class, 'satuan_id', 'id');
    }
}
