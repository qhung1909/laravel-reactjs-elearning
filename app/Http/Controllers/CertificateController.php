<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
class CertificateController extends Controller
{
    public function getCertificateDetails($certificateId)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'You need to log in to access this resource'], 401);
        }
    
        $userId = Auth::id();
        $user = Auth::user(); // Lấy thông tin user hiện tại
    
        Log::info('User ID: ' . $userId);
        Log::info('Certificate ID: ' . $certificateId);
    
        $certificate = Certificate::where('certificate_id', $certificateId)
            ->where('user_id', $userId)
            ->first();
    
        // Thêm log để xem query
        Log::info('Certificate Query: ' . $certificate);
    
        if (!$certificate) {
            // Thay đổi message để rõ ràng hơn
            return response()->json([
                'message' => 'Certificate not found or you do not have permission to view it',
                'user_id' => $userId,
                'certificate_id' => $certificateId
            ], 403);
        }
    
        $course = Course::find($certificate->course_id);
    
        $certificateDetails = [
            'certificate_id' => $certificate->certificate_id,
            'course_title' => $course ? $course->title : 'Unknown course',
            'student_name' => $user->name, // Thêm tên user
            'student_email' => $user->email, // Có thể thêm email nếu cần
            'issue_at' => $certificate->issue_at,
            'created_at' => $certificate->created_at,
            'updated_at' => $certificate->updated_at,
        ];
    
        return response()->json($certificateDetails);
    }
}
