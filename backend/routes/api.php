<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::post('me', [AuthController::class, 'me']);
});

Route::group([
    'middleware' => ['api', 'auth:api'],
], function ($router) {
    Route::apiResource('users', \App\Http\Controllers\UserController::class);
    Route::apiResource('flats', \App\Http\Controllers\FlatController::class);
    Route::apiResource('bills', \App\Http\Controllers\BillController::class);
    Route::apiResource('bill-categories', \App\Http\Controllers\BillCategoryController::class);
});

Route::get('owners', [\App\Http\Controllers\UserController::class, 'listOwners']);
