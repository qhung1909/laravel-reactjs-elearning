import React, { useEffect, useState } from 'react';
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
import axios from 'axios';

export const CoursesOfCategory = () => {
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;

    const fetchCourses = async () => {
        try {
            const res = await axios.get(`${API_URL}/courses`, {
                headers: { 'x-api-secret': API_KEY }
            });
            setCourses(res.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${API_URL}/categories`, {
                headers: { 'x-api-secret': API_KEY }
            });
            setCategories(res.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchCourses(), fetchCategories()]);
            setLoading(false);
        };

        fetchData();
    }, []);

    const handleCategoryChange = async (courseId, categoryId) => {
        if (!courseId) {
            console.error('Course ID is undefined');
            return;
        }

        console.log(`Course ID: ${courseId} - Selected Category ID: ${categoryId}`);

        // Cập nhật state courses chỉ cho khóa học đã chọn
        setCourses(prevCourses =>
            prevCourses.map(course =>
                course.course_id === courseId ? { ...course, course_category_id: categoryId } : course
            )
        );

        // Gửi yêu cầu cập nhật đến API
        try {
            await axios.put(`${API_URL}/courses/${courseId}`, {
                course_category_id: categoryId
            }, {
                headers: { 'x-api-secret': API_KEY }
            });
        } catch (error) {
            console.error('Error updating course category:', error);
        }
    };

    const viewCourseDetails = (courseId) => {
        // Chuyển hướng đến trang chi tiết khóa học
        console.log(`Viewing details for course ID: ${courseId}`);
        // Bạn có thể sử dụng router để điều hướng đến trang chi tiết
        // Ví dụ: history.push(`/courses/${courseId}`);
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
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/admin" className="text-blue-600 hover:text-blue-800">
                                        Dashboard
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink className="font-semibold">
                                        Gán khóa học vào Danh mục
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-yellow-400">
                                        <th className="text-left py-4 px-6">Tên khóa học</th>
                                        <th className="text-left py-4 px-6">Danh mục</th>
                                        <th className="text-left py-4 px-6">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.map(course => (
                                        <tr key={course.course_id} className="border-t border-gray-100">
                                            <td className="py-4 px-6">{course.title}</td>
                                            <td className="py-4 px-6">
                                                <select
                                                    value={course.course_category_id || ''}
                                                    onChange={(e) => handleCategoryChange(course.course_id, e.target.value)}
                                                    className="border border-gray-300 rounded-lg p-2"
                                                >
                                                    {categories.map(category => (
                                                        <option key={category.course_category_id} value={category.course_category_id}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="py-4 px-6">
                                                <button
                                                    onClick={() => viewCourseDetails(course.course_id)}
                                                    className="bg-blue-500 text-white rounded-lg px-4 py-2"
                                                >
                                                    Xem chi tiết
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};
