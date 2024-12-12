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
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
} from "@/components/ui/pagination"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
export default function TaskList() {
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [tasksPerPage] = useState(8)
    const [totalPages, setTotalPages] = useState(0)
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const API_URL = import.meta.env.VITE_API_URL
    const location = useLocation()
    const navigate = useNavigate()

    // chuyển đổi nội dung html
    const createMarkup = (htmlContent) => {
        return { __html: htmlContent };
    };

    // tìm kiếm
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

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

    // hàm xử lý xem tbao
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
            await handleMarkAsRead(notificationId);
        } catch (error) {
            console.error('Error fetching notification details:', error);
        }
    };

    // hàm xử lý xóa tbao
    const handleDeleteNotification = async (notificationId) => {
        const token = localStorage.getItem('access_token');
        try {
            const response = await axios.delete(`${API_URL}/auth/notifications/${notificationId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
            setNotifications(prevNotifications =>
                prevNotifications.filter(notification => notification.id !== notificationId)
            );
            setSelectedNotification(null);

        } catch (error) {
            console.error('Error fetching notification details:', error);
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const page = parseInt(params.get('page')) || 1
        setCurrentPage(page)
        fetchNotifications(page)
    }, [location.search])




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
        <Card className="border-0 bg-white/80 backdrop-blur-sm">

            <CardContent className="pb-3 px-0">
                <div className="space-y-6">
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
                                                <div className="flex gap-1 items-center">
                                                    <Dialog
                                                        open={isDialogOpen}
                                                        onOpenChange={(open) => {
                                                            setIsDialogOpen(open);
                                                            if (open) {
                                                                handleNotificationClick(notification.id);
                                                            }
                                                        }}
                                                    >
                                                        <DialogTrigger asChild>
                                                            <button className="inline-flex items-center justify-center rounded-md w-8 h-8 transition-colors hover:bg-gray-100 hover:text-gray-900">
                                                                <Eye className="h-4 w-4" />
                                                            </button>
                                                        </DialogTrigger>

                                                        <DialogContent className="sm:max-w-[500px] p-0">
                                                            <DialogHeader className="px-6 pt-6">
                                                                <div className="flex items-start gap-4">
                                                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                                        <Bell className="h-5 w-5 text-blue-600" />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center gap-2">
                                                                            <DialogTitle className="text-xl font-semibold">
                                                                                Thông báo
                                                                            </DialogTitle>
                                                                            <Badge variant="secondary" className="ml-2">Mới</Badge>
                                                                        </div>
                                                                        <p className="text-sm text-gray-500 mt-1">
                                                                            {new Date().toLocaleDateString('vi-VN')}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </DialogHeader>

                                                            <Separator className="my-4" />

                                                            <ScrollArea className="px-6 max-h-[60vh]">
                                                                <div className="space-y-4">
                                                                    <div className="space-y-2">
                                                                        <h3 className="font-medium text-gray-900">Tiêu đề</h3>
                                                                        <p className="text-gray-700">
                                                                            {selectedNotification?.message}
                                                                        </p>
                                                                    </div>

                                                                    <div className="space-y-2">
                                                                        <h3 className="font-medium text-gray-900">Nội dung chi tiết</h3>
                                                                        <div
                                                                            className="text-gray-700 prose prose-sm max-w-none"
                                                                            dangerouslySetInnerHTML={createMarkup(selectedNotification?.content)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </ScrollArea>

                                                            <div className="p-6 bg-gray-50 mt-6">
                                                                <p className="text-sm text-gray-500 text-center">
                                                                    Nhấn nút ESC hoặc click bên ngoài để đóng
                                                                </p>
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                    <button onClick={() => handleMarkAsRead(notification.id)} className="cursor-pointer">
                                                        <Check className="h-4 w-4 mr-2" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Ngăn event bubbling
                                                            handleDeleteNotification(notification.id);
                                                        }}
                                                        className="cursor-pointer"
                                                    >
                                                        <Trash className="h-4 w-4 mr-2" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <svg width="100%" height="177" viewBox="0 0 139 142" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M71.5016 125.45C104.302 125.45 130.902 99.0496 130.902 66.4496C130.902 33.8496 104.302 7.44958 71.5016 7.44958C38.7016 7.44958 12.1016 33.8496 12.1016 66.4496C12.1016 99.0496 38.7016 125.45 71.5016 125.45Z" fill="#EAEEF9">
                                                    </path>
                                                    <path d="M117.002 58.7495V94.8495C117.002 102.35 110.902 108.45 103.302 108.45H39.9017C32.4017 108.45 26.3017 102.45 26.2017 94.9495C26.2017 94.8495 26.2017 94.8495 26.2017 94.7495V58.7495C26.2017 58.6495 26.2017 58.6495 26.2017 58.5495C26.2017 58.3495 26.2017 58.1495 26.3017 57.9495C26.4017 57.6495 26.5017 57.4495 26.6017 57.1495L43.6017 24.6495C44.2017 23.3495 45.5017 22.6495 46.9017 22.6495H96.2017C97.6017 22.6495 98.8017 23.3495 99.5017 24.6495L116.502 57.1495C116.602 57.3495 116.702 57.6495 116.802 57.9495C117.002 58.1495 117.002 58.4495 117.002 58.7495Z" fill="#D5DDEA"></path><g filter="url(#filter0_d_0_17276)"><path d="M117.002 58.7496V98.5496C117.002 104.05 112.602 108.45 107.002 108.45H36.2017C30.7017 108.45 26.2017 104.05 26.2017 98.5496V58.5496C26.2017 58.3496 26.2017 58.1496 26.3017 57.9496H49.1017C52.5017 57.9496 55.3017 60.6496 55.3017 64.1496C55.3017 65.8496 56.0017 67.4496 57.1017 68.5496C58.3017 69.7496 59.7017 70.3496 61.5017 70.3496H81.8017C85.2017 70.3496 88.0017 67.6496 88.0017 64.1496C88.0017 62.4496 88.7017 60.8496 89.8017 59.7496C91.0017 58.5496 92.4017 57.9496 94.1017 57.9496H116.802C117.002 58.1496 117.002 58.4496 117.002 58.7496Z" fill="url(#paint0_linear_0_17276)"></path></g><path d="M129.384 38.2496C131.648 38.2496 133.484 36.4139 133.484 34.1496C133.484 31.8852 131.648 30.0496 129.384 30.0496C127.119 30.0496 125.284 31.8852 125.284 34.1496C125.284 36.4139 127.119 38.2496 129.384 38.2496Z" fill="#EAEEF9"></path><path d="M125.284 24.9496C126.83 24.9496 128.084 23.696 128.084 22.1496C128.084 20.6032 126.83 19.3496 125.284 19.3496C123.737 19.3496 122.484 20.6032 122.484 22.1496C122.484 23.696 123.737 24.9496 125.284 24.9496Z" fill="#EAEEF9"></path><path d="M11.8837 34.1496C13.4301 34.1496 14.6837 32.896 14.6837 31.3496C14.6837 29.8032 13.4301 28.5496 11.8837 28.5496C10.3373 28.5496 9.08374 29.8032 9.08374 31.3496C9.08374 32.896 10.3373 34.1496 11.8837 34.1496Z" fill="#EAEEF9"></path><path d="M5.58379 95.7496C8.45567 95.7496 10.7838 93.4215 10.7838 90.5496C10.7838 87.6777 8.45567 85.3496 5.58379 85.3496C2.71191 85.3496 0.383789 87.6777 0.383789 90.5496C0.383789 93.4215 2.71191 95.7496 5.58379 95.7496Z" fill="#EAEEF9"></path><path d="M96.6216 10.6187C97.9267 24.8658 98.5792 28.1285 95.6244 41.0313C94.6635 43.8998 93.7026 47.0416 91.6435 49.2271C88.7607 52.642 83.5443 54.1446 79.2889 53.0518C74.8961 51.9591 71.327 48.1343 70.5033 43.49C69.817 40.6215 70.7779 37.2065 73.2488 35.4308C75.857 33.7916 79.5634 34.2014 81.7598 36.2504C84.2307 38.2993 85.1916 41.4411 85.0543 44.4462C84.9171 47.4513 83.8189 50.4565 82.3089 53.0518C78.8954 59.4335 77.4901 59.41 70.5034 69.8911" stroke="#ABB5CC" strokeWidth="2" strokeMiterlimit="10" strokeDasharray="4 4"></path><path d="M104.275 5.31244C103.753 7.21624 101.666 7.90853 99.579 6.69702C97.3179 5.65858 95.7525 4.79322 96.1004 3.06249C96.6222 1.33177 98.7093 1.15869 101.144 0.985622C104.101 0.639477 104.623 3.40864 104.275 5.31244Z" fill="#DAE2EB"></path><path d="M87.4039 7.04302C88.2736 8.60068 90.7086 9.63911 92.4479 8.08146C94.3611 6.35073 95.9264 5.13922 95.0568 3.4085C94.1872 1.85084 92.7957 2.37006 89.8389 2.71621C87.4039 3.23542 86.3604 5.3123 87.4039 7.04302Z" fill="#DAE2EB"></path><path d="M95.0569 0.639542C96.2744 0.466469 97.4919 1.15876 97.8397 2.1972C98.0137 2.54334 98.1876 3.06256 98.1876 3.4087C98.5355 5.83172 97.6658 7.90859 96.2744 8.08167C94.709 8.42781 93.1437 6.69708 92.9697 4.44714C92.9697 3.75485 92.9697 3.4087 92.9697 2.88949C93.1437 1.67798 93.8394 0.812615 95.0569 0.639542C95.2308 0.639542 95.0569 0.639542 95.0569 0.639542Z" fill="#989FB0"></path><path d="M60.192 84.7092C61.4591 84.7092 62.4863 83.682 62.4863 82.4149C62.4863 81.1478 61.4591 80.1206 60.192 80.1206C58.9249 80.1206 57.8977 81.1478 57.8977 82.4149C57.8977 83.682 58.9249 84.7092 60.192 84.7092Z" fill="#989FB0"></path><path d="M83.0108 84.7092C84.278 84.7092 85.3051 83.682 85.3051 82.4149C85.3051 81.1478 84.278 80.1206 83.0108 80.1206C81.7437 80.1206 80.7166 81.1478 80.7166 82.4149C80.7166 83.682 81.7437 84.7092 83.0108 84.7092Z" fill="#989FB0"></path><path d="M75.322 99.7772H68.129C67.0129 99.7772 66.0828 98.8471 66.0828 97.731C66.0828 96.6148 67.0129 95.6847 68.129 95.6847H75.2599C76.3761 95.6847 77.3062 96.6148 77.3062 97.731C77.3682 98.8471 76.4381 99.7772 75.322 99.7772Z" fill="#989FB0"></path><defs><filter id="filter0_d_0_17276" x="4.20166" y="46.9496" width="134.8" height="94.5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dy="11"></feOffset><feGaussianBlur stdDeviation="11"></feGaussianBlur><feColorMatrix type="matrix" values="0 0 0 0 0.397708 0 0 0 0 0.47749 0 0 0 0 0.575 0 0 0 0.27 0"></feColorMatrix><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_17276"></feBlend><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_17276" result="shape"></feBlend></filter><linearGradient id="paint0_linear_0_17276" x1="71.5721" y1="56.7815" x2="71.5721" y2="108.994" gradientUnits="userSpaceOnUse"><stop stopColor="#FDFEFF"></stop><stop offset="0.9964" stopColor="#ECF0F5"></stop></linearGradient></defs>
                                                </svg>
                                                <p className="font-semibold sm:text-base text-sm text-black-900">
                                                    <p>Không có thông báo nào</p>
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <Pagination className="">
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
