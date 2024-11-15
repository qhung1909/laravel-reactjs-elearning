
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
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
import { Button } from "@/components/ui/button";
import {
    Trash2,
    Plus,
    PenLine,
    ChevronUp,
    ChevronDown,
    Search,
    FileDown
} from 'lucide-react';
import { SideBarUI } from '../sidebarUI';
import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import ReactQuill from 'react-quill';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast';
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';


const notify = (message, type) => {
    if (type === 'success') {
        toast.success(message, {
            style: {
                padding: '16px'
            }
        });
    } else {
        toast.error(message, {
            style: {
                padding: '16px'
            }
        })
    }
}

export const CmtCrud = () => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc'
    });
    const [searchTerm, setSearchTerm] = useState('');
    // const [showAddCategory, setShowAddCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryImage, setNewCategoryImage] = useState('');

    const [editCategoryId, setEditCategoryId] = useState(null);
    const [error, setError] = useState('')
    const [editCategoryName, setEditCategoryName] = useState('');
    const [editCategoryImage, setEditCategoryImage] = useState(null);

    const [showEditDialog, setShowEditDialog] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [loadingCategory, setLoadingCategory] = useState(false);

    const [loading, setLoading] = useState(false);
    const [categories, setCategory] = useState([]);
    const token = localStorage.getItem('access_token');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        total: 0
    })
    const [blogs, setBlogs] = useState([]);
    const [newBlogTitle, setNewBlogTitle] = useState('');
    const [newBlogContent, setNewBlogContent] = useState('');
    const [newBlogImage, setNewBlogImage] = useState('');
    const [editBlogId, setEditBlogId] = useState(null);
    const [editBlogTitle, setEditBlogTitle] = useState('');
    const [editBlogContent, setEditBlogContent] = useState(null);
    const [editBlogImage, setEditBlogImage] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);


    // API get blogs
    const fetchBlogs = async (page = 1) => {
        try {

            setLoading(true)
            const response = await axios.get(`${API_URL}/blogs?page=${page}`, {
                headers: {
                    'x-api-secret': API_KEY
                },

            })

            const { data } = response.data

            if (data && data.data) {
                setBlogs(data.data)
                setPagination({
                    currentPage: data.current_page,
                    lastPage: data.last_page,
                    total: data.total
                })
            }
        } catch (error) {
            console.error('Error fetching blogs:', error)
        } finally {
            setLoading(false)
        }
    }

    // phân trang
    const handlePageChange = (page) => {
        fetchBlogs(page)
    }


    // change ảnh
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditBlogImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // xuất exel
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(sortedBlogs);

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, worksheet, 'Courses');

        XLSX.writeFile(wb, 'blogs.xlsx');
    };

    // add blog
    const addBlog = async (e) => {
        e.preventDefault();
        const cleanContent = newBlogContent
            .replace(/<p><br><\/p>/g, '')
            .replace(/<(.|\n)*?>/g, '')
            .trim();
        const formData = new FormData();
        formData.append('title', newBlogTitle);
        formData.append('content', newBlogContent);
        formData.append('image', newBlogImage);

        try {
            setLoading(true);
            const res = await axios.post(`${API_URL}/blogs`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'x-api-secret': `${API_KEY}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            const data = res.data;
            console.log('Blog added:', data);
            setIsDialogOpen(false);
            notify('Thêm bài viết thành công', 'success');
        } catch (error) {
            if (error.response) {
                console.error('Server error:', error.response.data.errors);
            } else {
                console.error('Error adding category:', error.message);
            }
        } finally {
            setLoading(false);
            await fetchBlogs();
        }
    };

    // edit blog
    const editBlog = async () => {
        const payload = {
            title: editBlogTitle,
            content: editBlogContent,
        };

        try {
            setLoading(true);
            let headers = {
                'Authorization': `Bearer ${token}`,
                'x-api-secret': API_KEY,
            };
            let requestBody;
            if (editBlogImage) {
                const formData = new FormData();
                formData.append('title', editBlogTitle);
                formData.append('content', editBlogContent);
                formData.append('image', editBlogImage);
                requestBody = formData;
                headers['Content-Type'] = 'multipart/form-data';
            } else {
                requestBody = payload;
                headers['Content-Type'] = 'application/json';
            }

            const res = await axios.put(`${API_URL}/blogs/${editBlogId}`, requestBody, {
                headers: headers,
            });

            const data = res.data;
            console.log('Blog updated:', data);
            notify('Cập nhật bài viết thành công', 'success');
            setShowEditDialog(false);
            window.location.reload();
            await fetchBlogs();
        } catch (error) {
            setError('Lỗi khi sửa bài viết');
            console.error('Error updating blog:', error);
        } finally {
            setLoading(false);
        }
    };

    // delete blog
    const deleteBlog = async (slug) => {
        const { isConfirmed } = await Swal.fire({
            title: "Xác nhận xóa",
            text: "Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác.",
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
            setLoading(true)
            await axios.delete(`${API_URL}/blogs/${slug}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            window.location.reload()
        } catch (error) {
            console.error('Error delete blog:', error)
        } finally {
            setLoading(false);
            await fetchBlogs();
        }
    }

    // sắp xếp
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };


    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedBlogs = [...filteredBlogs].sort((a, b) => {
        if (!sortConfig.key) return 0;

        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (sortConfig.direction === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    // mở nút Edit, lấy data từng slug
    const openEditDialog = (blog) => {
        setEditBlogId(blog.slug);
        setEditBlogTitle(blog.title);
        setEditBlogContent(blog.content);
        setEditBlogImage(null);
        setSelectedImage(null);
        setShowEditDialog(true);
    };

    useEffect(() => {
        fetchBlogs()
    }, [])

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
                                        Thêm, sửa, xóa bài viết
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                {loading && (
                    <div className='loading'>
                        <div className='loading-spin'></div>
                    </div>
                )}

                <div className="absolute top-12 w-full p-4 font-sans">
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

                        {/* thêm blog */}
                        <div className="flex gap-3">
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                                        <Plus className="h-4 w-4" />
                                        Thêm bài viết
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="w-full pb-10">
                                    <DialogHeader>
                                        <DialogTitle>Thêm bài viết</DialogTitle>
                                        <DialogDescription>
                                            Nhập thông tin bài viết mới tại đây
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-5">

                                        {/* title */}
                                        <div className="space-y-2">
                                            <Label htmlFor="newCategoryName" className="text-right">
                                                Tên
                                            </Label>
                                            <Input
                                                value={newBlogTitle}
                                                onChange={(e) => setNewBlogTitle(e.target.value)}
                                                className="col-span-3"
                                                required
                                            />
                                        </div>

                                        {/* image */}
                                        <div className="space-y-2">
                                            <Label htmlFor="newCategoryImage" className="text-right">
                                                File ảnh
                                            </Label>
                                            <Input
                                                type='file'
                                                onChange={(e) => setNewBlogImage(e.target.files[0])}
                                                className="col-span-3"
                                                required
                                            />
                                        </div>

                                        {/* content */}
                                        <div className="space-y-2 h-40">
                                            <Label htmlFor="newCategoryName" className="text-right">
                                                Nội dung
                                            </Label>
                                            <ReactQuill
                                                value={newBlogContent}
                                                onChange={setNewBlogContent}
                                                className="w-full h-full"
                                                modules={{
                                                    toolbar: [
                                                        [{ 'header': [1, 2, 3, false] }],
                                                        ['bold', 'italic', 'underline'],
                                                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                        ['link', 'image', 'code-block'],
                                                        ['clean']
                                                    ],
                                                }}
                                                formats={[
                                                    'header', 'bold', 'italic', 'underline',
                                                    'list', 'bullet', 'link', 'image', 'code-block'
                                                ]}
                                            />
                                        </div>

                                    </div>
                                    <DialogFooter>
                                        <Button className='bg-yellow-500 hover:bg-yellow-600 mt-20' type="submit" onClick={addBlog}>
                                            Thêm
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            <Button variant="outline" className="flex items-center" onClick={exportToExcel}>
                                <FileDown size={16} />
                                Xuất
                            </Button>
                        </div>
                    </div>

                    {/* Phần bảng danh mục không thay đổi */}
                    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-yellow-400">
                                    <th className="text-left py-4 px-6 font-medium text-sm text-slate-800">ID</th>
                                    <th className="text-left py-4 px-6 font-medium text-sm text-slate-800">Tên</th>
                                    <th
                                        className="text-left py-4 px-6 font-medium text-sm text-slate-800 cursor-pointer group"

                                    >
                                        <div className="flex items-center gap-2">
                                            Ảnh bài viết

                                        </div>
                                    </th>
                                    <th
                                        className="text-left py-4 px-6 font-medium text-sm text-slate-800 cursor-pointer group"

                                    >
                                        <div className="flex items-center gap-2">
                                            Nội dung bài viết

                                        </div>
                                    </th>
                                    <th
                                        className="text-left py-4 px-6 font-medium text-sm text-slate-800 cursor-pointer group"

                                    >
                                        <div className="flex items-center gap-2">
                                            Cập nhật lần cuối

                                        </div>
                                    </th>
                                    <th className="text-left py-4 px-6 font-medium text-sm text-slate-800">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>

                                {/* loading */}
                                {loadingCategory ? (
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
                                                    <div className="bg-gray-300 rounded animate-pulse" style={{ width: '120px', height: '20px' }} />
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="bg-gray-300 rounded animate-pulse" style={{ width: '120px', height: '20px' }} />
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="bg-gray-300 rounded animate-pulse" style={{ width: '80px', height: '20px' }} />
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="bg-gray-300 rounded animate-pulse" style={{ width: '80px', height: '20px' }} />
                                                </td>
                                            </tr>
                                        ))}
                                    </>
                                ) :

                                    // nội dung blog hiển thị
                                    (
                                        blogs.map((blog, index) => (
                                            <tr key={index} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">

                                                {/* id */}
                                                <td className="py-4 px-6 text-sm text-gray-600">
                                                    {blog.blog_id}
                                                </td>

                                                {/* title */}
                                                <td className="py-4 px-6">
                                                    <div className="font-medium text-gray-900">{blog.title}</div>
                                                </td>

                                                {/* ảnh */}
                                                <td className="py-4 px-6 text-sm text-gray-600">
                                                    {blog.image ? (
                                                        <img src={blog.image} alt={`${blog.name} icon`} className="w-1/2" />
                                                    ) : (
                                                        <>Chưa có ảnh</>
                                                    )}
                                                </td>

                                                {/* content */}
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-2 w-40">
                                                        <span
                                                            className="text-sm text-gray-600 line-clamp-3"
                                                            dangerouslySetInnerHTML={{ __html: blog.content }}
                                                        />
                                                    </div>
                                                </td>

                                                {/* last update */}
                                                <td className="py-4 px-6 text-sm text-gray-600">
                                                    {new Date(blog.updated_at).toLocaleDateString('vi-VN')}
                                                </td>

                                                {/* action */}

                                                {/* sửa blog */}
                                                <td className="py-4 px-6">
                                                    <div className="flex justify-start gap-2">
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                                                    onClick={() => openEditDialog(blog)}
                                                                >
                                                                    <PenLine className="h-4 w-4 mr-1" />
                                                                    Sửa
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="sm:max-w-[425px] max-h-[500px] overflow-y-auto">
                                                                <DialogHeader>
                                                                    <DialogTitle>Sửa bài viết</DialogTitle>
                                                                    <DialogDescription>
                                                                        Thay đổi thông tin bài viết tại đây. Nhấn lưu khi bạn hoàn tất.
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <div className="space-y-3 py-4">

                                                                    {/* title */}
                                                                    <div className="space-y-2">
                                                                        <Label htmlFor="editBlogTitle" className="text-right">
                                                                            Tên
                                                                        </Label>
                                                                        <Input
                                                                            id="editBlogTitle"
                                                                            value={editBlogTitle}
                                                                            onChange={(e) => setEditBlogTitle(e.target.value)}
                                                                            className="col-span-3"
                                                                            required
                                                                        />
                                                                    </div>

                                                                    {/* content */}
                                                                    <div className="space-y-2">
                                                                        <Label htmlFor="editBlogContent" className="text-right">
                                                                            Nội dung
                                                                        </Label>
                                                                        <ReactQuill
                                                                            value={editBlogContent}
                                                                            onChange={setEditBlogContent}
                                                                            className="w-full max-h-40 overflow-y-auto"
                                                                            modules={{
                                                                                toolbar: [
                                                                                    [{ 'header': [1, 2, 3, false] }],
                                                                                    ['bold', 'italic', 'underline'],
                                                                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                                                    ['link', 'image', 'code-block'],
                                                                                    ['clean']
                                                                                ],
                                                                            }}
                                                                            formats={[
                                                                                'header', 'bold', 'italic', 'underline',
                                                                                'list', 'bullet', 'link', 'image', 'code-block'
                                                                            ]}
                                                                        />
                                                                    </div>
                                                                    {/* ảnh */}

                                                                    {blog.image ? (
                                                                        <div className="space-y-2">
                                                                            <Label>Ảnh hiện tại</Label>
                                                                            <img src={blog.image} className="w-40" alt="Current Icon" />
                                                                        </div>
                                                                    ) : (
                                                                        <></>
                                                                    )

                                                                    }

                                                                    <div className="space-y-2">
                                                                        <Label htmlFor="editCategoryImage" className="text-right">
                                                                            Tạo ảnh  mới
                                                                        </Label>
                                                                        <Input
                                                                            type='file'
                                                                            id="editCategoryImage"
                                                                            onChange={handleImageChange}
                                                                            className="col-span-3"
                                                                            required
                                                                        />
                                                                    </div>
                                                                    {selectedImage && (
                                                                        <div className="space-y-2">
                                                                            <Label>Hình ảnh đã chọn:</Label>
                                                                            <img src={selectedImage} onChange={((e) => setEditBlogImage(e.target.value))} alt="Selected" className="col-span-3" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {error && <p className="text-red-500 text-sm pt-2">{error}</p>}
                                                                <DialogFooter>
                                                                    <Button
                                                                        className="bg-yellow-500 hover:bg-yellow-600"
                                                                        type="submit"
                                                                        onClick={editBlog}
                                                                    >
                                                                        Cập nhật
                                                                    </Button>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>


                                                        {/* xóa blog */}
                                                        <Button
                                                            onClick={() => deleteBlog(blog.slug)}
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

                    {/* phân trang */}
                    <div className="mt-3">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                                        disabled={pagination.currentPage === 1}
                                        className="cursor-pointer"
                                    />
                                </PaginationItem>

                                {pagination.lastPage <= 3 ? (
                                    [...Array(pagination.lastPage)].map((_, index) => (
                                        <PaginationItem key={index + 1} className="cursor-pointer">
                                            <PaginationLink
                                                onClick={() => handlePageChange(index + 1)}
                                                isActive={pagination.currentPage === index + 1}
                                            >
                                                {index + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))
                                ) : (
                                    <>
                                        <PaginationItem>
                                            <PaginationLink
                                                onClick={() => handlePageChange(1)}
                                                isActive={pagination.currentPage === 1}
                                            >
                                                1
                                            </PaginationLink>
                                        </PaginationItem>

                                        {pagination.currentPage > 2 && <PaginationEllipsis />}

                                        {pagination.currentPage !== 1 && pagination.currentPage !== pagination.lastPage && (
                                            <PaginationItem>
                                                <PaginationLink
                                                    onClick={() => handlePageChange(pagination.currentPage)}
                                                    isActive
                                                >
                                                    {pagination.currentPage}
                                                </PaginationLink>
                                            </PaginationItem>
                                        )}

                                        {pagination.currentPage < pagination.lastPage - 1 && <PaginationEllipsis />}

                                        <PaginationItem>
                                            <PaginationLink
                                                onClick={() => handlePageChange(pagination.lastPage)}
                                                isActive={pagination.currentPage === pagination.lastPage}
                                            >
                                                {pagination.lastPage}
                                            </PaginationLink>
                                        </PaginationItem>
                                    </>
                                )}

                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                                        disabled={pagination.currentPage === pagination.lastPage}
                                        className="cursor-pointer"

                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>
            </SidebarInset>
            <Toaster />
        </SidebarProvider>
    );
};
