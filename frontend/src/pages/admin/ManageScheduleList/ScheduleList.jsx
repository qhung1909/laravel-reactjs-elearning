import React, { useEffect, useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import axios from 'axios'

import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from '@/components/ui/sidebar'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { SideBarUI } from '../sidebarUI'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function ScheduleList() {
    const API_KEY = import.meta.env.VITE_API_KEY
    const API_URL = import.meta.env.VITE_API_URL
    const navigate = useNavigate()

    const [schedules, setSchedules] = useState([])
    const [courses, setCourses] = useState([])
    const [loadingSchedules, setLoadingSchedules] = useState(true)
    const [loadingCourses, setLoadingCourses] = useState(true)
    const [loadingLessons, setLoadingLessons] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterCriteria, setFilterCriteria] = useState('all')
    const [error, setError] = useState(null)

    const checkAuth = () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            toast.error("Vui lòng đăng nhập để xem lịch dạy");
            navigate('/');
            return false;
        }
        return token;
    };

    const fetchSchedules = async () => {
        const token = checkAuth();
        if (!token) return;

        setLoadingSchedules(true);
        setError(null);
        try {
            const res = await axios.get(`${API_URL}/teacher/teaching-schedule`, {
                headers: {
                    'x-api-secret': API_KEY,
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log("API Response for schedules:", res.data);

            if (res.data?.data && Array.isArray(res.data.data)) {
                const schedulesWithCourseId = res.data.data.map(schedule => ({
                    ...schedule,
                    course_id: schedule.course_id || schedule.content?.course_id
                }));
                console.log("Processed schedules:", schedulesWithCourseId);
                setSchedules(schedulesWithCourseId);

                await fetchCourses();
                const uniqueCourseIds = [...new Set(schedulesWithCourseId.map(s => s.course_id))];
                for (const courseId of uniqueCourseIds) {
                    if (courseId) {
                        await fetchContentLesson(courseId);
                    }
                }
            } else {
                setSchedules([]);
                toast.info("Không có lịch dạy nào");
            }
        } catch (error) {
            console.error('Error fetching schedules:', error);
            const errorMessage = error.response?.data?.message || 'Không thể tải dữ liệu lịch dạy';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoadingSchedules(false);
        }
    };

    const fetchCourses = async () => {
        const token = checkAuth();
        if (!token) return;

        setLoadingCourses(true);
        try {
            const res = await axios.get(`${API_URL}/admin/courses`, {
                headers: {
                    'x-api-secret': API_KEY,
                    'Authorization': `Bearer ${token}`
                }
            });
            if (Array.isArray(res.data)) {
                setCourses(res.data);
            }
            else if (res.data?.data && Array.isArray(res.data.data)) {
                setCourses(res.data.data);
            }
            else {
                console.error("Unexpected courses data format:", res.data);
                setCourses([]);
                toast.error("Định dạng dữ liệu khóa học không đúng");
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
            const errorMessage = error.response?.data?.message || 'Không thể tải dữ liệu khóa học';
            setError(errorMessage);
            toast.error(errorMessage);
            setCourses([]);
        } finally {
            setLoadingCourses(false);
        }
    };
    useEffect(() => {
        fetchCourses();
    }, []);

    const [contentLesson, setContentLesson] = useState([]);
    const [titleContent, setTitleContent] = useState([]);

    const sortedContent = contentLesson.sort(
        (a, b) => a.content_id - b.content_id
    );
    
    const fetchTitleContent = async (contentId) => {
        const token = localStorage.getItem("access_token");
        try {
            const res = await axios.get(`${API_URL}/title-contents/${contentId}`, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.data && res.data.success) {
                setTitleContent(prev => ({ ...prev, [contentId]: res.data.data }));

            } else {
                console.error("Dữ liệu không hợp lệ:", res.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết title_content:", error);
        }
    };

    const fetchContentLesson = async (courseId) => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            toast.error("Bạn chưa đăng nhập.");
            navigate('/');
            return;
        }
        try {
            const res = await axios.get(`${API_URL}/contents`, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                },
                params: { course_id: courseId }
            });
            console.log("API Response for Content Lessons:", res.data);

            if (res.data && res.data.success && Array.isArray(res.data.data)) {
                setContentLesson(res.data.data);
            } else {
                console.error("Dữ liệu không phải là mảng hoặc không thành công:", res.data);
                toast.error("Dữ liệu không hợp lệ hoặc không thành công.");
            }
        } catch (error) {
            console.error("Lỗi khi lấy nội dung bài học:", error);
            toast.error("Có lỗi xảy ra khi tải nội dung bài học.");
        }
    };


    const [course_id, setCourse_id] = useState(null);

    useEffect(() => {
        if (course_id) {
            fetchContentLesson(course_id);
        }
    }, []);

    const filterSchedules = () => {
        if (!Array.isArray(schedules)) return [];

        return schedules.filter(item => {
            const matchesSearch =
                (item.user?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (item.notes?.toLowerCase() || '').includes(searchTerm.toLowerCase());

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
    useEffect(() => {
        fetchCourses();
        fetchContentLesson(course_id);
    }, []);

    useEffect(() => {
        console.log("Courses:", courses);
    }, [courses]);

    useEffect(() => {
        console.log("Content Lessons:", contentLesson);
    }, [contentLesson]);



    const [teachers, setTeachers] = useState([]);
    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/teachers`, {
                headers: {
                    'x-api-secret': API_KEY
                }
            });

            if (res.data) {
                console.log("Teacher data structure:", res.data[0]);
                setTeachers(res.data);
            }
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, [])



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
                                        <BreadcrumbLink href="/admin">Trang chủ</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href="/schedule-list">Danh sách lịch dạy</BreadcrumbLink>
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
                                        placeholder="Tìm kiếm giảng viên hoặc ghi chú..."
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
                                        <TableHead className="w-[100px] text-center bg-yellow-100 text-md font-bold py-4 px-3 text-yellow-900">STT</TableHead>
                                        <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-3 text-yellow-900">Tên giảng viên</TableHead>
                                        <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-3 text-yellow-900">Khóa học</TableHead>
                                        <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-3 text-yellow-900">Bài học</TableHead>
                                        <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-3 text-yellow-900">Ngày dạy</TableHead>
                                        <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-3 text-yellow-900">Khung giờ</TableHead>
                                        <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-3 text-yellow-900">Link meet</TableHead>
                                        <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-3 text-yellow-900">Ghi chú</TableHead>
                                        <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-3 text-yellow-900">Trạng thái</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(loadingSchedules || loadingCourses || loadingLessons) ? (
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
                                            <TableRow key={schedule.id}>
                                                <TableCell className="text-center">{index + 1}</TableCell> {/* STT */}
                                                <TableCell className="text-center">
                                                    {teachers.find(schedule =>
                                                        schedule.user_id === schedule.user_id
                                                    )?.name || 'Không tìm thấy giảng viên'}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {courses.find(course => course.id === schedule.course_id)?.name || 'Chưa có thông tin'}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {contentLesson.find(lesson => lesson.content_id === schedule.content_id)?.name || 'Chưa có thông tin'}
                                                </TableCell>
                                                <TableCell className="text-center"> {/* Ngày dạy */}
                                                    {formatDate(schedule.proposed_start)}
                                                </TableCell>
                                                <TableCell className="text-center"> {/* Khung giờ */}
                                                    {formatTime(schedule.proposed_start)}
                                                </TableCell>
                                                <TableCell className="text-center"> {/* Link meet */}
                                                    {schedule.meeting_url ? (
                                                        <a
                                                            href={schedule.meeting_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:underline"
                                                        >
                                                            Tham gia
                                                        </a>
                                                    ) : (
                                                        'Chưa có link'
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center"> {/* Ghi chú */}
                                                    {schedule.notes || 'Không có ghi chú'}
                                                </TableCell>
                                                <TableCell className="text-center"> {/* Trạng thái */}
                                                    <span className={`px-2 py-1 rounded-full text-sm ${schedule.meeting_id
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
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
