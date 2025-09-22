<?php

namespace App\Providers;

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\ServiceProvider;

class BroadcastServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Register the routes for broadcasting with proper middleware
        Broadcast::routes(['middleware' => ['web', 'auth']]);

        // Load channel definitions
        require base_path('routes/channels.php');
    }
}
