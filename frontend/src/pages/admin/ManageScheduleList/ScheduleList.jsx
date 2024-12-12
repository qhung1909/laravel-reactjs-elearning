import React, { useEffect, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import axios from 'axios';
import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { SideBarUI } from '../sidebarUI';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function ScheduleList() {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCriteria, setFilterCriteria] = useState('all');
    const [error, setError] = useState(null);

    const checkAuth = () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            toast.error("Vui lòng đăng nhập để xem lịch dạy");
            navigate('/');
            return false;
        }
        return token;
    };

    useEffect(() => {
        const fetchData = async () => {
            const token = checkAuth();
            if (!token) return;

            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${API_URL}/teacher/teaching-schedule`, {
                    headers: {
                        'x-api-secret': API_KEY,
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data?.data && Array.isArray(response.data.data)) {
                    setSchedules(response.data.data);
                } else {
                    setSchedules([]);
                    toast.info("Không có lịch dạy nào");
                }
            } catch (error) {
                console.error('Error fetching schedule:', error);
                const errorMessage = error.response?.data?.message || 'Không thể tải dữ liệu';
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [API_URL, API_KEY, navigate]);

    const filterSchedules = () => {
        if (!Array.isArray(schedules)) return [];

        return schedules.filter(item => {
            const matchesSearch =
                (item.user?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (item.notes?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (item.online_meeting?.course?.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (item.online_meeting?.content?.name_content?.toLowerCase() || '').includes(searchTerm.toLowerCase());

            if (!matchesSearch) return false;

            const scheduleDate = new Date(item.proposed_start);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            switch (filterCriteria) {
                case 'today':
                    return scheduleDate.toDateString() === today.toDateString();
                case 'yesterday': {
                    const yesterday = new Date(today);
                    yesterday.setDate(today.getDate() - 1);
                    return scheduleDate.toDateString() === yesterday.toDateString();
                }
                case 'lastMonth': {
                    const lastMonth = new Date(today);
                    lastMonth.setMonth(today.getMonth() - 1);
                    return scheduleDate.getMonth() === lastMonth.getMonth() &&
                        scheduleDate.getFullYear() === lastMonth.getFullYear();
                }
                default:
                    return true;
            }
        });
    };

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('vi-VN');
        } catch (error) {
            return 'Ngày không hợp lệ';
        }
    };

    const formatTime = (dateString) => {
        try {
            return new Date(dateString).toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Giờ không hợp lệ';
        }
    };

    return (
        <div className="h-screen">
            <SidebarProvider>
                <SideBarUI />
                <SidebarInset>
                    <header className="absolute left-1 top-3 font-sans">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger />
                            <Separator orientation="vertical" className="h-6" />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink>Danh sách lịch dạy</BreadcrumbLink>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>

                    <div className="absolute top-16 px-6 bg-gray-50 w-full font-sans overflow-auto p-6">
                        {error && (
                            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-between items-center mb-2 mr-6 ml-2">
                            <h1 className="text-2xl font-semibold mb-4">Danh sách lịch dạy</h1>
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-wrap w-full md:w-auto">
                                <div className="relative flex-1 md:flex-initial">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Tìm kiếm giảng viên, khóa học, bài học..."
                                        className="pl-9 pr-4 py-2 w-full"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="flex items-center gap-2">
                                            {filterCriteria === 'all' ? 'Tất cả lịch dạy' :
                                                filterCriteria === 'today' ? 'Lịch dạy hôm nay' :
                                                    filterCriteria === 'yesterday' ? 'Lịch dạy hôm qua' :
                                                        'Lịch dạy tháng trước'}
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-[200px]">
                                        <DropdownMenuItem onClick={() => setFilterCriteria('all')}>
                                            Tất cả lịch dạy
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setFilterCriteria('today')}>
                                            Lịch dạy hôm nay
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setFilterCriteria('yesterday')}>
                                            Lịch dạy hôm qua
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setFilterCriteria('lastMonth')}>
                                            Lịch dạy tháng trước
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[60px] text-center bg-yellow-100 text-md font-bold py-4 px-3 text-yellow-900">STT</TableHead>
                                        <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-3 text-yellow-900">Tên giảng viên</TableHead>
                                        <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-3 text-yellow-900">Khóa học</TableHead>
                                        <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-3 text-yellow-900">Bài học</TableHead>
                                        <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-3 text-yellow-900">Ngày dạy</TableHead>
                                        <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-3 text-yellow-900 whitespace-nowrap">Khung giờ</TableHead>
                                        <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-3 text-yellow-900">Link meet</TableHead>
                                        <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-3 text-yellow-900">Ghi chú</TableHead>
                                        <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-3 text-yellow-900">Trạng thái</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={9} className="text-center">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-400"></div>
                                                    <span>Đang tải dữ liệu...</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : filterSchedules().length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={9} className="text-center py-8">
                                                Không có dữ liệu
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filterSchedules().map((schedule, index) => (
                                            <TableRow key={schedule.id} className="hover:bg-gray-50">
                                                <TableCell className="text-center font-medium text-gray-600">{index + 1}</TableCell>
                                                <TableCell className="text-center text-gray-800 font-medium">
                                                    {schedule.user?.name || 'Không tìm thấy giảng viên'}
                                                </TableCell>
                                                <TableCell className="text-center text-gray-700">
                                                    {schedule.online_meeting?.course?.title || 'Chưa có thông tin'}
                                                </TableCell>
                                                <TableCell className="text-center text-gray-700">
                                                    {schedule.online_meeting?.content?.name_content || 'Chưa có thông tin'}
                                                </TableCell>
                                                <TableCell className="text-center font-medium text-gray-600 whitespace-nowrap">
                                                    {formatDate(schedule.proposed_start)}
                                                </TableCell>
                                                <TableCell className="text-center font-medium text-gray-600 whitespace-nowrap">
                                                    {formatTime(schedule.proposed_start)}
                                                </TableCell>
                                                <TableCell className="text-center whitespace-nowrap">
                                                    {schedule.online_meeting?.meeting_url ? (
                                                        <a
                                                            href={schedule.online_meeting.meeting_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                        >
                                                            Tham gia
                                                        </a>
                                                    ) : (
                                                        <span className="text-gray-500">Chưa có link</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center text-gray-600">
                                                    {schedule.notes ||
                                                        <span className="text-gray-400">Không có ghi chú</span>
                                                    }
                                                </TableCell>
                                                <TableCell className="text-center whitespace-nowrap">
                                                    <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${schedule.meeting_id
                                                        ? 'bg-green-50 text-green-700 border border-green-200'
                                                        : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                                                        }`}>
                                                        {schedule.meeting_id ? 'Đã tạo meet' : 'Chưa tạo meet'}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}
