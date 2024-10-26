import React from 'react';
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
import { Search, Filter, Download, FileDown, Clock, Users, BookOpen, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const BrowseNewCourses = () => {
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
                                        Dashboard
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/admin/courses" className="flex items-center gap-1 text-blue-600">
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

                <div className="absolute top-14 px-6 bg-gray-50 w-full min-h-screen pb-8">
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
                                        />
                                    </div>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <Filter size={16} />
                                        Lọc theo trạng thái
                                    </Button>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <FileDown size={16} />
                                        Xuất báo cáo
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                                {/* Course Review Card 1 */}
                                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">Lập Trình React Native Cơ Bản</h3>
                                            <p className="text-sm text-gray-500 mt-1">Submitted by: Nguyễn Văn A</p>
                                        </div>
                                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                            Chờ duyệt
                                        </Badge>
                                    </div>
                                    <p className="text-gray-600 mb-4">
                                        Khóa học giúp học viên làm quen với React Native và xây dựng ứng dụng di động đa nền tảng.
                                    </p>
                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm text-gray-600">8 tuần</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm text-gray-600">24 bài học</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm text-gray-600">Trình độ: Cơ bản</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 mt-4">
                                        <Button className="flex-1">Xem chi tiết</Button>
                                        <Button variant="outline" className="flex items-center gap-2 flex-1">
                                            <CheckCircle className="h-4 w-4" />
                                            Phê duyệt
                                        </Button>
                                        <Button variant="destructive" className="flex items-center gap-2 flex-1">
                                            <XCircle className="h-4 w-4" />
                                            Từ chối
                                        </Button>
                                    </div>
                                </div>

                                {/* Course Review Card 2 */}
                                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">UI/UX Design Masterclass</h3>
                                            <p className="text-sm text-gray-500 mt-1">Submitted by: Trần Thị B</p>
                                        </div>
                                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                            Chờ duyệt
                                        </Badge>
                                    </div>
                                    <p className="text-gray-600 mb-4">
                                        Khóa học chuyên sâu về thiết kế giao diện người dùng và trải nghiệm người dùng.
                                    </p>
                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm text-gray-600">12 tuần</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm text-gray-600">36 bài học</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm text-gray-600">Trình độ: Nâng cao</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 mt-4">
                                        <Button className="flex-1">Xem chi tiết</Button>
                                        <Button variant="outline" className="flex items-center gap-2 flex-1">
                                            <CheckCircle className="h-4 w-4" />
                                            Phê duyệt
                                        </Button>
                                        <Button variant="destructive" className="flex items-center gap-2 flex-1">
                                            <XCircle className="h-4 w-4" />
                                            Từ chối
                                        </Button>
                                    </div>
                                </div>

                                {/* Course Review Card 3 */}
                                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">UI/UX Design Masterclass</h3>
                                            <p className="text-sm text-gray-500 mt-1">Submitted by: Trần Thị B</p>
                                        </div>
                                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                            Chờ duyệt
                                        </Badge>
                                    </div>
                                    <p className="text-gray-600 mb-4">
                                        Khóa học chuyên sâu về thiết kế giao diện người dùng và trải nghiệm người dùng.
                                    </p>
                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm text-gray-600">12 tuần</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm text-gray-600">36 bài học</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm text-gray-600">Trình độ: Nâng cao</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 mt-4">
                                        <Button className="flex-1">Xem chi tiết</Button>
                                        <Button variant="outline" className="flex items-center gap-2 flex-1">
                                            <CheckCircle className="h-4 w-4" />
                                            Phê duyệt
                                        </Button>
                                        <Button variant="destructive" className="flex items-center gap-2 flex-1">
                                            <XCircle className="h-4 w-4" />
                                            Từ chối
                                        </Button>
                                    </div>
                                </div>

                                {/* Course Review Card 4 */}
                                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">UI/UX Design Masterclass</h3>
                                            <p className="text-sm text-gray-500 mt-1">Submitted by: Trần Thị B</p>
                                        </div>
                                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                            Chờ duyệt
                                        </Badge>
                                    </div>
                                    <p className="text-gray-600 mb-4">
                                        Khóa học chuyên sâu về thiết kế giao diện người dùng và trải nghiệm người dùng.
                                    </p>
                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm text-gray-600">12 tuần</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm text-gray-600">36 bài học</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm text-gray-600">Trình độ: Nâng cao</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 mt-4">
                                        <Button className="flex-1">Xem chi tiết</Button>
                                        <Button variant="outline" className="flex items-center gap-2 flex-1">
                                            <CheckCircle className="h-4 w-4" />
                                            Phê duyệt
                                        </Button>
                                        <Button variant="destructive" className="flex items-center gap-2 flex-1">
                                            <XCircle className="h-4 w-4" />
                                            Từ chối
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default BrowseNewCourses;
