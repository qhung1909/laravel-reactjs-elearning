import {
    Pagination,
    PaginationContent,
    PaginationPrevious,
    PaginationNext,
    PaginationItem,
    PaginationLink,
    PaginationEllipsis
} from "@/components/ui/pagination";
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
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Search,
    LayoutDashboard,
    GraduationCap,
    Users2,
    FileDown,
    Filter,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { SideBarUI } from '../sidebarUI';
import { useEffect, useState } from 'react';
import axios from "axios";
import * as XLSX from 'xlsx';
import { Link } from "react-router-dom";

export default function CourseList() {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;

    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalStudents: 0,
        activeCourses: 0
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const exportToExcel = () => {
        // Create a worksheet from the filtered courses
        const worksheet = XLSX.utils.json_to_sheet(currentFilteredCourses);

        // Create a new workbook and append the worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, worksheet, 'Courses');

        // Export the workbook to a file
        XLSX.writeFile(wb, 'courses_data.xlsx');
    };
    const fetchCourses = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/courses`, {
                headers: {
                    'x-api-secret': API_KEY
                }
            });
            const data = res.data;
            console.log(data);

            setCourses(data);
            setStats({
                totalCourses: data.length,
                totalStudents: data.reduce((sum, course) => sum + (course.enrolled_count || 0), 0),
                activeCourses: data.filter(course => course.status === "published" && course.status !== "hide").length
            });
        } catch (error) {
            console.error('Error fetching Courses:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const [categories, setCategories] = useState([]);
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
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchCourses(), fetchCategories()]);
            setLoading(false);
        };
        fetchData();
    }, []);

    const [showOptions, setShowOptions] = useState(false);
    const toggleOptions = () => {
        setShowOptions(!showOptions);
    };

    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc'
    });
    const [searchTerm, setSearchTerm] = useState('');

    // Hàm sắp xếp theo giá
    const handleSort = (direction) => {
        const sortedCourses = [...courses].sort((a, b) => {
            if (direction === 'asc') {
                return a.price - b.price;
            } else {
                return b.price - a.price;
            }
        });
        setCourses(sortedCourses);
        setSortConfig({ key: 'price', direction });
        setShowOptions(false);
    };

    // Hàm sắp xếp theo ngày
    const handleDateSort = () => {
        const sortedCourses = [...courses].sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at);
        });
        setCourses(sortedCourses);
        setShowOptions(false);
    };

    // Hàm lọc theo trạng thái
    const handleStatusFilter = () => {
        // Thêm logic lọc theo trạng thái ở đây
        setShowOptions(false);
    };

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.user && course.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const totalFilteredCourses = filteredCourses.length;
    const totalFilteredPages = Math.ceil(totalFilteredCourses / itemsPerPage);
    const indexOfLastCourseFiltered = currentPage * itemsPerPage;
    const indexOfFirstCourseFiltered = indexOfLastCourseFiltered - itemsPerPage;
    const currentFilteredCourses = filteredCourses.slice(indexOfFirstCourseFiltered, indexOfLastCourseFiltered);

    const getSortIcon = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
        }
        return <ChevronUp className="h-4 w-4 opacity-0 group-hover:opacity-50" />;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "published":
                return "bg-green-100 text-green-800 w-full text-center flex justify-center items-center p-1 rounded-lg";
            case "hide":
                return "bg-gray-400 text-white w-full text-center flex justify-center items-center p-1 rounded-lg";
            default:
                return '';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "published":
                return "Hoàn thành";
            case "hide":
                return "Ẩn";
            default:
                return '';
        }
    };

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalFilteredPages) {
            setCurrentPage(page);
        }
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

                <div className="absolute top-14 px-6 bg-gray-50 w-full font-sans">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <Card>
                            <CardContent className="flex items-center p-4">
                                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
                                    <GraduationCap className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Tổng khóa học</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="flex items-center p-4">
                                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center mr-4">
                                    <Users2 className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Tổng học viên</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="flex items-center p-4">
                                <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center mr-4">
                                    <GraduationCap className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Khóa học đang diễn ra</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.activeCourses}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Quản lý khóa học</h1>
                                    <p className="text-gray-500 mt-1">Quản lý tất cả các khóa học trong hệ thống</p>
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
                                    <div className="relative">
                                        <Button
                                            variant="outline"
                                            className="flex items-center gap-2"
                                            onClick={toggleOptions}
                                        >
                                            <Filter size={16} />
                                            Lọc
                                        </Button>
                                        {showOptions && (
                                            <div className="absolute mt-2 w-48 bg-white border border-gray-200 rounded shadow-md z-10">
                                                <ul className="py-2">
                                                    <li
                                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                        onClick={handleStatusFilter}
                                                    >
                                                        Theo trạng thái
                                                    </li>
                                                    <li
                                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                        onClick={() => handleSort('desc')}
                                                    >
                                                        Giá giảm dần
                                                    </li>
                                                    <li
                                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                        onClick={() => handleSort('asc')}
                                                    >
                                                        Giá tăng dần
                                                    </li>
                                                    <li
                                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                        onClick={handleDateSort}
                                                    >
                                                        Ngày tạo mới nhất
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                    <Button variant="outline" className="flex items-center gap-2" onClick={exportToExcel}>
                                        <FileDown size={16} />
                                        Xuất
                                    </Button>
                                </div>
                            </div>

                            <div className="overflow-x-auto rounded-lg border border-gray-200">
                                <table className="w-full">
                                    <thead className="text-md font-bold">
                                        <tr className="bg-yellow-100">
                                            <th className="text-left py-4 px-6 font-bold text-gray-600" style={{ width: '10%' }}>ID</th>
                                            <th
                                                className="text-center py-4 px-6 font-bold text-gray-600 cursor-pointer group"
                                                onClick={() => handleSort('title')}
                                                style={{ width: '40%' }}
                                            >
                                                <div className="flex items-center justify-center gap-2">
                                                    Tiêu đề
                                                    {getSortIcon('title')}
                                                </div>
                                            </th>
                                            <th
                                                className="text-center py-4 px-6 font-bold text-gray-600 cursor-pointer group"
                                                onClick={() => handleSort('user?.name')}
                                                style={{ width: '20%' }}
                                            >
                                                <div className="flex items-center justify-center gap-2">
                                                    Giảng viên
                                                    {getSortIcon('user?.name')}
                                                </div>
                                            </th>
                                            <th
                                                className="text-center py-4 px-6 font-bold text-gray-600 cursor-pointer group"
                                                onClick={() => handleSort('created_at')}
                                                style={{ width: '15%' }}
                                            >
                                                <div className="flex items-center justify-center gap-2">
                                                    Ngày tạo
                                                    {getSortIcon('created_at')}
                                                </div>
                                            </th>
                                            <th
                                                className="text-center py-4 px-6 font-bold text-gray-600 cursor-pointer group"
                                                onClick={() => handleSort('status')}
                                                style={{ width: '15%' }}
                                            >
                                                <div className="flex items-center justify-center gap-2">
                                                    Trạng thái
                                                    {getSortIcon('status')}
                                                </div>
                                            </th>
                                            <th
                                                className="text-center py-4 px-6 font-bold text-gray-600 cursor-pointer group"
                                                onClick={() => handleSort('price')}
                                                style={{ width: '20%' }}
                                            >
                                                <div className="flex items-center justify-center gap-2">
                                                    Giá
                                                    {getSortIcon('price')}
                                                </div>
                                            </th>
                                            <th
                                                className="text-center py-4 px-6 font-bold text-gray-600 cursor-pointer group"
                                                onClick={() => handleSort('categories')}
                                                style={{ width: '15%' }}
                                            >
                                                <div className="flex items-center justify-center gap-2">
                                                    Danh mục
                                                    {getSortIcon('categories')}
                                                </div>
                                            </th>
                                            <th className="text-center py-4 px-6 font-bold text-gray-600" style={{ width: '10%' }}>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading ? (
                                            <>
                                                {[...Array(5)].map((_, rowIndex) => (
                                                    <tr key={rowIndex} className="border-t border-gray-100">
                                                        <td className="py-4 px-6">
                                                            <div className="bg-gray-300 rounded animate-pulse" style={{ width: '40px', height: '20px' }} />
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <div className="bg-gray-300 rounded animate-pulse" style={{ width: '150px', height: '20px' }} />
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <div className="bg-gray-300 rounded animate-pulse" style={{ width: '100px', height: '20px' }} />
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <div className="bg-gray-300 rounded animate-pulse" style={{ width: '80px', height: '20px' }} />
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <div className="bg-gray-300 rounded animate-pulse" style={{ width: '60px', height: '20px' }} />
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <div className="bg-gray-300 rounded animate-pulse" style={{ width: '100px', height: '20px' }} />
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <div className="bg-gray-300 rounded animate-pulse" style={{ width: '100px', height: '20px' }} />
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <div className="bg-gray-300 rounded animate-pulse" style={{ width: '100px', height: '20px' }} />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </>
                                        ) : (
                                            currentFilteredCourses.map((course) => (
                                                <tr key={course.id} className="border-t border-gray-100 hover:bg-gray-50">
                                                    <td className="py-4 px-6 text-sm text-gray-600">{course.course_id}</td>
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center">
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">{course.title}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center">
                                                            <span className="text-sm text-gray-900">{course.user?.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center">
                                                            <span className="text-sm text-gray-900">{new Date(course.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <Badge className={`${getStatusColor(course.status)}`}>
                                                            {getStatusText(course.status)}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <span className="text-sm text-gray-900">
                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        {course.course_category_id ? (
                                                            <div className="flex items-center gap-2">
                                                                <Badge className="w-full px-2 py-1 justify-center text-xs font-semibold text-white bg-orange-400 rounded-full">
                                                                    {categories.find(c => c.course_category_id === course.course_category_id)?.name || 'Chưa có danh mục'}
                                                                </Badge>
                                                            </div>
                                                        ) : (
                                                            <Badge className="text-red-500">Chưa có danh mục</Badge>
                                                        )}
                                                    </td>

                                                    <td className="py-4 px-6">
                                                        <div className="flex justify-end gap-2">
                                                            <Button variant="outline" size="sm" className="text-bold text-amber-400 hover:text-amber-700">
                                                                Sửa
                                                            </Button>
                                                            <Link to={`/admin/courses/${course.course_id}`}>                                                                <Button variant="outline" size="sm" className="text-bold text-amber-400 hover:text-amber-700">
                                                                Chi tiết
                                                            </Button>
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-6 flex items-center justify-between">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                            />
                                        </PaginationItem>

                                        {totalFilteredPages > 3 && currentPage > 3 && (
                                            <>
                                                <PaginationItem>
                                                    <PaginationLink href="#" onClick={() => handlePageChange(1)}>
                                                        1
                                                    </PaginationLink>
                                                </PaginationItem>
                                                <PaginationItem>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            </>
                                        )}

                                        {[...Array(Math.min(5, totalFilteredPages))].map((_, index) => {
                                            let pageNumber;

                                            if (totalFilteredPages <= 5) {
                                                pageNumber = index + 1;
                                            } else if (currentPage <= 3) {
                                                pageNumber = index + 1;
                                            } else if (currentPage >= totalFilteredPages - 2) {
                                                pageNumber = totalFilteredPages - 4 + index;
                                            } else {
                                                pageNumber = currentPage - 2 + index;
                                            }

                                            // Tránh việc lặp lại số trang 1
                                            if (pageNumber === 1 && currentPage !== 1) {
                                                return null; // Không hiển thị lại số 1 khi đã được hiển thị ở phần trên
                                            }

                                            return (
                                                <PaginationItem key={pageNumber}>
                                                    <PaginationLink
                                                        href="#"
                                                        isActive={currentPage === pageNumber}
                                                        onClick={() => handlePageChange(pageNumber)}
                                                    >
                                                        {pageNumber}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            );
                                        })}

                                        {totalFilteredPages > 3 && currentPage < totalFilteredPages - 2 && (
                                            <>
                                                <PaginationItem>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                                <PaginationItem>
                                                    <PaginationLink
                                                        href="#"
                                                        onClick={() => handlePageChange(totalFilteredPages)}
                                                    >
                                                        {totalFilteredPages}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            </>
                                        )}

                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalFilteredPages}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>


                        </CardContent>
                    </Card>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
