<?php

namespace App\Http\Controllers\Api\Frontend;

use Stripe\Stripe;
use App\Models\Cart;
use App\Models\Order;
use App\Models\Inventory;
use App\Models\OrderItem;
use Stripe\PaymentIntent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http; // For PayPal API calls

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        // Get orders for the authenticated user with items and product details
        $orders = Order::where('user_id', $user->id)
            ->with('items.product') // Eager load items and their associated products
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        $user = Auth::user();

        // Ensure the order belongs to the authenticated user
        if ($order->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Load order with items and product details
        $order->load('items.product');

        return response()->json($order);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        // If the route is public, Auth::user() might be null. 
        // We explicitly check the sanctum guard to see if a valid token/cookie is present.
        if (!$user) {
            $user = Auth::guard('sanctum')->user();
        }

        $sessionId = $request->header('X-Guest-ID');

    // Log header & request payload for debugging
    Log::info('X-Guest-ID header: ' . $sessionId);
    Log::info('Request payload: ' . json_encode($request->all()));

    if (!$user && !$sessionId) {
        return response()->json(['error' => 'Guest ID required'], 400);
    }

    // Validate
    $validator = Validator::make($request->all(), [
        'address.name' => 'required|string|max:255',
        'address.phone' => 'required|string|max:20',
        'address.street' => 'required|string|max:255',
        'address.city' => 'required|string|max:255',
        'address.zip' => 'required|string|max:10',
        'payment_method' => 'required|string|in:cod,stripe,paypal',
        'stripe_payment_method_id' => 'required_if:payment_method,stripe|string',
        'paypal_order_id' => 'required_if:payment_method,paypal|string',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    // Fetch cart for user or guest
    $cart = Cart::with('items.product')
        ->where(function ($query) use ($user, $sessionId) {
            if ($user) {
                $query->where('user_id', $user->id);
            } else {
                $query->where('guest_id', $sessionId)
                      ->orWhere('session_id', $sessionId);
            }
        })
        ->first();

    if (!$cart || $cart->items->isEmpty()) {
        return response()->json(['error' => 'Cart is empty'], 400);
    }

        $subtotal = $cart->items->sum('price');
        $shipping = 0;
        $discount = 0;
        $total = $subtotal + $shipping - $discount;

        $paymentMethod = $request->input('payment_method');
        $orderStatus = 'pending';
        $stripePaymentId = null;
        $paypalOrderId = null;

        // Stripe payment
        if ($paymentMethod === 'stripe') {
            Stripe::setApiKey(config('services.stripe.secret'));
            try {
                $paymentIntent = PaymentIntent::create([
                    'amount' => (int)($total * 100),
                    'currency' => 'usd',
                    'payment_method' => $request->input('stripe_payment_method_id'),
                    'confirmation_method' => 'manual',
                    'confirm' => true,
                    'return_url' => config('app.url') . '/checkout/success',
                ]);

                if ($paymentIntent->status === 'succeeded') {
                    $orderStatus = 'paid';
                    $stripePaymentId = $paymentIntent->id;
                } else {
                    return response()->json([
                        'error' => 'Stripe payment requires additional action',
                        'payment_intent_client_secret' => $paymentIntent->client_secret
                    ], 402);
                }
            } catch (\Exception $e) {
                return response()->json(['error' => 'Stripe payment failed: '.$e->getMessage()], 400);
            }
        } elseif ($paymentMethod === 'paypal') {
            $paypalOrderId = $request->input('paypal_order_id');
            $orderStatus = 'paid'; // assuming frontend already captured
        }

        $shippingAddress = $request->address;

        $order = Order::create([
            'user_id' => $user ? $user->id : null,
            'subtotal' => $subtotal,
            'shipping' => $shipping,
            'discount' => $discount,
            'total' => $total,
            'shipping_address' => $shippingAddress,
            'payment_method' => $paymentMethod,
            'stripe_payment_id' => $stripePaymentId,
            'paypal_order_id' => $paypalOrderId,
            'status' => $orderStatus,
        ]);

        // Create order items and reduce inventory
        foreach ($cart->items as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item->product_id,
                'qty' => $item->qty,
                'price' => $item->qty > 0 ? $item->price / $item->qty : 0,
            ]);

            $inventory = Inventory::where('product_id', $item->product_id)->first();
            if ($inventory) {
                $inventory->decrement('stock', $item->qty);
            }
        }

        // Clear cart
        $cart->items()->delete();

        return response()->json([
            'message' => 'Order placed successfully',
            'order_id' => $order->id
        ]);
    }



}
