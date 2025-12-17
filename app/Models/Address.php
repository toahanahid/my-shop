<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $fillable = [
        'user_id', 'type', 'name', 'phone',
        'line1', 'line2', 'city', 'state',
        'postcode', 'country'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
