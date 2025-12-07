<?php

namespace App\Http\Controllers;

use App\Models\BillCategory;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class BillCategoryController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        if ($user->role === 'admin') {
             return BillCategory::all();
        }
        if ($user->role === 'owner') {
             return BillCategory::where('owner_id', $user->id)->get();
        }
        return response()->json(['error' => 'Unauthorized'], 403);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', BillCategory::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $category = new BillCategory();
        $category->name = $validated['name'];
        $category->owner_id = $request->user()->id;
        $category->save();

        return response()->json($category, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(BillCategory $billCategory)
    {
        $this->authorize('view', $billCategory);
        return $billCategory;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, BillCategory $billCategory)
    {
        $this->authorize('update', $billCategory);

        $validated = $request->validate([
            'name' => 'string|max:255',
        ]);

        $billCategory->update($validated);
        return $billCategory;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BillCategory $billCategory)
    {
        $this->authorize('delete', $billCategory);
        $billCategory->delete();
        return response()->json(['message' => 'Category deleted']);
    }
}
