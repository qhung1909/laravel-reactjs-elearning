import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    CheckCircle,
    Trash2,
    Plus,
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

export const CourseList = () => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;

    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalStudents: 0,
        activeCourses: 0
    });

    const fetchCourses = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/courses`, {
                headers: {
                    'x-api-secret': API_KEY
                }
            });
            const data = res.data;
            setCourses(data);

            // Calculate stats
            setStats({
                totalCourses: data.length,
                totalStudents: data.reduce((sum, course) => sum + (course.enrolled_count || 0), 0),
                activeCourses: data.filter(course => course.status === "active").length
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

    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc'
    });
    const [searchTerm, setSearchTerm] = useState('');

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedCourses = [...filteredCourses].sort((a, b) => {
        if (!sortConfig.key) return 0;

        const aValue = sortConfig.key === 'updated_at' ? new Date(a[sortConfig.key]) : a[sortConfig.key];
        const bValue = sortConfig.key === 'updated_at' ? new Date(b[sortConfig.key]) : b[sortConfig.key];

        return sortConfig.direction === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });

    const getSortIcon = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
        }
        return <ChevronUp className="h-4 w-4 opacity-0 group-hover:opacity-50" />;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-800";
            case "completed":
                return "bg-blue-100 text-blue-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "draft":
                return "Nháp";
            case "success":
                return "Hoàn thành";
            case "pending":
                return "Đang chờ";
            case "fail":
                return "Thất bại";
            default:
                return "Không xác định";
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

                <div className="absolute top-14 px-6 bg-gray-50 w-full">
                    {/* Summary Cards */}
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
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <Filter size={16} />
                                        Lọc
                                    </Button>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <FileDown size={16} />
                                        Xuất
                                    </Button>
                                </div>
                            </div>

                            <div className="overflow-x-auto rounded-lg border border-gray-200">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="text-left py-4 px-6 font-medium text-sm text-gray-600">ID</th>
                                            <th
                                                className="text-left py-4 px-6 font-medium text-sm text-gray-600 cursor-pointer group"
                                                onClick={() => handleSort('title')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    Tiêu đề
                                                    {getSortIcon('title')}
                                                </div>
                                            </th>
                                            <th
                                                className="text-left py-4 px-6 font-medium text-sm text-gray-600 cursor-pointer group"
                                                onClick={() => handleSort('user?.name')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    Giảng viên
                                                    {getSortIcon('user?.name')}
                                                </div>
                                            </th>
                                            <th
                                                className="text-left py-4 px-6 font-medium text-sm text-gray-600 cursor-pointer group"
                                                onClick={() => handleSort('status')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    Trạng thái
                                                    {getSortIcon('status')}
                                                </div>
                                            </th>
                                            <th
                                                className="text-left py-4 px-6 font-medium text-sm text-gray-600 cursor-pointer group"
                                                onClick={() => handleSort('price')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    Giá
                                                    {getSortIcon('price')}
                                                </div>
                                            </th>


                                            <th className="text-right py-4 px-6 font-medium text-sm text-gray-600">Hành động</th>
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
                                                            <div className="bg-gray-300 rounded animate-pulse" style={{ width: '120px', height: '20px' }} />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </>

                                        ) : (
                                            sortedCourses.map((course) => (
                                                <tr key={course.id} className="border-t border-gray-100 hover:bg-gray-50">
                                                    <td className="py-4 px-6 text-sm text-gray-600">{course.course_id}</td>
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center">
                                                            {/* <div className="w-10 h-10 rounded-lg bg-gray-100 mr-3 flex items-center justify-center">
                        <GraduationCap className="h-5 w-5 text-gray-500" />
                    </div> */}
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">{course.title}</p>
                                                                {/* <p className="text-sm text-gray-500">{course.description}</p> */}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center">

                                                            <span className="text-sm text-gray-900">{course.user?.name}</span>
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
                                                        <div className="flex justify-end gap-2">
                                                            <Button variant="outline" size="sm" className="text-bold text-yellow-400 hover:text-orange-500">
                                                                Xem chi tiết
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-6 flex items-center justify-between">
                                <p className="text-sm text-gray-500">
                                    Hiển thị {sortedCourses.length} trên tổng số {courses.length} khóa học
                                </p>
                                <Pagination>
                                    <PaginationContent>
                                        {/* <PaginationItem>
                                            <PaginationLink href="#">Previous</PaginationLink>
                                        </PaginationItem> */}
                                        <PaginationItem>
                                            <PaginationLink href="#" isActive>1</PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink href="#">2</PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink href="#">3</PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink href="#">10</PaginationLink>
                                        </PaginationItem>
                                        {/* <PaginationItem>
                                            <PaginationLink href="#">Next</PaginationLink>
                                        </PaginationItem> */}
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default CourseList;
