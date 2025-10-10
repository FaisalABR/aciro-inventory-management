<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseOrderItem extends Model
{
    use HasFactory;
    protected static function booted(): void
    {
        static::creating(function ($model) {
            if (!$model->purchase_order_item_id) {
                $lastPurchaseOrderItem = PurchaseOrderItem::orderBy('purchase_order_item_id', 'desc')->first();
                if ($lastPurchaseOrderItem) {
                    // Ambil angka terakhir, misal "USR_001" -> 1
                    $num = (int) substr($lastPurchaseOrderItem->purchase_order_item_id, 3);
                    $newNum = str_pad($num + 1, 7, '0', STR_PAD_LEFT);
                } else {
                    $newNum = "0000001";
                }
                $model->purchase_order_item_id = "POI" . $newNum;
            }
        });
    }

    protected $primaryKey = 'purchase_order_item_id'; // nama field PK
    public $incrementing = false;      // bukan auto increment
    protected $keyType = 'string';

    protected $fillable = [
        'purchase_order_id',
        'barang_id',
        'quantity',
        'harga_beli'
    ];

    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class, 'purchase_order_id', 'purchase_order_id');
    }

    public function barang()
    {
        return $this->belongsTo(Barang::class, 'barang_id', 'barang_id');
    }
}
