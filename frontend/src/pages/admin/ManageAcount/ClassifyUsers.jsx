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
import { Search, ChevronDown, FileDown, Trash, Pencil, UserCircle, School, CheckCircle, XCircle, Lock, UserCog, ShieldCheck } from 'lucide-react';
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button";
import axios from "axios";
import * as XLSX from 'xlsx';
import { toast } from "react-hot-toast";
import { useNavigate, } from "react-router-dom";

export default function ClassifyUsers() {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;

    const [students, setStudents] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [filterCriteria, setFilterCriteria] = useState('all');
    const navigate = useNavigate();

    const [editingUserId, setEditingUserId] = useState(null);

    const filterOptions = [
        { value: 'all', label: 'Tất cả người dùng' },
        { value: 'admin', label: 'Quản trị viên' },
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


    const getFilteredData = () => {
        const combinedData = [...students, ...teachers, ...admins];

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

    const fetchData = async () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            toast.error("Bạn chưa đăng nhập.");
            navigate('/');
            return;
        }

        try {
            setIsLoading(true);
            const [teachersRes, studentsRes, adminsRes] = await Promise.all([
                axios.get(`${API_URL}/admin/teachers`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "x-api-secret": API_KEY,
                    }
                }),
                axios.get(`${API_URL}/admin/users`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "x-api-secret": API_KEY,
                    }
                }),
                axios.get(`${API_URL}/admin/admins`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "x-api-secret": API_KEY,
                    }
                }),
            ]);

            if (teachersRes.data && studentsRes.data && adminsRes.data) {
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

                const adminsData = adminsRes.data.map(user => ({
                    ...user,
                    id: user.user_id,
                    role: 'admin'
                }));

                setTeachers(teachersData);
                setStudents(studentsData);
                setAdmins(adminsData);

                console.log("Teachers:", teachersData);
                console.log("Students:", studentsData);
                console.log("Admins:", adminsData);
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
            toast.error("Có lỗi xảy ra khi tải dữ liệu người dùng.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditUser = async (userId) => {
        console.log("User ID:", userId);
        const token = localStorage.getItem("access_token");
        if (!token) {
            toast.error("Bạn chưa đăng nhập.");
            navigate('/');
            return;
        }

        if (!userId) {
            toast.error("Không tìm thấy ID người dùng.");
            return;
        }
        setIsLoading(true);
        try {
            const response = await axios.put(
                `${API_URL}/admin/user/${userId}/toggle-role`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "x-api-secret": API_KEY,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data && response.data.message) {  // Sửa điều kiện kiểm tra
                toast.success("Cập nhật quyền thành công.");
                fetchData();  // Thêm dòng này để refresh data
                setEditingUserId(null); // Đóng dialog
            } else {
                toast.error("Có lỗi xảy ra khi cập nhật quyền.");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật quyền:", error);
            toast.error("Có lỗi xảy ra khi cập nhật quyền người dùng.");
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteUser = async (user_id) => {
        console.log("Deleting user:", user_id);
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
                                    <BreadcrumbLink >Phân loại người dùng</BreadcrumbLink>
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
                                            <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-3 text-yellow-900">STT</TableHead>
                                            <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-6 text-yellow-900">Avatar</TableHead>
                                            <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-6 text-yellow-900">Tên</TableHead>
                                            <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-6 text-yellow-900">Email</TableHead>
                                            <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-6 text-yellow-900 whitespace-nowrap">Ngày tạo</TableHead>
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

                                                <TableCell className="text-center">
                                                    <span className="text-center">
                                                        {user.role === "teacher" ? (
                                                            <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 font-medium border border-blue-200 shadow-sm whitespace-nowrap">
                                                                <School className="w-4 h-4" />
                                                                <span className="text-sm">Giảng viên</span>
                                                            </div>
                                                        ) : user.role === "admin" ? (
                                                            <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-50 text-red-700 font-medium border border-red-200 shadow-sm whitespace-nowrap">
                                                                <ShieldCheck className="w-4 h-4" />
                                                                <span className="text-sm">Quản trị viên</span>
                                                            </div>
                                                        ) : (
                                                            <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 font-medium border border-purple-200 shadow-sm whitespace-nowrap">
                                                                <UserCircle className="w-4 h-4" />
                                                                <span className="text-sm">Học viên</span>
                                                            </div>
                                                        )}
                                                    </span>

                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex justify-center items-center gap-2">
                                                        <Dialog
                                                            open={editingUserId === user.id}
                                                            onOpenChange={(open) => {
                                                                if (!open) {
                                                                    setEditingUserId(null);
                                                                }
                                                            }}
                                                        >
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    onClick={() => setEditingUserId(user.id)}
                                                                    className="hover:bg-gray-100 transition-all duration-200 rounded-full"
                                                                >
                                                                    <Pencil className="h-4 w-4 mr-1 text-gray-600" />
                                                                    <span className="text-gray-700">Sửa</span>
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="sm:max-w-[320px] p-0 border-0 rounded-xl shadow-xl">
                                                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-xl p-6">
                                                                    <DialogHeader>
                                                                        <DialogTitle className="flex items-center justify-center text-lg font-semibold text-gray-800">
                                                                            <UserCog className="h-5 w-5 mr-2 text-gray-700" />
                                                                            Tùy chọn người dùng
                                                                        </DialogTitle>
                                                                    </DialogHeader>
                                                                </div>

                                                                <div className="p-4 space-y-3">
                                                                    <Button
                                                                        type="submit"
                                                                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transform transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                                                                        disabled={isLoading}
                                                                        onClick={() => handleEditUser(user.id)}  // Chuyển onClick lên Button
                                                                    >
                                                                        {isLoading ? (
                                                                            <div className="flex items-center justify-center">
                                                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                                                                Đang xử lý...
                                                                            </div>
                                                                        ) : (
                                                                            <div className="flex items-center justify-center">
                                                                                <UserCog className="h-4 w-4 mr-2" />
                                                                                Sửa quyền
                                                                            </div>
                                                                        )}
                                                                    </Button>

                                                                    <Button
                                                                        variant="ghost"
                                                                        className="w-full text-white hover:text-red-50 bg-red-600 hover:bg-red-700 border border-red-200 font-medium transition-all duration-200 hover:shadow-sm"
                                                                    >
                                                                        <Lock className="h-4 w-4 mr-2" />
                                                                        Khóa tài khoản
                                                                    </Button>
                                                                </div>
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
