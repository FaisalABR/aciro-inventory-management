<?php

namespace App\Providers;

use App\Models\Barang;
use App\Services\AuthService;
use App\Services\AuthServiceInterface;
use App\Services\BarangKeluarService;
use App\Services\BarangKeluarServiceInterface;
use App\Services\BarangMasukService;
use App\Services\BarangMasukServiceInterface;
use App\Services\BarangService;
use App\Services\BarangServiceInterface;
use App\Services\SatuanService;
use App\Services\SatuanServiceInterface;
use App\Services\SupplierService;
use App\Services\SupplierServiceInterface;
use App\Services\UserService;
use App\Services\UserServiceInterface;
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
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
