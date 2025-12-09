<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'content',
        'excerpt',
        'image',
        'user_id',
        'is_published',
    ];

    public function author()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
