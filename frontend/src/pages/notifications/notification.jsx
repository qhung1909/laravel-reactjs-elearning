import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
} from "@/components/ui/pagination"
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
import { Bell, Search, MoreHorizontal, Eye, Trash } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import axios from "axios"
export default function TaskList() {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [tasksPerPage] = useState(8)
    const [totalPages, setTotalPages] = useState(0)
    const [selectedNotification, setSelectedNotification] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL
    const location = useLocation()
    const navigate = useNavigate()

    // hàm xử lý hiện thông báo
    const fetchNotifications = async (page = 1) => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            console.error('No token found');
            return;
        }
        try {
            const response = await axios.get(`${API_URL}/auth/notifications?per_page=${tasksPerPage}&page=${page}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            // Log response data

            setTasks(response.data.data.notifications || []);
            setTotalPages(response.data.data.pagination.last_page);
            setCurrentPage(response.data.data.pagination.current_page);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        const token = localStorage.getItem('access_token');
        try {
            // Gửi yêu cầu POST để đánh dấu thông báo là đã đọc
            await axios.post(`${API_URL}/auth/notifications/read/${notificationId}`, null, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            // Cập nhật trạng thái thông báo đã đọc trong danh sách
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === notificationId ? { ...task, is_read: 1 } : task
                )
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };


    // hàm xử lý lấy thông báo chi tiết
    const handleNotificationClick = async (notificationId) => {
        const token = localStorage.getItem('access_token');
        try {
            const response = await axios.get(`${API_URL}/auth/notifications/${notificationId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
            setSelectedNotification(response.data.data);
            console.log(response.data.data)
            await markAsRead(notificationId);
        } catch (error) {
            console.error('Error fetching notification details:', error);
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const page = parseInt(params.get('page')) || 1
        const per_page = parseInt(params.get('per_page')) || tasksPerPage

        setCurrentPage(page)
        fetchNotifications(page)
    }, [location.search])

    const filteredTasks = tasks.filter(task =>
        task.message.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const TaskSkeleton = () => (
        <TableRow>
            <TableCell><Skeleton className="h-4 w-8" /></TableCell>
            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
            <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
        </TableRow>
    )

    const handlePageChange = (page) => {
        setCurrentPage(page)
        const params = new URLSearchParams(location.search)
        params.set('page', page)
        params.set('per_page', tasksPerPage)
        navigate({ search: params.toString() })
    }

    return (
        <Card className="w-full max-w-4xl mx-auto shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                <CardTitle className="text-3xl font-bold">Thông báo</CardTitle>
                <Bell className="h-8 w-8 text-primary" />
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="flex items-center space-x-2 bg-secondary p-2 rounded-md">
                        <Search className="h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Tìm kiếm thông báo..."
                            className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="rounded-md border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-secondary">
                                    <TableHead className="w-12 font-bold">STT</TableHead>
                                    <TableHead className="w-40 font-bold">Người gửi</TableHead>
                                    <TableHead className="font-bold">Nội dung</TableHead>
                                    <TableHead className="w-[120px] font-bold">Trạng thái</TableHead>
                                    <TableHead className="w-[120px] font-bold">Thao tác</TableHead>
                                    <TableHead className="w-[120px] font-bold">Hành động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array(8).fill(0).map((_, index) => <TaskSkeleton key={index} />)
                                ) : filteredTasks.length > 0 ? (
                                    filteredTasks.map((task, index) => (

                                        <TableRow

                                            key={task.id}
                                            className={task.is_read === 0 ? "bg-red-50 hover:bg-red-100 " : "bg-green-50 hover:bg-green-100"}
                                            onClick={() => handleNotificationClick(task.id)}
                                        >

                                            {/* STT */}
                                            <TableCell>{(currentPage - 1) * tasksPerPage + index + 1}</TableCell>

                                            {/* Người gửi */}
                                            <TableCell>
                                            {task.sender_name}
                                            </TableCell>
                                            {/* ID */}
                                            {/* <TableCell className="font-medium">
                                                <Badge variant={task.type === "high" ? "destructive" : task.type === "medium" ? "default" : "secondary"}>
                                                    {task.id}
                                                </Badge>
                                            </TableCell> */}

                                            {/* Content */}
                                            <TableCell className="font-medium">{task.message}</TableCell>

                                            {/* Trạng thái */}
                                            <TableCell>
                                                <Badge
                                                    variant={task.is_read === 0 ? "destructive" : "success"}
                                                    className="w-24 justify-center py-1"
                                                >
                                                    {task.is_read === 0 ? "Chưa đọc" : "Đã đọc"}
                                                </Badge>
                                            </TableCell>

                                            {/* Thao tác */}
                                            <TableCell>
                                                <AlertDialog>
                                                    <AlertDialogTrigger onClick={() => handleNotificationClick(task.id)}>Xem chi tiết</AlertDialogTrigger>
                                                    <AlertDialogContent className="max-h-[700px]">
                                                        <AlertDialogHeader>

                                                            {/* title */}
                                                            <AlertDialogTitle>
                                                                <div className="">
                                                                    <div className="space-y-5 border-b-2 border-yellow-500 pb-8">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="">
                                                                                <img src="/src/assets/images/antlearn.png" className="w-16" alt="" />
                                                                            </div>
                                                                            <div className="text-xl font-bold text-yellow-400">
                                                                                <p>AntLearn - Cùng học trực tuyến tại nhà</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>

                                                                {/* content */}
                                                                <div className="max-h-[450px] overflow-y-auto py-3">
                                                                    <div className="space-y-2">
                                                                        {selectedNotification ? (
                                                                            <>

                                                                                {/* date */}
                                                                                <div className="">
                                                                                    <span className="text-sm">
                                                                                        {new Date(selectedNotification.created_at).toLocaleString('vi-VN')}
                                                                                    </span>
                                                                                </div>

                                                                                {/* title */}
                                                                                <div className="text-2xl font-bold">
                                                                                    <span className="text-xl font-semibold">{selectedNotification.message}</span>
                                                                                </div>

                                                                                {/* content */}
                                                                                <div className="space-y-1">
                                                                                    <div className="space-y-3">
                                                                                        <div
                                                                                            className="space-y-3"
                                                                                            dangerouslySetInnerHTML={{ __html: selectedNotification.content }}
                                                                                        />
                                                                                        <img src="/src/assets/images/doremon.jpg" className=" w-52" alt="" />
                                                                                    </div>
                                                                                </div>
                                                                            </>
                                                                        ) : (
                                                                            <p>Đang tải</p>
                                                                        )}


                                                                    </div>
                                                                </div>
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel className=" hover:bg-yellow-500">
                                                                Trở về
                                                            </AlertDialogCancel>
                                                            {/* <AlertDialogAction className=" hover:bg-yellow-500">
                                                                Đánh dấu đã đọc
                                                            </AlertDialogAction> */}
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>

                                            {/* Hành động */}
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem className="cursor-pointer">
                                                            <Trash className="mr-2 h-4 w-4" />
                                                            <span>Xóa</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            Không có thông báo nào.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <Pagination>
                        <PaginationContent>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <PaginationItem key={index + 1}>
                                    <PaginationLink
                                        href="#"
                                        className={currentPage === index + 1 ? "bg-primary text-primary-foreground" : ""}
                                        onClick={() => handlePageChange(index + 1)}
                                    >
                                        {index + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                        </PaginationContent>
                    </Pagination>
                </div>
            </CardContent>
        </Card>
    )
}
