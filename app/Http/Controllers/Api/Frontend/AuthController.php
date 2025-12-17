<?php

namespace App\Http\Controllers\Api\Frontend;

use App\Models\User;
use App\Models\Cart;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\PersonalAccessToken;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();

        // --- Cart Merging Logic ---
        $guestId = $request->header('X-Guest-ID');
        if ($guestId) {
            $guestCart = Cart::where('guest_id', $guestId)->with('items')->first();
            
            if ($guestCart) {
                $userCart = Cart::firstOrCreate(['user_id' => $user->id]);
                $userCart->load('items.product'); // Eager load for efficiency

                // Move items from guest cart to user cart
                foreach ($guestCart->items as $guestItem) {
                    $userItem = $userCart->items->firstWhere('product_id', $guestItem->product_id);

                    if ($userItem) {
                        // If item exists in user cart, update quantity and price, then delete guest item
                        $userItem->qty += $guestItem->qty;
                        $userItem->price = $userItem->product->price * $userItem->qty;
                        $userItem->save();
                        $guestItem->delete(); 
                    } else {
                        // If item does not exist, just re-assign it to the user's cart
                        $guestItem->cart_id = $userCart->id;
                        $guestItem->save();
                    }
                }
                
                // Delete the guest cart shell, which should be empty now
                $guestCart->delete();
            }
        }
        // --- End Cart Merging Logic ---

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $accessToken = $request->user()->currentAccessToken();

        if ($accessToken instanceof PersonalAccessToken) {
            $accessToken->delete();
        } else {
            Auth::guard('web')->logout();
            
            if ($request->hasSession()) {
                $request->session()->invalidate();
                $request->session()->regenerateToken();
            }
        }

        return response()->json(['message' => 'Logged out successfully']);
    }


    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'User registered successfully',
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
        ]);

        $user = $request->user();

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
        ]);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user,
        ]);
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Current password does not match'], 422);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return response()->json(['message' => 'Password updated successfully']);
    }
}
