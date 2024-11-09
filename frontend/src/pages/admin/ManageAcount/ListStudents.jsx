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
import { Input } from "@/components/ui/input";
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
import { Search, UserPlus, Filter, FileDown, Eye } from 'lucide-react';

export default function ListStudents() {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;

    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${API_URL}/admin/users`, {
                    headers: {
                        'x-api-secret': API_KEY
                    }
                });
                const data = res.data;

                console.log("Dữ liệu từ API:", data);

                const filteredData = data.map(user => ({
                    id: user.user_id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    created_at: user.created_at,
                    role: user.role,
                    status: user.status
                }));
                console.log(data.status);
                setStudents(filteredData);
            } catch (error) {
                console.error('Error fetching Users:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);


    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
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
                                        <BreadcrumbLink href="/">
                                            Trang chủ
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href="/students">
                                            Danh sách học viên
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>

                    <div className="absolute top-16 px-6 bg-gray-50 w-full font-sans">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                    <CardTitle className="mb-0">Danh sách học viên</CardTitle>

                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <div className="relative w-full md:w-64">
                                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Tìm kiếm học viên..."
                                                className="pl-9 pr-4 py-2 border border-gray-200 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap">
                                                <Filter size={16} />
                                                Lọc
                                            </Button>
                                            <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap">
                                                <FileDown size={16} />
                                                Xuất
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-6 text-yellow-900">STT</TableHead>
                                                <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-6 text-yellow-900">Avatar</TableHead>
                                                <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-6 text-yellow-900">Họ và tên</TableHead>
                                                <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-6 text-yellow-900">Email</TableHead>
                                                <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-6 text-yellow-900">Trạng thái</TableHead>
                                                <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-6 text-yellow-900">Ngày</TableHead>
                                                <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-6 text-yellow-900">Quyền</TableHead>
                                                <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-6 text-yellow-900">Thao tác</TableHead>
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
                                                filteredStudents.map((student, index) => (
                                                    <TableRow key={student.user_id}>
                                                        <TableCell className="text-center">{index + 1}</TableCell>
                                                        <TableCell className="flex justify-center items-center gap-3">
                                                            <img
                                                                src={student.avatar}
                                                                alt={`Avatar of ${student.name}`}
                                                                className="w-10 h-10 rounded-full object-cover"
                                                            />
                                                        </TableCell>
                                                        <TableCell className="font-medium text-center">{student.name}</TableCell>
                                                        <TableCell className="text-center">{student.email}</TableCell>
                                                        <TableCell className="text-center">
                                                            <span className={`px-2 py-1 w-full rounded-full text-xs text-center ${student.status === 1
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-red-100 text-red-800"
                                                                }`}>
                                                                {student.status === 1 ? "Đang hoạt động" : "Bị khóa"}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            {new Date(student.created_at).toLocaleDateString('vi-VN')}
                                                        </TableCell>
                                                        <TableCell className="text-center ">
                                                            <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-medium">
                                                                {student.role === "user" ? "Học viên" : student.role}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-center; cursor-pointer">
                                                            {/* <Button variant="ghost" size="sm">
                                                                Chi tiết
                                                            </Button> */}
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="hover:bg-yellow-50 hover:text-yellow-700 transition-colors"
                                                            >
                                                                <Eye className="h-4 w-4 mr-1" />
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
        </>
    );
}
