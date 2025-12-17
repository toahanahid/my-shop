<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Inventory;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = Category::all();

        if ($categories->isEmpty()) {
            $this->command->info('No categories found, seeding categories first.');
            $this->call(CategorySeeder::class);
            $categories = Category::all();
        }

        Product::factory(100)->make()->each(function ($product) use ($categories) {
            $product->category_id = $categories->random()->id;
            $product->save();

            Inventory::create([
                'product_id' => $product->id,
                'stock' => rand(0, 100),
            ]);
        });
    }
}
