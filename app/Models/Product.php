<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'category_id', 'name', 'slug', 'description',
        'price', 'compare_at_price', 'image', 'active'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class); // make sure the foreign key is correct
    }

    public function inventory()
    {
        return $this->hasOne(Inventory::class);
    }
}
