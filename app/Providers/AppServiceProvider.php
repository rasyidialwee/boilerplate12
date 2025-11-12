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

        // Define Gate for system settings management
        Gate::define('can-manage-system-settings', function ($user) {
            return $user?->hasPermissionTo('can-manage-system-settings') ?? false;
        });

        // Register event listeners
        Event::listen(
            UserCreated::class,
            SendUserPasswordEmail::class
        );
    }
}
