<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes for Cepat UI Olshop
|--------------------------------------------------------------------------
|
| Include these routes inside your Laravel `routes/api.php` file.
| These routes match the endpoints expected by Cepat UI Olshop repositories:
|
| - ApiProductRepository  -> /api/products, /api/categories, /api/products/deduct-stock
| - ApiOrderRepository    -> /api/orders, /api/orders/{id}/status, /api/orders/{id}/tracking
| - LaravelSanctumAdapter -> /api/login, /api/register, /api/logout, /api/user
|
*/

// ==========================================
// Public Routes (Storefront & Auth)
// ==========================================
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Public Storefront Catalog
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/categories', [ProductController::class, 'categories']);

// Public Order Placement & Tracking
Route::post('/orders', [OrderController::class, 'store']);
Route::get('/orders/track', [OrderController::class, 'track']);
Route::get('/orders/{id}', [OrderController::class, 'show']);

// ==========================================
// Customer Protected Routes (Bearer Token)
// ==========================================
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Customer Account
    Route::get('/account/orders', [OrderController::class, 'myOrders']);
});

// ==========================================
// Admin Protected Routes (Admin Bearer Token)
// ==========================================
Route::middleware(['auth:sanctum'])->group(function () {
    // Admin Products CRUD & Stock
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    Route::post('/products/deduct-stock', [ProductController::class, 'deductStock']);

    // Admin Orders Management
    Route::get('/orders', [OrderController::class, 'index']);
    Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus']);
    Route::patch('/orders/{id}/tracking', [OrderController::class, 'updateTracking']);
});
