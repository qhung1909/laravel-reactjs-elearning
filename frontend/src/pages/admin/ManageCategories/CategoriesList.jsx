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
    X, // Import biểu tượng X
    Filter,
    FileDown
} from 'lucide-react';
import { SideBarUI } from '../sidebarUI';
import { useState } from 'react';
import { Link } from "react-router-dom";

export const CategoriesList = () => {
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc'
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryIconUrl, setNewCategoryIconUrl] = useState('');

    const categories = [
        { id: 1, name: "Danh mục a", icon: "https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/nodejs.svg", courseCount: 5, lastUpdated: "2024-03-15" },
        { id: 2, name: "Danh mục c", icon: "https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/reactjs.svg", courseCount: 3, lastUpdated: "2024-03-14" },
        { id: 3, name: "Danh mục b", icon: "https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/angular.svg", courseCount: 8, lastUpdated: "2024-03-13" },
        { id: 4, name: "Danh mục d", icon: "https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/css.svg", courseCount: 2, lastUpdated: "2024-03-12" },
    ];

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
            return sortConfig.direction === 'asc' ?
                <ChevronUp className="h-4 w-4" /> :
                <ChevronDown className="h-4 w-4" />;
        }
        return <ChevronUp className="h-4 w-4 opacity-0 group-hover:opacity-50" />;
    };

    const handleAddCategory = (e) => {
        e.preventDefault();
        // Logic to add new category (you can replace this with an actual API call)
        console.log('Adding category:', { name: newCategoryName, iconUrl: newCategoryIconUrl });
        setNewCategoryName('');
        setNewCategoryIconUrl('');
        setShowAddCategory(false);
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
                        <div className="flex gap-3">
                            <Button onClick={() => setShowAddCategory(!showAddCategory)} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                                {showAddCategory ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                {showAddCategory ? 'Hủy' : 'Thêm danh mục mới'}
                            </Button>
                            <Button variant="outline" className="flex items-center">
                                <Filter size={16} />
                                Lọc
                            </Button>
                            <Button variant="outline" className="flex items-center">
                                <FileDown size={16} />
                                Xuất
                            </Button>
                        </div>
                    </div>

                    {showAddCategory && (
                        <form onSubmit={handleAddCategory} className="mb-4 flex items-center gap-4">
                            <input
                                type="text"
                                placeholder="Tên danh mục"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                className="flex-grow p-2 border border-gray-200 rounded-lg"
                                required
                            />
                            <input
                                type="text"
                                placeholder="URL icon"
                                value={newCategoryIconUrl}
                                onChange={(e) => setNewCategoryIconUrl(e.target.value)}
                                className="flex-grow p-2 border border-gray-200 rounded-lg"
                                required
                            />
                            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                                Thêm
                            </Button>
                        </form>
                    )}

                    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="text-left py-4 px-6 font-medium text-sm text-gray-600">STT</th>
                                    <th className="text-left py-4 px-6 font-medium text-sm text-gray-600">Icon</th> {/* Cột icon */}
                                    <th
                                        className="text-left py-4 px-6 font-medium text-sm text-gray-600 cursor-pointer group"
                                        onClick={() => handleSort('name')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Tên danh mục
                                            {getSortIcon('name')}
                                        </div>
                                    </th>
                                    <th
                                        className="text-left py-4 px-6 font-medium text-sm text-gray-600 cursor-pointer group"
                                        onClick={() => handleSort('courseCount')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Số lượng khóa học
                                            {getSortIcon('courseCount')}
                                        </div>
                                    </th>
                                    <th
                                        className="text-left py-4 px-6 font-medium text-sm text-gray-600 cursor-pointer group"
                                        onClick={() => handleSort('lastUpdated')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Cập nhật lần cuối
                                            {getSortIcon('lastUpdated')}
                                        </div>
                                    </th>
                                    <th className="text-right py-4 px-6 font-medium text-sm text-gray-600">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedCategories.map((category) => (
                                    <tr
                                        key={category.id}
                                        className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="py-4 px-6 text-sm text-gray-600">#{category.id}</td>
                                        <td className="py-4 px-6 text-sm text-gray-600">
                                            <img src={category.icon} alt={`${category.name} icon`} className="h-6 w-6" /> {/* Hiển thị icon */}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="font-medium text-gray-900">{category.name}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm text-gray-600">{category.courseCount} khóa học</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-600">
                                            {new Date(category.lastUpdated).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex justify-end gap-2">
                                                <Link to='/admin/edit-category'>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                                    >
                                                        <PenLine className="h-4 w-4 mr-1" />
                                                        Sửa
                                                    </Button>
                                                </Link>

                                                <Button
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};
