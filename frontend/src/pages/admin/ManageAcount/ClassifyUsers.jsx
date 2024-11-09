'use client'

import { useState, useEffect } from "react";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { SideBarUI } from "../sidebarUI"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Search, ChevronDown, FileDown } from 'lucide-react';
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function ClassifyUsers() {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;

    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [filterCriteria, setFilterCriteria] = useState('all');
    const [editingUser, setEditingUser] = useState(null);

    const filterOptions = [
        { value: 'all', label: 'Tất cả người dùng' },
        { value: 'teacher', label: 'Giảng viên' },
        { value: 'user', label: 'Học viên' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [teachersRes, studentsRes] = await Promise.all([
                    axios.get(`${API_URL}/admin/teachers`, {
                        headers: { 'x-api-secret': API_KEY }
                    }),
                    axios.get(`${API_URL}/admin/users`, {
                        headers: { 'x-api-secret': API_KEY }
                    })
                ]);

                if (teachersRes.status === 200 && studentsRes.status === 200) {
                    const teachersData = teachersRes.data.map(user => ({
                        ...user,
                        id: user.user_id,
                        role: 'teacher'
                    }));

                    const studentsData = studentsRes.data.map(user => ({
                        ...user,
                        id: user.user_id,
                        role: 'user'
                    }));

                    setTeachers(teachersData);
                    setStudents(studentsData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [API_URL, API_KEY]);

    const getFilteredData = () => {
        const combinedData = [...students, ...teachers];

        return combinedData.filter(user => {
            const matchesSearch =
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesFilter =
                filterCriteria === 'all' ||
                user.role === filterCriteria;

            return matchesSearch && matchesFilter;
        });
    };

    const getCurrentFilterLabel = () => {
        return filterOptions.find(option => option.value === filterCriteria)?.label || 'Tất cả người dùng';
    };

    const handleEditUser = async (userId) => {
        console.log("Editing user:", userId);
        setEditingUser(null);
    };

    const handleDeleteUser = async (userId) => {
        console.log("Deleting user:", userId);
    };

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
                                    <BreadcrumbLink href="/admin">Trang chủ</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/classify-users">Phân loại người dùng</BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <div className="absolute top-16 px-6 bg-gray-50 w-full font-sans">
                    <Card>
                        <CardHeader>
                            <CardTitle>Phân loại người dùng</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex flex-wrap gap-4 w-full md:w-auto">
                                    <div className="relative flex-1 md:flex-initial">
                                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input
                                            type="text"
                                            placeholder="Tìm kiếm người dùng..."
                                            className="pl-9 pr-4 py-2 w-full md:w-64"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="flex items-center gap-2">
                                                {getCurrentFilterLabel()}
                                                <ChevronDown className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-[200px]">
                                            {filterOptions.map((option) => (
                                                <DropdownMenuItem
                                                    key={option.value}
                                                    onClick={() => setFilterCriteria(option.value)}
                                                >
                                                    {option.label}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    <Button variant="outline" className="flex items-center gap-2">
                                        <FileDown className="h-4 w-4" />
                                        Xuất
                                    </Button>
                                </div>
                            </div>

                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow >
                                            <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-6 text-yellow-900">STT</TableHead>
                                            <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-6 text-yellow-900">Avatar</TableHead>
                                            <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-6 text-yellow-900">Tên</TableHead>
                                            <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-6 text-yellow-900">Email</TableHead>
                                            <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-6 text-yellow-900">Ngày tạo</TableHead>
                                            <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-6 text-yellow-900">Trạng thái</TableHead>
                                            <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-6 text-yellow-900">Quyền</TableHead>
                                            <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-6 text-yellow-900">Hành động</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {!isLoading && getFilteredData().map((user, index) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium text-center">{index + 1}</TableCell>
                                                <TableCell className="text-center">
                                                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full mx-auto" />
                                                </TableCell>
                                                <TableCell className="text-center">{user.name}</TableCell>
                                                <TableCell className="text-center">{user.email}</TableCell>
                                                <TableCell className="text-center">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {user.status === 1 ? (
                                                        <span className="bg-green-500 text-white text-sm p-2 rounded-xl">Hoạt động</span>
                                                    ) : (
                                                        <span className="bg-red-500 text-white text-sm p-2 rounded-xl">Không hoạt động</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {user.role === "teacher" ? "Giảng viên" : "Học viên"}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm" className="mr-2">
                                                            Thay đổi
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[425px]">
                                                        <DialogHeader>
                                                            <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
                                                            <DialogDescription>
                                                                Thay đổi thông tin người dùng tại đây. Nhấn lưu khi hoàn tất.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="grid gap-4 py-4">
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <Label htmlFor="role" className="text-right">
                                                                    Quyền
                                                                </Label>
                                                                <select
                                                                    id="role"
                                                                    defaultValue={user.role}
                                                                    className="col-span-3 border rounded px-2 py-1"
                                                                >
                                                                    <option value="user">Học viên</option>
                                                                    <option value="teacher">Giảng viên</option>
                                                                    <option value="viewer">Quản trị viên</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <DialogFooter>
                                                            <Button type="submit" onClick={() => handleEditUser(user.id)}>
                                                                Lưu thay đổi
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="outline" size="sm">
                                                                Xóa
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn tài khoản người dùng và loại bỏ nó khỏi hệ thống của chúng tôi.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>Tiếp tục</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </TableCell>
                                            </TableRow>
                                        ))}
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
