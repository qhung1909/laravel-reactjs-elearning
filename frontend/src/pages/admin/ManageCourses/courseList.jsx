import React from 'react';
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
    CheckCircle,
    Trash2,
    Plus,
    Search,
    LayoutDashboard,
    GraduationCap,
    Users2,
    FileDown,
    Filter
} from 'lucide-react';
import { SideBarUI } from '../sidebarUI';

const courses = [
    { id: 1, title: "Khóa học React", instructor: "Nguyễn Văn A", status: "Đang diễn ra", price: "500,000 VNĐ", students: 45 },
    { id: 2, title: "Khóa học JavaScript", instructor: "Trần Thị B", status: "Đang diễn ra", price: "400,000 VNĐ", students: 32 },
    { id: 3, title: "Khóa học CSS", instructor: "Lê Văn C", status: "Đang chờ", price: "300,000 VNĐ", students: 28 },
    { id: 4, title: "Khóa học HTML", instructor: "Nguyễn Thị D", status: "Đang diễn ra", price: "200,000 VNĐ", students: 50 },
    { id: 1, title: "Khóa học React", instructor: "Nguyễn Văn A", status: "Đang diễn ra", price: "500,000 VNĐ", students: 45 },
    { id: 2, title: "Khóa học JavaScript", instructor: "Trần Thị B", status: "Đang diễn ra", price: "400,000 VNĐ", students: 32 },
    { id: 3, title: "Khóa học CSS", instructor: "Lê Văn C", status: "Đang chờ", price: "300,000 VNĐ", students: 28 },
    { id: 4, title: "Khóa học HTML", instructor: "Nguyễn Thị D", status: "Đang diễn ra", price: "200,000 VNĐ", students: 50 },

];

const getStatusColor = (status) => {
    switch (status) {
        case "Đang diễn ra":
            return "bg-green-100 text-green-800";
        case "Hoàn thành":
            return "bg-blue-100 text-blue-800";
        case "Đang chờ":
            return "bg-yellow-100 text-yellow-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

export default function CourseList() {
    return (
        <SidebarProvider>
            <SideBarUI/>
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
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/admin/courses" className="flex items-center gap-1 text-blue-600">
                                    <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/angular.svg" className='h-5 w-5'/>
                                        Danh sách tất cả khóa học
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
                                    <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
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
                                    <p className="text-2xl font-bold text-gray-900">
                                        {courses.reduce((sum, course) => sum + course.students, 0)}
                                    </p>
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
                                    <p className="text-2xl font-bold text-gray-900">
                                        {courses.filter(course => course.status === "Đang diễn ra").length}
                                    </p>
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
                                            <th className="text-left py-4 px-6 font-medium text-sm text-gray-600">Tiêu đề</th>
                                            <th className="text-left py-4 px-6 font-medium text-sm text-gray-600">Giảng viên</th>
                                            <th className="text-left py-4 px-6 font-medium text-sm text-gray-600">Trạng thái</th>
                                            <th className="text-left py-4 px-6 font-medium text-sm text-gray-600">Học viên</th>
                                            <th className="text-left py-4 px-6 font-medium text-sm text-gray-600">Giá</th>
                                            <th className="text-right py-4 px-6 font-medium text-sm text-gray-600">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {courses.map((course) => (
                                            <tr
                                                key={course.id}
                                                className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="py-4 px-6 text-sm text-gray-600">#{course.id}</td>
                                                <td className="py-4 px-6">
                                                    <div className="font-medium text-gray-900">{course.title}</div>
                                                </td>
                                                <td className="py-4 px-6 text-sm text-gray-600">{course.instructor}</td>
                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                                                        {course.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-sm text-gray-900">{course.students}</td>
                                                <td className="py-4 px-6 text-sm text-gray-900 font-medium">{course.price}</td>
                                                <td className="py-4 px-6">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                                                            <CheckCircle size={14} className="text-green-600" />
                                                            Duyệt
                                                        </Button>
                                                        <Button variant="destructive" size="sm" className="flex items-center gap-1">
                                                            <Trash2 size={14} />
                                                            Xóa
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
