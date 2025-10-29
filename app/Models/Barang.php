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
            if (!$model->barang_id) {
                $lasBarang = Barang::orderBy('barang_id', 'desc')->first();
                if ($lasBarang) {
                    // Ambil angka terakhir, misal "USR_001" -> 1
                    $num = (int) substr($lasBarang->barang_id, 2);
                    $newNum = str_pad($num + 1, 7, '0', STR_PAD_LEFT);
                } else {
                    $newNum = "0000001";
                }
                $model->barang_id = "BR" . $newNum;
            }
        });

        static::creating(function ($model) {
            $model->uuid = (string) Str::uuid();
        });
    }

    protected $primaryKey = 'barang_id'; // nama field PK
    public $incrementing = false;      // bukan auto increment
    protected $keyType = 'string';


    protected $casts = [
        'hargaJual' => 'float', // Akan mengonversi 'harga' menjadi float
        'hargaBeli' => 'float',

    ];

    protected $fillable = [
        'uuid',
        'name',
        'supplier_id',
        'satuan_id',
        'kategori_id',
        'hargaJual',
        'hargaBeli',
        'maximal_quantity',
        'rata_rata_permintaan_harian',
        'leadtime',
        'safety_stock',
    ];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id', 'supplier_id');
    }

    public function satuan()
    {
        return $this->belongsTo(Satuan::class, 'satuan_id', 'satuan_id');
    }

    public function kategori()
    {
        return $this->belongsTo(Kategori::class, 'kategori_id', 'kategori_id');
    }

    public function barangMasukItems()
    {
        return $this->hasMany(BarangMasukItem::class, 'barang_masuk_item_id', 'barang_masuk_item_id');
    }

    public function barangKeluarItems()
    {
        return $this->hasMany(BarangKeluarItem::class, 'barang_keluar_item_id', 'barang_keluar_item_id');
    }

    public function stock()
    {
        return $this->hasOne(Stock::class, 'stock_id', 'stock_id');
    }
}
