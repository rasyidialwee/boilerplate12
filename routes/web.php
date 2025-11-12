<?php

use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Settings\SystemSettings;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    $canRegister = true;
    try {
        $systemSettings = app(SystemSettings::class);
        $canRegister = $systemSettings->registration_enabled && Features::enabled(Features::registration());
    } catch (\Exception $e) {
        // If settings table doesn't exist yet, default to enabled
        $canRegister = Features::enabled(Features::registration());
    }

    return Inertia::render('welcome', [
        'canRegister' => $canRegister,
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resources([
        'users' => UserController::class,
        'roles' => RoleController::class,
    ]);
});
