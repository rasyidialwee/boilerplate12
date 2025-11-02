<?php

namespace App\Actions\Roles;

use Spatie\Permission\Models\Role;

class DeleteRole
{
    public function handle(Role $role): void
    {
        $role->delete();

        // Clear the permission cache
        app()->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
