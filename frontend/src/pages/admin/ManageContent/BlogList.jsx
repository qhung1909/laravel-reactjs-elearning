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
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
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
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
export const BlogList = () => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false)
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        total: 0
    });
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

    useEffect(() => {
        fetchBlogs()
    }, [])

    const handlePageChange = (page) => {
        fetchBlogs(page)
    }
    const renderBlogs = () => {
        if (loading) {
            return <p>Đang tải...</p>
        }

        if (!blogs.length) {
            return (
                <>  <TableRow>
                    <TableCell colSpan={5} className="text-center leading-6 ">
                        <p>Không có bài viết nào.</p>
                    </TableCell>
                </TableRow>

                </>
            )


        }

        return (
            <>
                {
                    blogs.map((blog, index) => (
                        <TableBody key={blog.index}>
                            <TableRow >
                                <TableCell className="font-medium">
                                    {index + 1}
                                </TableCell>

                                {/* Title */}
                                <TableCell className="leading-6 items-center">
                                    {blog.title}
                                </TableCell>

                                {/* Image */}
                                <TableCell>
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="w-full h-28 rounded object-cover"
                                    />
                                </TableCell>

                                {/* Content */}
                                <TableCell className="line-clamp-3 leading-6">
                                    {blog.content}
                                </TableCell>



                                {/* Actions */}
                                <TableCell className="text-right">
                                    <div className="flex justify-start gap-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                                >
                                                    <PenLine className="h-4 w-4 mr-1" />
                                                    Sửa
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <DialogHeader>
                                                    <DialogTitle>Sửa bài viết</DialogTitle>
                                                    <DialogDescription>
                                                        Thay đổi thông tin danh mục ở đây. Nhấn lưu khi bạn hoàn tất.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="editCategoryName" className="text-right">
                                                            Tên
                                                        </Label>
                                                        <Input
                                                            id="editCategoryName"
                                                            className="col-span-3"
                                                            required
                                                        />
                                                    </div>

                                                </div>
                                                <DialogFooter>
                                                    <Button className='bg-yellow-500 hover:bg-yellow-600' type="submit">
                                                        Cập nhật
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="bg-red-500 hover:bg-red-600"
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            Xóa
                                        </Button>
                                    </div>
                                </TableCell>

                            </TableRow>
                        </TableBody>

                    ))
                }
            </>

        )
    }
    return (
        <>
            <SidebarProvider>
                <SideBarUI />
                <SidebarInset>

                    {/* header */}
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

                    {/* table blog list */}
                    <div className="absolute top-12 w-full p-4 ">

                        {/* table */}
                        <Table >
                            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                            <TableHeader className="text-black">
                                <TableRow className="bg-yellow-500">
                                    <TableHead className="w-[50px] text-white">STT</TableHead>
                                    <TableHead className="w-[150px] text-white">Tên</TableHead>
                                    <TableHead className="w-[150px] text-white">Hình ảnh</TableHead>
                                    <TableHead className="w-[400px] text-white">Nội dung</TableHead>
                                    <TableHead className="w-[50px] text-white ">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            {renderBlogs()}

                        </Table>

                        {/* phân trang */}
                        <div className="blog-pagination my-10">
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
            </SidebarProvider>
        </>
    )
}
