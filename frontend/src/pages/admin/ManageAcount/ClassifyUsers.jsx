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
import { Search, ChevronDown, FileDown, Trash, Pencil } from 'lucide-react';
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button";
import axios from "axios";
import * as XLSX from 'xlsx';

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

    const exportToExcel = () => {
        let dataToExport = [];

        if (filterCriteria === 'all' || filterCriteria === 'teacher') {
            dataToExport = [...dataToExport, ...teachers];
        }
        if (filterCriteria === 'all' || filterCriteria === 'user') {
            dataToExport = [...dataToExport, ...students];
        }

        if (searchTerm) {
            dataToExport = dataToExport.filter(user =>
                user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.phone?.includes(searchTerm)
            );
        }

        const excelData = [
            ['STT', 'Họ và tên', 'Email', 'Vai trò', 'Ngày tạo', 'Trạng thái'],
            ...dataToExport.map((user, index) => [
                index + 1,
                user.name,
                user.email,
                user.role === 'teacher' ? 'Giảng viên' : 'Học viên',
                new Date(user.created_at).toLocaleString('vi-VN'),
                user.status ? 'Hoạt động' : 'Không hoạt động'
            ])
        ];

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(excelData);

        ws['!cols'] = [
            { wch: 10 },
            { wch: 25 },
            { wch: 30 },
            { wch: 12 },
            { wch: 20 },
            { wch: 15 }
        ];

        XLSX.utils.book_append_sheet(wb, ws, "Danh sách người dùng");

        const timestamp = new Date().toISOString().slice(0, 10);
        XLSX.writeFile(wb, `danh_sach_nguoi_dung_${timestamp}.xlsx`);
    };


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
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <CardTitle className="text-xl font-semibold mb-0">Phân loại người dùng</CardTitle>

                                <div className="flex items-center flex-wrap gap-4 w-full md:w-auto">
                                    <div className="relative w-full md:w-64">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                                        <Input
                                            type="text"
                                            placeholder="Tìm kiếm người dùng..."
                                            className="pl-9 pr-4 w-full"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="flex items-center gap-2 whitespace-nowrap"
                                                >
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

                                        <Button
                                            variant="outline"
                                            className="flex items-center gap-2 whitespace-nowrap"
                                            onClick={exportToExcel}
                                        >
                                            <FileDown className="h-4 w-4" />
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
                                            <TableRow
                                                key={user.id}
                                                className="hover:bg-gray-50 transition-colors duration-150"
                                            >
                                                <TableCell className="font-medium text-center text-gray-600">{index + 1}</TableCell>
                                                <TableCell className="text-center">
                                                    <div className="relative inline-block">
                                                        <img
                                                            src={user.avatar}
                                                            alt={user.name}
                                                            className="w-10 h-10 rounded-full object-cover ring-2 ring-offset-2 ring-yellow-100"
                                                        />
                                                        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${user.status === 1 ? "bg-green-500" : "bg-red-500"
                                                            }`}></span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center font-medium">{user.name}</TableCell>
                                                <TableCell className="text-center text-gray-600">{user.email}</TableCell>
                                                <TableCell className="text-center text-gray-600">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${user.status === 1
                                                        ? "bg-green-50 text-green-700 ring-1 ring-green-600/20"
                                                        : "bg-red-50 text-red-700 ring-1 ring-red-600/20"
                                                        }`}>
                                                        {user.status === 1 ? "Hoạt động" : "Không hoạt động"}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-medium ring-1 ring-yellow-600/20">
                                                        {user.role === "teacher" ? "Giảng viên" : "Học viên"}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex justify-center items-center gap-2">
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="hover:bg-yellow-50 hover:text-yellow-700 transition-colors"
                                                                >
                                                                    <Pencil className="h-4 w-4 mr-1" />
                                                                    Thay đổi
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="sm:max-w-[425px]">
                                                                <DialogHeader>
                                                                    <DialogTitle className="text-lg font-semibold">Chỉnh sửa người dùng</DialogTitle>
                                                                    <DialogDescription className="text-gray-500">
                                                                        Thay đổi thông tin người dùng tại đây. Nhấn lưu khi hoàn tất.
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <div className="grid gap-4 py-4">
                                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                                        <Label htmlFor="role" className="text-right text-gray-600">
                                                                            Quyền
                                                                        </Label>
                                                                        <select
                                                                            id="role"
                                                                            defaultValue={user.role}
                                                                            className="col-span-3 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                                                        >
                                                                            <option value="user">Học viên</option>
                                                                            <option value="teacher">Giảng viên</option>
                                                                            <option value="viewer">Quản trị viên</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <DialogFooter>
                                                                    <Button
                                                                        type="submit"
                                                                        onClick={() => handleEditUser(user.id)}
                                                                        className="bg-yellow-600 hover:bg-yellow-700 text-white"
                                                                    >
                                                                        Lưu thay đổi
                                                                    </Button>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>

                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="hover:bg-red-50 hover:text-red-600 transition-colors"
                                                                >
                                                                    <Trash className="h-4 w-4 mr-1" />
                                                                    Xóa
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle className="text-lg font-semibold">
                                                                        Bạn có chắc chắn muốn xóa?
                                                                    </AlertDialogTitle>
                                                                    <AlertDialogDescription className="text-gray-500">
                                                                        Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn tài khoản người dùng và loại bỏ nó khỏi hệ thống của chúng tôi.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter className="gap-2">
                                                                    <AlertDialogCancel className="hover:bg-gray-100">
                                                                        Hủy
                                                                    </AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => handleDeleteUser(user.id)}
                                                                        className="bg-red-600 hover:bg-red-700 text-white"
                                                                    >
                                                                        Tiếp tục
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
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
