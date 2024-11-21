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
import { Bell, Search, MoreHorizontal, Eye, Trash, Check } from "lucide-react"
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
    const [notifications, setNotifications] = useState([]);

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
            console.log(response.data);

            setNotifications(response.data.data.notifications || []);
            setTotalPages(response.data.data.pagination.last_page);
            setCurrentPage(response.data.data.pagination.current_page);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };
    const handleMarkAsRead = async (notificationId) => {
        const token = localStorage.getItem('access_token');
        try {
            await axios.post(`${API_URL}/auth/notifications/read/${notificationId}`, null, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            // Update notification status locally
            setNotifications(prevNotifications =>
                prevNotifications.map(notification =>
                    notification.id === notificationId
                        ? { ...notification, is_read: 1 }
                        : notification
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

    const filteredNotifications = notifications.filter(notification =>
        notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.sender_name.toLowerCase().includes(searchQuery.toLowerCase())
    );


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
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b pb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-50 rounded-xl">
                            <Bell className="h-5 w-5 text-yellow-500" />
                        </div>
                        <CardTitle className="text-xl font-bold">Thông báo của bạn</CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-6">
                    {/* Search Box */}
                    <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-xl">
                        <Search className="h-5 w-5 text-gray-400" />
                        <Input
                            placeholder="Tìm kiếm thông báo..."
                            className="flex-1 bg-transparent border-none focus:ring-1 focus:ring-yellow-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>


                    {/* Table */}
                    <div className="rounded-xl border border-gray-100 overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-yellow-50/50">
                                    <TableHead className="font-bold">STT</TableHead>
                                    <TableHead className="font-bold">Người gửi</TableHead>
                                    <TableHead className="font-bold">Nội dung</TableHead>
                                    <TableHead className="font-bold">Trạng thái</TableHead>
                                    <TableHead className="font-bold">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array(8).fill(0).map((_, index) => <TaskSkeleton key={index} />)
                                ) : notifications.length > 0 ? (
                                    notifications.map((notification, index) => (
                                        <TableRow
                                            key={notification.id}
                                            className={notification.is_read === 0
                                                ? "bg-red-50/50 hover:bg-red-100/50"
                                                : "bg-green-50/50 hover:bg-green-100/50"
                                            }
                                            onClick={() => handleNotificationClick(notification.id)}
                                        >
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{notification.sender_name}</TableCell>
                                            <TableCell>{notification.message}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={notification.is_read === 0
                                                        ? "bg-red-500 text-white"
                                                        : "bg-green-500 text-white"
                                                    }
                                                >
                                                    {notification.is_read === 0 ? 'Chưa đọc' : 'Đã đọc'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger>
                                                        <Button variant="ghost">
                                                            <MoreHorizontal className="h-5 w-5" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem onClick={() => handleNotificationClick(notification.id)}>
                                                            <Eye className="h-4 w-4 mr-2" /> Xem chi tiết
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleMarkAsRead(notification.id)}>
                                                            <Check className="h-4 w-4 mr-2" /> Đánh dấu đã đọc
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDeleteNotification(notification.id)}>
                                                            <Trash className="h-4 w-4 mr-2" /> Xóa
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                            Không có thông báo nào
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <Pagination>
                        <PaginationContent>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <PaginationItem key={index + 1}>
                                    <PaginationLink
                                        href="#"
                                        className={currentPage === index + 1
                                            ? "bg-yellow-400 text-white hover:bg-yellow-500"
                                            : "hover:bg-yellow-50"
                                        }
                                        onClick={() => handlePageChange(index + 1)}
                                    >
                                        {index + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                        </PaginationContent>
                    </Pagination>

                    {/* Alert Dialog */}
                    <AlertDialog>
                        <AlertDialogContent className="bg-white">
                            <AlertDialogHeader className="border-b border-yellow-200 pb-4">
                                <AlertDialogTitle className="text-xl font-bold text-yellow-500">
                                    Chi tiết thông báo
                                </AlertDialogTitle>
                            </AlertDialogHeader>
                            {/* Giữ nguyên nội dung AlertDialog */}
                            <AlertDialogFooter>
                                <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200">
                                    Đóng
                                </AlertDialogCancel>
                                <AlertDialogAction className="bg-yellow-400 hover:bg-yellow-500 text-white">
                                    Đánh dấu đã đọc
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardContent>
        </Card>
    );
}
