<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Frontend\AuthController;
use App\Http\Controllers\Api\Frontend\CartController;
use App\Http\Controllers\Api\Frontend\OrderController as FrontendOrderController;
use App\Http\Controllers\Api\Backend\OrderController as BackendOrderController;
use App\Http\Controllers\Api\Backend\ProductController;
use App\Http\Controllers\Api\Backend\CategoryController;
use App\Http\Controllers\Api\Backend\AdminAuthController;
use App\Http\Controllers\Api\Backend\DashboardController;
use App\Http\Controllers\Api\Backend\InventoryController;

use App\Http\Controllers\Api\Frontend\FrontendController;

// ===============================
// 🔹 Frontend User Auth
// ===============================
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::put('/user/password', [AuthController::class, 'updatePassword']);
});


// ---------------------------
// Backend/Admin Auth
// ---------------------------
Route::post('/backend/login', [AdminAuthController::class, 'login']);

Route::middleware(['auth:sanctum', 'isAdmin'])->group(function () {
    Route::post('/backend/logout', [AdminAuthController::class, 'logout']);
    Route::get('/backend/user', [AdminAuthController::class, 'user']);
});


// ===============================
// 🔹 Backend (Admin APIs)
// ===============================
Route::prefix('backend')->middleware(['auth:sanctum', 'isAdmin'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index']);
    Route::apiResource('categories', CategoryController::class);
    Route::get('categories-list', [CategoryController::class, 'list']);
    Route::apiResource('products', ProductController::class);
    Route::apiResource('inventories', InventoryController::class);
    Route::apiResource('orders', BackendOrderController::class);
});


// ===============================
// 🔹 Frontend APIs
// ===============================
Route::prefix('frontend')->group(function () {
    Route::get('products', [FrontendController::class, 'products']);
    Route::get('cart', [CartController::class, 'index']);
    Route::post('cart', [CartController::class, 'store']);
    Route::put('cart/{item}', [CartController::class, 'update']);
    Route::delete('cart/{item}', [CartController::class, 'destroy']);
    
    // Order routes are protected by sanctum in their own group now
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('orders', [FrontendOrderController::class, 'index']);
        Route::get('orders/{order}', [FrontendOrderController::class, 'show']);
    });
    
    // Public order placement (handles guest & auth)
    Route::post('orders', [FrontendOrderController::class, 'store']);
});