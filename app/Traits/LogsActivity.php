<?php

namespace App\Traits;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity as SpatieLogsActivity;

trait LogsActivity
{
    use SpatieLogsActivity;

    /**
     * Get the options for logging the activity.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->logExcept($this->getLogAttributesToIgnore())
            ->setDescriptionForEvent(fn (string $eventName) => $this->getDescriptionForEvent($eventName));
    }

    /**
     * Get the description for the event.
     */
    protected function getDescriptionForEvent(string $eventName): string
    {
        $modelName = class_basename($this);

        return match ($eventName) {
            'created' => "Created {$modelName}",
            'updated' => "Updated {$modelName}",
            'deleted' => "Deleted {$modelName}",
            default => "{$eventName} {$modelName}",
        };
    }

    /**
     * Get the attributes that should be ignored when logging.
     */
    public function getLogAttributesToIgnore(): array
    {
        return [
            'password',
            'two_factor_secret',
            'two_factor_recovery_codes',
            'remember_token',
        ];
    }
}
