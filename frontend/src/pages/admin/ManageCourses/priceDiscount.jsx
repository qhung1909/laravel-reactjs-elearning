'use client'

import React, { useEffect, useState } from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
} from "@/components/ui/pagination";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Search,
    Filter,
    FileDown,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { SideBarUI } from '../sidebarUI';
import axios from "axios";
import { toast } from 'react-toastify';

export default function PriceDiscount() {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;

    const [coupons, setCoupons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [searchTerm, setSearchTerm] = useState('');

    const fetchCoupons = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/admin/coupons`, {
                headers: { 'x-api-secret': API_KEY },
            });
            setCoupons(data);
        } catch (error) {
            console.error('Error fetching Coupons:', error);
            toast.error('Lỗi khi tải dữ liệu mã giảm giá.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleSort = (key) => {
        const direction = (sortConfig.key === key && sortConfig.direction === 'asc') ? 'desc' : 'asc';
        setSortConfig({ key, direction });
    };

    const filteredCoupons = coupons.filter(coupon =>
        coupon.name_coupon.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedCoupons = [...filteredCoupons].sort((a, b) => {
        if (!sortConfig.key) return 0;
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (sortConfig.key === 'start_discount' || sortConfig.key === 'end_discount') {
            return sortConfig.direction === 'asc'
                ? new Date(aValue) - new Date(bValue)
                : new Date(bValue) - new Date(aValue);
        }
        return sortConfig.direction === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });

    const getSortIcon = (key) => (
        sortConfig.key === key
            ? (sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)
            : <ChevronUp className="h-4 w-4 opacity-0 group-hover:opacity-50" />
    );

    return (
        <SidebarProvider>
            <SideBarUI />
            <SidebarInset>
                <header className="z-10 absolute left-1 top-3">
                    <div className="flex items-center gap-2 px-4 py-3">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/admin/coupons">Quản lý mã giảm giá</BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <div className="absolute top-14 px-6 bg-gray-50 w-full">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Quản lý mã giảm giá</h1>
                                    <p className="text-gray-500 mt-1">Quản lý tất cả các mã giảm giá trong hệ thống</p>
                                </div>
                                <div className="flex flex-wrap gap-4 w-full md:w-auto">
                                    <div className="relative flex-1 md:flex-initial">
                                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Tìm kiếm mã giảm giá..."
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

                            <div className="overflow-x-auto rounded-lg border border-gray-200">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="text-left py-4 px-6 font-medium text-sm text-gray-600">ID</th>
                                            <th
                                                className="text-left py-4 px-6 font-medium text-sm text-gray-600 cursor-pointer group"
                                                onClick={() => handleSort('name_coupon')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    Tên mã
                                                    {getSortIcon('name_coupon')}
                                                </div>
                                            </th>
                                            <th
                                                className="text-left py-4 px-6 font-medium text-sm text-gray-600 cursor-pointer group"
                                                onClick={() => handleSort('discount_price')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    Giảm giá cố định
                                                    {getSortIcon('discount_price')}
                                                </div>
                                            </th>
                                            <th
                                                className="text-left py-4 px-6 font-medium text-sm text-gray-600 cursor-pointer group"
                                                onClick={() => handleSort('percent_discount')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    Phần trăm giảm giá
                                                    {getSortIcon('percent_discount')}
                                                </div>
                                            </th>
                                            <th
                                                className="text-left py-4 px-6 font-medium text-sm text-gray-600 cursor-pointer group"
                                                onClick={() => handleSort('start_discount')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    Ngày bắt đầu
                                                    {getSortIcon('start_discount')}
                                                </div>
                                            </th>
                                            <th
                                                className="text-left py-4 px-6 font-medium text-sm text-gray-600 cursor-pointer group"
                                                onClick={() => handleSort('end_discount')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    Ngày kết thúc
                                                    {getSortIcon('end_discount')}
                                                </div>
                                            </th>
                                            <th className="text-right py-4 px-6 font-medium text-sm text-gray-600">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading ? (
                                            Array.from({ length: 5 }).map((_, index) => (
                                                <tr key={index} className="border-t border-gray-100 bg-gray-200 h-6">
                                                    <td className="py-4 px-6 h-6" />
                                                    <td className="py-4 px-6 h-6" />
                                                    <td className="py-4 px-6 h-6" />
                                                    <td className="py-4 px-6 h-6" />
                                                    <td className="py-4 px-6 h-6" />
                                                    <td className="py-4 px-6 h-6" />
                                                    <td className="py-4 px-6 h-6" />
                                                </tr>
                                            ))
                                        ) : (
                                            sortedCoupons.map((coupon, index) => (
                                                <tr key={coupon.coupons_id} className={`border-t border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                    <td className="py-4 px-6 text-sm text-gray-600">{coupon.coupons_id}</td>
                                                    <td className="py-4 px-6 text-sm text-gray-600">{coupon.name_coupon}</td>
                                                    <td className="py-4 px-6 text-sm text-gray-600">
                                                        {coupon.discount_price ? `${coupon.discount_price.toLocaleString('vi-VN')} VNĐ` : 'N/A'}
                                                    </td>
                                                    <td className="py-4 px-6 text-sm text-gray-600">
                                                        {coupon.percent_discount ? `${coupon.percent_discount}%` : 'N/A'}
                                                    </td>
                                                    <td className="py-4 px-6 text-sm text-gray-600">
                                                        {new Date(coupon.start_discount).toLocaleDateString('vi-VN')}
                                                    </td>
                                                    <td className="py-4 px-6 text-sm text-gray-600">
                                                        {new Date(coupon.end_discount).toLocaleDateString('vi-VN')}
                                                    </td>
                                                    <td className="py-4 px-6 text-sm text-gray-600 text-right">
                                                        <Button variant="link">Chỉnh sửa</Button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationLink href="#" aria-label="Trang trước">
                                &lt;
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#" isActive>1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">2</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">3</PaginationLink>
                        </PaginationItem>
                        <PaginationEllipsis />
                        <PaginationItem>
                            <PaginationLink href="#" aria-label="Trang sau">
                                &gt;
                            </PaginationLink>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </SidebarInset>
        </SidebarProvider>
    );
}
