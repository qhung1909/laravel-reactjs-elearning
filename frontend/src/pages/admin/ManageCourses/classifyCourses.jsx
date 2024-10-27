'use client'

import * as React from 'react'
import { Book, ChevronDown, Search, Users, Clock, Star } from 'lucide-react'
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

// Mock data for categories and courses
const categories = [
  "Tất cả",
  "Công nghệ thông tin",
  "Kinh doanh",
  "Thiết kế",
  "Marketing",
  "Ngoại ngữ",
]

const courses = [
  { id: 1, title: "Lập trình React", category: "Công nghệ thông tin", instructor: "Nguyễn Văn A", price: "599.000 VND", students: 1234, duration: "20 giờ", rating: 4.7 },
  { id: 2, title: "Quản lý dự án", category: "Kinh doanh", instructor: "Trần Thị B", price: "799.000 VND", students: 987, duration: "30 giờ", rating: 4.5 },
  { id: 3, title: "UI/UX Design", category: "Thiết kế", instructor: "Lê Văn C", price: "699.000 VND", students: 2345, duration: "25 giờ", rating: 4.8 },
  { id: 4, title: "Digital Marketing", category: "Marketing", instructor: "Phạm Thị D", price: "549.000 VND", students: 1567, duration: "15 giờ", rating: 4.6 },
  { id: 5, title: "Tiếng Anh giao tiếp", category: "Ngoại ngữ", instructor: "Hoàng Văn E", price: "499.000 VND", students: 3456, duration: "40 giờ", rating: 4.9 },
]

export default function ClassifyCourse() {
  const [selectedCategory, setSelectedCategory] = React.useState("Tất cả")
  const [searchTerm, setSearchTerm] = React.useState("")

  const filteredCourses = courses.filter(course =>
    (selectedCategory === "Tất cả" || course.category === selectedCategory) &&
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <SidebarProvider>
      <SideBarUI />
      <SidebarInset>
        <header className="z-10 absolute left-1 top-3">
          <div className="flex items-center gap-2 px-4 py-3">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="text-gray-500 hover:text-gray-900">Trang chủ</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/courses" className="text-blue-600 font-medium">Khóa học</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <main className="px-6 py-8 bg-gray-50 min-h-screen w-full">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Phân loại khóa học</h1>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-4 rounded-lg shadow-sm">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto">
                    {selectedCategory} <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {categories.map((category) => (
                    <DropdownMenuItem key={category} onSelect={() => setSelectedCategory(category)}>
                      {category}
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

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="flex flex-col hover:shadow-md transition-shadow duration-200">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800">{course.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Badge variant="secondary" className="text-xs font-normal">
                        {course.category}
                      </Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-gray-600 mb-2">Giảng viên: {course.instructor}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {course.students}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {course.duration}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center border-t pt-4">
                    <p className="text-lg font-semibold text-blue-600">{course.price}</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{course.rating}</span>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
