<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SharedFlow extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'flow_id', 'share_uuid'];
}
