<?php

namespace App\Policies;

use App\Models\Flat;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class FlatPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->role === 'admin' || $user->role === 'owner';
    }

    public function view(User $user, Flat $flat): bool
    {
        if ($user->role === 'admin') return true;
        if ($user->role === 'owner') return $flat->owner_id === $user->id;
        if ($user->role === 'tenant') return $flat->tenant_id === $user->id;
        return false;
    }

    public function create(User $user): bool
    {
        return $user->role === 'admin' || $user->role === 'owner';
    }

    public function update(User $user, Flat $flat): bool
    {
        if ($user->role === 'admin') return true;
        if ($user->role === 'owner') return $flat->owner_id === $user->id;
        return false;
    }

    public function delete(User $user, Flat $flat): bool
    {
        if ($user->role === 'admin') return true;
        if ($user->role === 'owner') return $flat->owner_id === $user->id;
        return false;
    }
}
