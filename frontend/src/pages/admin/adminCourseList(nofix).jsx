import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarRail,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/sidebar"; // Import các thành phần cần thiết

const courses = [
  { id: 1, title: "Khóa học React", instructor: "Nguyễn Văn A", status: "Đang diễn ra", price: "500,000 VNĐ" },
  { id: 2, title: "Khóa học JavaScript", instructor: "Trần Thị B", status: "Hoàn thành", price: "400,000 VNĐ" },
  { id: 3, title: "Khóa học CSS", instructor: "Lê Văn C", status: "Đang chờ", price: "300,000 VNĐ" },
  { id: 4, title: "Khóa học HTML", instructor: "Nguyễn Thị D", status: "Đang diễn ra", price: "200,000 VNĐ" },
  // Thêm nhiều khóa học nếu cần
];

const AdminCourseListt = () => {
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
                      <span className="material-icons">school</span> {/* Sử dụng biểu tượng */}
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">Khóa học</span>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 rounded-lg" align="start" side="bottom" sideOffset={4}>
                  <DropdownMenuItem className="gap-2 p-2">Thêm khóa học</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Danh sách khóa học</SidebarGroupLabel>
            <SidebarMenu>
              {/* Các mục menu khác có thể được thêm vào đây */}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                    <span className="material-icons">account_circle</span> {/* Sử dụng biểu tượng */}
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">Người dùng</span>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 rounded-lg" side="bottom" align="end" sideOffset={4}>
                  <DropdownMenuItem>Đăng xuất</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Danh sách tất cả khóa học</h1>
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          <thead>
            <tr className="bg-gray-300 text-gray-700">
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Tiêu đề</th>
              <th className="py-2 px-4 border-b">Giảng viên</th>
              <th className="py-2 px-4 border-b">Trạng thái</th>
              <th className="py-2 px-4 border-b">Giá</th>
              <th className="py-2 px-4 border-b">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{course.id}</td>
                <td className="py-2 px-4 border-b">{course.title}</td>
                <td className="py-2 px-4 border-b">{course.instructor}</td>
                <td className="py-2 px-4 border-b">{course.status}</td>
                <td className="py-2 px-4 border-b">{course.price}</td>
                <td className="py-2 px-4 border-b">
                  <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                    Chỉnh sửa
                  </button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2">
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SidebarProvider>
  );
};

export default AdminCourseListt;
