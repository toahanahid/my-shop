<?php

namespace App\Http\Controllers\Api\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    private function getCart(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            $user = Auth::guard('sanctum')->user();
        }

        $guestId = $request->header('X-Guest-ID') ?? session()->getId();

        if ($user) {
            $userCart = Cart::where('user_id', $user->id)->first();
            $guestCart = Cart::where('guest_id', $guestId)->first();

            if ($guestCart) {
                if ($userCart) {
                    // Merge guest cart items into user cart
                    foreach ($guestCart->items as $item) {
                        $existing = $userCart->items()->where('product_id', $item->product_id)->first();
                        if ($existing) {
                            $existing->qty += $item->qty;
                            $existing->price = $existing->qty * $existing->product->price;
                            $existing->save();
                            $item->delete();
                        } else {
                            $item->cart_id = $userCart->id;
                            $item->save();
                        }
                    }
                    $guestCart->delete();
                } else {
                    // Assign guest cart to user
                    $guestCart->user_id = $user->id;
                    $guestCart->guest_id = null;
                    $guestCart->save();
                    $userCart = $guestCart;
                }
            }

            if (!$userCart) {
                $userCart = Cart::create([
                    'user_id' => $user->id,
                    'session_id' => session()->getId(),
                ]);
            }

            return $userCart;
        }

        $cart = Cart::firstOrCreate(
            ['guest_id' => $guestId],
            [
                'session_id' => session()->getId(),
            ]
        );

        return $cart;
    }

    public function index(Request $request)
    {
        $cart = $this->getCart($request)->load('items.product');

        $data = [
            'items' => $cart->items->map(fn($item) => [
                'id' => $item->id,
                'qty' => $item->qty,
                'price' => $item->qty * $item->product->price,
                'product' => [
                    'id' => $item->product->id,
                    'name' => $item->product->name,
                    'price' => $item->product->price,
                    'image' => $item->product->image,
                ],
            ]),
            'subtotal' => $cart->items->sum(fn($item) => $item->qty * $item->product->price),
        ];

        return response()->json(['cart' => $data]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'qty' => 'required|integer|min:1',
        ]);

        $cart = $this->getCart($request);
        $product = Product::findOrFail($request->product_id);

        $item = $cart->items()->firstOrCreate(
            ['product_id' => $product->id],
            ['qty' => 0, 'price' => 0]
        );

        $item->qty += $request->qty;
        $item->price = $product->price * $item->qty;
        $item->save();

        return response()->json(['message' => 'Product added to cart']);
    }

    public function update($itemId, Request $request)
    {
        $request->validate(['qty' => 'required|integer|min:1']);
        $cart = $this->getCart($request);
        $item = $cart->items()->findOrFail($itemId);

        $item->qty = $request->qty;
        $item->price = $item->product->price * $request->qty;
        $item->save();

        return response()->json(['message' => 'Cart updated']);
    }

    public function destroy($itemId, Request $request)
    {
        $cart = $this->getCart($request);
        $item = $cart->items()->findOrFail($itemId);
        $item->delete();

        return response()->json(['message' => 'Item removed']);
    }
}
