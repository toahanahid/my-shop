<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Frontend\AuthController;


// -----------------------------
// 🔹 Sanctum SPA Authentication
// -----------------------------

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/password/update', [AuthController::class, 'updatePassword']);
});




// --------------------------------------------------------
// 🔹 Catch-all for React frontend (Must stay at the bottom)
// --------------------------------------------------------
Route::get('/{any}', function () {
    return view('app'); // loads your React app
})->where('any', '.*');
