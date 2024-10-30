import * as React from 'react'
import axios from 'axios'
import { Book, ChevronDown, Search } from 'lucide-react'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { SideBarUI } from "../sidebarUI"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function ClassifyCourse() {
  const [courses, setCourses] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState("Tất cả");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  const API_KEY = import.meta.env.VITE_API_KEY;
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/courses`, {
        headers: { 'x-api-secret': API_KEY }
      });
      setCourses(res.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/categories`, {
        headers: { 'x-api-secret': API_KEY }
      });
      setCategories([{ course_category_id: 'all', name: 'Tất cả' }, ...res.data]);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchCourses(), fetchCategories()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleCategoryChange = async (courseId, categoryId) => {
    if (!courseId) {
      console.error('Course ID is undefined');
      return;
    }

    setCourses(prevCourses =>
      prevCourses.map(course =>
        course.course_id === courseId ? { ...course, course_category_id: categoryId } : course
      )
    );

    try {
      await axios.put(`${API_URL}/admin/courses/${courseId}`, {
        course_category_id: categoryId
      }, {
        headers: { 'x-api-secret': API_KEY }
      });
    } catch (error) {
      console.error('Error updating course category:', error);
    }
  }

  const filteredCourses = courses.filter(course => {
    const isInSelectedCategory = selectedCategory === "Tất cả" || selectedCategory === "all" || course.course_category_id === selectedCategory;
    const isInSearchTerm = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    return isInSelectedCategory && isInSearchTerm;
  });

  return (
    <SidebarProvider>
      <SideBarUI />
      <SidebarInset>
        <header className="z-10 absolute left-1 top-3">
          <div className="flex items-center gap-2 px-4 py-3">
            <SidebarTrigger className="ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="text-gray-500 hover:text-gray-900">Trang chủ</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/courses" className="text-blue-600 font-medium">Phân loại hóa học</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="absolute top-16 px-6 bg-gray-50 w-full">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">Phân loại khóa học</h1>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 bg-white p-4 rounded-lg shadow-sm">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  {selectedCategory === "Tất cả" ? "Tất cả" : categories.find(c => c.course_category_id === selectedCategory)?.name || "Tất cả"} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {categories.map((category) => (
                  <DropdownMenuItem key={category.course_category_id} onSelect={() => setSelectedCategory(category.course_category_id)}>
                    {category.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm khóa học"
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <p>Đang tải...</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-4 px-6 font-medium text-sm text-gray-600">Tên khóa học</th>
                    <th className="text-left py-4 px-6 font-medium text-sm text-gray-600">Giá</th>
                    <th className="text-left py-4 px-6 font-medium text-sm text-gray-600">Danh mục</th>
                    <th className="text-left py-4 px-6 font-medium text-sm text-gray-600">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((course) => (
                    <tr key={course.course_id} className="border-t border-gray-100">
                      <td className="py-4 px-6">{course.title}</td>
                      <td className="py-4 px-6">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}</td>
                      <td className="py-4 px-6">
                        <select
                          value={course.course_category_id || ''}
                          onChange={(e) => handleCategoryChange(course.course_id, e.target.value)}
                          className="border border-gray-300 rounded-lg p-2"
                        >
                          {categories.filter(c => c.course_category_id !== 'all').map(category => (
                            <option key={category.course_category_id} value={category.course_category_id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-4 px-6">
                        <Button variant="outline" size="sm">
                          Xem chi tiết
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
