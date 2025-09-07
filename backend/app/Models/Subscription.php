<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    protected $fillable = ['user_id', 'plan', 'start_date', 'end_date', 'razorpay_payment_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
