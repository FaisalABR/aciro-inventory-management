<?php

namespace App\Providers;

use App\Services\AuthService;
use App\Services\AuthServiceInterface;
use App\Services\BarangKeluarService;
use App\Services\BarangKeluarServiceInterface;
use App\Services\BarangMasukService;
use App\Services\BarangMasukServiceInterface;
use App\Services\BarangService;
use App\Services\BarangServiceInterface;
use App\Services\KategoriService;
use App\Services\KategoriServiceInterface;
use App\Services\SatuanService;
use App\Services\SatuanServiceInterface;
use App\Services\SupplierService;
use App\Services\SupplierServiceInterface;
use App\Services\UserService;
use App\Services\UserServiceInterface;
use App\Services\WhatsappService;
use App\Services\WhatsappServiceInterface;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
        $this->app->bind(
            AuthServiceInterface::class,
            AuthService::class,
        );
        $this->app->bind(
            UserServiceInterface::class,
            UserService::class,
        );
        $this->app->bind(
            KategoriServiceInterface::class,
            KategoriService::class,
        );
        $this->app->bind(
            SatuanServiceInterface::class,
            SatuanService::class,
        );
        $this->app->bind(
            SupplierServiceInterface::class,
            SupplierService::class,
        );
        $this->app->bind(
            BarangServiceInterface::class,
            BarangService::class,
        );
        $this->app->bind(
            BarangMasukServiceInterface::class,
            BarangMasukService::class,
        );
        $this->app->bind(
            BarangKeluarServiceInterface::class,
            BarangKeluarService::class,
            WhatsappServiceInterface::class,
        );
        $this->app->bind(
            WhatsappServiceInterface::class,
            WhatsappService::class,
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // 1. Tambahkan pengecekan lingkungan (opsional tapi disarankan)
        if (config('app.env') !== 'local') {
            // 2. Beri tahu Laravel untuk selalu menghasilkan URL dengan HTTPS
            URL::forceScheme('https');

            // 3. (Opsional tapi direkomendasikan jika menggunakan load balancer)
            // Atau, gunakan trusted proxies untuk mendeteksi skema HTTPS:
            // \Illuminate\Support\Facades\Request::server('HTTP_X_FORWARDED_PROTO') == 'https'
        }
    }
}
