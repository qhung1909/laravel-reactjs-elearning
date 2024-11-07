import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, XCircle, Clock, GraduationCap, LayoutDashboard, Book, Filter, Search } from 'lucide-react';
import { SideBarUI } from '../sidebarUI';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Separator } from '@radix-ui/react-context-menu';
import axios from 'axios';
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";


export default function Draft() {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;

    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({});
    const [activeCourse, setActiveCourse] = useState(null);
    const [activeMainTab, setActiveMainTab] = useState('info');
    const [activeLessonTab, setActiveLessonTab] = useState('content');
    const [statusFilter, setStatusFilter] = useState('pending');
    const pendingCount = courses.filter(course => course.status === 'pending').length;
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();


    const fetchCourses = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/courses`, {
                headers: {
                    'x-api-secret': API_KEY,
                },
            });
            const data = res.data;

            const pendingCourses = data.filter(course => course.status === 'pending');
            setCourses(pendingCourses);
            setStats({
                totalCourses: pendingCourses.length,
                totalStudents: pendingCourses.reduce((sum, course) => sum + (course.enrolled_count || 0), 0),
                activeCourses: pendingCourses.length,
            });
        } catch (error) {
            console.error('Lỗi khi tải danh sách khóa học:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const [contentLesson, setContentLesson] = useState([]);
    const fetchContentLesson = async (courseId) => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            toast.error("Bạn chưa đăng nhập.");
            navigate('/');
            return;
        }
        try {
            const res = await axios.get(`${API_URL}/contents`, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    course_id: courseId
                }
            });
            if (res.data && res.data.success && Array.isArray(res.data.data)) {
                setContentLesson(res.data.data.filter(content => content.course_id === courseId));
            } else {
                console.error("Dữ liệu không phải là mảng:", res.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy nội dung bài học:", error);
        }
    };


    const [titleContent, setTitleContent] = useState([]);
    const fetchTitleContent = async (contentId) => {
        const token = localStorage.getItem("access_token");
        try {
            const res = await axios.get(`${API_URL}/title-contents/${contentId}`, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.data && res.data.success) {
                setTitleContent(prev => ({ ...prev, [contentId]: res.data.data }));
            } else {
                console.error("Dữ liệu không hợp lệ:", res.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết title_content:", error);
        }
    };


    // Filter courses
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.instructor?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = course.status === statusFilter;
        return matchesSearch && matchesStatus;
    });



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
                                    <BreadcrumbLink
                                        href="/admin/courses"
                                        className="flex items-center gap-1 text-blue-600"
                                    >
                                        <GraduationCap size={16} />
                                        Quản lý khóa học
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="absolute top-14 px-6 bg-gray-50 w-full">
                    <div className="flex items-center justify-between space-y-0">
                        <h2 className="text-3xl font-bold tracking-tight mb-0">Quản lý duyệt nội dung</h2>
                        <div className="relative flex-1 md:flex-initial">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm khóa học..."
                                className="pl-9 pr-4 py-2 border border-gray-200 rounded-md w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>


                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Left Sidebar */}
                        <div className="lg:w-1/4">
                            <Card className="border shadow-lg">
                                <CardHeader className="pb-3 border-b">
                                    <CardTitle className="flex items-center gap-2">
                                        <div className="flex items-center gap-3">
                                            <Book className="w-6 h-6 text-blue-500" />
                                            <span className="text-base font-medium">Danh sách khóa học chờ duyệt</span>
                                        </div>
                                        <button
                                            size="sm"
                                            className="h-8 px-3"
                                            onClick={() => setStatusFilter('pending')}
                                        >
                                            {pendingCount > 0 && (
                                                <div className="px-2 py-0.5  text-sm font-medium rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
                                                    {pendingCount}
                                                </div>
                                            )}
                                        </button>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <ScrollArea className="h-full pr-4">
                                        <div className="space-y-3">
                                            {filteredCourses.map((course, index) => (
                                                <div
                                                    key={course.id}
                                                    className={`group relative p-4 rounded-xl border cursor-pointer transition-all duration-200
                                                    ${activeCourse?.id === course.id
                                                            ? 'bg-blue-50 border-blue-200 shadow-sm'
                                                            : 'hover:bg-gray-50 hover:border-gray-300'
                                                        }`}
                                                    onClick={() => setActiveCourse(course)}
                                                >
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="font-semibold">{index + 1}</div>
                                                        <h4 className="font-medium text-gray-900">{course.title}</h4>
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        Giảng viên: {course.user.name || 'Không rõ'}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1">
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-2xl font-bold mb-6">
                                        {activeCourse ? activeCourse.title : 'Chọn một khóa học'}
                                    </h3>

                                    {/* Main Tabs */}
                                    <Tabs value={activeMainTab} onValueChange={setActiveMainTab}>
                                        <TabsList className="mb-4">
                                            <TabsTrigger value="info">Thông tin khóa học</TabsTrigger>
                                            <TabsTrigger value="lessons">Danh sách bài học</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="info">
                                            {activeCourse ? (
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="font-semibold">Giảng viên:</label>
                                                        <p>{activeCourse.instructor}</p>
                                                    </div>
                                                    <div>
                                                        <label className="font-semibold">Mô tả:</label>
                                                        <p>{activeCourse.description}</p>
                                                    </div>
                                                    <div>
                                                        <label className="font-semibold">Thời lượng:</label>
                                                        <p>{activeCourse.duration}</p>
                                                    </div>
                                                    <div>
                                                        <label className="font-semibold">Cấp độ:</label>
                                                        <p>{activeCourse.level}</p>
                                                    </div>
                                                    <div>
                                                        <label className="font-semibold">Yêu cầu tiên quyết:</label>
                                                        <p>{activeCourse.prerequisites}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p>Thông tin khóa học sẽ xuất hiện ở đây.</p>
                                            )}
                                        </TabsContent>

                                        <TabsContent value="lessons">
                                            {activeCourse ? (
                                                <div className="space-y-4">
                                                    <h4 className="font-semibold">Chi tiết bài học</h4>

                                                    {/* Lesson Content Tabs */}
                                                    <Tabs value={activeLessonTab} onValueChange={setActiveLessonTab}>
                                                        <TabsList>
                                                            <TabsTrigger value="content">Nội dung bài học</TabsTrigger>
                                                            <TabsTrigger value="video">Video bài giảng</TabsTrigger>
                                                            <TabsTrigger value="quiz">Câu hỏi Quiz</TabsTrigger>
                                                        </TabsList>

                                                        {/* Nội dung bài học */}
                                                        <TabsContent value="content" className="mt-4">
                                                            {contentLesson.map((lesson) => (
                                                                <Dialog key={lesson.id}>
                                                                    <DialogTrigger>{lesson.name_content}</DialogTrigger>
                                                                    <DialogContent>
                                                                        <DialogHeader>
                                                                            <DialogTitle>{lesson.name_content}</DialogTitle>
                                                                            <DialogDescription>
                                                                                {lesson.body_content || "Nội dung không có sẵn."}
                                                                            </DialogDescription>
                                                                        </DialogHeader>
                                                                    </DialogContent>
                                                                </Dialog>
                                                            ))}
                                                        </TabsContent>

                                                        {/* Video bài giảng */}
                                                        <TabsContent value="video" className="mt-4">
                                                            {contentLesson.map((lesson) =>
                                                                lesson.video_link ? (
                                                                    <div key={lesson.id} className="aspect-video bg-gray-100 rounded-lg">
                                                                        <iframe
                                                                            className="w-full h-64 md:h-80"
                                                                            src={lesson.video_link}
                                                                            title={`Video bài giảng ${lesson.name_content}`}
                                                                            frameBorder="0"
                                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                            allowFullScreen
                                                                        ></iframe>
                                                                    </div>
                                                                ) : (
                                                                    <p key={lesson.id} className="text-gray-500">
                                                                        Video không có sẵn.
                                                                    </p>
                                                                )
                                                            )}
                                                        </TabsContent>

                                                        {/* Câu hỏi Quiz */}
                                                        <TabsContent value="quiz" className="mt-4">
                                                            <div className="space-y-4">
                                                                <p className="font-medium">Câu hỏi 1: React được phát triển bởi công ty nào?</p>
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center">
                                                                        <input type="radio" name="q1" id="q1a" className="mr-2" />
                                                                        <label htmlFor="q1a">Facebook (Meta)</label>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <input type="radio" name="q1" id="q1b" className="mr-2" />
                                                                        <label htmlFor="q1b">Google</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </TabsContent>
                                                    </Tabs>
                                                </div>
                                            ) : (
                                                <p>Chi tiết bài học sẽ xuất hiện ở đây.</p>
                                            )}
                                        </TabsContent>

                                    </Tabs>

                                    {/* Action Buttons */}
                                    <div className="flex gap-4 mt-6">
                                        <Button className="bg-green-500 hover:bg-green-600">
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            Phê duyệt Bài học
                                        </Button>
                                        <Button variant="destructive">
                                            <XCircle className="mr-2 h-4 w-4" />
                                            Từ chối Bài học
                                        </Button>
                                        <Button variant="outline" className="bg-yellow-500 hover:bg-yellow-600 text-white border-none">
                                            <Clock className="mr-2 h-4 w-4" />
                                            Yêu cầu chỉnh sửa
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
