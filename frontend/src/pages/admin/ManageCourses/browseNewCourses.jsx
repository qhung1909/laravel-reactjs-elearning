import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    BookOpen,
    Search,
    FileText,
    GraduationCap,
    Clock,
    Users,
    BookCheck,
    ScrollText
} from "lucide-react"
import React, { useEffect, useState } from 'react';
import NewExample from './newExample';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { SideBarUI } from "../sidebarUI";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Filter, FileDown, LayoutDashboard } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import axios from "axios";
import ReactPlayer from "react-player"
import toast from "react-hot-toast"

export default function BrowseNewCourses() {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;

    const [courses, setCourses] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('pending');
    const pendingCount = courses.filter(course => course.status === 'pending').length;
    const pendingLessonsCount = lessons.filter(lesson => lesson.status === 'pending').length;
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("Tất cả");
    const [titleContent, setTitleContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const { slug } = useParams();

    // Fetch courses
    const fetchCourses = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/courses`, {
                headers: {
                    'x-api-secret': API_KEY
                }
            });
            setCourses(res.data);
        } catch (error) {
            console.error('Error fetching pending courses:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch lessons
    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const response = await axios.get(`${API_URL}/lessons`, {
                    headers: {
                        'x-api-secret': API_KEY
                    }
                });
                console.log("Dữ liệu bài học:", response.data);
                const pendingLessons = response.data.filter(lesson => lesson.status === 'pending');
                setLessons(pendingLessons);
                console.log('Fetched Lessons:', pendingLessons); // Log here
            } catch (err) {
                console.error('Error fetching lessons:', err);
            }
        };
        fetchLessons();
    }, []);


    useEffect(() => {
        const fetchData = async () => {

            setLoading(true);
            await Promise.all([fetchCourses(), fetchCategories()]);
            setLoading(false);
        };
        fetchData();
    }, []);


    const [contentLesson, setContentLesson] = useState([]);
    const fetchContentLesson = async (lessonId) => {


        try {
            const res = await axios.get(`${API_URL}/contents`, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                }, params: {
                    lesson_id: lessonId
                }
            });
            if (res.data && res.data.success && Array.isArray(res.data.data)) {
                setContentLesson(res.data.data.filter(content => content.lesson_id === lessonId));
            } else {
                console.error("Dữ liệu không phải là mảng:", res.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy nội dung bài học:", error);
        }
    };

    // Video
    const fetchTitleContent = async () => {
        try {
            const res = await axios.get(`${API_URL}/title-contents`, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                },
            });

            if (res.data && res.data.success) {
                if (Array.isArray(res.data.data)) {
                    setTitleContent(res.data);
                    console.log("Dữ liệu titleContent 2w2w2 22 :", res.data); // Log dữ liệu nhận được
                } else {
                    console.error("Dữ liệu titleContent không phải là mảng:", res.data.data);
                    setTitleContent([]); // Đặt về mảng rỗng nếu không phải là mảng
                }
            } else {
                console.error("Dữ liệu không hợp lệ:", res.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết title_content:", error);
        }
    };

    useEffect(() => {
        fetchTitleContent()
    }, [])

    // Filter courses
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.instructor?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = course.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Filter lessons
    const filteredLessons = lessons.filter(lesson => {
        const matchesSearch = lesson.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lesson.course_title?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = lesson.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${API_URL}/categories`, {
                headers: { 'x-api-secret': API_KEY }
            });
            setCategories([{ course_category_id: 'all', name: 'Tất cả' }, ...res.data]);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }




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
                                    <BreadcrumbLink href="/admin/courses" className="flex items-center gap-1">
                                        <GraduationCap size={16} />
                                        Quản lý khóa học
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/admin/courses/review" className="flex items-center gap-1 text-blue-600">
                                        Duyệt khóa học mới
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <div className="absolute top-14 w-full mx-auto px-6">
                    <h1 className="text-2xl font-bold mb-6">Quản lý phê duyệt nội dung</h1>

                    <Tabs defaultValue="courses" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                            <TabsTrigger value="courses" className="flex items-center gap-2">
                                <GraduationCap className="w-4 h-4" />
                                Duyệt khóa học
                            </TabsTrigger>
                            <TabsTrigger value="lessons" className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                Duyệt bài học
                            </TabsTrigger>
                        </TabsList>

                        {/* Duyệt Khóa Học */}
                        <TabsContent value="courses">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-xl font-semibold">Danh sách khóa học chờ duyệt</h2>
                                    <p className="text-muted-foreground">
                                        Xem xét và phê duyệt thông tin tổng quan của khóa học
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-4 w-full md:w-auto">
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
                                    <Button
                                        variant="outline"
                                        className="flex items-center gap-2"
                                        onClick={() => setStatusFilter('pending')}>
                                        <Filter size={16} />
                                        Chờ duyệt
                                        {pendingCount > 0 && (
                                            <Badge
                                                variant="secondary"
                                                className="ml-1 bg-yellow-100 text-yellow-800 border-yellow-200"
                                            >
                                                {pendingCount}
                                            </Badge>
                                        )}
                                    </Button>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <FileDown size={16} />
                                        Xuất
                                    </Button>
                                </div>
                            </div>

                            {filteredCourses.map((course) => (
                                <div key={course.id} className="grid gap-6">
                                    <Card>
                                        <CardHeader className="flex flex-row items-start justify-between">
                                            <div>
                                                <CardTitle className="text-xl">{course.title}</CardTitle>
                                                <div className="flex gap-2 mt-2">
                                                    <Badge variant="outline">{course.category_name}</Badge>
                                                </div>
                                            </div>
                                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                                {course.status}
                                            </Badge>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="">
                                                <span>{course.description}</span>
                                            </div>
                                            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">

                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4" />
                                                    <span>{course.user?.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    <span>{course.duration || 'N/A'}</span>
                                                </div>
                                            </div>
                                            <Button>Xem chi tiết & Duyệt</Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </TabsContent>

                        {/* Duyệt Bài Học */}
                        <TabsContent value="lessons">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-xl font-semibold">Danh sách bài học chờ duyệt</h2>
                                    <p className="text-muted-foreground">
                                        Xem xét và phê duyệt nội dung chi tiết của từng bài học
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-4 w-full md:w-auto">
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
                                    <Button
                                        variant="outline"
                                        className="flex items-center gap-2"
                                        onClick={() => setStatusFilter('pending')}>
                                        <Filter size={16} />
                                        Chờ duyệt
                                        {pendingCount > 0 && (
                                            <Badge
                                                variant="secondary"
                                                className="ml-1 bg-yellow-100 text-yellow-800 border-yellow-200"
                                            >
                                                {pendingCount}
                                            </Badge>
                                        )}
                                    </Button>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <FileDown size={16} />
                                        Xuất
                                    </Button>
                                </div>
                            </div>
                            <div className="grid gap-6">
                            {lessons.length > 0 ? lessons.map((lesson) => {
    const lessonContent = contentLesson.find(content => content.lesson_id === lesson.lesson_id);
    console.log("lesson.title_content:", lesson.title_content); // Giả định bạn có thuộc tính này
    console.log("Dữ liệu titleContent:", titleContent);

    // Lấy titleContentItems từ titleContent.data
    const titleContentItems = titleContent && titleContent.data ? titleContent.data : [];

    // In ra tất cả các title_content từ titleContentItems
    titleContentItems.forEach(item => {
        console.log("title_content trong titleContent:", item.title_content);
    });

    // Tìm mục trong titleContentItems tương ứng với lesson.title_content
    const titleContentItem = titleContentItems.find(item => item.title_content === lesson.title_content) || null;

    console.log("titleContentItem:", titleContentItem);
    console.log("lesson.course_id:", lesson.course_id);




                                    return (
                                        <Card key={lesson.lesson_id}>
            <CardHeader className="flex flex-row items-start justify-between">
                <div>
                    <div className="text-sm text-muted-foreground mb-1">
                        Thuộc khóa học: Lập trình React Native
                    </div>
                    <CardTitle className="text-xl">Bài {lesson.lesson_id}: {lesson.name}</CardTitle>
                    <div className="flex gap-2 mt-2">
                        <Badge>Bài học</Badge>
                        <Badge variant="outline">15 phút</Badge>
                    </div>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    Chờ duyệt
                </Badge>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>Giảng viên:</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>Bài giảng + Quiz</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <BookCheck className="h-4 w-4" />
                        <span>Kiểm tra nội dung chi tiết và câu hỏi quiz</span>
                    </div>
                </div>

                {/* Hiển thị nội dung của bài học */}
                <div className="text-muted-foreground mb-4">
                    <h4 className="font-semibold">
                        {lessonContent ? lessonContent.name_content : "Đang tải nội dung..."}
                    </h4>

                    {/* Kiểm tra xem có titleContentItem không */}
                    {titleContentItem ? (
                        <div>
                            <p>{titleContentItem.body_content || "Nội dung không có"}</p>
                            {/* Hiển thị video nếu có URL */}
                            {titleContentItem.video_link ? (
                                <ReactPlayer
                                    url={titleContentItem.video_link}
                                    className="absolute top-0 left-0 w-full h-full"
                                    controls={true}
                                    width="100%"
                                    height="100%"
                                />
                            ) : (
                                <p>Đang tải video...</p>
                            )}
                        </div>
                    ) : (
                        <p>Không có nội dung tương ứng...</p>
                    )}
                </div>
                <Button>Xem chi tiết & Duyệt</Button>
            </CardContent>
        </Card>
                                    );
                                }) : (
                                    <div className="text-center py-8 bg-white rounded-xl">
                                        <p className="text-gray-500">Không có bài học nào để hiển thị.</p>
                                    </div>
                                )}
                            </div>



                        </TabsContent>
                    </Tabs>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
