import { useEffect, useState } from 'react';
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
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SortAsc, SortDesc } from "lucide-react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
} from "@/components/ui/pagination";
import axios from 'axios';

export const CoursesOfCategory = () => {
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;

    const fetchCourses = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/courses`, {
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
        if (!courseId) return;

        setCourses(prevCourses =>
            prevCourses.map(course =>
                course.course_id === courseId ? { ...course, course_category_id: categoryId } : course
            )
        );

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

    const handleSort = (key) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const filteredAndSortedCourses = courses
        .filter(course =>
            course.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortConfig.key === 'title') {
                return sortConfig.direction === 'asc'
                    ? a.title.localeCompare(b.title)
                    : b.title.localeCompare(a.title);
            }
            return 0;
        });

    const pageCount = Math.ceil(filteredAndSortedCourses.length / itemsPerPage);
    const currentCourses = filteredAndSortedCourses.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        if (currentPage > pageCount) {
            setCurrentPage(Math.max(1, pageCount));
        }
    }, [pageCount, currentPage]);

    const generatePaginationItems = () => {
        const items = [];
        const maxVisible = 5;

        if (pageCount <= maxVisible) {
            for (let i = 1; i <= pageCount; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            onClick={() => setCurrentPage(i)}
                            isActive={currentPage === i}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        } else {
            // First page
            items.push(
                <PaginationItem key={1}>
                    <PaginationLink
                        onClick={() => setCurrentPage(1)}
                        isActive={currentPage === 1}
                    >
                        1
                    </PaginationLink>
                </PaginationItem>
            );

            // First ellipsis
            if (currentPage > 3) {
                items.push(
                    <PaginationItem key="ellipsis-1">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }

            // Current page and surrounding pages
            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(pageCount - 1, currentPage + 1);

            for (let i = startPage; i <= endPage; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            onClick={() => setCurrentPage(i)}
                            isActive={currentPage === i}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }

            // Last ellipsis
            if (currentPage < pageCount - 2) {
                items.push(
                    <PaginationItem key="ellipsis-2">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }

            // Last page
            if (pageCount > 1) {
                items.push(
                    <PaginationItem key={pageCount}>
                        <PaginationLink
                            onClick={() => setCurrentPage(pageCount)}
                            isActive={currentPage === pageCount}
                        >
                            {pageCount}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        }

        return items;
    };

    return (
        <SidebarProvider>
            <SideBarUI />
            <SidebarInset>
                <div className="p-6">
                    <div className="absolute top-2 left-2 flex items-center gap-2 mb-6">
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
                                        Quản lý Danh mục Khóa học
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>

                    <div className="absolute top-12 left-0 w-full">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="relative w-72">
                                        <Input
                                            type="text"
                                            placeholder="Tìm kiếm khóa học..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Tổng số: {filteredAndSortedCourses.length} khóa học
                                    </div>
                                </div>

                                <div className="overflow-x-auto rounded-lg border border-gray-200">
                                    {loading ? (
                                        <div className="flex justify-center items-center h-32">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                                        </div>
                                    ) : (
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-gray-50">
                                                    <th className="text-left py-4 px-6 font-medium text-gray-600">
                                                        <button
                                                            className="flex items-center gap-2"
                                                            onClick={() => handleSort('title')}
                                                        >
                                                            STT
                                                            {sortConfig.key === 'title' && (
                                                                sortConfig.direction === 'asc' ?
                                                                    <SortAsc className="h-4 w-4" /> :
                                                                    <SortDesc className="h-4 w-4" />
                                                            )}
                                                        </button>
                                                    </th>
                                                    <th className="text-left py-4 px-6 font-medium text-gray-600">Tên khóa học</th>
                                                    <th className="text-left py-4 px-6 font-medium text-gray-600">Danh mục</th>
                                                    <th className="text-left py-4 px-6 font-medium text-gray-600">Trạng thái</th>
                                                    <th className="text-left py-4 px-6 font-medium text-gray-600">Hành động</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {currentCourses.map((course, index) => (
                                                    <tr key={course.course_id} className="hover:bg-gray-50">
                                                        <td className="py-4 px-6 text-gray-600">
                                                            {(currentPage - 1) * itemsPerPage + index + 1}
                                                        </td>
                                                        <td className="py-4 px-6 font-medium">
                                                            <div className="max-w-md truncate" title={course.title}>
                                                                {course.title}
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <select
                                                                value={course.course_category_id || ''}
                                                                onChange={(e) => handleCategoryChange(course.course_id, e.target.value)}
                                                                className="w-full border border-gray-300 rounded-lg p-2 bg-white hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            >
                                                                <option value="">Chọn danh mục</option>
                                                                {categories.map(category => (
                                                                    <option key={category.course_category_id} value={category.course_category_id}>
                                                                        {category.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <span className={`px-3 py-1 rounded-full text-sm ${course.course_category_id
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                                }`}>
                                                                {course.course_category_id ? 'Đã phân loại' : 'Chưa phân loại'}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <Button
                                                                variant="outline"
                                                                className="text-blue-600 hover:text-blue-800"
                                                            >
                                                                Xem chi tiết
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>

                                {/* Pagination */}
                                <div className="flex justify-between items-center mt-4">
                                    <div className="text-sm text-gray-500">
                                        {filteredAndSortedCourses.length > 0 ? (
                                            `Hiển thị ${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(currentPage * itemsPerPage, filteredAndSortedCourses.length)} trong số ${filteredAndSortedCourses.length} khóa học`
                                        ) : (
                                            'Không có khóa học nào'
                                        )}
                                    </div>
                                    {pageCount > 1 && (
                                        <Pagination>
                                            <PaginationContent>
                                                <PaginationItem>
                                                    <PaginationLink
                                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                        disabled={currentPage === 1}
                                                    >
                                                    </PaginationLink>
                                                </PaginationItem>
                                                {generatePaginationItems()}
                                                <PaginationItem>
                                                    <PaginationLink
                                                        onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))}
                                                        disabled={currentPage === pageCount}
                                                    >
                                                    </PaginationLink>
                                                </PaginationItem>
                                            </PaginationContent>
                                        </Pagination>

                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default CoursesOfCategory;
