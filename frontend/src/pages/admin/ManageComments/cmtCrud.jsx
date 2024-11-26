import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
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
import { Button } from "@/components/ui/button";
import {
    Trash2,
    Plus,
    PenLine,
    ChevronUp,
    ChevronDown,
    Search,
    FileDown,
    Star,
} from 'lucide-react';

import { SideBarUI } from '../sidebarUI';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import { formatDate } from "@/components/FormatDay/Formatday";
import {
    Filter
} from 'lucide-react';

const notify = (message, type) => {
    if (type === 'success') {
        toast.success(message, { style: { padding: '16px' } });
    } else {
        toast.error(message, { style: { padding: '16px' } });
    }
};

export const CmtCrud = () => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc',
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({ rating: 'all' });
    const [showFilters, setShowFilters] = useState(false);
    const commentsPerPage = 10;


    const token = localStorage.getItem('access_token');

    // Fetch comments
    const fetchComments = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/comment`, {
                headers: {
                    'x-api-secret': API_KEY,
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (res.data) {
                setComments(res.data.comments);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    // Export to Excel
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(comments);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, worksheet, 'Comments');
        XLSX.writeFile(wb, 'comments.xlsx');
    };

    // Delete comment
    const deleteComment = async (commentId) => {
        const { isConfirmed } = await Swal.fire({
            title: "Xác nhận xóa",
            text: "Bạn có chắc chắn muốn xóa bình luận này? Hành động này không thể hoàn tác.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Có, xóa!",
            cancelButtonText: "Hủy",
        });

        if (!isConfirmed) {
            return;
        }

        try {
            setLoading(true);
            await axios.delete(`${API_URL}/comments/${commentId}`, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                    'Authorization': `Bearer ${token}`,
                },
            });
            notify('Xóa bình luận thành công', 'success');
            fetchComments();
        } catch (error) {
            console.error('Error deleting comment:', error.response || error);
            notify('Có lỗi xảy ra khi xóa bình luận', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Sort handler
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredComments = comments.filter(cmt => {
        if (!cmt || !cmt.course) return false;

        const matchesSearch = cmt.course.title
            ? cmt.course.title.toLowerCase().includes(searchTerm.toLowerCase())
            : false;

        const matchesRating = filters.rating === 'all' ||
            Number(cmt.rating) === Number(filters.rating);

        return matchesSearch && matchesRating;
    });


    // Sort comments
    const sortedComments = [...filteredComments].sort((a, b) => {
        if (!sortConfig.key) return 0;
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (sortConfig.direction === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = sortedComments.slice(indexOfFirstComment, indexOfLastComment);

    // Change page
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const totalPages = Math.ceil(sortedComments.length / commentsPerPage);

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
                                    <BreadcrumbLink href="/admin" className="text-blue-600 hover:text-blue-800">
                                        Dashboard
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink className="font-semibold">
                                        Quản lí bình luận
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                {loading && (
                    <div className="loading">
                        <div className="loading-spin"></div>
                    </div>
                )}

                <div className="absolute top-12 w-full p-4 font-sans">
                    <div className="mb-4 flex items-center justify-between gap-4">
                        <h1 className="text-2xl ml-1 font-bold text-gray-800">Quản lí bình luận</h1>

                        <div className="flex items-center gap-4 ml-auto">
                            <div className="relative max-w-xs">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm..."
                                    className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="relative">
                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2"
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    <Filter size={16} />
                                    Lọc
                                    <ChevronDown size={14} />
                                </Button>
                                {showFilters && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                                        <div className="px-4 py-2">
                                            <p className="text-sm font-medium">Đánh giá</p>
                                            <select
                                                className="mt-1 w-full rounded-md border border-gray-200 p-2"
                                                value={filters.rating}
                                                onChange={e => setFilters({ ...filters, rating: e.target.value })}
                                            >
                                                <option value="all">Tất cả</option>
                                                <option value="5">5 sao</option>
                                                <option value="4">4 sao</option>
                                                <option value="3">3 sao</option>
                                                <option value="2">2 sao</option>
                                                <option value="1">1 sao</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Button variant="outline" className="flex items-center gap-2">
                                <FileDown size={16} />
                                Xuất
                            </Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                        <table className="w-full min-w-[1200px]">
                            <thead>
                                <tr className="bg-yellow-100">
                                    <th className="text-center py-4 px-6 text-md font-bold text-yellow-900 whitespace-nowrap">STT</th>
                                    <th className="text-center py-4 px-6 text-md font-bold text-yellow-900 whitespace-nowrap">Tên khóa học</th>
                                    <th className="text-center py-4 px-6 text-md font-bold text-yellow-900 whitespace-nowrap">Ảnh khóa học</th>
                                    <th className="text-center py-4 px-6 text-md font-bold text-yellow-900 whitespace-nowrap">Người gửi</th>
                                    <th className="text-center py-4 px-6 text-md font-bold text-yellow-900 whitespace-nowrap">Nội dung bình luận</th>
                                    <th className="text-center py-4 px-6 text-md font-bold text-yellow-900 whitespace-nowrap">Đánh giá</th>
                                    <th className="text-center py-4 px-6 text-md font-bold text-yellow-900 whitespace-nowrap">Bình luận ngày</th>
                                    <th className="text-center py-4 px-6 text-md font-bold text-yellow-900 whitespace-nowrap">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    [...Array(5)].map((_, index) => (
                                        <tr key={index} className="border-t border-gray-100">
                                            <td className="py-4 px-6">
                                                <div className="bg-gray-300 rounded animate-pulse w-20 h-4"></div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="bg-gray-300 rounded animate-pulse w-48 h-4"></div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="bg-gray-300 rounded animate-pulse w-32 h-4"></div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="bg-gray-300 rounded animate-pulse w-32 h-4"></div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="bg-gray-300 rounded animate-pulse w-24 h-4"></div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="bg-gray-300 rounded animate-pulse w-24 h-4"></div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="bg-gray-300 rounded animate-pulse w-24 h-4"></div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="bg-gray-300 rounded animate-pulse w-24 h-4"></div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    currentComments.map((comment, index) => (
                                        <tr key={index} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6 text-sm text-center text-gray-600">
                                                {(currentPage - 1) * commentsPerPage + index + 1}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="text-sm text-center text-gray-600 max-w-[250px] whitespace-normal break-words">
                                                    {comment.course?.title || "Chưa có tên khóa học"}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                {comment.course?.img ? (
                                                    <img src={comment.course.img} alt="Course" className="w-full object-cover mx-auto rounded-lg" />
                                                ) : (
                                                    <span className="text-sm text-gray-600">Chưa có ảnh</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="text-sm text-gray-900 text-center max-w-[200px] break-words line-clamp-3">
                                                    {comment.user?.name}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="text-sm text-gray-900 text-center max-w-[200px] break-words line-clamp-3">
                                                    {comment.content}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex justify-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-5 h-5 ${i < Math.floor(comment.rating) ? "text-yellow-400" : "text-gray-200"}`}
                                                            fill="currentColor"
                                                        />
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-center text-gray-600 whitespace-nowrap">
                                                {formatDate(comment.updated_at)}
                                            </td>
                                            <td className="py-4 px-6">
                                                <Button
                                                    onClick={() => deleteComment(comment.comment_id || index)}
                                                    variant="destructive"
                                                    size="sm"
                                                    className="flex items-center gap-1 bg-white text-red-500 border border-red-500 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Xóa
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {!loading && totalPages > 1 && (
                        <div className="mt-4 flex justify-center">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => setCurrentPage(curr => Math.max(1, curr - 1))}
                                            disabled={currentPage === 1}
                                        />
                                    </PaginationItem>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <PaginationItem key={i}>
                                            <PaginationLink
                                                onClick={() => setCurrentPage(i + 1)}
                                                isActive={currentPage === i + 1}
                                            >
                                                {i + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => setCurrentPage(curr => Math.min(totalPages, curr + 1))}
                                            disabled={currentPage === totalPages}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </div>
            </SidebarInset>
            <Toaster />
        </SidebarProvider>
    );
}
