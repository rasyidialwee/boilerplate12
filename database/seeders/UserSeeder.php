<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superadmin = User::firstOrCreate(
            ['email' => 'superadmin@skyrem.my'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        if (!$superadmin->hasRole('superadmin')) {
            $role = Role::firstOrCreate(['name' => 'superadmin']);
            $superadmin->assignRole($role);
        }

        $admin = User::firstOrCreate(
            ['email' => 'admin@skyrem.my'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        if (!$admin->hasRole('admin')) {
            $role = Role::firstOrCreate(['name' => 'admin']);
            $admin->assignRole($role);
        }

        User::factory(100)->asUser()->create();

    }
}
