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
import { Link } from 'react-router-dom';
import axios from "axios";

export default function BrowseNewCourses() {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;

    //   const [searchTerm, setSearchTerm] = React.useState("")
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('pending');
    const pendingCount = courses.filter(course => course.status === 'pending').length;
    const [categories, setCategories] = React.useState([]);
    const [selectedCategory, setSelectedCategory] = React.useState("Tất cả");

    const [loading, setLoading] = React.useState(true);

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

      React.useEffect(() => {
        const fetchData = async () => {
          setLoading(true);
          await Promise.all([fetchCourses(), fetchCategories()]);
          setLoading(false);
        };
        fetchData();
      }, []);

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
                                {/* <div className="flex gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                            placeholder="Tìm khóa học..."
                            className="pl-9 w-[300px]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                                </div> */}
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
                                                    <Badge variant="outline">{course.category_name}</Badge> {/* hoặc một thuộc tính thay thế */}
                                                </div>
                                            </div>
                                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                                {course.status}
                                            </Badge>
                                        </CardHeader>
                                        <CardContent>
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
                                <div className="flex gap-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Tìm bài học..."
                                            className="pl-9 w-[300px]"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-6">
                                <Card>
                                    <CardHeader className="flex flex-row items-start justify-between">
                                        <div>
                                            <div className="text-sm text-muted-foreground mb-1">
                                                Thuộc khóa học: Lập trình React Native
                                            </div>
                                            <CardTitle className="text-xl">Bài 1: Giới thiệu React Native</CardTitle>
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
                                                <span>Nguyễn Văn A</span>
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
                                        <Button>Xem chi tiết & Duyệt</Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
