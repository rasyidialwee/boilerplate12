<?php

namespace App\Actions\Roles;

use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UpdateRole
{
    /**
     * Update the role with the given data and permissions.
     */
    public function handle(Role $role, array $data): Role
    {
        $role->update([
            'name' => $data['name'],
            'guard_name' => $data['guard_name'] ?? $role->guard_name,
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
