<?php

namespace App\Services;

use Illuminate\Support\Str;
use Spatie\Permission\Models\Permission;

class PermissionGeneratorService
{
    /**
     * Default CRUD actions.
     *
     * @var array<string>
     */
    protected array $defaultActions = ['create', 'edit', 'delete', 'view'];

    /**
     * Generate permissions for a model.
     *
     * @param  string|object  $model  Model class name or instance
     * @param  array<string>|null  $actions  Specific actions, null to use defaults
     * @param  string  $guard  Guard name
     * @param  bool  $force  Force regeneration
     * @return array<string> Array of created permission names
     */
    public function generateForModel(
        string|object $model,
        ?array $actions = null,
        string $guard = 'web',
        bool $force = false
    ): array {
        $modelName = $this->getModelName($model);
        $actions = $actions ?? $this->defaultActions;
        $created = [];

        foreach ($actions as $action) {
            $permissionName = $this->generatePermissionName($action, $modelName);

            $exists = Permission::where('name', $permissionName)
                ->where('guard_name', $guard)
                ->exists();

            if ($exists && ! $force) {
                continue;
            }

            if ($exists && $force) {
                Permission::where('name', $permissionName)
                    ->where('guard_name', $guard)
                    ->first()?->delete();
            }

            Permission::create([
                'name' => $permissionName,
                'guard_name' => $guard,
            ]);

            $created[] = $permissionName;
        }

        // Clear the permission cache
        app()->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();

        return $created;
    }

    /**
     * Generate permissions for multiple models.
     *
     * @param  array<string|object>  $models  Array of model class names or instances
     * @param  array<string>|null  $actions  Specific actions, null to use defaults
     * @param  string  $guard  Guard name
     * @param  bool  $force  Force regeneration
     * @return array<string, array<string>> Array keyed by model name with created permissions
     */
    public function generateForModels(
        array $models,
        ?array $actions = null,
        string $guard = 'web',
        bool $force = false
    ): array {
        $results = [];

        foreach ($models as $model) {
            $modelName = $this->getModelName($model);
            $results[$modelName] = $this->generateForModel($model, $actions, $guard, $force);
        }

        return $results;
    }

    /**
     * Get model name from full class name or instance.
     */
    protected function getModelName(string|object $model): string
    {
        if (is_object($model)) {
            $className = class_basename(get_class($model));
        } else {
            $className = class_basename($model);
        }

        return Str::plural(Str::kebab($className));
    }

    /**
     * Generate permission name from action and model.
     */
    protected function generatePermissionName(string $action, string $modelName): string
    {
        return "{$action} {$modelName}";
    }
}
