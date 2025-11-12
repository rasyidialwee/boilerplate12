<?php

use App\Http\Controllers\Settings\SystemSettingsController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::get('system', [SystemSettingsController::class, 'index'])->name('system.index');
    Route::put('system', [SystemSettingsController::class, 'update'])->name('system.update');
});
