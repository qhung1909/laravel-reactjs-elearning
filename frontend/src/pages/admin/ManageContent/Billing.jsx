import React, { useEffect, useState } from 'react';
import {
    Wallet,
    ShoppingCart,
    CheckCircle2,
    BadgeCheck,
    BanIcon,
    ChevronDown,
    FileDown,
    Search,
    CreditCard,
    Calendar,
    Mail,
    BookOpen,
    GraduationCap
} from "lucide-react";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as XLSX from 'xlsx';
import axios from 'axios';

export default function Billing() {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;

    const [searchTerm, setSearchTerm] = useState("");
    const [filterCriteria, setFilterCriteria] = useState('all');
    const [dateRange, setDateRange] = useState({ from: '', to: '' });

    const [purchases, setPurchases] = useState([]);

    useEffect(() => {

        const fetchOrders = async () => {
            try {
                const res = await axios.get(`${API_URL}/admin/orders`, {
                    headers: {
                        'x-api-secret': `${API_KEY}`
                    }
                })
                setPurchases(res.data.data);
                console.log(res.data.data);

            } catch (error) {
                console.log(error);
            }
        }

        fetchOrders();

    }, [])


    const filterOptions = [
        { value: 'all', label: 'Tất cả trạng thái' },
        { value: 'success', label: 'Thành công' },
        { value: 'failed', label: 'Thất bại' },
    ];


    const cleanPrice = (priceString) => {
        // Remove commas, spaces, and "đ" symbol, then convert to number
        return Number(priceString.replace(/[,\s₫đ]/g, ''));
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    // const formatDate = (dateString) => {
    //     return new Date(dateString).toLocaleDateString('vi-VN');
    // };

    const filteredPurchases = purchases.filter(purchase => {
        const matchesSearch = purchase.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            purchase.course_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterCriteria === 'all' || purchase.status === filterCriteria;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        totalRevenue: filteredPurchases.reduce((sum, p) =>
            p.status === 'success' ? sum + cleanPrice(p.total_price) : sum, 0),
        totalOrders: filteredPurchases.length,
        successfulOrders: filteredPurchases.filter(p => p.status === 'success').length,
    };



    const exportToExcel = () => {
        const excelData = [
            ['STT', 'Email', 'Tên khóa học', 'Giáo viên', 'Ngày mua', 'Phương thức thanh toán', 'Trạng thái', 'Tổng tiền'],
            ...filteredPurchases.map((purchase, index) => [
                index + 1,
                purchase.email,
                purchase.course_name,
                purchase.teacher_name,
                purchase.purchase_date,
                purchase.payment_method,
                purchase.status === 'success' ? 'Thành công' : 'Thất bại',
                formatCurrency(cleanPrice(purchase.total_price))
            ])
        ];

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(excelData);
        XLSX.utils.book_append_sheet(wb, ws, "Lịch sử mua hàng");
        XLSX.writeFile(wb, `lich_su_mua_hang_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };

    return (
        <SidebarProvider>
            <SideBarUI />
            <SidebarInset>
                <header className="absolute left-1 top-3 font-sans">
                    <div className="flex items-center gap-2 mb-6">
                        <SidebarTrigger />
                        <Separator orientation="vertical" className="h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/admin">Trang chủ</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/billing">Lịch sử mua hàng</BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <div className="absolute top-16 px-6 bg-gradient-to-b from-gray-50 to-white w-full font-sans">
                    <div className="grid gap-4 md:grid-cols-3 mb-6">
                        <Card className="bg-gradient-to-br from-blue-50 to-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <Wallet className="h-8 w-8 text-blue-500" />
                                <div>
                                    <CardTitle className="text-sm font-medium text-blue-600">Tổng doanh thu</CardTitle>
                                    <div className="text-2xl font-bold text-blue-700 mt-1">{formatCurrency(stats.totalRevenue)}</div>
                                </div>
                            </CardHeader>
                        </Card>
                        <Card className="bg-gradient-to-br from-purple-50 to-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <ShoppingCart className="h-8 w-8 text-purple-500" />
                                <div>
                                    <CardTitle className="text-sm font-medium text-purple-600">Tổng đơn hàng</CardTitle>
                                    <div className="text-2xl font-bold text-purple-700 mt-1">{stats.totalOrders}</div>
                                </div>
                            </CardHeader>
                        </Card>
                        <Card className="bg-gradient-to-br from-green-50 to-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CheckCircle2 className="h-8 w-8 text-green-500" />
                                <div>
                                    <CardTitle className="text-sm font-medium text-green-600">Đơn thành công</CardTitle>
                                    <div className="text-2xl font-bold text-green-700 mt-1">{stats.successfulOrders}</div>
                                </div>
                            </CardHeader>
                        </Card>
                    </div>

                    <Card>
                        <CardContent>
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4 my-6">
                                <div className="flex items-center gap-2">
                                    <CardTitle>Lịch sử mua hàng</CardTitle>
                                    <ShoppingCart className="h-5 w-5 text-gray-500" />
                                </div>
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <div className="relative w-full md:w-80">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                                        <Input
                                            placeholder="Tìm kiếm theo email hoặc khóa học..."
                                            className="pl-9"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="w-[180px]">
                                                {filterOptions.find(opt => opt.value === filterCriteria)?.label}
                                                <ChevronDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
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
                                        onClick={exportToExcel}
                                    >
                                        <FileDown className="mr-2 h-4 w-4" />
                                        Xuất Excel
                                    </Button>
                                </div>
                            </div>

                            <div className="rounded-md border bg-white shadow-sm">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50">
                                            <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-3 text-yellow-900">STT</TableHead>
                                            <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-3 text-yellow-900">Email</TableHead>
                                            <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-3 text-yellow-900">Tên khóa học</TableHead>
                                            <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-3 text-yellow-900">Giảng viên</TableHead>
                                            <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-3 text-yellow-900">Ngày mua</TableHead>
                                            <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-3 text-yellow-900">Phương thức</TableHead>
                                            <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-3 text-yellow-900">Trạng thái</TableHead>
                                            <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-3 text-yellow-900">Tổng tiền</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredPurchases.map((purchase, index) => (
                                            <TableRow key={purchase.id} className="hover:bg-gray-50">
                                                <TableCell className="text-center">{index + 1}</TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex items-center gap-2">
                                                        {purchase.email}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-left">
                                                    <div className="flex items-center gap-2">
                                                        {purchase.course_name}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                                                        {purchase.teacher_name}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        {purchase.purchase_date}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        {purchase.paymentMethod === 'MOMO' ? (
                                                            <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-pink-100 text-pink-600 flex items-center gap-1.5">
                                                                <CreditCard className="h-3.5 w-3.5" />
                                                                MOMO
                                                            </span>
                                                        ) : (
                                                            <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex items-center gap-1.5">
                                                                <CreditCard className="h-3.5 w-3.5" />
                                                                VNPay
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="flex justify-center">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 whitespace-nowrap ${purchase.status === 'success'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {purchase.status === 'success' ? (
                                                            <BadgeCheck className="h-3 w-3" />
                                                        ) : (
                                                            <BanIcon className="h-3 w-3" />
                                                        )}
                                                        {purchase.status === 'success' ? 'Thành công' : 'Thất bại'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-center font-medium">{formatCurrency(cleanPrice(purchase.total_price))}</TableCell>
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
