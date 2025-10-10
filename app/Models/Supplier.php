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
            if (!$model->supplier_id) {
                $lastSupplier = Supplier::orderBy('supplier_id', 'desc')->first();
                if ($lastSupplier) {
                    // Ambil angka terakhir, misal "USR_001" -> 1
                    $num = (int) substr($lastSupplier->supplier_id, 3);
                    $newNum = str_pad($num + 1, 7, '0', STR_PAD_LEFT);
                } else {
                    $newNum = "0000001";
                }
                $model->supplier_id = "SPL" . $newNum;
            }
        });

        static::creating(function ($model) {
            $model->uuid = (string) Str::uuid();
        });
    }

    protected $primaryKey = 'supplier_id'; // nama field PK
    public $incrementing = false;      // bukan auto increment
    protected $keyType = 'string';

    protected $fillable = [
        'uuid',
        'name',
        'contactPerson',
        'noWhatsapp',
        'email',
        'alamat',
        'kota',
    ];

    public function barangs()
    {
        return $this->hasMany(Barang::class, 'supplier_id', 'supplier_id');
    }

    public function barangMasuk()
    {
        return $this->hasMany(BarangMasuk::class, 'barang_masuk_item_id', 'barang_masuk_item_id');
    }

    public function barangKeluar()
    {
        return $this->hasMany(BarangKeluar::class, 'barang_keluar_item_id', 'barang_keluar_item_id');
    }

    public function purchaseOrder()
    {
        return $this->hasMany(PurchaseOrder::class, 'supplier_id', 'supplier_id');
    }
}
