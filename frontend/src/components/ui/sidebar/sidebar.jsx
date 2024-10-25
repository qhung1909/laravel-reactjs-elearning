"use client"

import * as React from "react"
import {
  BarChart,
  BookOpen,
  ChevronRight,
  ChevronsUpDown,
  Coins,
  FileText,
  Folders,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuButton,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar"

const navItems = [
  {
    title: "Trang Chủ",
    icon: LayoutDashboard,
    items: [
      { title: "Thống kê doanh thu", url: "/dashboard/revenue" },
      { title: "Học viên mới", url: "/dashboard/new-students" },
      { title: "Khóa học mới", url: "/dashboard/new-courses" },
      { title: "Khóa học bán chạy", url: "/dashboard/top-courses" },
      { title: "Tổng quan tài chính", url: "/dashboard/financial-overview" },
    ],
  },
  {
    title: "Quản Lý Khóa Học",
    icon: BookOpen,
    items: [
      { title: "Tất cả khóa học", url: "/courses" },
      { title: "Thông tin khóa học", url: "/courses/info" },
      { title: "Duyệt khóa học mới", url: "/courses/approve" },
      { title: "Trạng thái khóa học", url: "/courses/status" },
      { title: "Danh mục khóa học", url: "/courses/categories" },
      { title: "Giá và khuyến mãi", url: "/courses/pricing" },
      { title: "Nội dung và tài liệu", url: "/courses/content" },
    ],
  },
  {
    title: "Quản Lý Danh Mục",
    icon: Folders,
    items: [
      { title: "Quản lý danh mục", url: "/categories" },
      { title: "Thứ tự hiển thị", url: "/categories/order" },
      { title: "Bật/Tắt danh mục", url: "/categories/toggle" },
      { title: "Gán khóa học", url: "/categories/assign" },
      { title: "Ảnh đại diện danh mục", url: "/categories/images" },
    ],
  },
  {
    title: "Quản Lý Người Dùng",
    icon: Users,
    items: [
      { title: "Danh sách học viên", url: "/users/students" },
      { title: "Danh sách giảng viên", url: "/users/instructors" },
      { title: "Hồ sơ người dùng", url: "/users/profiles" },
      { title: "Phân quyền người dùng", url: "/users/permissions" },
    ],
  },
  {
    title: "Quản Lý Thanh Toán",
    icon: Coins,
    items: [
      { title: "Lịch sử giao dịch", url: "/payments/history" },
      { title: "Mã giảm giá", url: "/payments/discounts" },
      { title: "Chính sách giá", url: "/payments/policies" },
      { title: "Báo cáo tài chính", url: "/payments/reports" },
    ],
  },
  {
    title: "Quản Lý Nội Dung",
    icon: FileText,
    items: [
      { title: "Bài viết/Blog", url: "/content/blog" },
      { title: "Banner quảng cáo", url: "/content/banners" },
      { title: "Thông báo hệ thống", url: "/content/notifications" },
    ],
  },
]

export default function SidebarDashboard() {
  const [activeItem, setActiveItem] = React.useState(navItems[0])

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      <GraduationCap className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        Bảng Điều Khiển LMS
                      </span>
                      <span className="truncate text-xs">
                        Quản Trị Viên
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  align="start"
                  side="bottom"
                  sideOffset={4}
                >
                  <DropdownMenuItem className="gap-2 p-2">
                    <Settings className="size-4" />
                    <span>Cài đặt</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 p-2">
                    <BarChart className="size-4" />
                    <span>Phân tích</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 p-2">
                    <LogOut className="size-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item === activeItem}
                onOpenChange={(isOpen) => {
                  if (isOpen) setActiveItem(item)
                }}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src="/avatars/01.png"
                        alt="Quản trị viên"
                      />
                      <AvatarFallback className="rounded-lg">QTV</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        Quản Trị Viên
                      </span>
                      <span className="truncate text-xs">
                        admin@example.com
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel>Tài Khoản Của Tôi</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Hồ Sơ</DropdownMenuItem>
                  <DropdownMenuItem>Cài Đặt</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Đăng Xuất</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  )
}
