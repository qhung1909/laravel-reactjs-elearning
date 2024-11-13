<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\TitleContent;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;

class ProcessVideoUpload implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $titleContent;
    protected $videoPath;
    protected $contentId;
    protected $titleContentId;
    protected $updateData;

    public function __construct($titleContentId, $contentId, $videoPath, array $updateData)
    {
        $this->titleContentId = $titleContentId;
        $this->contentId = $contentId;
        $this->videoPath = $videoPath;
        $this->updateData = $updateData;
    }

    public function handle()
    {
        try {
            Log::info('Starting video processing job', [
                'title_content_id' => $this->titleContentId,
                'content_id' => $this->contentId
            ]);

            $titleContent = TitleContent::where('title_content_id', $this->titleContentId)
                ->where('content_id', $this->contentId)
                ->first();

            if (!$titleContent) {
                Log::error('TitleContent not found in job', [
                    'title_content_id' => $this->titleContentId,
                    'content_id' => $this->contentId
                ]);
                return;
            }

            // Xử lý video và cập nhật
            $this->updateData['video_link'] = $this->handleVideoUpload($this->videoPath, $titleContent);
            
            $titleContent->update($this->updateData);

            Log::info('Video processing completed successfully', [
                'title_content_id' => $this->titleContentId
            ]);
        } catch (\Exception $e) {
            Log::error('Error processing video in job', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    protected function handleVideoUpload($videoPath, $titleContent)
    {
        // Copy logic từ controller của bạn vào đây
        // Đảm bảo xử lý file từ temporary path
        // Return đường dẫn video sau khi xử lý
    }

    public function failed(\Exception $exception)
    {
        Log::error('Video processing job failed', [
            'title_content_id' => $this->titleContentId,
            'error' => $exception->getMessage()
        ]);
    }
}