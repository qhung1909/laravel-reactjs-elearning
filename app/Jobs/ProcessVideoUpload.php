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
use Aws\S3\S3Client;
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

    protected function handleVideoUpload($file, $titleContent)
    {
        // Khởi tạo S3 client
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

        // Xóa video cũ nếu tồn tại
        if ($titleContent->video_link) {
            try {
                // Lấy key từ URL cũ
                $oldKey = str_replace(env('AWS_URL'), '', $titleContent->video_link);
                $s3->deleteObject([
                    'Bucket' => env('AWS_BUCKET'),
                    'Key'    => $oldKey,
                ]);
            } catch (\Exception $e) {
                Log::error('Error deleting old video: ' . $e->getMessage());
            }
        }

        // Chuẩn bị thông tin file mới
        $filePath = $file->getRealPath();
        $contentId = $titleContent->content_id;
        $titleContentId = $titleContent->title_content_id;
        $originalFileName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $extension = $file->getClientOriginalExtension();
        $newFileName = "content_{$contentId}_title_{$titleContentId}_{$originalFileName}.{$extension}";
        $key = 'videos/' . $newFileName;

        // Xác định content type cho video
        $contentType = match ($extension) {
            'mp4' => 'video/mp4',
            'mov' => 'video/quicktime',
            'avi' => 'video/x-msvideo',
            'wmv' => 'video/x-ms-wmv',
            default => 'video/mp4',
        };

        try {
            // Upload file lên S3
            $result = $s3->putObject([
                'Bucket' => env('AWS_BUCKET'),
                'Key'    => $key,
                'SourceFile' => $filePath,
                'ContentType' => $contentType,
                'ACL' => 'public-read',
            ]);

            return $result['ObjectURL'];
        } catch (\Exception $e) {
            throw new \Exception('Không thể upload video lên S3: ' . $e->getMessage());
        }
    }

    public function failed(\Exception $exception)
    {
        Log::error('Video processing job failed', [
            'title_content_id' => $this->titleContentId,
            'error' => $exception->getMessage()
        ]);
    }
}