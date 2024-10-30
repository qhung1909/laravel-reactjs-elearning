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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, FileDown, Clock, Users, BookOpen, LayoutDashboard, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import axios from "axios";

export default function BrowseNewCourses () {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;

    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('pending'); // Thêm state để lọc status

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

    useEffect(() => {
        fetchCourses();
    }, []);

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
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Duyệt Khóa Học Mới</h1>
                                    <p className="text-gray-500 mt-1">Xem xét và phê duyệt các khóa học được gửi bởi giảng viên</p>
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
                                        onClick={() => setStatusFilter('pending')} // Thêm onClick để lọc status pending
                                    >
                                        <Filter size={16} />
                                        Chờ duyệt
                                    </Button>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <FileDown size={16} />
                                        Xuất
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                                    {[...Array(4)].map((_, index) => (
                                        <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                                            <div className="animate-pulse space-y-4">
                                                <div className="flex justify-between">
                                                    <div className="space-y-2">
                                                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                                                    </div>
                                                    <div className="h-6 bg-gray-300 rounded w-20"></div>
                                                </div>
                                                <div className="h-16 bg-gray-300 rounded"></div>
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div className="h-4 bg-gray-300 rounded"></div>
                                                    <div className="h-4 bg-gray-300 rounded"></div>
                                                    <div className="h-4 bg-gray-300 rounded"></div>
                                                </div>
                                                <div className="flex justify-center">
                                                    <div className="h-10 bg-gray-300 rounded w-1/2"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                                    {filteredCourses.map((course) => (
                                        <div key={course.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900">{course.title}</h3>
                                                    <p className="text-sm text-gray-500 mt-1">Submitted by: {course.user?.name}</p>
                                                </div>
                                                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                                    Chờ duyệt
                                                </Badge>
                                            </div>
                                            <p className="text-gray-600 mb-4">
                                                {course.description}
                                            </p>
                                            <div className="grid grid-cols-3 gap-4 mb-4">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm text-gray-600">{course.duration} tuần</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm text-gray-600">{course.lessons_count} bài học</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm text-gray-600">Trình độ: {course.level}</span>
                                                </div>
                                            </div>
                                            <Link
                                                to={`/admin/browse-new-courses/${course.course_id}`}
                                                className="w-full md:w-1/2"
                                                >
                                                <Button className="w-full">Xem chi tiết</Button>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

