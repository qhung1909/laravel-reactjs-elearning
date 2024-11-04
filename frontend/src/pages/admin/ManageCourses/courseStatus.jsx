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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Search, Loader2, BookOpen, Users, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";

export default function CourseStatus() {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;

    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
    const [statusNote, setStatusNote] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [courses, setCourses] = useState([]);
    const [statusOptions, setStatusOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [newStatus, setNewStatus] = useState("");

    const fetchCourses = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/courses`, {
                headers: {
                    'x-api-secret': API_KEY
                }
            });
            const data = res.data;
            setCourses(data);

            const uniqueStatuses = [...new Set(data.map(course => course.status))];
            const statusOptionsWithColors = uniqueStatuses.map(status => ({
                value: status,
                color: getStatusColorByValue(status)
            }));
            setStatusOptions(statusOptionsWithColors);

        } catch (error) {
            console.error('Error fetching Courses:', error);
            toast.error('Không thể tải danh sách khóa học. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColorByValue = (status) => {
        switch (status.toLowerCase()) {
            case "published":
                return "bg-green-100 text-green-800 w-full text-center flex justify-center items-center p-1 rounded-lg  ";
            case "draft":
                return "bg-blue-100 text-blue-800 w-full text-center flex justify-center items-center p-1 rounded-lg";
            case "pending":
                return "bg-yellow-100 text-yellow-800 w-full text-center flex justify-center items-center p-1 rounded-lg";
            case "unpublished":
                return "bg-red-500 text-white w-full text-center flex justify-center items-center p-1 rounded-lg ";
        }
    };
    const getStatusText = (status) => {
        switch (status) {
            case "draft":
                return "Nháp";
            case "published":
                return "Hoàn thành";
            case "pending":
                return "Đang chờ";
            case "unpublished":
                return "Thất bại";
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const getStatusColor = (status) => {
        const statusOption = statusOptions.find(opt => opt.value === status);
        return statusOption ? statusOption.color : "bg-gray-300";
    };

    const handleStatusChange = async () => {
        if (!newStatus) {
            toast.error('Vui lòng chọn trạng thái mới.');
            return;
        }

        console.log('Updating course status:', {
            courseId: selectedCourse.course_id,
            newStatus: newStatus,
            note: statusNote,
        });

        setIsUpdating(true);
        try {
            await axios.patch(
                `${API_URL}/admin/courses/${selectedCourse.course_id}/status`,
                {
                    status: newStatus,
                    note: statusNote
                },
                {
                    headers: {
                        'x-api-secret': API_KEY
                    }
                }
            );

            setCourses(courses.map(course => {
                if (course.course_id === selectedCourse.course_id) {
                    return {
                        ...course,
                        status: newStatus,
                        lastUpdated: new Date().toISOString()
                    };
                }
                return course;
            }));

            toast.success('Đã cập nhật trạng thái khóa học.');

            setIsStatusDialogOpen(false);
            setStatusNote("");
            setNewStatus("");
        } catch (error) {
            console.error('Error updating course status:', error);
            toast.error('Không thể cập nhật trạng thái. Vui lòng thử lại sau.');
        } finally {
            setIsUpdating(false);
        }
    };

    const openStatusDialog = (course) => {
        console.log('Opening status dialog for course:', course); // Kiểm tra khóa học

        setSelectedCourse(course);
        setNewStatus(course.status);
        setIsStatusDialogOpen(true);
    };

    const filteredCourses = courses.filter(course => {
        const matchesStatus = filterStatus === "all" || course.status === filterStatus;
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            course.user.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <SidebarProvider>
            <SideBarUI />
            <SidebarInset>
                <div className="w-full">
                    <div className="absolute top-16 px-6 bg-gray-50 w-full min-h-screen">
                        <div className="mb-4">
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href="/admin/courses">Khóa học</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink>Trạng thái</BreadcrumbLink>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Trạng thái khóa học</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex gap-4">
                                        <Select
                                            value={filterStatus}
                                            onValueChange={setFilterStatus}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Lọc theo trạng thái" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                                {statusOptions.map((option) => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        <div className="flex items-center">
                                                            <Badge className={option.color}>
                                                                {/* {option.value} */}
                                                                {`${getStatusText(option.value)}`}
                                                            </Badge>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <div className="relative">
                                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Tìm kiếm khóa học..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-8 w-[300px]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {isLoading ? (
                                    <div className="flex justify-center items-center h-32">
                                        <Loader2 className="h-8 w-8 animate-spin" />
                                    </div>
                                ) : (
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-yellow-100">
                                                    <TableHead  className="font-semibold text-center">ID</TableHead>
                                                    <TableHead  className="font-semibold text-center">Tên khóa học</TableHead>
                                                    <TableHead  className="font-semibold text-center">Giảng viên</TableHead>
                                                    <TableHead  className="font-semibold text-center">Trạng thái</TableHead>
                                                    <TableHead  className="font-semibold text-center">Thao tác</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredCourses.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={4} className="text-center">
                                                            Không tìm thấy khóa học nào
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    filteredCourses.map((course) => (
                                                        <TableRow key={course.id}>
                                                            <TableCell className="font-medium">
                                                                {course.course_id}
                                                            </TableCell>
                                                            <TableCell className="font-medium">
                                                                {course.title}
                                                            </TableCell>
                                                            <TableCell>{course.user.name}</TableCell>
                                                            <TableCell>
                                                                <Badge className={getStatusColor(course.status)}>
                                                                    {getStatusText(course.status)}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <Button
                                                                    onClick={() => openStatusDialog(course)}
                                                                    variant="outline"
                                                                >
                                                                    Thay đổi trạng thái
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

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
                                <Label>Trạng thái hiện tại</Label>
                                <Badge className={`${getStatusColor(selectedCourse?.status)} px-2 py-2 rounded-md`}>
                                {`${getStatusText(selectedCourse?.status)}`}
                                </Badge>
                            </div>
                            <div className="grid gap-2">
                                <Label>Trạng thái mới</Label>
                                <Select
                                    value={newStatus}
                                    onValueChange={setNewStatus}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusOptions.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                <div className="flex items-center">
                                                    <Badge className={option.color}>
                                                        {/* {option.value} */}
                                                        {`${getStatusText(option.value)}`}
                                                    </Badge>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* Ghi chú */}
                            {/* <div className="grid gap-2">
                                <Label>Ghi chú</Label>
                                <Textarea
                                    value={statusNote}
                                    onChange={(e) => setStatusNote(e.target.value)}
                                    placeholder="Nhập ghi chú về việc thay đổi trạng thái (không bắt buộc)"
                                />
                            </div> */}
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsStatusDialogOpen(false)}
                                disabled={isUpdating}
                            >
                                Hủy
                            </Button>
                            <Button
                                onClick={handleStatusChange}
                                disabled={isUpdating}
                            >
                                {isUpdating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Đang cập nhật
                                    </>
                                ) : (
                                    'Lưu thay đổi'
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </SidebarInset>
            <Toaster position="top-right" />
        </SidebarProvider>
    );
}


