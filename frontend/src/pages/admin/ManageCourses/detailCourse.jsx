import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from "axios";
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
import { SideBarUI } from '../sidebarUI';
import { GraduationCap, LayoutDashboard, BookOpenText, School } from 'lucide-react';
import { Separator } from '@radix-ui/react-context-menu';
import { formatCurrency } from "@/components/Formatcurrency/formatCurrency";

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

        } catch (error) {
            setError('Không thể tải thông tin khóa học');
            console.error('Lỗi khi tải khóa học:', error);
        } finally {
            setIsLoading(false);
        }
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
                                        Chi tiết khóa học: {course?.title || 'Khóa học không tồn tại'}
                                    </BreadcrumbLink>

                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>

                    {/* Content section */}
                    <div className=" bg-gray-50 w-full font-sans">
                        {isLoading ? (
                            <div className="flex justify-center items-center ">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : error ? (
                            <div className="text-red-600 text-center py-4">
                                {error}
                            </div>
                        ) : course ? (
                            <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto mt-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Hình ảnh */}
                                    <div className="relative h-64 md:h-full rounded-lg overflow-hidden">
                                        <img
                                            src={course.img}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>

                                    {/* Thông tin */}
                                    <div className="justify-between w-full">
                                        <div>
                                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                                {course.title}
                                            </h1>
                                            <div className="text-sm text-gray-600 mb-4">
                                                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded inline-flex items-center gap-1">
                                                    <School className="w-4 h-4" />{course.user.name}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-600 mb-4">
                                                <span className="bg-blue-100 text-yellow-500 px-2 py-1 rounded">
                                                    {categories.find(c => c.course_category_id === course.course_category_id)?.name || 'Chưa có danh mục'}
                                                </span>
                                            </div>
                                            <p className="text-gray-600">
                                                {course.description}
                                            </p>
                                        </div>
                                        <div className="mt-4">
                                            <div className="text-xl font-bold">
                                                {formatCurrency(course.price)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                Không tìm thấy khóa học
                            </div>
                        )}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
