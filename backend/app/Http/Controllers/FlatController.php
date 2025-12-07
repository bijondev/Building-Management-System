<?php

namespace App\Http\Controllers;

use App\Models\Flat;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class FlatController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
       
        $user = $request->user();
        
        if ($user->role === 'admin') {
             return Flat::with(['owner', 'tenant'])->get();
        }

        if ($user->role === 'owner') {
            return Flat::with(['tenant'])->where('owner_id', $user->id)->get();
        }

        return response()->json(['error' => 'Unauthorized'], 403);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Flat::class);

        $validated = $request->validate([
            'number' => 'required|string',
            'tenant_id' => 'nullable|exists:users,id', 
        ]);

        $flat = new Flat();
        $flat->number = $validated['number'];
        $flat->owner_id = $request->user()->id; 
        if (isset($validated['tenant_id'])) {
             $flat->tenant_id = $validated['tenant_id'];
        }
        $flat->save();

        return response()->json($flat, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Flat $flat)
    {
        $this->authorize('view', $flat);
        return $flat->load(['owner', 'tenant', 'bills']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Flat $flat)
    {
        $this->authorize('update', $flat);

        $validated = $request->validate([
            'number' => 'string',
            'tenant_id' => 'nullable|exists:users,id',
        ]);

        $flat->update($validated);
        return $flat;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Flat $flat)
    {
        $this->authorize('delete', $flat);
        $flat->delete();
        return response()->json(['message' => 'Flat deleted']);
    }
}
