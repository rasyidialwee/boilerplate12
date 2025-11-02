<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->asSuperadmin()->create([
            'name' => 'Super Admin',
            'email' => 'superadmin@skyrem.my',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        User::factory()->asAdmin()->create([
            'name' => 'Admin',
            'email' => 'admin@skyrem.my',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

    }
}
