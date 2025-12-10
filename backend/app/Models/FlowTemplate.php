<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FlowTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'xml_file_path',
        'thumbnail_path',
        'tags',
    ];

    protected $casts = [
        'tags' => 'array',
    ];
    //
}
