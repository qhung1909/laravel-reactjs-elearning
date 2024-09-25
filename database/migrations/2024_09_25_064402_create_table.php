<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id('user_id');
            $table->string('email')->unique();
            $table->string('name')->nullable();
            $table->string('password');
            $table->string('google_id')->nullable();
            $table->string('role')->nullable();
            $table->string('avatar')->nullable();
            $table->boolean('status')->default(1);
            $table->timestamps(0); 
        });

        Schema::create('categories', function (Blueprint $table) {
            $table->id('course_categories_id');
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamps(0); 
        });

        Schema::create('coupons', function (Blueprint $table) {
            $table->id('coupons_id');
            $table->string('name_coupon');
            $table->decimal('discount_price', 10, 2)->nullable();
            $table->decimal('percent_discount', 5, 2)->nullable();
            $table->decimal('max_discount', 10, 2)->nullable();
            $table->timestamp('start_discount')->nullable();
            $table->timestamp('end_discount')->nullable();
        });

        Schema::create('courses', function (Blueprint $table) {
            $table->id('course_id');
            $table->foreignId('course_category_id')->constrained('categories', 'course_categories_id')->onDelete('cascade');
            $table->string('title');
            $table->decimal('price', 10, 2);
            $table->text('description')->nullable();
            $table->timestamps(0); 
        });

        Schema::create('comments', function (Blueprint $table) {
            $table->id('comment_id');
            $table->foreignId('user_id')->constrained('users', 'user_id')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses', 'course_id')->onDelete('cascade');
            $table->text('content')->nullable();
            $table->decimal('rating', 3, 2)->nullable();
            $table->timestamps(0); 
        });

        Schema::create('lessons', function (Blueprint $table) {
            $table->id('lesson_id');
            $table->foreignId('course_id')->constrained('courses', 'course_id')->onDelete('cascade');
            $table->string('name');
            $table->text('content')->nullable();
            $table->text('description')->nullable();
            $table->timestamps(0); 
        });

        Schema::create('quizzes', function (Blueprint $table) {
            $table->id('quiz_id');
            $table->foreignId('course_id')->constrained('courses', 'course_id')->onDelete('cascade');
            $table->foreignId('lesson_id')->constrained('lessons', 'lesson_id')->onDelete('cascade');
            $table->string('title');
            $table->timestamps(0); 
        });

        Schema::create('quizzes_questions', function (Blueprint $table) {
            $table->id('question_id');
            $table->foreignId('quiz_id')->constrained('quizzes', 'quiz_id')->onDelete('cascade');
            $table->text('question')->nullable();
            $table->timestamps(0); 
        });

        Schema::create('quiz_answers', function (Blueprint $table) {
            $table->id('answer_id');
            $table->foreignId('user_id')->constrained('users', 'user_id')->onDelete('cascade');
            $table->foreignId('question_id')->constrained('quizzes_questions', 'question_id')->onDelete('cascade');
            $table->text('answer')->nullable();
            $table->boolean('is_correct')->default(0);
            $table->timestamps(0); 
        });

        Schema::create('progress', function (Blueprint $table) {
            $table->id('progress_id');
            $table->foreignId('user_id')->constrained('users', 'user_id')->onDelete('cascade');
            $table->foreignId('lesson_id')->constrained('lessons', 'lesson_id')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses', 'course_id')->onDelete('cascade');
            $table->boolean('is_complete')->default(0);
            $table->timestamp('complete_at')->nullable();
            $table->decimal('progress_percent', 5, 2)->default(0);
            $table->timestamp('complete_update')->nullable();
        });

        Schema::create('certificates', function (Blueprint $table) {
            $table->id('certificate_id');
            $table->foreignId('user_id')->constrained('users', 'user_id')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses', 'course_id')->onDelete('cascade');
            $table->timestamp('issue_at')->nullable();
            $table->timestamps(0); 
        });

        Schema::create('enrolls', function (Blueprint $table) {
            $table->id('enroll_id');
            $table->foreignId('user_id')->constrained('users', 'user_id')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses', 'course_id')->onDelete('cascade');
            $table->timestamps(0); 
        });

        Schema::create('orders', function (Blueprint $table) {
            $table->id('order_id');
            $table->foreignId('user_id')->constrained('users', 'user_id')->onDelete('cascade');
            $table->foreignId('coupon_id')->nullable()->constrained('coupons', 'coupons_id')->onDelete('set null'); // Thêm set null
            $table->decimal('total_price', 10, 2);
            $table->string('status')->nullable();
            $table->timestamps(0); 
        });

        Schema::create('order_detail', function (Blueprint $table) {
            $table->id('order_detail_id');
            $table->foreignId('order_id')->constrained('orders', 'order_id')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses', 'course_id')->onDelete('cascade');
            $table->decimal('price', 10, 2);
            $table->timestamps(0); 
        });
    }

    public function down()
    {
        Schema::dropIfExists('order_detail');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('coupons');
        Schema::dropIfExists('enrolls');
        Schema::dropIfExists('certificates');
        Schema::dropIfExists('progress');
        Schema::dropIfExists('quiz_answers');
        Schema::dropIfExists('quizzes_questions');
        Schema::dropIfExists('quizzes');
        Schema::dropIfExists('lessons');
        Schema::dropIfExists('comments');
        Schema::dropIfExists('courses');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('users');
    }
};
