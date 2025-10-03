<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormResponse extends Model
{
    use HasFactory;

    protected $fillable = [
        'flow_id',
        'form_template_id',
        'node_id',
        'response',
        'user_id',
    ];

    protected $casts = [
        'response' => 'array',
    ];

    // Relations
    public function flow()
    {
        return $this->belongsTo(Flow::class);
    }

    public function formTemplate()
    {
        return $this->belongsTo(FormTemplate::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

