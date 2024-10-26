'use client'

import * as React from 'react'
import { Book, ChevronDown, Search, Users, Clock, BookOpen } from 'lucide-react'
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
  "Lập trình Web",
  "Lập trình Mobile",
  "Data Science",
  "UI/UX Design",
  "DevOps",
]

const courses = [
  {
    id: 1,
    title: "Fullstack Web Development với React & Node.js",
    category: "Lập trình Web",
    instructor: {
      name: "Nguyễn Văn A",
      title: "Senior Software Engineer",
      experience: "8 năm kinh nghiệm"
    },
    description: "Khóa học toàn diện về phát triển web từ frontend đến backend, sử dụng công nghệ hiện đại React và Node.js.",
    duration: "12 tuần",
    lessons: 48,
    level: "Trung cấp",
    students: 1234
  }
]

export default function  NewExample () {
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

        <main className="absolute top-2 px-6 bg-gray-50 w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold">Danh sách khóa học</h1>
              <p className="text-muted-foreground mt-1">Khám phá các khóa học chất lượng từ những giảng viên hàng đầu</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
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
          </div>

          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{course.title}</CardTitle>
                      <Badge variant="secondary" className="mt-2">
                        {course.category}
                      </Badge>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {course.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground mb-4">{course.description}</p>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <Users className="h-5 w-5 text-muted-foreground mt-1" />
                      <div>
                        <p className="font-medium">{course.instructor.name}</p>
                        <p className="text-sm text-muted-foreground">{course.instructor.title}</p>
                        <p className="text-sm text-muted-foreground">{course.instructor.experience}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{course.lessons} bài học</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{course.students} học viên</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  {/* <Button>Xem chi tiết</Button> */}
                </CardFooter>
              </Card>
            ))}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
