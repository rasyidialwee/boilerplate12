<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class SystemSettings extends Settings
{
    public bool $registration_enabled;

    public static function group(): string
    {
        return 'system';
    }
}
