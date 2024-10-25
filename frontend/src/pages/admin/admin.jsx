"use client"
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, Line, LineChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ]
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--chart-2))",
    },
  }
import * as React from "react"
import {
  AudioWaveform,
  BadgeCheck,
  Bell,
  BookOpen,
  Bot,
  ChevronRight,
  ChevronsUpDown,
  Command,
  CreditCard,
  Folder,
  Forward,
  Frame,
  GalleryVerticalEnd,
  LogOut,
  Map,
  MoreHorizontal,
  PieChart,
  Plus,
  Settings2,
  Sparkles,
  SquareTerminal,
  Trash2,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "admin",
    email: "admin@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Quản lý Khóa học",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Danh sách tất cả khóa học",
          url: "#",
        },
        {
          title: "Xem, xóa thông tin khóa học",
          url: "#",
        },
        {
          title: "Duyệt khóa học mới từ giảng viên",
          url: "#",
        },
        {
            title: "Quản lý trạng thái khóa học (Draft/Published/Hidden)",
            url: "#",
        },
        {
        title: "Phân loại khóa học theo category",
        url: "#",
        },
        {
        title: "Điều chỉnh giá và khuyến mãi",
        url: "#",
        },
        {
        title: "Quản lý nội dung và tài liệu của khóa học",
        url: "#",
        },
      ],
    },
    {
      title: "Quản lý Category",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Thêm/Sửa/Xóa category",
          url: "#",
        },
        {
          title: "Sắp xếp thứ tự hiển thị",
          url: "#",
        },
        {
          title: "Bật/Tắt category",
          url: "#",
        },
        {
          title: "Gán khóa học vào category",
          url: "#",
        },
        {
          title: "Quản lý ảnh đại diện category",
          url: "#",
        },
      ],
    },
    {
      title: "Quản lý Người dùng",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Danh sách học viên",
          url: "#",
        },
        {
          title: "Quản lý mã giảm giá (Thêm/ xóa/ sửa)",
          url: "#",
        },
        {
          title: "Thiết lập chính sách giá",
          url: "#",
        },
        {
          title: "Xuất báo cáo tài chính",
          url: "#",
        },
      ],
    },
    {
      title: "Quản lý Nội dung",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Bài viết/Blog",
          url: "#",
        },
        {
          title: "Banner quảng cáo",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Thông báo hệ thống",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export default function Dashboard() {
  const [activeTeam, setActiveTeam] = React.useState(data.teams[0])

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      <activeTeam.logo className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        abc
                      </span>
                      <span className="truncate text-xs">
                        abcdddđ
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
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Teams
                  </DropdownMenuLabel>
                  {data.teams.map((team, index) => (
                    <DropdownMenuItem
                      key={team.name}
                      onClick={() => setActiveTeam(team)}
                      className="gap-2 p-2"
                    >
                      <div className="flex size-6 items-center justify-center rounded-sm border">
                        <team.logo className="size-4 shrink-0" />
                      </div>
                      {team.name}
                      <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 p-2">
                    <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                      <Plus className="size-4" />
                    </div>
                    <div className="font-medium text-muted-foreground">
                      Add team
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
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
          </SidebarGroup>
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarMenu>
              {data.projects.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-48 rounded-lg"
                      side="bottom"
                      align="end"
                    >
                      <DropdownMenuItem>
                        <Folder className="text-muted-foreground" />
                        <span>View Project</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Forward className="text-muted-foreground" />
                        <span>Share Project</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Trash2 className="text-muted-foreground" />
                        <span>Delete Project</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton className="text-sidebar-foreground/70">
                  <MoreHorizontal className="text-sidebar-foreground/70" />
                  <span>More</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={data.user.avatar}
                        alt={data.user.name}
                      />
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {data.user.name}
                      </span>
                      <span className="truncate text-xs">
                        {data.user.email}
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
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={data.user.avatar}
                          alt={data.user.name}
                        />
                        <AvatarFallback className="rounded-lg">
                          CN
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {data.user.name}
                        </span>
                        <span className="truncate text-xs">
                          {data.user.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Sparkles />
                      Upgrade to Pro
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <BadgeCheck />
                      Account
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CreditCard />
                      Billing
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Bell />
                      Notifications
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="fixed top-0 left-60 w-full z-50 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 ">
        {/* <header className="flex top-0 h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"> */}
        <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">
                    Trang chủ
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
              </BreadcrumbList>
            </Breadcrumb>
        </div>
        </header>
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <div>
                <h1 className="text-2xl font-semibold">Admin</h1>
                <div className="text-gray-500 text-sm">
                    <a href="/">Trang chủ</a> &gt; <span>Dashboard</span>
                </div>
                </div>
                <div className="flex items-center space-x-4">
                <input
                    type="text"
                    placeholder="Search..."
                    className="border rounded px-3 py-1 text-gray-700"
                />
                <button className="relative">
                    <span className="absolute top-0 right-0 bg-blue-500 text-white rounded-full px-1 text-xs">
                    1
                    </span>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQOyEJTVplvsmdzMXJ7dpIC6tP4sJUb0r8UQ&s" alt="Notification" className="w-6 h-6" />
                </button>
                <img src="https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474120nrt/anh-avatar-shin-cute-nhat_014815307.jpg" alt="User" className="w-8 h-8 rounded-full" />
                </div>
            </div>
            <div className="grid grid-cols-4 gap-6 mb-6">
                <div className="bg-white shadow rounded p-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-sm font-semibold">Tổng doanh thu</h2>
                    <span className="text-xs text-gray-500">07 Days</span>
                </div>
                <div className="mt-4 text-2xl font-semibold">$30</div>
                <div className="text-sm text-green-500 mt-1">abc</div>
                <div className="h-12 mt-2 bg-yellow-200 rounded" />
                </div>
                <div className="bg-white shadow rounded p-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-sm font-semibold">Tổng khóa học</h2>
                    <span className="text-xs text-gray-500">07 Days</span>
                </div>
                <div className="mt-4 text-2xl font-semibold">21,000</div>
                <div className="text-sm text-red-500 mt-1">abc</div>
                <div className="h-12 mt-2 bg-yellow-200 rounded" />
                </div>
                <div className="bg-white shadow rounded p-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-sm font-semibold">Tổng bài học</h2>
                    <span className="text-xs text-gray-500">07 Days</span>
                </div>
                <div className="mt-4 text-2xl font-semibold">25,000</div>
                <div className="text-sm text-blue-500 mt-1">abc</div>
                <div className="h-12 mt-2 bg-yellow-200 rounded" />
                </div>
                <div className="bg-white shadow rounded p-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-sm font-semibold">Đánh giá trung bình</h2>
                    <span className="text-xs text-gray-500">07 Days</span>
                </div>
                <div className="mt-4 text-2xl font-semibold">4.5</div>
                <div className="text-sm text-blue-500 mt-1">abc</div>
                <div className="h-12 mt-2 bg-yellow-200 rounded" />
                </div>
            </div>
        </div>
        <Card className="max-w-lg">
        <CardHeader>
            <CardTitle>Biểu đồ</CardTitle>
            <CardDescription>Tháng 1 - Tháng 10 2024</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={chartConfig}>
            <LineChart
                accessibilityLayer
                data={chartData}
                margin={{
                left: 12,
                right: 12,
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Line
                dataKey="desktop"
                type="monotone"
                stroke="var(--color-desktop)"
                strokeWidth={2}
                dot={false}
                />
                <Line
                dataKey="mobile"
                type="monotone"
                stroke="var(--color-mobile)"
                strokeWidth={2}
                dot={false}
                />
            </LineChart>
            </ChartContainer>
        </CardContent>
        <CardFooter>
            <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
                <div className="flex items-center gap-2 font-medium leading-none">
                Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                Showing total visitors for the last 6 months
                </div>
            </div>
            </div>
        </CardFooter>
        </Card>
      </SidebarInset>
    </SidebarProvider>

  )
}
