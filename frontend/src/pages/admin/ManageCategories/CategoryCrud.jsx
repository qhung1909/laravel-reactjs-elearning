

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
import { Button } from "@/components/ui/button";
import {
    Trash2,
    Plus,
    PenLine,
    BookOpen,
    ChevronUp,
    ChevronDown,
    Search,
    X,
    Filter,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast';


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

export const CategoryCrud = () => {
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc'
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryImage, setNewCategoryImage] = useState('');

    const [editCategoryId, setEditCategoryId] = useState(null);
    const [editCategoryName, setEditCategoryName] = useState('');
    const [editCategoryImage, setEditCategoryImage] = useState('');
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [loadingCategory, setLoadingCategory] = useState(false)

    const openDialog = () => {
        setIsDialogOpen(true);
    };

    const API_KEY = import.meta.env.VITE_API_KEY
    const API_URL = import.meta.env.VITE_API_URL
    const [loading, setLoading] = useState(false);

    const [categories, setCategory] = useState([]);
    const token = localStorage.getItem('access_token');


    useEffect(() => {

        const fetchCategory = async () => {
            try {
                setLoadingCategory(true)
                const res = await axios.get(`${API_URL}/categories`, {
                    headers: {
                        'x-api-secret': API_KEY
                    }
                })
                const data = res.data;

                setCategory(data)
            } catch (error) {
                console.error('Error fetching Categories:', error)
            } finally {
                setLoadingCategory(false)
            }
        }
        fetchCategory()
    }, [API_KEY, API_URL])

    const addCategory = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', newCategoryName);
        formData.append('image', newCategoryImage); // newCategoryImage phải là một đối tượng File

        try {
            setLoading(true);
            const res = await axios.post(`${API_URL}/categories`, formData, {
                headers: {
                    'x-api-secret': API_KEY,
                    'Content-Type': 'multipart/form-data'
                }
            });
            const data = res.data;
            console.log('Category added:', data);
            setIsDialogOpen(false);
            notify('Thêm danh mục thành công', 'success');
        } catch (error) {
            if (error.response) {
                // Lỗi trả về từ server
                console.error('Server error:', error.response.data.errors);
            } else {
                // Lỗi không phải từ server
                console.error('Error adding category:', error.message);
            }
        } finally {
            setLoading(false);
        }
    };
    console.log(newCategoryImage); // Kiểm tra xem có phải là đối tượng File không



    const editCategory = async (categoryId) => {
        const updatedCategory = {
            name: editCategoryName,
            image: editCategoryImage, // Đảm bảo đúng tên trường mà API yêu cầu
        };

        try {
            setLoading(true);
            const res = await axios.put(`${API_URL}/categories/${categoryId}`, updatedCategory, {
                headers: {
                    'x-api-secret': API_KEY // Nếu cần gửi khóa API
                }
            });
            const data = res.data; // Xử lý dữ liệu phản hồi nếu cần
            console.log('Category updated:', data); // Xem phản hồi từ server
            // Reset các trường input sau khi sửa
            setEditCategoryName('');
            setEditCategoryImage('');
        } catch (error) {
            console.error('Error updating category:', error);
        } finally {
            setLoading(false);
        }
    };


    const deleteCategory = async (slug) => {
        try {
            setLoading(true)
            await axios.delete(`${API_URL}/categories/${slug}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            window.location.reload()
        } catch (error) {
            console.error('Error delete category:', error)
        } finally {
            setLoading(false);
        }
    }





    // const categories = [
    //     { id: 1, name: "Danh mục a", icon: "https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/nodejs.svg", courseCount: 5, lastUpdated: "2024-03-15" },
    //     { id: 2, name: "Danh mục c", icon: "https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/reactjs.svg", courseCount: 3, lastUpdated: "2024-03-14" },
    //     { id: 3, name: "Danh mục b", icon: "https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/angular.svg", courseCount: 8, lastUpdated: "2024-03-13" },
    //     { id: 4, name: "Danh mục d", icon: "https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/css.svg", courseCount: 2, lastUpdated: "2024-03-12" },
    //     { id: 5, name: "Danh mục a", icon: "https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/nodejs.svg", courseCount: 5, lastUpdated: "2024-03-15" },
    //     { id: 6, name: "Danh mục c", icon: "https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/reactjs.svg", courseCount: 3, lastUpdated: "2024-03-14" },
    //     { id: 7, name: "Danh mục b", icon: "https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/angular.svg", courseCount: 8, lastUpdated: "2024-03-13" },
    //     { id: 8, name: "Danh mục d", icon: "https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/css.svg", courseCount: 2, lastUpdated: "2024-03-12" },
    // ];

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

        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (sortConfig.direction === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    const getSortIcon = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
        }
        return <ChevronUp className="h-4 w-4 opacity-0 group-hover:opacity-50" />;
    };



    const openEditDialog = (category) => {
        setEditCategoryId(category.slug);
        setEditCategoryName(category.name);
        setEditCategoryImage(category.icon);
        setShowEditDialog(true);
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
                                        Thêm, sửa, xóa danh mục
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
                        <div className="flex gap-3">
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                                        <Plus className="h-4 w-4" />
                                        Thêm danh mục mới
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Thêm danh mục</DialogTitle>
                                        <DialogDescription>
                                            Nhập thông tin danh mục mới ở đây. Nhấn thêm khi bạn hoàn tất.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="newCategoryName" className="text-right">
                                                Tên
                                            </Label>
                                            <Input
                                                // id="newCategoryName"
                                                value={newCategoryName}
                                                onChange={(e) => setNewCategoryName(e.target.value)}
                                                className="col-span-3"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="newCategoryImage" className="text-right">
                                                File ảnh
                                            </Label>
                                            <Input
                                                // id="newCategoryImage"
                                                type='file'
                                                // value={newCategoryImage}
                                                onChange={(e) => setNewCategoryImage(e.target.files[0])}
                                                className="col-span-3"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" onClick={addCategory}>
                                            Thêm
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            <Button variant="outline" className="flex items-center">
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
                                    <th className="text-left py-4 px-6 font-medium text-sm text-slate-800">Icon</th>
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
                                    <th className="text-left py-4 px-6 font-medium text-sm text-slate-800">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadingCategory ? (
                                    <>
                                        {[...Array(5)].map((_, rowIndex) => (
                                            <tr key={rowIndex} className="border-t border-gray-100">
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
                                                <td className="py-4 px-6">
                                                    <div className="bg-gray-300 rounded animate-pulse" style={{ width: '80px', height: '20px' }} />
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="bg-gray-300 rounded animate-pulse" style={{ width: '80px', height: '20px' }} />
                                                </td>
                                            </tr>
                                        ))}
                                    </>
                                ) : (
                                    sortedCategories.map((category, index) => (
                                        <tr key={index} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6 text-sm text-gray-600">#{category.course_category_id}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600">
                                                <img src={category.image} alt={`${category.name} icon`} className="h-6 w-6" />
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="font-medium text-gray-900">{category.name}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    {/* <BookOpen className="h-4 w-4 text-gray-400" /> */}
                                                    <span className="text-sm text-gray-600">{category.courseCount}  update soon</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-600">
                                                {new Date(category.updated_at).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex justify-start gap-2">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                                                onClick={() => openEditDialog(category)} // Mở dialog sửa
                                                            >
                                                                <PenLine className="h-4 w-4 mr-1" />
                                                                Sửa
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="sm:max-w-[425px]">
                                                            <DialogHeader>
                                                                <DialogTitle>Sửa danh mục</DialogTitle>
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
                                                                        value={editCategoryName}
                                                                        onChange={(e) => setEditCategoryName(e.target.value)}
                                                                        className="col-span-3"
                                                                        required
                                                                    />
                                                                </div>
                                                                <div className="grid grid-cols-4 items-center gap-4">
                                                                    <Label htmlFor="editCategoryImage" className="text-right">
                                                                        URL icon
                                                                    </Label>
                                                                    <Input
                                                                        id="editCategoryImage"
                                                                        value={editCategoryImage}
                                                                        onChange={(e) => setEditCategoryImage(e.target.value)}
                                                                        className="col-span-3"
                                                                        required
                                                                    />
                                                                </div>
                                                            </div>
                                                            <DialogFooter>
                                                                <Button type="submit" onClick={editCategory}>
                                                                    Cập nhật
                                                                </Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                    <Button
                                                        onClick={() => deleteCategory(category.slug)}
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
            <Toaster />
        </SidebarProvider>
    );
};
