import * as React from "react";
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
    GalleryVerticalEnd,
    LogOut,
    Plus,
    Settings2,
    Sparkles,
    SquareTerminal,
    Layout,
    MessageCircle
} from "lucide-react";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

const data = {
    user: {
        name: "Tôi tên là Hoàng",
        email: "admin@gmail.com",
        avatar: "/src/assets/images/doremon.jpg",
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
            title: "Tổng quan",
            url: "/admin",
            icon: Layout,
        },
        {
            title: "Quản lý Khóa học",
            url: "#",
            icon: SquareTerminal,
            items: [
                { title: "Danh sách tất cả khóa học", url: "/admin/course-list" },
                { title: "Duyệt khóa học mới từ giảng viên", url: "/admin/browse-new-courses" },
                { title: "Quản lý trạng thái khóa học (Draft/Published/Hidden)", url: "/admin/course-status" },
                { title: "Phân loại khóa học theo danh mục", url: "/admin/classify-course" },
                { title: "Quản lý mã voucher", url: "/admin/page-coupons" },
            ],
        },
        {
            title: "Quản lý Danh mục",
            url: "#",
            icon: Bot,
            items: [
                // { title: "Danh sách tất cả Danh mục", url: "/admin/category-list" },
                { title: "Thêm/Sửa/Xóa Danh mục", url: "/admin/category-crud" },
                // { title: "Sắp xếp thứ tự hiển thị", url: "/admin/priority-category" },
                // { title: "Gán khóa học vào Danh mục", url: "/admin/courses-of-category" }
            ],
        },
        {
            title: "Quản lý Người dùng",
            url: "#",
            icon: BookOpen,
            items: [
                // { title: "Danh sách học viên", url: "/admin/list-students" },
                // { title: "Danh sách giảng viên", url: "/admin/list-teachers" },
                { title: "Thông tin cá nhân và hồ sơ", url: "/admin/personal-information" },
                { title: "Phân loại người dùng", url: "/admin/classify-users" },
            ],
        },
        {
            title: "Quản lý nội dung",
            url: "#",
            icon: Settings2,
            items: [
                { title: "Bài viết/Blog", url: "/admin/blogs" },
                { title: "Banner quảng cáo", url: "#" },
                { title: "Billing", url: "#" },
                { title: "Thông báo hệ thống", url: "#" },
            ],
        },
        {
            title: "Quản lý bình luận",
            url: "#",
            icon: MessageCircle,
            items: [
                { title: "Tất cả bình luận", url: "/admin/comments" },

            ],
        },
        {
            title: "Quản lý Header/Footer",
            url: "#",
            icon: Settings2,
            items: [
                { title: "Quản lý Header", url: "/admin/manage-header" },
                { title: "Quản lý Footer", url: "/admin/manage-footer" },
            ],
        },
    ],
};

export const SideBarUI = () => {
    const [activeTeam, setActiveTeam] = React.useState(data.teams[0]);
    const [openSection, setOpenSection] = React.useState(null); // Trạng thái cho phần đang mở

    const toggleSection = (title) => {
        setOpenSection((prev) => (prev === title ? null : title)); // Nếu phần đang mở thì đóng, ngược lại thì mở
    };

    return (
        <Sidebar collapsible="icon">

            {/* header - teams */}
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
                                        <span className="truncate font-semibold">Teams</span>
                                        <span className="truncate text-xs">Admin</span>
                                    </div>
                                    <ChevronsUpDown className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg" align="start" side="bottom" sideOffset={4}>
                                <DropdownMenuLabel className="text-xs text-muted-foreground">Teams</DropdownMenuLabel>
                                {data.teams.map((team, index) => (
                                    <DropdownMenuItem key={team.name} onClick={() => setActiveTeam(team)} className="gap-2 p-2">
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
                                    <div className="font-medium text-muted-foreground">Add team</div>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* Content - nav list */}
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        <p className="sm:text-lg text-xl">
                            Platform
                        </p>
                    </SidebarGroupLabel>
                    <SidebarMenu className="space-y-2">
                        {data.navMain.map((item) => {
                            const isOpen = openSection === item.title; // Kiểm tra xem phần này có đang mở không
                            if (item.title === "Tổng quan") {
                                return (

                                    // Tổng quan
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton tooltip={item.title} asChild>
                                            <Link to={item.url} className="flex items-center gap-4 justify-start my-2">
                                                <div className="">
                                                    {item.icon && <item.icon />}
                                                </div>
                                                <span className="text-lg font-medium">{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            } else {
                                return (
                                    <Collapsible
                                        key={item.title}
                                        asChild
                                        open={isOpen}
                                    >
                                        <SidebarMenuItem>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton tooltip={item.title} onClick={() => toggleSection(item.title)}>
                                                    <div className="flex items-center gap-5">
                                                        {item.icon && <item.icon />}
                                                        <span>{item.title}</span>
                                                    </div>

                                                    <ChevronRight className="ml-auto transition-transform duration-400" style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }} />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {item.items.map((subItem) => (
                                                        <SidebarMenuSubItem key={subItem.title}>
                                                            <SidebarMenuSubButton asChild>
                                                                <Link to={subItem.url}>
                                                                    <span>{subItem.title}</span>
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </SidebarMenuItem>
                                    </Collapsible>
                                );
                            }
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>


            {/* footer - user */}
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={data.user.avatar} alt={data.user.name} />
                                        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">{data.user.name}</span>
                                        <span className="truncate text-xs">{data.user.email}</span>
                                    </div>
                                    <ChevronsUpDown className="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg" side="bottom" align="end" sideOffset={4}>
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage src={data.user.avatar} alt={data.user.name} />
                                            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">{data.user.name}</span>
                                            <span className="truncate text-xs">{data.user.email}</span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <Sparkles /> Upgrade to Pro
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <BadgeCheck /> Account
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <CreditCard /> Billing
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Bell /> Notifications
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <LogOut /> Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
