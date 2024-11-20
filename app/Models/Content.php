<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
class Content extends Model
{
    use HasFactory;
    protected $table = 'contents';
    protected $primaryKey = 'content_id';
    protected $fillable = [
        'course_id',
        'name_content',
        'status',
        'created_at',
        'updated_at',
        'is_online_meeting'

    ];
    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function titleContents()
    {
        return $this->hasMany(TitleContent::class, 'content_id', 'content_id');
    }
    public function deleteWithTitleContents()
    {
        try {
            if (!$this->exists) {
                throw new \Exception("Content không tồn tại");
            }

            $contentExists = Content::where('content_id', $this->content_id)->exists();
            if (!$contentExists) {
                throw new \Exception("Content với ID {$this->content_id} không tồn tại");
            }

            DB::beginTransaction();

            $titleContentsCount = $this->titleContents()->count();
            $this->titleContents()->delete();

            $this->delete();

            DB::commit();

            return [
                'success' => true,
                'message' => "Đã xóa content và $titleContentsCount title contents liên quan"
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
}
