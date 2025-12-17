<?php

namespace App\Http\Controllers\Api\Backend;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;

class AdminAuthController extends Controller
{
    // Admin login
    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            $user = User::where('email', $request->email)
                        ->where('is_admin', true)
                        ->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                Log::warning('Admin login failed', ['email' => $request->email]);
                return response()->json(['message' => 'Invalid credentials'], 401);
            }

            $token = $user->createToken('admin-token')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token,
            ]);
        } catch (\Throwable $e) {
            // Log full error
            Log::error('Admin login error: '.$e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json(['message' => 'Server error'], 500);
        }
    }


    // Admin logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Admin logged out successfully']);
    }

    // Get authenticated admin
    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}
