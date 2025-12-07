<?php

namespace App\Policies;

use App\Models\Bill;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class BillPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->role === 'admin' || $user->role === 'owner' || $user->role === 'tenant';
    }

    public function view(User $user, Bill $bill): bool
    {
        if ($user->role === 'admin') return true;
        if ($user->role === 'owner') return $bill->flat->owner_id === $user->id;
        if ($user->role === 'tenant') return $bill->flat->tenant_id === $user->id;
        return false;
    }

    public function create(User $user): bool
    {
        return $user->role === 'admin' || $user->role === 'owner';
    }

    public function update(User $user, Bill $bill): bool
    {
        if ($user->role === 'admin') return true;
        if ($user->role === 'owner') return $bill->flat->owner_id === $user->id;
        return false;
    }

    public function delete(User $user, Bill $bill): bool
    {
        if ($user->role === 'admin') return true;
        if ($user->role === 'owner') return $bill->flat->owner_id === $user->id;
        return false;
    }
}
