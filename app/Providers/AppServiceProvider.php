<?php

namespace App\Providers;


use App\Services\AuthService;
use App\Services\AuthServiceInterface;
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
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
