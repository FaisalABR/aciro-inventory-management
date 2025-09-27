<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Barang extends Model
{
    /** @use HasFactory<\Database\Factories\BarangFactory> */
    use HasFactory;

    protected static function booted(): void
    {
        static::creating(function ($model) {
            $model->uuid = (string) Str::uuid();
        });
    }

    protected $casts = [
        'hargaJual' => 'float', // Akan mengonversi 'harga' menjadi float
        'hargaBeli' => 'float',

    ];

    protected $fillable = [
        'uuid',
        'name',
        'supplier_id',
        'satuan_id',
        'hargaJual',
        'hargaBeli',
    ];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id', 'id');
    }

    public function satuan()
    {
        return $this->belongsTo(Satuan::class, 'satuan_id', 'id');
    }

    public function barangMasukItems()
    {
        return $this->hasMany(BarangMasukItem::class, 'barang_masuk_item_id', 'id');
    }

    public function barangKeluarItems()
    {
        return $this->hasMany(BarangKeluarItem::class, 'barang_keluar_item_id', 'id');
    }

    public function stock()
    {
        return $this->hasOne(Stock::class);
    }
}
