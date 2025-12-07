<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\BillCreatedMail;

class FlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_full_flow()
    {
        Mail::fake();

        // 1. Admin Login & Create Owner
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
            'role' => 'admin'
        ]);

        $token = auth('api')->login($admin);
        
        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->postJson('/api/users', [
                             'name' => 'Owner Test',
                             'email' => 'owner@test.com',
                             'password' => 'password',
                             'role' => 'owner'
                         ]);
        
        $response->assertStatus(201);
        $ownerId = $response->json('id');

        // 2. Owner Login & Create Flat
        $owner = User::find($ownerId);
        $ownerToken = auth('api')->login($owner);

        // Create Tenant first (Admin should do this, but for test simplicity, Owner viewing tenant id)
        // Let's create tenant via factory or Admin
        $tenant = User::create([
            'name' => 'Tenant Test',
            'email' => 'tenant@test.com',
            'password' => bcrypt('password'),
            'role' => 'tenant'
        ]);

        $flatResponse = $this->withHeaders(['Authorization' => "Bearer $ownerToken"])
                             ->postJson('/api/flats', [
                                 'number' => '102',
                                 'tenant_id' => $tenant->id
                             ]);
        
        $flatResponse->assertStatus(201);
        $flatId = $flatResponse->json('id');

        // 3. Create Bill Category
        $catResponse = $this->withHeaders(['Authorization' => "Bearer $ownerToken"])
                            ->postJson('/api/bill-categories', [
                                'name' => 'Water'
                            ]);
        $catResponse->assertStatus(201);
        $catId = $catResponse->json('id');

        // 4. Create Bill
        $billResponse = $this->withHeaders(['Authorization' => "Bearer $ownerToken"])
                             ->postJson('/api/bills', [
                                 'flat_id' => $flatId,
                                 'category_id' => $catId,
                                 'amount' => 500,
                                 'due_date' => '2025-01-01'
                             ]);
        
        $billResponse->assertStatus(201);

        // 5. Verify Email Sent
        Mail::assertSent(BillCreatedMail::class, function ($mail) use ($tenant) {
            return $mail->hasTo($tenant->email);
        });
    }
}
