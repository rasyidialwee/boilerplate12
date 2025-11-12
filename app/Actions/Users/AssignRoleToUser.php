<?php

namespace App\Actions\Users;

use App\Models\User;
use Spatie\Permission\Models\Role;

class AssignRoleToUser
{
    /**
     * Assign role(s) to a user.
     */
    public function handle(User $user, int|array $roleIds): void
    {
        // Convert single role ID to array
        $roleIds = is_array($roleIds) ? $roleIds : [$roleIds];

        // Get roles by ID
        $roles = Role::whereIn('id', $roleIds)->get();

        // Sync roles (replace existing roles)
        $user->syncRoles($roles);
    }
}
