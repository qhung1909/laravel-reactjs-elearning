<?php

namespace App\Http\Controllers;

use Aws\S3\S3Client;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
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

            if ($request->hasFile('logo')) {
                $settings->logo_url = $this->handleFileUpload($request->file('logo'), 'logo');
            }
            
            if ($request->hasFile('favicon')) {
                $settings->favicon = $this->handleFileUpload($request->file('favicon'), 'favicon');
            }
            
            if ($request->hasFile('banner')) {
                $settings->banner_url = $this->handleFileUpload($request->file('banner'), 'banner');
            }
            
            if ($request->hasFile('default_thumbnail')) {
                $settings->default_thumbnail = $this->handleFileUpload($request->file('default_thumbnail'), 'thumbnail');
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

    private function handleFileUpload($file, $type)
    {
        $s3 = new S3Client([
            'region'  => env('AWS_DEFAULT_REGION'),
            'version' => 'latest',
            'credentials' => [
                'key'    => env('AWS_ACCESS_KEY_ID'),
                'secret' => env('AWS_SECRET_ACCESS_KEY'),
            ],
            'http' => [
                'verify' => env('VERIFY_URL'),
            ],
        ]);

        $filePath = $file->getRealPath();
        $originalFileName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $extension = $file->getClientOriginalExtension();
        $newFileName = "settings.{$type}.{$originalFileName}.{$extension}";
        $key = 'settings/' . $newFileName;

        $contentType = match ($extension) {
            'jpg', 'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'ico' => 'image/x-icon',
            'svg' => 'image/svg+xml',
            default => 'application/octet-stream',
        };

        try {
            $result = $s3->putObject([
                'Bucket' => env('AWS_BUCKET'),
                'Key'    => $key,
                'SourceFile' => $filePath,
                'ContentType' => $contentType,
                'ACL' => 'public-read',
            ]);

            return $result['ObjectURL'];
        } catch (\Exception $e) {
            throw new \Exception("Could not upload {$type} to S3: " . $e->getMessage());
        }
    }
}
