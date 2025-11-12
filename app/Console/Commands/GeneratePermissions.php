<?php

namespace App\Console\Commands;

use App\Services\PermissionGeneratorService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class GeneratePermissions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'permissions:generate 
                            {--models= : Comma-separated list of model names (e.g., User,Product)}
                            {--actions=create,edit,delete,view : Comma-separated list of actions}
                            {--guard=web : The guard name}
                            {--force : Force regeneration of existing permissions}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate permissions automatically based on models and actions (e.g., create users, edit users)';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $service = app(PermissionGeneratorService::class);
        $models = $this->getModels();
        $actions = $this->getActions();
        $guard = $this->option('guard') ?: 'web';
        $force = (bool) $this->option('force');

        if (empty($models)) {
            $this->error('No models found. Please specify models using --models option or ensure models exist in app/Models directory.');
            $this->info('');
            $this->info('Example usage:');
            $this->line('  sail artisan permissions:generate --models=User');
            $this->line('  sail artisan permissions:generate --models=User,Product,Order');
            $this->line('  sail artisan permissions:generate --models=User --actions=create,edit');

            return Command::FAILURE;
        }

        $this->info('Generating permissions...');
        $this->newLine();

        $totalCreated = 0;
        $totalSkipped = 0;

        foreach ($models as $model) {
            // $model is always a string from getModels(), but service accepts string|object
            $modelName = class_basename($model);
            $this->info("Processing model: {$modelName}");

            $created = $service->generateForModel($model, $actions, $guard, $force);
            $createdCount = count($created);

            foreach ($created as $permissionName) {
                $this->line("  ✓ Created: {$permissionName}");
            }

            // Count skipped (permissions that should have been created but already exist)
            $actionsCount = count($actions);
            $skippedCount = $actionsCount - $createdCount;
            $totalSkipped += $skippedCount;

            if ($skippedCount > 0 && ! $force) {
                $this->line("  ⚠ Skipped: {$skippedCount} permission(s) (already exist)");
            }

            $totalCreated += $createdCount;
            $this->newLine();
        }

        $this->info('Summary:');
        $this->line("  Created: {$totalCreated}");
        if ($totalSkipped > 0) {
            $this->line("  Skipped: {$totalSkipped}");
        }
        $this->newLine();
        $this->info('Permissions generated successfully!');

        return Command::SUCCESS;
    }

    /**
     * Get models to process.
     *
     * @return array<string>
     */
    protected function getModels(): array
    {
        $modelsOption = $this->option('models');

        if ($modelsOption) {
            $modelNames = array_map('trim', explode(',', $modelsOption));
            $models = [];

            foreach ($modelNames as $modelName) {
                // Try to find the full class name
                $fullClassName = $this->resolveModelClass($modelName);
                if ($fullClassName && class_exists($fullClassName)) {
                    $models[] = $fullClassName;
                } else {
                    $this->warn("Model '{$modelName}' not found. Skipping...");
                }
            }

            return $models;
        }

        // Auto-discover models in app/Models directory
        $modelsPath = app_path('Models');

        if (! File::exists($modelsPath)) {
            return [];
        }

        $files = File::allFiles($modelsPath);
        $models = [];

        foreach ($files as $file) {
            $className = str_replace(
                [app_path(), '/', '.php'],
                ['App', '\\', ''],
                $file->getPathname()
            );

            if (class_exists($className)) {
                $reflection = new \ReflectionClass($className);

                // Skip abstract classes and interfaces
                if (! $reflection->isAbstract() && ! $reflection->isInterface()) {
                    // Check if it extends Eloquent model
                    $parent = $reflection->getParentClass();
                    if ($parent && (
                        $parent->getName() === 'Illuminate\Database\Eloquent\Model' ||
                        str_contains($parent->getName(), 'Eloquent\Model')
                    )) {
                        $models[] = $className;
                    }
                }
            }
        }

        return $models;
    }

    /**
     * Resolve model class name from short name.
     */
    protected function resolveModelClass(string $modelName): ?string
    {
        // If it's already a full class name, return it
        if (class_exists($modelName)) {
            return $modelName;
        }

        // Try common namespaces
        $namespaces = ['App\\Models\\', 'App\\'];

        foreach ($namespaces as $namespace) {
            $fullClassName = $namespace.$modelName;
            if (class_exists($fullClassName)) {
                return $fullClassName;
            }
        }

        return null;
    }

    /**
     * Get actions to generate.
     *
     * @return array<string>
     */
    protected function getActions(): array
    {
        $actionsOption = $this->option('actions');

        if ($actionsOption) {
            return array_map('trim', explode(',', $actionsOption));
        }

        return ['create', 'edit', 'delete', 'view'];
    }
}
