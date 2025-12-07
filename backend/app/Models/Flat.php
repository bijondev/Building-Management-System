<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Bill;

class Flat extends Model
{
    use HasFactory;

    protected $fillable = ['owner_id', 'tenant_id', 'number'];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function tenant()
    {
        return $this->belongsTo(User::class, 'tenant_id');
    }

    public function bills()
    {
        return $this->hasMany(Bill::class);
    }
}
