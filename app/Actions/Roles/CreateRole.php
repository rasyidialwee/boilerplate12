<?php

namespace App\Actions\Roles;

use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class CreateRole
{
    /**
     * Create a new role with the given permissions.
     */
    public function handle(array $data): Role
    {
        $role = Role::create([
            'name' => $data['name'],
            'guard_name' => $data['guard_name'] ?? 'web',
        ]);

        // Get permission IDs and convert to integers (HTML inputs send strings)
        $permissionIds = array_map('intval', $data['permissions'] ?? []);

        // Sync permissions by fetching them by ID
        if (! empty($permissionIds)) {
            $permissions = Permission::whereIn('id', $permissionIds)->get();
            $role->syncPermissions($permissions);
        } else {
            $role->syncPermissions([]);
        }

        // Clear permission cache after syncing
        app()->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();

        return $role;
    }
}
