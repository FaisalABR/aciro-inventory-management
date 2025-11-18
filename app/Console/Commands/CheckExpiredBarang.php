<?php

namespace App\Console\Commands;

use App\Events\ROPNotification;
use App\Models\BarangMasukItem;
use App\Models\Role;
use Carbon\Carbon;
use Illuminate\Console\Command;

class CheckExpiredBarang extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'inventory:check-expired';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cek barang yang akan kadaluarsa dalam 30 hari dan kirim notifikasi.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $thresholdDate = Carbon::now()->addDays(30);

        $expiredItems = BarangMasukItem::with('barangs')->where('tanggal_expired', "<=", $thresholdDate)
            ->where('tanggal_expired', '>=', Carbon::now())->get();

        if ($expiredItems->isEmpty()) {
            $this->info('Tidak ada barang yang mendekati kedaluwarsa.');
            return;
        }

        $messageItems = $this->generateExpiredNotifications($expiredItems);

        $roles = Role::whereIn('name', ['kepala_gudang', 'kepala_toko'])->get();
        foreach ($roles as $role) {
            // Send whatsapp ke kepala toko dan kepala gudang
            foreach ($messageItems as $message)
                event(new ROPNotification($message, $role->name));
        }

        $this->info("Berhasil mengirim notifikasi untuk {$expiredItems->count()} barang.");
    }

    private function generateExpiredNotifications($dataArray): array
    {
        // Konversi array input menjadi Laravel Collection
        $items = collect($dataArray);
        $notifications = [];
        $today = Carbon::today(); //

        foreach ($items as $item) {
            // 1. Ambil data yang dibutuhkan, pastikan kolom ada
            $itemName = $item['barangs']['name'] ?? 'Nama Barang Tidak Diketahui';
            $batchNumber = $item['nomor_batch'] ?? 'N/A';
            $expiryDate = $item['tanggal_expired'] ?? null;

            if (!$expiryDate) {
                continue; // Skip jika tanggal expired tidak ada
            }

            // 2. Hitung sisa hari
            try {
                $expiryCarbon = Carbon::parse($expiryDate);
                // Sisa hari: differenceInDays akan menghitung selisih integer hari.
                $remainingDays = $today->diffInDays($expiryCarbon, false);
                // false: jika tanggal expired di masa lalu, hasil bisa negatif.

                // 3. Tentukan teks sisa hari
                if ($remainingDays > 0) {
                    $sisaHariText = abs($remainingDays) . " hari";
                } elseif ($remainingDays === 0) {
                    $sisaHariText = "hari ini";
                } else {
                    // Jika sudah kadaluarsa (remainingDays < 0)
                    $sisaHariText = "sudah " . abs($remainingDays) . " hari yang lalu";
                }

                // Format tanggal expired menjadi format Indonesia (D, d M Y)
                $formattedExpiryDate = $expiryCarbon->translatedFormat('d F Y');

                // 4. Buat string notifikasi
                $notifications[] = "{$itemName} dengan batch {$batchNumber} akan kadaluarsa {$sisaHariText} lagi. Tanggal expired {$formattedExpiryDate}";
            } catch (\Exception $e) {
                // Tangani error parsing tanggal jika ada
                $notifications[] = "Error memproses item: {$itemName} (Tanggal tidak valid)";
            }
        }

        return $notifications;
    }
}
