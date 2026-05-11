<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Super Admin
        User::updateOrCreate(
            ['email' => 'admin@bank.com'],
            [
                'name' => 'System Root',
                'password' => Hash::make('password'),
                'role' => 'super_admin',
                'email_verified_at' => now(),
                'balance' => 1000000,
            ]
        );

        // Create Admin
        User::updateOrCreate(
            ['email' => 'staff@bank.com'],
            [
                'name' => 'Bank Manager',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'email_verified_at' => now(),
                'balance' => 50000,
            ]
        );

        // Create a Standard User for testing
        User::updateOrCreate(
            ['email' => 'user@bank.com'],
            [
                'name' => 'John Doe',
                'password' => Hash::make('password'),
                'role' => 'user',
                'email_verified_at' => now(),
                'balance' => 5400,
            ]
        );
    }
}
