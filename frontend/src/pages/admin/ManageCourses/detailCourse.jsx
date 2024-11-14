import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from "react";

import axios from "axios";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"

import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import { SideBarUI } from '../sidebarUI';
import { GraduationCap, LayoutDashboard, BookOpenText, School } from 'lucide-react';
import { Separator } from '@radix-ui/react-context-menu';
import { formatCurrency } from "@/components/Formatcurrency/formatCurrency";

import ReactPlayer from 'react-player';
import toast, { Toaster } from 'react-hot-toast';
export default function DetailCourse() {
    const { course_id } = useParams();
    console.log("Course ID from URL:", course_id);

    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;

    const [courses, setCourses] = useState([]);
    const [course, setCourse] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalStudents: 0,
        activeCourses: 0
    });

    const fetchCourses = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await axios.get(`${API_URL}/admin/courses`, {
                headers: { 'x-api-secret': API_KEY }
            });
            const data = res.data;

            console.log("Dữ liệu trả về từ API:", data);

            const courseId = Number(course_id);  // Chuyển đổi course_id từ URL thành số
            const selectedCourse = data.find(course => {
                console.log("So sánh course_id từ URL:", courseId, "với course.course_id trong dữ liệu:", course.course_id);
                return course.course_id === courseId;
            });

            if (!selectedCourse) {
                setError('Không tìm thấy khóa học');
                return;
            }

            console.log("Khóa học được chọn từ API:", selectedCourse);

            setCourses(data);
            setStats({
                totalCourses: data.length,
                totalStudents: data.reduce((sum, course) => sum + (course.enrolled_count || 0), 0),
                activeCourses: data.filter(course => course.status === "pending").length
            });

            setCourse(selectedCourse);

            const uniqueStatuses = [...new Set(data.map(course => course.status))];
            const statusOptionsWithColors = uniqueStatuses.map(status => ({
                value: status,
                color: getStatusColorByValue(status)
            }));
            setStatusOptions(statusOptionsWithColors);



        } catch (error) {
            setError('Không thể tải thông tin khóa học');
            console.error('Lỗi khi tải khóa học:', error);
        } finally {
            setIsLoading(false);
        }
    };
    const [statusOptions, setStatusOptions] = useState([]);

    const getStatusColorByValue = (status) => {
        switch (status.toLowerCase()) {
            case "published":
                return "bg-green-100 text-green-800 w-full text-center flex justify-center items-center p-1 rounded-lg  ";
            case "draft":
                return "bg-blue-100 text-blue-800 w-full text-center flex justify-center items-center p-1 rounded-lg";
            case "pending":
                return "bg-yellow-100 text-yellow-800 w-full text-center flex justify-center items-center p-1 rounded-lg";
            case "unpublished":
                return "bg-red-500 text-white w-full text-center flex justify-center items-center p-1 rounded-lg ";
        }
    };
    const getStatusText = (status) => {
        switch (status) {
            case "draft":
                return "Nháp";
            case "published":
                return "Hoàn thành";
            case "pending":
                return "Đang chờ";
            case "unpublished":
                return "Thất bại";
        }
    };
    const getStatusColor = (status) => {
        const statusOption = statusOptions.find(opt => opt.value === status);
        return statusOption ? statusOption.color : "bg-gray-300";
    };


    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${API_URL}/categories`, {
                headers: { 'x-api-secret': API_KEY }
            });
            setCategories([{ course_category_id: 'all', name: 'Tất cả' }, ...res.data]);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchCourses();
        fetchCategories();
    }, [course_id]);

    const [contentLesson, setContentLesson] = useState([]);
    const [titleContent, setTitleContent] = useState([]);
    // Sắp xếp content theo content_id
    const sortedContent = contentLesson.sort(
        (a, b) => a.content_id - b.content_id
    );
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

    const navigate = useNavigate();


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
                params: { course_id: courseId }
            });

            // Sửa điều kiện kiểm tra dữ liệu để phù hợp với cấu trúc API mới
            if (res.data && res.data.success && Array.isArray(res.data.data)) {
                const lessonsWithTitles = await Promise.all(
                    res.data.data
                        .filter(content => content.course_id === Number(courseId) && content.status === 'published')
                        .map(async (content) => {
                            try {
                                const titleRes = await axios.get(`${API_URL}/title-contents`, {
                                    headers: {
                                        "x-api-secret": `${API_KEY}`,
                                        Authorization: `Bearer ${token}`,
                                    },
                                    params: { content_id: content.content_id }
                                });

                                return {
                                    ...content,
                                    titleContents: Array.isArray(titleRes.data.titleContents) ? titleRes.data.titleContents : []
                                };
                            } catch (error) {
                                console.error(`Error fetching title contents for content ${content.content_id}:`, error);
                                return {
                                    ...content,
                                    titleContents: []
                                };
                            }
                        })
                );

                setContentLesson(lessonsWithTitles);

                if (lessonsWithTitles.length === 0) {
                    toast.info("Không có bài học đã xuất bản.");
                }
            } else {
                console.error("Dữ liệu không phải là mảng hoặc không có thành công:", res.data);
                toast.error("Dữ liệu không hợp lệ hoặc không thành công.");
            }
        } catch (error) {
            console.error("Lỗi khi lấy nội dung bài học:", error);
            toast.error("Có lỗi xảy ra khi tải nội dung bài học.");
        }
    };


    useEffect(() => {
        if (course_id) {
            fetchContentLesson(course_id); // gọi lại khi course_id thay đổi
        }
    }, [course_id]);

    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <SidebarProvider>
            <SideBarUI />
            <SidebarInset>
                <div className="absolute left-1 top-3 px-4">
                    <div className="flex items-center gap-2 pb-6">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/" className="flex items-center gap-1">
                                        <LayoutDashboard size={16} />
                                        Dashboard
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/admin/course-list" className="flex items-center gap-1">
                                        <BookOpenText size={16} />
                                        Danh sách khóa học
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/admin/courses" className="text-blue-600 flex items-center gap-1">
                                        <GraduationCap size={16} />
                                        {course?.title || 'Khóa học không tồn tại'}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>

                    {/* Content section */}
                    <div className="bg-gray-50 w-full font-sans">
                        {isLoading ? (
                            <div className="flex justify-center items-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                            </div>
                        ) : error ? (
                            <div className="text-red-600 text-center py-4">
                                {error}
                            </div>
                        ) : course ? (
                            <div className="bg-white rounded-none shadow-sm p-8 w-full mx-auto mt-8 ">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8  pr-5">
                                    {/* Image Section */}
                                    <div className="relative h-full md:h-full rounded-lg overflow-hidden shadow-md">
                                        <img
                                            src={course.img}
                                            alt="Course"
                                            className="object-cover w-full h-full transition-opacity duration-300 ease-in-out hover:opacity-90"
                                        />
                                    </div>

                                    {/* Information Section */}
                                    <div className="flex flex-col justify-between w-full space-y-4 ">
                                        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
                                            {course.title}
                                        </h1>
                                        <div className="text-md text-gray-900 mb-4 flex items-center space-x-2">
                                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded inline-flex items-center gap-1 font-medium">
                                                <School className="w-4 h-4" />{course.user.name}
                                            </span>
                                        </div>
                                        <div className="text-md text-gray-900 mb-4">
                                            <span className="gap-1 font-bold">Danh mục: </span>
                                            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md shadow-sm font-medium">
                                                {categories.find(c => c.course_category_id === course.course_category_id)?.name || 'Chưa có danh mục'}
                                            </span>
                                        </div>
                                        <div className="text-gray-900 text-justify leading-relaxed">
                                            <span className="gap-1 font-bold">Mô tả:</span>
                                            <span> {course.description}</span>
                                        </div>
                                        <div className="text-md mt-4">
                                            <span className="font-bold mr-2 text-gray-900 ">Giá:</span>
                                            <span className="text-blue-700 font-medium">
                                                {formatCurrency(course.price)}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="font-bold ">Trạng thái khóa học:</span>
                                            <span className={`${getStatusColor(course?.status)} font-medium text-md px-1 py-1 rounded-lg`}>
                                                {getStatusText(course.status)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                Không tìm thấy khóa học
                            </div>
                        )}

                        {/* Bài học */}
                        <div className="w-full my-5 ">
                            <h2 className="text-3xl font-bold mb-6">Nội dung khóa học</h2>
                            {contentLesson.length > 0 ? (
                                <Accordion type="single" collapsible className="w-full">
                                    {contentLesson.map((lesson, lessonIndex) => (
                                        <AccordionItem
                                            key={lesson.content_id}
                                            value={`item-${lessonIndex}`}
                                            className="bg-white rounded-md shadow-sm mb-4"
                                        >
                                            <AccordionTrigger
                                                className="text-left px-6 py-4 font-medium text-lg"
                                                onClick={() => {
                                                    if (!titleContent[lesson.content_id]) {
                                                        fetchTitleContent(lesson.content_id);
                                                    }
                                                }}
                                            >
                                                <span className="font-medium hover:text-gray-700">
                                                    Bài học {lessonIndex + 1}:&nbsp;{lesson.name_content}
                                                </span>
                                            </AccordionTrigger>
                                            <AccordionContent className="px-3 py-2">
                                                {titleContent[lesson.content_id] && titleContent[lesson.content_id].length > 0 ? (
                                                    <div className="space-y-2">
                                                        {titleContent[lesson.content_id].map((title, titleIndex) => (
                                                            <div key={titleIndex} className="bg-gray-100 rounded-lg p-3">
                                                                <h5 className="font-medium text-base mb-2">
                                                                    {titleIndex + 1}. {title.body_content || "Content not available."}
                                                                </h5>
                                                                {title.video_link && (
                                                                    <Dialog>
                                                                        <DialogTrigger className="bg-yellow-400 hover:bg-yellow-700 text-white font-medium py-1 px-2 rounded-md transition duration-300 ease-in-out">
                                                                            Xem Video
                                                                        </DialogTrigger>
                                                                        <DialogContent className="sm:max-w-[625px]">
                                                                            <DialogHeader>
                                                                                <DialogTitle>Xem Video</DialogTitle>
                                                                                <DialogDescription>
                                                                                    <div className="relative" style={{ paddingTop: '56.25%' }}>
                                                                                        <ReactPlayer
                                                                                            url={title.video_link}
                                                                                            className="absolute top-0 left-0"
                                                                                            width="100%"
                                                                                            height="100%"
                                                                                            controls
                                                                                        />
                                                                                    </div>
                                                                                </DialogDescription>
                                                                            </DialogHeader>
                                                                        </DialogContent>
                                                                    </Dialog>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500">Loading content...</p>
                                                )}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            ) : (
                                <p className="text-gray-500">Loading content...</p>
                            )}
                        </div>



                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );

}
