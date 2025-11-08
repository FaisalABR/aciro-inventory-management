<?php

namespace Database\Seeders;

use App\Models\Barang;
use App\Models\Stock;
use Illuminate\Database\Seeder;

class StockSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $barangs = Barang::all();

        foreach ($barangs as $barang) {
            // Hitung nilai ROP berdasarkan data barang
            $rataPermintaan = $barang->rata_rata_permintaan_harian ?? 0;
            $leadtime        = $barang->leadtime ?? 0;
            $safetyStock     = ceil(1.65 * $rataPermintaan * sqrt($leadtime));

            // Rumus ROP
            $rop = ($rataPermintaan * $leadtime) + $safetyStock;


            // Buat record stock
            Stock::create([
                'barang_id'         => $barang->barang_id,
                'quantity'          => 0,
                'potensi_penjualan' => 0.0,
                'itr'               => null,
                'rop'               => $rop,
                'status_rop'        => 'Out Of Stock',
                'status_itr'        => null,
                'last_evaluated'    => now(),
            ]);
        }
    }
}
