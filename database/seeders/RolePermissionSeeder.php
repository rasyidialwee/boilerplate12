<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create permissions
        Permission::firstOrCreate(['name' => 'view telescope']);
        Permission::firstOrCreate(['name' => 'view horizon']);

        // Create roles
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $user = Role::firstOrCreate(['name' => 'user']);

        // Assign permissions to roles
        // Only admin has access to Telescope and Horizon
        $admin->givePermissionTo(['view telescope', 'view horizon']);
        // User role has no special permissions by default
    }
}
