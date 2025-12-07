<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Flat;
use App\Models\BillCategory;

class Bill extends Model
{
    use HasFactory;

    protected $fillable = ['flat_id', 'category_id', 'amount', 'due_date', 'status'];

    public function flat()
    {
        return $this->belongsTo(Flat::class);
    }

    public function category()
    {
        return $this->belongsTo(BillCategory::class);
    }
}
