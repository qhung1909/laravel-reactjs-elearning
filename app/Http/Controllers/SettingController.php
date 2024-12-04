<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Setting;

class SettingController extends Controller
{   
    public function __construct() {
        $this->middleware(function ($request, $next) {
            if (!auth()->check()) {
                return response()->json(['message' => 'Unauthenticated'], 401);
            }
            
            if (auth()->user()->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            
            return $next($request);
        });
    }
    public function index()
    {
        $settings = Setting::first();
        return response()->json($settings);
    }

    public function update(Request $request)
    {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $settings = Setting::first();
            if (!$settings) {
                $settings = new Setting();
            }
            $validated = $request->validate([
                'title' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'timezone' => 'nullable|string|max:50',
                'language' => 'nullable|string|max:10',
                'email_notifications' => 'nullable|boolean',
                'logo_url' => 'nullable|string|max:255',
                'favicon' => 'nullable|string|max:255',
                'primary_color' => 'nullable|string|max:7',
                'secondary_color' => 'nullable|string|max:7',
                'meta_title' => 'nullable|string|max:255',
                'meta_description' => 'nullable|string',
                'google_analytics_id' => 'nullable|string|max:50',
                'facebook_pixel_id' => 'nullable|string|max:50',
                'contact_email' => 'nullable|email|max:255',
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string',
                'working_hours' => 'nullable|string|max:255',
                'banner_url' => 'nullable|string|max:255',
                'default_thumbnail' => 'nullable|string|max:255',
                'max_upload_size' => 'nullable|integer',
                'allowed_file_types' => 'nullable|json',
                'facebook_url' => 'nullable|string|max:255',
                'twitter_url' => 'nullable|string|max:255',
                'instagram_url' => 'nullable|string|max:255',
                'linkedin_url' => 'nullable|string|max:255',
                'youtube_url' => 'nullable|string|max:255',
                'api_key' => 'nullable|string|max:255',
                'webhook_url' => 'nullable|string|max:255',
                'allowed_origins' => 'nullable|string|max:255',
                'rate_limit' => 'nullable|integer'
            ]);

            foreach ($validated as $key => $value) {
                if ($request->has($key)) {
                    $settings->$key = $value;
                }
            }

            $settings->save();

            return response()->json([
                'message' => 'Settings updated successfully',
                'data' => $settings
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
