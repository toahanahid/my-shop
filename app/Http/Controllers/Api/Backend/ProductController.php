<?php

namespace App\Http\Controllers\Api\Backend;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ProductController extends Controller
{
    // Get all products
    public function index()
    {
        $products = Product::with('category')->get();
        $categories = Category::all();

        return response()->json([
            'products' => $products,
            'categories' => $categories
        ]);
    }


    // Store new product
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'            => 'required|string|max:255',
            'slug'            => 'required|string|max:255|unique:products,slug',
            'category_id'     => 'required|exists:categories,id',
            'description'     => 'nullable|string',
            'price'           => 'required|numeric|min:0',
            'compare_at_price'=> 'nullable|numeric|min:0',
            'image'           => 'nullable|image|mimes:jpg,jpeg,png,gif,webp|max:2048',
            'active'          => 'boolean',
        ]);

        $validated['slug'] = Str::slug($request->name);

        $product = Product::create($validated);

        // Handle image uploads
        if ($request->hasFile('image')) {
            $imageName = time().$request->image->extension();
            $request->image->move(public_path('uploads/products/'), $imageName);
            $product->image = $imageName;
        }

        // Save product again after assigning images
        $product->save();

        return response()->json([
            'message' => 'Product created successfully',
            'product' => $product,
        ], 201);
    }

    // Show single product
    public function show($id)
    {
        $product = Product::findOrFail($id);
        return response()->json($product);
    }

    // Update product
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name'            => 'required|string|max:255',
            'slug'            => 'required|string|max:255|unique:products,slug,' . $id,
            'category_id'     => 'required|exists:categories,id',
            'description'     => 'nullable|string',
            'price'           => 'required|numeric|min:0',
            'compare_at_price'=> 'nullable|numeric|min:0',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'active'          => 'boolean',
        ]);

        $validated['slug'] = Str::slug($request->name);

        if ($request->hasFile('image')) {
            // delete old image
            if ($product->image && file_exists(public_path('uploads/products/' . $product->image))) {
                unlink(public_path('uploads/products/' . $product->image));
            }

            $imageName = time() . '.' . $request->image->extension();
            $request->image->move(public_path('uploads/products'), $imageName);

            $validated['image'] = $imageName;
        }

        $product->update($validated);

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product,
        ]);
    }

    // Delete product
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }
}
