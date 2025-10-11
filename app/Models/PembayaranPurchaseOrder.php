<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PembayaranPurchaseOrder extends Model
{

    protected static function booted(): void
    {
        static::creating(function ($model) {
            if (!$model->pembayaran_purchase_order_id) {
                $lastPurchaseOrder = PembayaranPurchaseOrder::orderBy('pembayaran_purchase_order_id', 'desc')->first();
                if ($lastPurchaseOrder) {
                    // Ambil angka terakhir, misal "USR_001" -> 1
                    $num = (int) substr($lastPurchaseOrder->pembayaran_purchase_order_id, 3);
                    $newNum = str_pad($num + 1, 7, '0', STR_PAD_LEFT);
                } else {
                    $newNum = "0000001";
                }
                $model->pembayaran_purchase_order_id = "PPO" . $newNum;
            }
        });
    }

    protected $table = 'pembayaran_purchase_order';
    protected $primaryKey = 'pembayaran_purchase_order_id'; // nama field PK
    public $incrementing = false;      // bukan auto increment
    protected $keyType = 'string';

    protected $fillable = [
        'purchase_order_id',
        'metode_pembayaran',
        'nama_bank',
        'nomor_rekening',
        'jumlah',
        'bukti_pembayaran',
        'catatan',
        'tanggal_pembayaran',
    ];

    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class);
    }
}
