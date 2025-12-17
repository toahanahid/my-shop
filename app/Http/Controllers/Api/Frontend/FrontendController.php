<?php

namespace App\Http\Controllers\Api\Frontend;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class FrontendController extends Controller
{
    public function products()
    {
        $products = Product::all(['id', 'name', 'price', 'image']);
        return response()->json(['products' => $products]);
    }
}
