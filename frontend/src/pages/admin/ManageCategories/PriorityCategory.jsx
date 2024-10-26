
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
} from "@/components/ui/pagination"

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
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { SideBarUI } from '../sidebarUI';
import { useState } from 'react';

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const PriorityCategory= () => {
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc'
    });
    const [searchTerm, setSearchTerm] = useState('');

    const initialCategories = [
        { id: 1, name: "Danh mục a", courseCount: 5, isActive: true },
        { id: 2, name: "Danh mục c", courseCount: 3, isActive: false },
        { id: 3, name: "Danh mục b", courseCount: 8, isActive: true },
        { id: 4, name: "Danh mục d", courseCount: 2, isActive: true },
        { id: 5, name: "Danh mục e", courseCount: 5, isActive: true },
        { id: 6, name: "Danh mục f", courseCount: 3, isActive: false },
        { id: 7, name: "Danh mục g", courseCount: 8, isActive: true },
        { id: 8, name: "Danh mục h", courseCount: 2, isActive: true },
    ];

    const [categories, setCategories] = useState(initialCategories);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedCategories = [...filteredCategories].sort((a, b) => {
        if (!sortConfig.key) return 0;

        const aValue = sortConfig.key === 'lastUpdated' ? new Date(a[sortConfig.key]) : a[sortConfig.key];
        const bValue = sortConfig.key === 'lastUpdated' ? new Date(b[sortConfig.key]) : b[sortConfig.key];

        return sortConfig.direction === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });

    const getSortIcon = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
        }
        return <ChevronUp className="h-4 w-4 opacity-0 group-hover:opacity-50" />;
    };



    return (
        <SidebarProvider>
            <SideBarUI />
            <SidebarInset>
                <header className="absolute left-1 top-3">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/admin" className="text-blue-600 hover:text-blue-800">
                                        Dashboard
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink className="font-semibold">
                                        Danh sách Danh mục
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <div className="absolute top-12 w-full p-4">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm danh mục..."
                                className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-yellow-400">
                                    <th className="text-left py-4 px-6 font-medium text-sm text-white-600">STT</th>
                                    <th
                                        className="text-left py-4 px-6 font-medium text-sm text-slate-800 cursor-pointer group"
                                        onClick={() => handleSort('name')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Tên danh mục
                                            {getSortIcon('name')}
                                        </div>
                                    </th>
                                    <th
                                        className="text-left py-4 px-6 font-medium text-sm text-slate-800 cursor-pointer group"
                                        onClick={() => handleSort('courseCount')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Số lượng khóa học
                                            {getSortIcon('courseCount')}
                                        </div>
                                    </th>
                                    <th
                                        className="text-left py-4 px-6 font-medium text-sm text-slate-800 cursor-pointer group"
                                        onClick={() => handleSort('lastUpdated')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Cập nhật lần cuối
                                            {getSortIcon('lastUpdated')}
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedCategories.map((category) => (
                                    <tr key={category.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6 text-sm text-gray-600">#{category.id}</td>
                                        <td className="py-4 px-6">
                                            <div className="font-medium text-gray-900">{category.name}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-sm text-gray-600">{category.courseCount} khóa học</span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-600">
                                            {new Date(category.lastUpdated).toLocaleDateString('vi-VN')}
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                    <div className="mt-3">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationLink href="#" isActive>
                                        1
                                    </PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#" >
                                        2
                                    </PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#">3</PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>

                </div>


            </SidebarInset>
        </SidebarProvider>
    );
};
