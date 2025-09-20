<?php

namespace App\Http\Controllers;

use App\Models\PurchaseOrder;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PurchaseOrderController extends Controller
{
    public function index()
    {
        $query = PurchaseOrder::with('supplier')->select(
            'id',
            'uuid',
            'nomor_referensi',
            'tanggal_order',
            'supplier_id',
            'catatan',
            'status',
            DB::raw('(SELECT COUNT (DISTINCT barang_id) FROM purchase_order_items WHERE purchase_order_id = purchase_orders.id) as total_unique_items'),
            DB::raw('(SELECT SUM(quantity) FROM purchase_order_items WHERE purchase_order_id = purchase_orders.id) as total_quantity'),
        );

        $formattedValue = $query->get()->map(function ($purchaseOrder) {
            return [
                'id' => $purchaseOrder->id,
                'uuid' => $purchaseOrder->uuid,
                'nomor_referensi' => $purchaseOrder->nomor_referensi,
                'tanggal_order' => $purchaseOrder->tanggal_order,
                'total_quantity' => $purchaseOrder->total_quantity,
                'total_unique_items' => $purchaseOrder->total_unique_items,
                'status' => $purchaseOrder->status,
                'supplier' => [
                    'id'   => $purchaseOrder->supplier->id,
                    'name' => $purchaseOrder->supplier->name,
                ],
            ];
        });

        return Inertia::render('PurchaseOrder/Index', [
            'data' => $formattedValue,
        ]);
    }

    public function showEdit($uuid)
    {
        $po = PurchaseOrder::where('uuid', $uuid)->with(['supplier', 'items.barang'])->firstOrFail();
        $data = Supplier::all();

        $optionSupplier = $data->map(function ($supplier) {
            return [
                'value' => $supplier->id,
                'label' => $supplier->name,
            ];
        });

        return Inertia::render('PurchaseOrder/FormPurchase', [
            "isUpdate" => true,
            "data" => $po,
            'optionSupplier' => $optionSupplier,
        ]);
    }
}
