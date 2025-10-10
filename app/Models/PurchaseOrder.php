<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PurchaseOrder extends Model
{
    use HasFactory;

    protected static function booted(): void
    {
        static::creating(function ($model) {
            if (!$model->purchase_order_id) {
                $lastPurchaseOrder = PurchaseOrder::orderBy('purchase_order_id', 'desc')->first();
                if ($lastPurchaseOrder) {
                    // Ambil angka terakhir, misal "USR_001" -> 1
                    $num = (int) substr($lastPurchaseOrder->purchase_order_id, 2);
                    $newNum = str_pad($num + 1, 7, '0', STR_PAD_LEFT);
                } else {
                    $newNum = "0000001";
                }
                $model->purchase_order_id = "PO" . $newNum;
            }
        });

        static::creating(function ($model) {
            $model->uuid = (string) Str::uuid();
        });
    }

    protected $primaryKey = 'purchase_order_id'; // nama field PK
    public $incrementing = false;      // bukan auto increment
    protected $keyType = 'string';

    protected $fillable = [
        'uuid',
        'nomor_referensi',
        'supplier_id',
        'tanggal_order',
        'catatan',
        'status',
        'kepala_toko_menolak',
        'kepala_accounting_menolak',
        'kepala_pengadaan_menolak',
        'kepala_gudang_menolak'
    ];

    public function items()
    {
        return $this->hasMany(PurchaseOrderItem::class, 'purchase_order_id', 'purchase_order_id');
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id', 'supplier_id');
    }

    public function payment()
    {
        return $this->hasOne(PembayaranPurchaseOrder::class);
    }
}
