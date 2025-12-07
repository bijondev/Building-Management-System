<?php

namespace App\Http\Controllers;

use App\Models\Bill;
use App\Models\Flat;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class BillController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'admin') {
             return Bill::with(['flat', 'category'])->get();
        }

        if ($user->role === 'owner') {
             return Bill::with(['flat', 'category'])
                 ->whereHas('flat', function($q) use ($user) {
                     $q->where('owner_id', $user->id);
                 })->get();
        }

        if ($user->role === 'tenant') {
             return Bill::with(['flat', 'category'])
                 ->whereHas('flat', function($q) use ($user) {
                     $q->where('tenant_id', $user->id);
                 })->get();
        }

        return response()->json(['error' => 'Unauthorized'], 403);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Bill::class);

        $validated = $request->validate([
            'flat_id' => 'required|exists:flats,id',
            'category_id' => 'required|exists:bill_categories,id',
            'amount' => 'required|numeric',
            'due_date' => 'required|date',
        ]);

        
        $flat = Flat::find($validated['flat_id']);
        if ($flat->owner_id !== $request->user()->id && $request->user()->role !== 'admin') {
             return response()->json(['error' => 'Unauthorized: You do not own this flat'], 403);
        }

        $bill = Bill::create($validated);
        
        
        \App\Jobs\SendBillNotification::dispatch($bill, 'created');

        return response()->json($bill, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Bill $bill)
    {
        $this->authorize('view', $bill);
        return $bill->load(['flat', 'category']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Bill $bill)
    {
        $this->authorize('update', $bill);

        $validated = $request->validate([
            'amount' => 'numeric',
            'due_date' => 'date',
            'status' => 'string|in:pending,paid,overdue',
        ]);

        $originalStatus = $bill->status;
        $bill->update($validated);
        
        if ($originalStatus !== 'paid' && $bill->status === 'paid') {
             \App\Jobs\SendBillNotification::dispatch($bill, 'paid');
        }
        
        return $bill;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Bill $bill)
    {
        $this->authorize('delete', $bill);
        $bill->delete();
        return response()->json(['message' => 'Bill deleted']);
    }
}
