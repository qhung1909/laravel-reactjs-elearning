import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { SideBarUI } from '../sidebarUI';

export const PriorityCategory = () => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;

    const fetchCategory = async () => {
        try {
            const res = await axios.get(`${API_URL}/categories`, {
                headers: { 'x-api-secret': API_KEY }
            });
            console.log("Fetched categories:", res.data);
            setCategory(res.data);
        } catch (error) {
            console.error('Error fetching Categories:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategory();
    }, []);

    const handleSort = (key) => {
        const direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
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

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedCategories = Array.from(categories);
        const [removed] = reorderedCategories.splice(result.source.index, 1);
        reorderedCategories.splice(result.destination.index, 0, removed);
        setCategory(reorderedCategories);
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
                                    <BreadcrumbLink href="/admin" className="text-blue-600 hover:text-blue-800">Dashboard</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink className="font-semibold">Danh sách Danh mục</BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <>Xin lỗi, trang bạn tìm đã không còn! </>

                {/* <div className="absolute top-12 w-full p-4">
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

                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="categories">
                            {(provided) => (
                                <div
                                    className="overflow-x-auto rounded-lg border border-gray-200 bg-white"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-yellow-400">
                                                <th className="text-left py-4 px-6 font-medium text-sm text-white-600">ID</th>
                                                <th className="text-left py-4 px-6 font-medium text-sm text-slate-800 cursor-pointer group" onClick={() => handleSort('name')}>
                                                    <div className="flex items-center gap-2">Tên danh mục {getSortIcon('name')}</div>
                                                </th>
                                                <th className="text-left py-4 px-6 font-medium text-sm text-slate-800 cursor-pointer group" onClick={() => handleSort('courseCount')}>
                                                    <div className="flex items-center gap-2">Số lượng khóa học {getSortIcon('courseCount')}</div>
                                                </th>
                                                <th className="text-left py-4 px-6 font-medium text-sm text-slate-800 cursor-pointer group" onClick={() => handleSort('lastUpdated')}>
                                                    <div className="flex items-center gap-2">Cập nhật lần cuối {getSortIcon('lastUpdated')}</div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sortedCategories.map((category, index) => (
                                                <Draggable key={category.course_category_id} draggableId={String(category.course_category_id)} index={index}>
                                                    {(provided) => (
                                                        <tr
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                                                        >
                                                            <td className="py-4 px-6 text-sm text-gray-600">#{category.course_category_id}</td>
                                                            <td className="py-4 px-6">
                                                                <div className="font-medium text-gray-900">{category.name}</div>
                                                            </td>
                                                            <td className="py-4 px-6">
                                                                <span className="text-sm text-gray-600">{category.courseCount} update soon</span>
                                                            </td>
                                                            <td className="py-4 px-6 text-sm text-gray-600">
                                                                {new Date(category.updated_at).toLocaleDateString('vi-VN')}
                                                            </td>
                                                        </tr>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>

                    <div className="mt-3">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationLink href="#" isActive>1</PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#">2</PaginationLink>
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
                </div> */}
            </SidebarInset>
        </SidebarProvider>
    );
};
