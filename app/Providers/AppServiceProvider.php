<?php

namespace App\Providers;

use App\Events\UserCreated;
use App\Listeners\SendUserPasswordEmail;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Define Gate for superadmin access
        Gate::define('access-superadmin', function ($user) {
            return $user?->hasRole('superadmin') ?? false;
        });

        // Register event listeners
        Event::listen(
            UserCreated::class,
            SendUserPasswordEmail::class
        );
    }
}
