<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class DemoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            ['name' => 'Admin User', 'password' => bcrypt('password'), 'role' => 'admin']
        );

        $owner = User::create([
            'name' => 'John Owner',
            'email' => 'owner@example.com',
            'password' => bcrypt('password'),
            'role' => 'owner',
        ]);

        $tenant = User::create([
            'name' => 'Jane Tenant',
            'email' => 'tenant@example.com',
            'password' => bcrypt('password'),
            'role' => 'tenant',
        ]);

        $flat = \App\Models\Flat::create([
            'number' => '101',
            'owner_id' => $owner->id,
            'tenant_id' => $tenant->id,
        ]);

        $category = \App\Models\BillCategory::create([
            'name' => 'Electricity',
            'owner_id' => $owner->id,
        ]);

        \App\Models\Bill::create([
            'flat_id' => $flat->id,
            'category_id' => $category->id,
            'amount' => 150.00,
            'due_date' => now()->addDays(15),
            'status' => 'pending',
        ]);

        $this->command->info('Demo data seeded successfully!');
    }
}
