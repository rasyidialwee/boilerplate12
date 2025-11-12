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
        Permission::firstOrCreate(['name' => 'can-manage-system-settings']);

        // Create roles
        $superadmin = Role::firstOrCreate(['name' => 'superadmin']);
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $user = Role::firstOrCreate(['name' => 'user']);

        // Assign permissions to roles
        $superadmin->givePermissionTo('can-manage-system-settings');
        $admin->givePermissionTo('can-manage-system-settings');

    }
}
