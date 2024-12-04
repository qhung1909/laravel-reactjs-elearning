<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $table = 'settings';
    protected $primaryKey = 'id ';
    protected $fillable =
    [
        'title',
        'description',
        'timezone',
        'language',
        'logo_url',
        'favicon',
        'primary_color',
        'secondary_color',
        'meta_title',
        'meta_description',
        'google_analytics_id',
        'facebook_pixel_id',
        'contact_email',
        'phone',
        'address',
        'working_hours',
        'banner_url',
        'default_thumbnail',
        'max_upload_size',
        'allowed_file_types',
        'facebook_url',
        'twitter_url',
        'instagram_url',
        'linkedin_url',
        'youtube_url',
        'api_key',
        'webhook_url',
        'allowed_origins',
        'rate_limit',
        'created_at',
        'updated_at'
    ];
}
