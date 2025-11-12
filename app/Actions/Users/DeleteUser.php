<?php

namespace App\Actions\Users;

use App\Models\User;

class DeleteUser
{
    /**
     * Delete the user.
     */
    public function handle(User $user): void
    {
        $user->delete();
    }
}
