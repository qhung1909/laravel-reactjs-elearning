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
import { Search, ChevronDown, FileDown, UserCircle, XCircle, School, CheckCircle, Trash } from 'lucide-react';
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button";
import axios from "axios";
import * as XLSX from 'xlsx';

export default function PersonalInformation() {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;

    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [filterCriteria, setFilterCriteria] = useState('all');
    const [editingUser, setEditingUser] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');

    const filterOptions = [
        { value: 'all', label: 'Tất cả người dùng' },
        { value: 'teacher', label: 'Giảng viên' },
        { value: 'user', label: 'Học viên' },
        { value: 'active', label: 'Hoạt động' },
        { value: 'inactive', label: 'Không hoạt động' },
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

            let matchesFilter = true;

            switch (filterCriteria) {
                case 'teacher':
                    matchesFilter = user.role === 'teacher';
                    break;
                case 'user':
                    matchesFilter = user.role === 'user';
                    break;
                case 'active':
                    matchesFilter = user.status === 1;
                    break;
                case 'inactive':
                    matchesFilter = user.status !== 1;
                    break;
                default:
                    matchesFilter = true;
            }

            return matchesSearch && matchesFilter;
        });
    };


    const getCurrentFilterLabel = () => {
        return filterOptions.find(option => option.value === filterCriteria)?.label || 'Tất cả người dùng';
    };


    const handleDeleteUser = async (userId) => {
        console.log("Deleting user:", userId);
    };

    const exportToExcel = () => {
        const filteredData = getFilteredData();

        const formattedData = filteredData.map((user, index) => ({
            STT: index + 1,
            Avatar: user.avatar,
            Name: user.name,
            Email: user.email,
            CreatedAt: new Date(user.created_at).toLocaleDateString(),
            UpdatedAt: new Date(user.updated_at).toLocaleDateString(),
            Status: user.status === 1 ? 'Hoạt động' : 'Không hoạt động',
            Role: user.role === "teacher" ? 'Giảng viên' : 'Học viên'
        }));

        const ws = XLSX.utils.json_to_sheet(formattedData);
        ws['!cols'] = [
            { wpx: 50 }, // STT
            { wpx: 100 }, // Avatar
            { wpx: 150 }, // Name
            { wpx: 200 }, // Email
            { wpx: 120 }, // CreatedAt
            { wpx: 120 }, // UpdatedAt
            { wpx: 100 }, // Status
            { wpx: 100 }, // Role
        ];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'User Data');

        XLSX.writeFile(wb, 'user_data.xlsx');
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
                                    <BreadcrumbLink href="/classify-users">Thông tin & hồ sơ người dùng</BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <div className="absolute top-16 px-6 bg-gray-50 w-full font-sans">
                    <Card>

                        <div className="flex justify-between items-center mb-2 mr-6 ml-2">
                            <CardHeader>
                                <CardTitle>Thông tin & hồ sơ người dùng</CardTitle>
                            </CardHeader>
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
                                            {filterOptions.find(option => option.value === filterCriteria)?.label || 'Tất cả người dùng'}
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

                                <Button variant="outline" className="flex items-center gap-2" onClick={exportToExcel}>
                                    <FileDown className="h-4 w-4" />
                                    Xuất
                                </Button>
                            </div>
                        </div>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow >
                                            <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-3 text-yellow-900">STT</TableHead>
                                            <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-6 text-yellow-900">Avatar</TableHead>
                                            <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-6 text-yellow-900">Tên</TableHead>
                                            <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-6 text-yellow-900">Email</TableHead>
                                            <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-6 text-yellow-900 whitespace-nowrap">Ngày tạo</TableHead>
                                            <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-6 text-yellow-900 whitespace-nowrap">Ngày cập nhật</TableHead>
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
                                                <TableCell className="text-center">{user.name}</TableCell>
                                                <TableCell className="text-center">{user.email}</TableCell>
                                                <TableCell className="text-center">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {new Date(user.updated_at).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className={`inline-flex items-center justify-center space-x-1 p-1 rounded-full ${user.status === 1 ? 'bg-green-50 text-green-700 border-green-200 shadow-sm' : 'bg-red-50 text-red-700 border-red-200 shadow-sm'} font-medium ring-1 ${user.status === 1 ? 'ring-green-600/20' : 'ring-red-600/20'} whitespace-nowrap w-full`}>
                                                        {user.status === 1 ? (
                                                            <>
                                                                <CheckCircle className="w-4 h-4" />
                                                                <span className="text-sm">Hoạt động</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <XCircle className="w-4 h-4" />
                                                                <span className="text-sm">Không hoạt động</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className=" text-center">
                                                    {user.role === "teacher" ? (
                                                        <div className="inline-flex items-center  gap-1 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 font-medium border border-blue-200 shadow-sm whitespace-nowrap">
                                                            <School className="w-4 h-4" />
                                                            <span className="text-sm">Giảng viên</span>
                                                        </div>
                                                    ) : (
                                                        <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 font-medium border border-purple-200 shadow-sm whitespace-nowrap">
                                                            <UserCircle className="w-4 h-4" />
                                                            <span className="text-sm">Học viên</span>
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <AlertDialog className="cursor-pointer">
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
                                                                <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn tài khoản người dùng và loại bỏ nó khỏi hệ thống của chúng tôi.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDeleteUser(user.id)} className="bg-red-600 hover:bg-red-700 text-white">Tiếp tục</AlertDialogAction>
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
