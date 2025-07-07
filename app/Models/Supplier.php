<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;


class Supplier extends Model
{
    /** @use HasFactory<\Database\Factories\SupplierFactory> */
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
        'contactPerson',
        'noWhatsapp',
        'email',
        'alamat',
        'kota'
    ];

    public function barangs()
    {
        return $this->hasMany(Barang::class, 'supplier_id', 'id');
    }

    public function barangMasuks()
    {
        return $this->hasMany(BarangMasuk::class, 'barang_masuk_item_id', 'id');
    }
}
