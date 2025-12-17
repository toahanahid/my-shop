<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id', 'status', 'subtotal', 'shipping',
        'discount', 'total', 'payment_method', 'stripe_payment_id', 'paypal_order_id', 'payment_ref', 'shipping_address'
    ];

    protected $casts = [
        'shipping_address' => 'array'
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
