<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory; 

class BillCategory extends Model
{
    use HasFactory;

    protected $fillable = ['owner_id', 'name']; 

    public function owner() 
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function bills() 
    {
        return $this->hasMany(Bill::class, 'category_id');
    }
}
