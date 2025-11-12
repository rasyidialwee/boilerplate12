<?php

namespace App\Actions\Users;

use App\Events\UserCreated;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class CreateUser
{
    /**
     * Create a new user with the given data and assign role.
     */
    public function handle(array $data): User
    {
        // Generate a random strong password (minimum 12 characters with mixed case, numbers, and symbols)
        $plainPassword = Str::password(12);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($plainPassword),
        ]);

        // Assign role - use provided role or default to 'user' role
        $roleId = $data['role'] ?? $this->getDefaultRoleId();
        $assignRoleToUser = app(AssignRoleToUser::class);
        $assignRoleToUser->handle($user, $roleId);

        // Dispatch event to send password email
        event(new UserCreated($user, $plainPassword));

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
