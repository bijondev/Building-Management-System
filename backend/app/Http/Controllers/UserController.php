<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        
        if ($request->user()->role !== 'admin' && $request->user()->role !== 'owner') {
             return response()->json(['error' => 'Unauthorized'], 403);
        }

        $query = User::query();

        if ($request->user()->role === 'owner') {
             $query->where('role', 'tenant')
                   ->where(function ($q) use ($request) {
                       $q->where('landlord_id', $request->user()->id)
                         ->orWhereHas('flatsAsTenant', function($subQ) use ($request) {
                             $subQ->where('owner_id', $request->user()->id);
                         });
                   });
        }
        if ($request->has('role')) {
            $query->where('role', $request->role);
        }
        return $query->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $creatorRole = $request->user()->role;
        if ($creatorRole !== 'admin' && $creatorRole !== 'owner') {
             return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => $creatorRole === 'admin' ? ['required', Rule::in(['owner', 'tenant', 'admin'])] : 'nullable',
            'landlord_id' => 'nullable|exists:users,id',
        ]);

        $role = $creatorRole === 'admin' ? $validated['role'] : 'tenant';
        
        $landlordId = null;
        if ($creatorRole === 'owner') {
            $landlordId = $request->user()->id;
        } elseif ($creatorRole === 'admin' && isset($validated['landlord_id'])) {
            $landlordId = $validated['landlord_id'];
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $role,
            'landlord_id' => $landlordId,
        ]);

        return response()->json($user, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, User $user)
    {
        if ($request->user()->role !== 'admin') {
             return response()->json(['error' => 'Unauthorized'], 403);
        }
        return $user;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $canUpdate = false;
        if ($request->user()->role === 'admin') {
            $canUpdate = true;
        } elseif ($request->user()->role === 'owner' && $user->role === 'tenant' && $user->landlord_id === $request->user()->id) {
            $canUpdate = true;
        }

        if (!$canUpdate) {
             return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'string|max:255',
            'email' => ['string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'string|min:6', 
            'role' => [Rule::in(['owner', 'tenant', 'admin'])],
            'landlord_id' => 'nullable|exists:users,id',
        ]);

        if (isset($validated['name'])) $user->name = $validated['name'];
        if (isset($validated['email'])) $user->email = $validated['email'];
        if (isset($validated['role']) && $request->user()->role === 'admin') $user->role = $validated['role'];
        if (isset($validated['password'])) $user->password = Hash::make($validated['password']);
        
        if (array_key_exists('landlord_id', $validated)) {
             if ($request->user()->role === 'admin') {
                 $user->landlord_id = $validated['landlord_id'];
             }
        }
        
        $user->save();

        return $user;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, User $user)
    {
        $canDelete = false;
        if ($request->user()->role === 'admin') {
            $canDelete = true;
        } elseif ($request->user()->role === 'owner' && $user->role === 'tenant' && $user->landlord_id === $request->user()->id) {
            $canDelete = true;
        }

        if (!$canDelete) {
             return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        $user->delete();
        return response()->json(['message' => 'User deleted successfully.']);
    }

    public function listOwners()
    {
        return User::where('role', 'owner')->select('id', 'name')->get();
    }
}
