<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\OnlineMeeting;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use App\Models\Content;

class OnlineMeetingController extends Controller
{
    public function createMeeting(Request $request, $content_id)
    {
        $validator = Validator::make($request->all(), [
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
        ], [
            'start_time.required' => 'Thời gian bắt đầu là bắt buộc.',
            'end_time.required' => 'Thời gian kết thúc là bắt buộc.',
            'end_time.after' => 'Thời gian kết thúc phải sau thời gian bắt đầu.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 422);
        }

        $content = Content::find($content_id);
        if (!$content) {
            return response()->json([
                'success' => false,
                'message' => 'Content ID không tồn tại.'
            ], 404);
        }

        $existingMeeting = OnlineMeeting::where('content_id', $content_id)->first();
        if ($existingMeeting) {
            return response()->json([
                'success' => false,
                'message' => 'Content ID này đã được sử dụng cho một cuộc họp.'
            ], 409);
        }

        try {
            $meetingUrl = 'http://localhost:5173/jitsitest/' . Str::uuid();

            $onlineMeeting = new OnlineMeeting([
                'content_id' => $content_id,
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
                'meeting_url' => $meetingUrl,
            ]);
            $onlineMeeting->save();

            return response()->json([
                'success' => true,
                'message' => 'Tạo cuộc họp trực tuyến thành công.',
                'data' => $onlineMeeting
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi: ' . $e->getMessage()
            ], 500);
        }
    }

    
    public function getMeetingByUuid($uuid)
    {
        $onlineMeeting = OnlineMeeting::where('meeting_url', 'like', "%$uuid")->first();

        if (!$onlineMeeting) {
            return response()->json([
                'success' => false,
                'message' => 'Cuộc họp không tồn tại.'
            ], 404);
        }

        $data = [
            'meeting_id' => $onlineMeeting->meeting_id,
            'content_id' => $onlineMeeting->content_id,
        ];

        return response()->json([
            'success' => true,
            'message' => 'Lấy thông tin cuộc họp thành công.',
            'data' => $data
        ], 200);
    }
}
