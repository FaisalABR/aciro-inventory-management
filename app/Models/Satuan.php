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
            if (!$model->satuan_id) {
                $lastSatuan = Satuan::orderBy('satuan_id', 'desc')->first();
                if ($lastSatuan) {
                    $num = (int) substr($lastSatuan->satuan_id, 3);
                    $newNum = str_pad($num + 1, 7, '0', STR_PAD_LEFT);
                } else {
                    $newNum = "0000001";
                }
                $model->satuan_id = "STN" . $newNum;
            }
        });
        static::creating(function ($model) {
            $model->uuid = (string) Str::uuid();
        });
    }

    protected $primaryKey = 'satuan_id'; // nama field PK
    public $incrementing = false;      // bukan auto increment
    protected $keyType = 'string';

    protected $fillable = [
        'uuid',
        'name',
        'code',
        'description',
    ];

    public function barangs()
    {
        return $this->hasMany(Barang::class, 'satuan_id', 'satuan_id');
    }
}
