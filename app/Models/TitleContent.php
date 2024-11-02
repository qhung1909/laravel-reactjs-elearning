<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TitleContent extends Model
{
    use HasFactory;

    protected $table = 'title_content';
    protected $primaryKey = 'title_content_id';

    protected $fillable = ['body_content', 'content_id', 'video_link', 'document_link', 'description','status','created_at', 'updated_at'];

    public function content()
    {
        return $this->belongsTo(Content::class, 'content_id', 'content_id');
    }
}
