<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'form_data',
        'user_id', // 🆕 add user_id to fillable

    ];

    protected $casts = [
        'form_data' => 'array', // JSON <-> array automatically
    ];
    // Optional: relation to user
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
