<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Kategori extends Model
{
    /** @use HasFactory<\Database\Factories\KategoriFactory> */
    use HasFactory;

    protected static function booted(): void
    {
        static::creating(function ($model) {
            if (!$model->kategori_id) {
                $lastKategori = Kategori::orderBy('kategori_id', 'desc')->first();
                if ($lastKategori) {
                    $num = (int) substr($lastKategori->kategori_id, 3);
                    $newNum = str_pad($num + 1, 7, '0', STR_PAD_LEFT);
                } else {
                    $newNum = "0000001";
                }
                $model->kategori_id = "KTG" . $newNum;
            }
        });
        static::creating(function ($model) {
            $model->uuid = (string) Str::uuid();
        });
    }

    protected $primaryKey = 'kategori_id'; // nama field PK
    public $incrementing = false;      // bukan auto increment
    protected $keyType = 'string';

    protected $fillable = [
        'uuid',
        'name',
        'code',
        'description',
    ];

    public function barang()
    {
        return $this->hasMany(Barang::class, 'kategori_id', 'kategori_id');
    }
}
