<?php

namespace App\Http\Controllers\Api\Backend;

use App\Http\Controllers\Controller; // ✅ must import this
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Order;
use App\Models\User;

class DashboardController extends Controller
{
    // ✅ Constructor with middleware
    public function __construct()
    {
        $this->middleware(['auth:sanctum', 'isAdmin']);
    }

    public function index()
    {
        $totalProducts = Product::count();
        $totalOrders = Order::count();
        $pendingOrders = Order::where('status', 'pending')->count();
        $totalUsers = User::where('is_admin', false)->count();

        return response()->json([
            'totalProducts' => $totalProducts,
            'totalOrders' => $totalOrders,
            'pendingOrders' => $pendingOrders,
            'totalUsers' => $totalUsers,
        ]);
    }
}
