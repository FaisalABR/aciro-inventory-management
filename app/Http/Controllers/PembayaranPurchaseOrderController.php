<?php

namespace App\Http\Controllers;

use App\Jobs\SendWhatsappJob;
use App\Models\PembayaranPurchaseOrder;
use App\Models\PurchaseOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PembayaranPurchaseOrderController extends Controller
{
    public function create(Request $request, $id)
    {
        $validated = $request->validate([
            'metode_pembayaran' => 'required|string',
            'nama_bank' => 'nullable|string',
            'nomor_rekening' => 'nullable|string',
            'jumlah' => 'required|numeric',
            'bukti_pembayaran' => 'nullable|file|mimes:jpg,png,pdf|max:2048',
            'catatan' => 'nullable|string',
            'tanggal_pembayaran' => 'required',
        ]);

        if ($request->hasFile('bukti_pembayaran')) {
            $validated['bukti_pembayaran'] = $request->file('bukti_pembayaran')->store('bukti-pembayaran', 'public');
        }

        $purchaseOrder = PurchaseOrder::where('purchase_order_id', $id);

        $payment = PembayaranPurchaseOrder::create([
            'purchase_order_id' => $id,
            'metode_pembayaran' => $validated['metode_pembayaran'],
            'nama_bank' => $validated['nama_bank'],
            'nomor_rekening' => $validated['nomor_rekening'],
            'jumlah' => $validated['jumlah'],
            'bukti_pembayaran' => $validated['bukti_pembayaran'],
            'catatan' => $validated['catatan'],
            'tanggal_order' => $validated['tanggal_pembayaran']
        ]);

        // update status PO jadi sudah dibayar
        $purchaseOrder->update(['status' => 'SUDAH DIBAYAR']);

        // kirim WA notifikasi ke supplier
        try {
            dd($purchaseOrder->supplier->noWhatsapp);
            $message = "Halo, pembayaran untuk PO #{$purchaseOrder->nomor_po} telah dilakukan. Silakan proses pengiriman barang.";
            SendWhatsappJob::dispatch($purchaseOrder->supplier->noWhatsapp, $message);
        } catch (\Throwable $th) {
            Log::error("Gagal kirim WA ke supplier: " . $th->getMessage());
        }

        return redirect()->back()->with('success', 'PO Berhasil Dibuat berhasil ditambahkan!');
    }
}
