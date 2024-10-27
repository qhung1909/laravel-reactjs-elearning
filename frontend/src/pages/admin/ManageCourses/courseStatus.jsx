import React, { useState, useEffect } from 'react';
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
import { Button } from "@/components/ui/button";
import {
    Filter,
    FileDown,
    History
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Download, Clock, Users, BookOpen, CheckCircle, XCircle } from "lucide-react";

export default function CourseStatus() {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
    const [statusNote, setStatusNote] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [courses, setCourses] = useState([]);
    const [statusOptions, setStatusOptions] = useState([]); // Thêm trạng thái options vào state

    // Fetch courses and status from API
    const fetchCourses = async () => {
        try {
            const response = await fetch('YOUR_API_URL_HERE'); // Thay YOUR_API_URL_HERE bằng URL API của bạn
            if (!response.ok) {
                throw new Error('Failed to fetch courses');
            }
            const data = await response.json();
            setCourses(data.courses); // Giả sử response có trường 'courses'
            setStatusOptions(data.statusOptions); // Giả sử response có trường 'statusOptions'
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    useEffect(() => {
        fetchCourses(); // Gọi hàm fetchCourses khi component mount
    }, []);

    const getStatusColor = (status) => {
        const statusOption = statusOptions.find(opt => opt.value === status);
        return statusOption ? statusOption.color : "bg-gray-300";
    };

    const handleStatusChange = (courseId, newStatus) => {
        setCourses(courses.map(course => {
            if (course.id === courseId) {
                return {
                    ...course,
                    status: newStatus,
                    lastUpdated: new Date().toISOString().split('T')[0]
                };
            }
            return course;
        }));
        setIsStatusDialogOpen(false);
        setStatusNote("");
    };

    const openStatusDialog = (course) => {
        setSelectedCourse(course);
        setIsStatusDialogOpen(true);
    };

    const StatusChangeDialog = () => (
        <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Thay đổi trạng thái khóa học</DialogTitle>
                    <DialogDescription>
                        Cập nhật trạng thái cho khóa học: {selectedCourse?.title}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Trạng thái mới</Label>
                        <Select
                            onValueChange={(value) => handleStatusChange(selectedCourse?.id, value)}
                            defaultValue={selectedCourse?.status}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label>Ghi chú</Label>
                        <Textarea
                            placeholder="Nhập ghi chú về việc thay đổi trạng thái..."
                            value={statusNote}
                            onChange={(e) => setStatusNote(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
                        Hủy
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );

    return (
        <SidebarProvider>
            <SideBarUI />
            <SidebarInset>
                <div className="w-full">
                    <header className="z-10 absolute left-1 top-3">
                        <div className="flex items-center gap-2 px-4 h-14">
                            <SidebarTrigger />
                            <Separator orientation="vertical" className="h-6" />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href="/admin/courses">
                                            Quản lý trạng thái khóa học
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>

                    {/* Main Content */}
                    <div className="absolute top-16 px-6 bg-gray-50 w-full min-h-screen">
                        <Card>
                            <CardHeader>
                                <CardTitle>Trạng thái khóa học</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center mb-4">
                                    <Select
                                        value={filterStatus}
                                        onValueChange={setFilterStatus}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Lọc theo trạng thái" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                            {statusOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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

                                <div className="border rounded-lg">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Tên khóa học</TableHead>
                                                <TableHead>Giảng viên</TableHead>
                                                <TableHead>Trạng thái</TableHead>
                                                <TableHead>Cập nhật</TableHead>
                                                <TableHead className="text-right">Thao tác</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {courses
                                                .filter(course => filterStatus === "all" || course.status === filterStatus)
                                                .map((course) => (
                                                    <TableRow key={course.id}>
                                                        <TableCell className="font-medium">{course.title}</TableCell>
                                                        <TableCell>{course.instructor}</TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                className={`${getStatusColor(course.status)} text-white`}
                                                            >
                                                                {statusOptions.find(opt => opt.value === course.status)?.label || 'Không có'}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>{course.lastUpdated}</TableCell>
                                                        <TableCell className="text-right">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => openStatusDialog(course)}
                                                            >
                                                                Thay đổi trạng thái
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </SidebarInset>
            <StatusChangeDialog />
        </SidebarProvider>
    );
}
