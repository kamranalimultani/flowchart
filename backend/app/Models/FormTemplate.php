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
    ];

    protected $casts = [
        'form_data' => 'array', // JSON <-> array automatically
    ];
}
