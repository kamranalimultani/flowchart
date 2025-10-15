<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $fillable = [
        'user_id',
        'company_name',
        'industry',
        'website',
        'subscription_id',
        'subscription_type',
        'status',
    ];
    public function users()
    {
        return $this->hasMany(User::class);
    }
}
