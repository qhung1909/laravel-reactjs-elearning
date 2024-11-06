import React, { useState } from 'react';
import { CheckCircle, XCircle, CircleAlert, Play, Pause, LayoutDashboard, GraduationCap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { SideBarUI } from '../sidebarUI';
import { Separator } from '@radix-ui/react-context-menu';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '@/components/ui/breadcrumb';



const courses = [
    {
        id: 1,
        title: 'Khóa học React cơ bản',
        instructor: 'Nguyễn Văn A',
        status: 'pending',
        description: 'Khóa học này sẽ giúp bạn làm quen với React...',
        duration: '10 giờ',
        level: 'Cơ bản',
        prerequisites: 'Kiến thức cơ bản về HTML, CSS, và JavaScript'
    },
    {
        id: 2,
        title: 'Lập trình Python nâng cao',
        instructor: 'Trần Thị B',
        status: 'pending',
        description: 'Khám phá các tính năng nâng cao của Python...',
        duration: '15 giờ',
        level: 'Nâng cao',
        prerequisites: 'Kiến thức cơ bản về Python'
    },
];

const lessons = [
    {
        id: 1,
        courseId: 1,
        title: 'Giới thiệu về React',
        content: 'React là một thư viện JavaScript để xây dựng giao diện người dùng...',
        videoUrl: 'https://example.com/video1.mp4',
        duration: '45 phút',
        quizzes: [
            { id: 1, question: 'React là gì?', options: ['Framework', 'Library', 'Language', 'Platform'], correctAnswer: 1 },
        ]
    },
];

export default function Draft() {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleCourseSelect = (course) => {
        setSelectedCourse(course);
        setSelectedLesson(null);
    };

    const handleApprove = () => {
        alert('Đã phê duyệt!');
    };

    const handleReject = () => {
        alert('Đã từ chối!');
    };

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <SidebarProvider>
        <SideBarUI />
        <SidebarInset>
            <header className="z-10 absolute left-1 top-3">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="/" className="flex items-center gap-1">
                                    <LayoutDashboard size={16} />
                                    Dashboard
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/admin/courses" className="flex items-center gap-1 text-blue-600">
                                    <GraduationCap size={16} />
                                    Quản lý khóa học
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>

            <div className="absolute top-14 px-6 bg-gray-50 w-full">
                <h1 className="text-2xl font-bold mb-4">Quản lý duyệt nội dung</h1>
                <div className="flex">
                    <div className="w-1/3 pr-4">
                        <h2 className="text-xl font-semibold mb-2">Danh sách khóa học chờ duyệt</h2>
                        <ul className="space-y-2">
                            {courses.map(course => (
                                <li
                                    key={course.id}
                                    className={`p-2 border rounded cursor-pointer ${selectedCourse?.id === course.id ? 'bg-blue-100' : ''}`}
                                    onClick={() => handleCourseSelect(course)}
                                >
                                    {course.title} - {course.instructor}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="w-2/3">
                        {selectedCourse && (
                            <div>
                                <h2 className="text-xl font-semibold mb-2">{selectedCourse.title}</h2>
                                <p className="mb-2"><strong>Giảng viên:</strong> {selectedCourse.instructor}</p>
                                <p className="mb-2"><strong>Thời gian:</strong> {selectedCourse.duration}</p>
                                <p className="mb-2"><strong>Cấp độ:</strong> {selectedCourse.level}</p>
                                <p className="mb-2"><strong>Yêu cầu:</strong> {selectedCourse.prerequisites}</p>
                                <p className="mb-4"><strong>Mô tả:</strong> {selectedCourse.description}</p>
                                <Tabs defaultValue="content">
                                    <TabsList className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                                        <TabsTrigger value="content">Nội dung bài học</TabsTrigger>
                                        <TabsTrigger value="video">Video bài giảng</TabsTrigger>
                                        <TabsTrigger value="quiz">Câu hỏi Quiz</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="content" className="mt-2">
                                        <h3 className="text-lg font-semibold mb-2">Nội dung bài học</h3>
                                        {selectedLesson ? (
                                            <div>
                                                <h4 className="font-medium">{selectedLesson.title}</h4>
                                                <p>{selectedLesson.content}</p>
                                            </div>
                                        ) : (
                                            <p>Vui lòng chọn một bài học để xem nội dung</p>
                                        )}
                                    </TabsContent>
                                    <TabsContent value="video" className="mt-2">
                                        <h3 className="text-lg font-semibold mb-2">Video bài giảng</h3>
                                        {selectedLesson ? (
                                            <div>
                                                <div className="aspect-w-16 aspect-h-9 mb-4">
                                                    <video src={selectedLesson.videoUrl} controls className="w-full h-full object-cover rounded" />
                                                </div>
                                                <button
                                                    onClick={togglePlayPause}
                                                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                >
                                                    {isPlaying ? (
                                                        <>
                                                            <Pause className="h-5 w-5 mr-2" />
                                                            Tạm dừng
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Play className="h-5 w-5 mr-2" />
                                                            Phát
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        ) : (
                                            <p>Vui lòng chọn một bài học để xem video</p>
                                        )}
                                    </TabsContent>
                                    <TabsContent value="quiz" className="mt-2">
                                        <h3 className="text-lg font-semibold mb-2">Câu hỏi Quiz</h3>
                                        {selectedLesson ? (
                                            <ul className="space-y-2">
                                                {selectedLesson.quizzes.map(quiz => (
                                                    <li key={quiz.id} className="border p-2 rounded">
                                                        <p className="font-medium">{quiz.question}</p>
                                                        <ul className="ml-4 list-disc">
                                                            {quiz.options.map((option, index) => (
                                                                <li key={index} className={index === quiz.correctAnswer ? 'text-green-600' : ''}>
                                                                    {option}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>Vui lòng chọn một bài học để xem câu hỏi quiz</p>
                                        )}
                                    </TabsContent>
                                </Tabs>
                                <div className="mt-4 flex space-x-2">
                                    <button
                                        onClick={handleApprove}
                                        className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                    >
                                        <CheckCircle className="h-5 w-5 mr-2" />
                                        Phê duyệt
                                    </button>
                                    <button
                                        onClick={handleReject}
                                        className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        <XCircle className="h-5 w-5 mr-2" />
                                        Từ chối
                                    </button>
                                    <button className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                                        <CircleAlert className="h-5 w-5 mr-2" />
                                        Yêu cầu chỉnh sửa
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </SidebarInset>
        </SidebarProvider>
    );
}
