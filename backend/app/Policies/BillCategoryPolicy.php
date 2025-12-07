<?php

namespace App\Policies;

use App\Models\BillCategory;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class BillCategoryPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->role === 'admin' || $user->role === 'owner';
    }

    public function view(User $user, BillCategory $billCategory): bool
    {
        if ($user->role === 'admin') return true;
        if ($user->role === 'owner') return $billCategory->owner_id === $user->id;
        return false;
    }

    public function create(User $user): bool
    {
        return $user->role === 'admin' || $user->role === 'owner';
    }

    public function update(User $user, BillCategory $billCategory): bool
    {
        if ($user->role === 'admin') return true;
        if ($user->role === 'owner') return $billCategory->owner_id === $user->id;
        return false;
    }

    public function delete(User $user, BillCategory $billCategory): bool
    {
        if ($user->role === 'admin') return true;
        if ($user->role === 'owner') return $billCategory->owner_id === $user->id;
        return false;
    }
}
