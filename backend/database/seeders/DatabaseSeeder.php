<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Admin
        User::factory()->create([
            'name' => 'System Admin',
            'email' => 'admin@example.com',
            'password' => 'password', // Default factory password
            'role' => 'admin',
        ]);

        // 2. Create Owner
        $owner = User::factory()->create([
            'name' => 'Demo Owner',
            'email' => 'owner@example.com',
            'password' => 'password',
            'role' => 'owner',
        ]);

        // 3. Create Tenant assigned to Owner
        User::factory()->create([
            'name' => 'Demo Tenant',
            'email' => 'tenant@example.com',
            'password' => 'password',
            'role' => 'tenant',
            'landlord_id' => $owner->id,
        ]);
    }
}
