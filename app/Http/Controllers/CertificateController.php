<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class CertificateController extends Controller
{
    public function getCertificateDetails()
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'You need to log in to access this resource'], 401);
        }

        $userId = Auth::id(); 

        $certificates = Certificate::where('user_id', $userId)->get();

        if ($certificates->isEmpty()) {
            return response()->json(['message' => 'No certificates found for this user'], 404);
        }

        $certificateDetails = $certificates->map(function ($certificate) {
            $course = Course::find($certificate->course_id);
            return [
                'certificate_id' => $certificate->certificate_id,
                'course_title' => $course ? $course->title : 'Unknown course',
                'issue_at' => $certificate->issue_at,
                'created_at' => $certificate->created_at,
                'updated_at' => $certificate->updated_at,
            ];
        });

        return response()->json($certificateDetails);
    }
}
