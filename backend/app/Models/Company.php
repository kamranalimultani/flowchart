<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $fillable = ['user_id', 'company_name', 'industry', 'website'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
