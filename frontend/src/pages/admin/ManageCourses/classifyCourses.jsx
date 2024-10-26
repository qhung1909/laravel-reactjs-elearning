'use client'

import * as React from 'react'
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
  { id: 1, title: "Lập trình React", category: "Công nghệ thông tin", instructor: "Nguyễn Văn A", price: "599.000 VND" },
  { id: 2, title: "Quản lý dự án", category: "Kinh doanh", instructor: "Trần Thị B", price: "799.000 VND" },
  { id: 3, title: "UI/UX Design", category: "Thiết kế", instructor: "Lê Văn C", price: "699.000 VND" },
  { id: 4, title: "Digital Marketing", category: "Marketing", instructor: "Phạm Thị D", price: "549.000 VND" },
  { id: 5, title: "Tiếng Anh giao tiếp", category: "Ngoại ngữ", instructor: "Hoàng Văn E", price: "499.000 VND" },
]

export const ClassifyCourse = () => {
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
                  <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/courses">Khóa học</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <main className="absolute top-14 px-6 bg-gray-50 w-full">
          <h1 className="text-3xl font-bold mb-8">Phân loại khóa học</h1>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
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
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
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
              <Card key={course.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription>{course.category}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground">Giảng viên: {course.instructor}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <p className="text-lg font-semibold">{course.price}</p>
                  {/* <Button variant="outline">
                    <Book className="mr-2 h-4 w-4" />
                    Đăng ký
                  </Button> */}
                </CardFooter>
              </Card>
            ))}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
