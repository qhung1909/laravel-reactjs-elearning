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
                    'Authorization': `Bearer ${token}`,
                },
            });
            notify('Xóa bình luận thành công', 'success');
            fetchComments();
        } catch (error) {
            console.error('Error deleting comment:', error);
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

    const filteredComments = comments.filter(cmt =>
        cmt.title && cmt.title.toLowerCase().includes(searchTerm.toLowerCase())
    );


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
                    <div className="mb-4 flex items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm bình luận..."
                                className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-3">
                            <Button variant="outline" className="flex items-center" onClick={exportToExcel}>
                                <FileDown size={16} />
                                Xuất
                            </Button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-yellow-400">
                                    <th className="text-left py-4 px-6 font-medium text-sm text-slate-800">ID</th>
                                    <th className="text-left py-4 px-6 font-medium text-sm text-slate-800">Nội dung bình luận</th>
                                    <th className="text-left py-4 px-6 font-medium text-sm text-slate-800">Đánh giá</th>
                                    <th className="text-left py-4 px-6 font-medium text-sm text-slate-800">Ảnh khóa học</th>
                                    <th className="text-left py-4 px-6 font-medium text-sm text-slate-800">Tên khóa học</th>
                                    <th className="text-left py-4 px-6 font-medium text-sm text-slate-800">Bình luận ngày</th>
                                    <th className="text-left py-4 px-6 font-medium text-sm text-slate-800">Hành động</th>
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
                                    comments.map((comment, index) => (
                                        <tr
                                            key={index}
                                            className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                                        >
                                            {/* Comment ID */}
                                            <td className="py-4 px-6 text-sm text-gray-600">{comment.comment_id}</td>

                                            {/* Comment Content */}
                                            <td className="py-4 px-6 max-w-72">
                                                <div className="font-medium text-gray-900 whitespace-normal line-clamp-3">
                                                    {comment.content}
                                                </div>
                                            </td>

                                            {/* Rating */}
                                            <td className="py-4 px-6 flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-5 h-5 cursor-pointer ${i < Math.floor(comment.rating)
                                                            ? "text-yellow-500"
                                                            : "text-gray-300"
                                                            }`}
                                                        fill="currentColor"
                                                    />
                                                ))}
                                            </td>

                                            {/* Course Image */}
                                            <td className="xl:py-4 xl:px-6 text-sm text-gray-600">
                                                {comment.course.img ? (
                                                    <img src={comment.course.img} alt="Course" className="w-full" />
                                                ) : (
                                                    <>Chưa có ảnh</>
                                                )}
                                            </td>

                                            {/* Course Name */}
                                            <td className="py-4 px-6 w-1/5">
                                                <div className="text-sm text-gray-600 truncate">
                                                    {comment.course.title || "Chưa có tên khóa học"}
                                                </div>
                                            </td>

                                            {/* Last Updated */}
                                            <td className="py-4 px-6 text-sm text-gray-600">
                                                {formatDate(comment.updated_at)}
                                            </td>

                                            {/* Action Buttons */}
                                            <td className="py-4 px-6">
                                                <div className="flex justify-start gap-2">
                                                    <Button
                                                        onClick={() => deleteComment(comment.comment_id || index)}
                                                        variant="destructive"
                                                        size="sm"
                                                        className="bg-red-500 hover:bg-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-1" />
                                                        Xóa
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                    </div>

                </div>
            </SidebarInset>
            <Toaster />
        </SidebarProvider>
    );
};
