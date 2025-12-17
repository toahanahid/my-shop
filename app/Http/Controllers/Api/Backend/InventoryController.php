<?php

namespace App\Http\Controllers\Api\Backend;

use App\Models\Inventory;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class InventoryController extends Controller
{
    // Get all inventory records
    public function index()
    {
        return response()->json(Inventory::with('product')->get());
    }

    // Store new inventory entry
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id'   => 'required|exists:products,id',
            'quantity'     => 'required|numeric|min:1',
            'type'         => 'required|in:in,out', // stock in or out
            'notes'        => 'nullable|string',
        ]);

        $inventory = Inventory::create($validated);

        return response()->json([
            'message'   => 'Inventory entry created successfully',
            'inventory' => $inventory,
        ], 201);
    }

    // Show inventory details
    public function show($id)
    {
        $inventory = Inventory::with('product')->findOrFail($id);
        return response()->json($inventory);
    }

    // Update inventory
    public function update(Request $request, $id)
    {
        $inventory = Inventory::findOrFail($id);

        $validated = $request->validate([
            'product_id'   => 'required|exists:products,id',
            'quantity'     => 'required|numeric|min:1',
            'type'         => 'required|in:in,out',
            'notes'        => 'nullable|string',
        ]);

        $inventory->update($validated);

        return response()->json([
            'message'   => 'Inventory updated successfully',
            'inventory' => $inventory,
        ]);
    }

    // Delete inventory record
    public function destroy($id)
    {
        $inventory = Inventory::findOrFail($id);
        $inventory->delete();

        return response()->json(['message' => 'Inventory deleted successfully']);
    }
}
