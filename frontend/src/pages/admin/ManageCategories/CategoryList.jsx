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
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { SideBarUI } from '../sidebarUI';
import { useEffect, useState } from 'react';
import axios from "axios";

export const CategoryList = () => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;

    const [categories, setCategory] = useState([]);
    const [categoryCounts, setCategoryCounts] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [searchTerm, setSearchTerm] = useState('');

    // Hàm fetch danh mục
    const fetchCategory = async () => {
        try {
            const res = await axios.get(`${API_URL}/categories`, {
                headers: {
                    'x-api-secret': API_KEY
                }
            });
            const data = res.data;
            setCategory(data);
            setTotalPages(Math.ceil(data.length / itemsPerPage));
            // await fetchQuantityOfCategory(data);
        } catch (error) {
            console.error('Error fetching Categories:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm fetch số lượng khóa học cho mỗi danh mục
    const fetchQuantityOfCategory = async (categories) => {
        const promises = categories.map(category =>
            axios.get(`${API_URL}/admin/categories/${category.course_category_id}/courses/count`, {
                headers: { 'x-api-secret': API_KEY }
            }).then(res => ({
                id: category.course_category_id,
                count: res.data.course_count
            }))
        );

        try {
            const counts = await Promise.all(promises);
            const countsObject = counts.reduce((acc, { id, count }) => {
                acc[id] = count;
                return acc;
            }, {});
            setCategoryCounts(countsObject);
        } catch (error) {
            console.error('Error fetching Category Quantities:', error);
        }
    };

    useEffect(() => {
        fetchCategory();
    }, []);

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

    // Logic phân trang
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedCategories.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPaginationItems = () => {
        const items = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // First page
        if (startPage > 1) {
            items.push(
                <PaginationItem key="1">
                    <PaginationLink onClick={() => handlePageChange(1)}>
                        1
                    </PaginationLink>
                </PaginationItem>
            );
            if (startPage > 2) {
                items.push(
                    <PaginationItem key="ellipsis1">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }
        }

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        onClick={() => handlePageChange(i)}
                        isActive={currentPage === i}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        // Last page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                items.push(
                    <PaginationItem key="ellipsis2">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }
            items.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink onClick={() => handlePageChange(totalPages)}>
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return items;
    };

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
                                    <th className="text-left py-4 px-6 font-medium text-sm text-white-600">ID</th>
                                    <th className="text-left py-4 px-6 font-medium text-sm text-white-600">Image</th>
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
                                {isLoading ? (
                                    <>
                                        {[...Array(5)].map((_, rowIndex) => (
                                            <tr key={rowIndex} className="border-t border-gray-100">
                                                <td className="py-4 px-6">
                                                    <div className="bg-gray-300 rounded animate-pulse" style={{ width: '40px', height: '20px' }} />
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="bg-gray-300 rounded animate-pulse" style={{ width: '40px', height: '20px' }} />
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="bg-gray-300 rounded animate-pulse" style={{ width: '150px', height: '20px' }} />
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="bg-gray-300 rounded animate-pulse" style={{ width: '100px', height: '20px' }} />
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="bg-gray-300 rounded animate-pulse" style={{ width: '120px', height: '20px' }} />
                                                </td>
                                            </tr>
                                        ))}
                                    </>
                                ) : (
                                    currentItems.map((category) => (
                                        <tr key={category.course_category_id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6 text-sm text-gray-600">#{category.course_category_id}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600">
                                                <img src={category.image} className="w-6 h-6" alt={category.name} />
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="font-medium text-gray-900">{category.name}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-sm text-gray-600">{categoryCounts[category.course_category_id] || 0}</span>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-600">
                                                {new Date(category.updated_at).toLocaleDateString('vi-VN')}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                Hiển thị {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, sortedCategories.length)} trong số {sortedCategories.length} danh mục
                            </div>
                            <Pagination>
                                <PaginationContent>
                                    {renderPaginationItems()}
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};
