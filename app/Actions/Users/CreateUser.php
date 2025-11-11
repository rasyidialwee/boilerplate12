<?php

namespace App\Actions\Users;

use App\Actions\Users\AssignRoleToUser;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class CreateUser
{
    /**
     * Create a new user with the given data and assign role.
     */
    public function handle(array $data): User
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        // Assign role - use provided role or default to 'user' role
        $roleId = $data['role'] ?? $this->getDefaultRoleId();
        $assignRoleToUser = app(AssignRoleToUser::class);
        $assignRoleToUser->handle($user, $roleId);

        return $user;
    }

    /**
     * Get the default role ID (user role).
     */
    protected function getDefaultRoleId(): int
    {
        $role = Role::firstOrCreate(['name' => 'user']);
        return $role->id;
    }
}

