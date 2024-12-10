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
import toast, { Toaster } from 'react-hot-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AlertDialogFooter, AlertDialogHeader } from "@/components/ui/alert-dialog";

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
    const itemsPerPage = 8;

    const toggleCourseStatus = async (courseId, currentStatus) => {
        try {
            const newStatus = currentStatus === "published" ? "hide" : "published";

            console.log('Toggling status:', { courseId, currentStatus, newStatus });

            const response = await axios.put(
                `${API_URL}/admin/courses/${courseId}/toggle-status`,
                { status: newStatus },
                {
                    headers: {
                        'x-api-secret': API_KEY,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('API response:', response.data);

            // Show loading toast while processing
            toast.loading('Đang cập nhật trạng thái...', {
                position: "top-center",
                duration: 3000, // Toast will show for 3 seconds
            });

            // Delay the state update and page refresh
            setTimeout(() => {
                // Hiển thị thông báo thành công
                toast.success(`Đã thay đổi trạng thái khóa học thành "${newStatus === "published" ? "Hoàn thành" : "Ẩn"}"`, {
                    position: "top-center"
                });

                // Refresh toàn bộ trang
                window.location.reload();
            }, 3000);

        } catch (error) {
            console.error('Error updating course status:', error.response?.data || error.message);
            // Hiển thị thông báo lỗi
            toast.error("Không thể thay đổi trạng thái khóa học", {
                position: "top-center"
            });
        }
    };


    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(currentFilteredCourses);


        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, worksheet, 'Courses');

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
    const handleStatusFilter = (status) => {
        console.log("Lọc theo trạng thái:", status);
        const filteredItems = courses.filter(course => course.status === status);
        console.log(filteredItems);
        setCourses(filteredItems);
        setShowOptions(false);
    };

    const filteredCourses = courses.filter(course => {
        const titleMatch = course.title
            ? course.title.toLowerCase().includes(searchTerm.toLowerCase())
            : false;

        const authorMatch = course.user?.name
            ? course.user.name.toLowerCase().includes(searchTerm.toLowerCase())
            : false;

        return titleMatch || authorMatch;
    });

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
                                        <Button variant="outline" className="flex items-center gap-2" onClick={toggleOptions}>
                                            <Filter size={16} />
                                            Lọc
                                        </Button>

                                        {showOptions && (
                                            <div className="absolute mt-2 w-48 bg-white border border-gray-200 rounded shadow-md z-10">
                                                <ul className="py-2">
                                                    <li
                                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                        onClick={() => handleStatusFilter('published')}
                                                    >
                                                        Hoàn thành
                                                    </li>
                                                    <li
                                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                        onClick={() => handleStatusFilter('hide')}
                                                    >
                                                        Ẩn
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
                                            <th className="text-left py-4 px-6 font-bold text-gray-600" style={{ width: '10%' }}>STT</th>
                                            <th
                                                className="text-center py-4 px-6 font-bold text-gray-600 cursor-pointer group whitespace-nowrap"
                                                onClick={() => handleSort('title')}
                                                style={{ width: '40%' }}
                                            >
                                                <div className="flex items-center justify-center gap-2">
                                                    Tiêu đề
                                                    {getSortIcon('title')}
                                                </div>
                                            </th>
                                            <th
                                                className="text-center py-4 px-6 font-bold text-gray-600 cursor-pointer group whitespace-nowrap"
                                                onClick={() => handleSort('user?.name')}
                                                style={{ width: '20%' }}
                                            >
                                                <div className="flex items-center justify-center gap-2">
                                                    Giảng viên
                                                    {getSortIcon('user?.name')}
                                                </div>
                                            </th>
                                            <th
                                                className="text-center py-4 px-6 font-bold text-gray-600 cursor-pointer group whitespace-nowrap"
                                                onClick={() => handleSort('created_at')}
                                                style={{ width: '15%' }}
                                            >
                                                <div className="flex items-center justify-center gap-2">
                                                    Ngày tạo
                                                    {getSortIcon('created_at')}
                                                </div>
                                            </th>
                                            <th
                                                className="text-center py-4 px-6 font-bold text-gray-600 cursor-pointer group whitespace-nowrap"
                                                onClick={() => handleSort('status')}
                                                style={{ width: '15%' }}
                                            >
                                                <div className="flex items-center justify-center gap-2">
                                                    Trạng thái
                                                    {getSortIcon('status')}
                                                </div>
                                            </th>
                                            <th
                                                className="text-center py-4 px-6 font-bold text-gray-600 cursor-pointer group whitespace-nowrap"
                                                onClick={() => handleSort('price')}
                                                style={{ width: '20%' }}
                                            >
                                                <div className="flex items-center justify-center gap-2">
                                                    Giá gốc
                                                    {getSortIcon('price')}
                                                </div>
                                            </th>
                                            <th
                                                className="text-center py-4 px-6 font-bold text-gray-600 cursor-pointer group whitespace-nowrap"
                                                onClick={() => handleSort('price')}
                                                style={{ width: '20%' }}
                                            >
                                                <div className="flex items-center justify-center gap-2">
                                                    Giá giảm
                                                    {getSortIcon('price')}
                                                </div>
                                            </th>
                                            <th
                                                className="text-center py-4 px-6 font-bold text-gray-600 cursor-pointer group whitespace-nowrap"
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
                                                        <td className="py-4 px-6">
                                                            <div className="bg-gray-300 rounded animate-pulse" style={{ width: '100px', height: '20px' }} />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </>
                                        ) : (
                                            currentFilteredCourses.map((course, index) => (
                                                <tr key={course.id} className="border-t border-gray-100 hover:bg-gray-50">
                                                    {/* <td className="py-4 px-6 text-sm text-gray-600">{course.course_id}</td> */}
                                                    <td className="py-4 px-6 text-sm text-gray-600">
                                                        {(currentPage - 1) * itemsPerPage + index + 1}
                                                    </td>

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
                                                    <td className="py-4 px-6  text-center">
                                                        <span className="text-sm text-gray-900">
                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6  text-center">
                                                        <span className="text-sm text-gray-900">
                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price_discount)}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        {course.course_category_id ? (
                                                            <div className="flex items-center justify-center">
                                                                <Badge
                                                                    className="px-3 py-1 text-xs font-semibold text-white bg-orange-400 rounded-full whitespace-nowrap "
                                                                >
                                                                    {categories.find(c => c.course_category_id === course.course_category_id)?.name || 'Chưa có danh mục'}
                                                                </Badge>
                                                            </div>
                                                        ) : (
                                                            <Badge variant="destructive" className="whitespace-nowrap ">Chưa có danh mục</Badge>
                                                        )}
                                                    </td>

                                                    <td className="py-4 px-6">
                                                        <div className="flex justify-end gap-2">
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="text-bold text-amber-400 hover:text-amber-700"
                                                                    >
                                                                        Sửa
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent className="max-w-[450px]">
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle className="text-left">
                                                                            Thay đổi trạng thái khóa học
                                                                        </AlertDialogTitle>
                                                                        <AlertDialogDescription className="text-left whitespace-normal">
                                                                            Chọn trạng thái mới cho khóa học:
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <div className="flex flex-col gap-3 py-4">
                                                                        {course.status === "hide" && (
                                                                            <Button
                                                                                variant="outline"
                                                                                className="justify-start text-green-600 hover:text-green-700 hover:bg-green-50"
                                                                                onClick={() => {
                                                                                    toggleCourseStatus(course.course_id, "published");
                                                                                }}
                                                                            >
                                                                                <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                                                                                Hoàn thành
                                                                            </Button>
                                                                        )}
                                                                        {course.status === "published" && (
                                                                            <Button
                                                                                variant="outline"
                                                                                className="justify-start text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                                                                                onClick={() => {
                                                                                    toggleCourseStatus(course.course_id, "hide");
                                                                                }}
                                                                            >
                                                                                <span className="w-3 h-3 rounded-full bg-gray-500 mr-2"></span>
                                                                                Ẩn
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>

                                                            <Link to={`/admin/courses/${course.course_id}`}>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="text-bold text-amber-400 hover:text-amber-700"
                                                                >
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

                                        {totalFilteredPages <= 7 ? (
                                            // Nếu có 7 trang hoặc ít hơn, hiển thị tất cả
                                            [...Array(totalFilteredPages)].map((_, index) => (
                                                <PaginationItem key={index + 1}>
                                                    <PaginationLink
                                                        href="#"
                                                        isActive={currentPage === index + 1}
                                                        onClick={() => handlePageChange(index + 1)}
                                                    >
                                                        {index + 1}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            ))
                                        ) : (
                                            // Nếu có nhiều hơn 7 trang
                                            <>
                                                {/* Luôn hiển thị trang 1 */}
                                                <PaginationItem>
                                                    <PaginationLink
                                                        href="#"
                                                        isActive={currentPage === 1}
                                                        onClick={() => handlePageChange(1)}
                                                    >
                                                        1
                                                    </PaginationLink>
                                                </PaginationItem>

                                                {/* Hiển thị ... nếu trang hiện tại > 3 */}
                                                {currentPage > 3 && (
                                                    <PaginationItem>
                                                        <PaginationEllipsis />
                                                    </PaginationItem>
                                                )}

                                                {/* Hiển thị các trang xung quanh trang hiện tại */}
                                                {[...Array(3)].map((_, idx) => {
                                                    let pageNumber;
                                                    if (currentPage <= 3) pageNumber = idx + 2;
                                                    else if (currentPage >= totalFilteredPages - 2) pageNumber = totalFilteredPages - 4 + idx;
                                                    else pageNumber = currentPage - 1 + idx;

                                                    if (pageNumber > 1 && pageNumber < totalFilteredPages) {
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
                                                    }
                                                    return null;
                                                })}

                                                {/* Hiển thị ... nếu trang hiện tại < tổng số trang - 2 */}
                                                {currentPage < totalFilteredPages - 2 && (
                                                    <PaginationItem>
                                                        <PaginationEllipsis />
                                                    </PaginationItem>
                                                )}

                                                {/* Luôn hiển thị trang cuối */}
                                                <PaginationItem>
                                                    <PaginationLink
                                                        href="#"
                                                        isActive={currentPage === totalFilteredPages}
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
                </div >
            </SidebarInset >
        </SidebarProvider >
    );
}
