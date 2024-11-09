import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Search, Filter, FileDown } from 'lucide-react';

export default function ListTeachers() {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;

    const [teachers, setTeachers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTeachers, setFilteredTeachers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${API_URL}/admin/teachers`, {
                    headers: {
                        'x-api-secret': API_KEY
                    }
                });

                if (res.status === 200) {
                    const data = res.data;

                    const filteredData = data.map(user => ({
                        id: user.user_id,
                        name: user.name,
                        email: user.email,
                        avatar: user.avatar,
                        created_at: user.created_at,
                        role: user.role,
                        status: user.status
                    }));

                    setTeachers(filteredData);
                } else {
                    console.error('Error fetching teachers:', res.statusText);
                }
            } catch (error) {
                console.error('Error fetching teachers:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [API_URL, API_KEY]);

    useEffect(() => {
        const filterTeachers = (teachers, term) => {
            return teachers.filter(teacher =>
                teacher.name.toLowerCase().includes(term.toLowerCase()) ||
                teacher.email.toLowerCase().includes(term.toLowerCase())
            );
        };

        setFilteredTeachers(filterTeachers(teachers, searchTerm));
    }, [teachers, searchTerm]);

    return (
        <SidebarProvider>
            <SideBarUI />
            <SidebarInset>
                <header className="absolute left-1 top-3 font-sans">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/teachers">Danh sách giảng viên</BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <div className="absolute top-16 px-6 bg-gray-50 w-full font-sans">
                    <Card>
                        <CardHeader>
                            <CardTitle>Danh sách giảng viên</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex flex-wrap gap-4 w-full md:w-auto">
                                    <div className="relative flex-1 md:flex-initial">
                                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Tìm kiếm giảng viên..."
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

                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-gray-600 font-bold text-center bg-yellow-100 ">STT</TableHead>
                                            <TableHead className="text-gray-600 font-bold text-center bg-yellow-100 ">Avatar</TableHead>
                                            <TableHead className="text-gray-600 font-bold text-center bg-yellow-100 ">Họ và tên</TableHead>
                                            <TableHead className="text-gray-600 font-bold text-center bg-yellow-100 ">Email</TableHead>
                                            <TableHead className="text-gray-600 font-bold text-center bg-yellow-100 ">Trạng thái</TableHead>
                                            <TableHead className="text-gray-600 font-bold text-center bg-yellow-100 ">Ngày</TableHead>
                                            <TableHead className="text-gray-600 font-bold text-center bg-yellow-100 ">Quyền</TableHead>
                                            <TableHead className="text-gray-600 font-bold text-center bg-yellow-100 ">Thao tác</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isLoading ? (
                                            <TableRow>
                                                <TableCell colSpan="8" className="text-center">
                                                    Đang tải dữ liệu...
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredTeachers.map((teacher, index) => (
                                                <TableRow key={teacher.id}>
                                                        <TableCell className="text-center">{index + 1}</TableCell>
                                                        <TableCell className="flex justify-center items-center gap-3">
                                                        <img
                                                            src={teacher.avatar}
                                                            alt={`Avatar of ${teacher.name}`}
                                                            className="w-10 h-10 rounded-full object-cover"
                                                        />
                                                    </TableCell>
                                                    <TableCell className="font-medium text-center">{teacher.name}</TableCell>
                                                    <TableCell className="text-center">{teacher.email}</TableCell>
                                                    <TableCell className="text-center">
                                                        <span className={`px-2 py-1 w-full rounded-full text-xs text-center ${
                                                            teacher.status === 1
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-red-100 text-red-800"
                                                        }`}>
                                                            {teacher.status === 1 ? "Đang hoạt động" : "Bị khóa"}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {new Date(teacher.created_at).toLocaleDateString('vi-VN')}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {teacher.role === "teacher" ? "Giảng viên" : teacher.role}
                                                    </TableCell>
                                                    <TableCell className="text-center; cursor-pointer">
                                                        <Button variant="ghost" size="sm">
                                                            Chi tiết
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
