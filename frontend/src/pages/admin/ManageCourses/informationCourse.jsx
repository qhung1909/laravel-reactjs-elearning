import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, Download, FileDown } from "lucide-react";

export default function InformationCourse() {
    const [courses] = useState([
        { id: 1, name: "Khóa học JavaScript", description: "Khóa học cơ bản về JavaScript", category: "Frontend" },
        { id: 2, name: "Khóa học React", description: "Học cách xây dựng ứng dụng với React", category: "Frontend" },
        { id: 3, name: "Khóa học Tailwind CSS", description: "Thiết kế UI nhanh với Tailwind CSS", category: "UI/UX" },
    ]);

    const [searchTerm, setSearchTerm] = useState("");

    const handleView = (course) => {
        alert(`Tên khóa học: ${course.name}\nMô tả: ${course.description}`);
    };

    const handleExport = () => {
        const csvContent = courses
            .map(course => `${course.id},${course.name},${course.description}`)
            .join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "courses.csv";
        a.click();
    };

    const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
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
                                    <BreadcrumbLink href="/admin/courses" className="flex items-center gap-1 text-blue-600">
                                    {/* <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/angular.svg" className='h-5 w-5'/> */}
                                        Danh sách tất cả khóa học
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                        {/* Main Content */}
                        <div className="absolute top-14 px-6 bg-gray-50 w-full">
                        <Card className="w-full">
                            <CardHeader>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Thông tin khóa học</h1>
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

                            </CardHeader>

                            <CardContent>
                                <div className="border rounded-lg overflow-hidden">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b bg-gray-50">
                                                <th className="text-left p-4 font-medium">Tên khóa học</th>
                                                <th className="text-left p-4 font-medium">Mô tả</th>
                                                <th className="text-center p-4 font-medium w-32">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredCourses.map((course) => (
                                                <tr key={course.id} className="border-b">
                                                    <td className="p-4">{course.name}</td>
                                                    <td className="p-4">{course.description}</td>
                                                    <td className="p-4">
                                                        <div className="flex justify-center gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleView(course)}
                                                            >
                                                                Xem
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                            >
                                                                Xóa
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {filteredCourses.length === 0 && (
                                        <div className="text-center p-8 text-gray-500">
                                            Không tìm thấy khóa học nào
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
};
