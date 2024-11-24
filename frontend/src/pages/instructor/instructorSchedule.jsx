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
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Button } from '@/components/ui/button';
import { useEffect, useState, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"
import toast, { Toaster } from 'react-hot-toast';
import { UserContext } from "../context/usercontext";
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { format, addHours, isPast, isBefore } from 'date-fns';
import * as XLSX from 'xlsx';
import axios from "axios"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
const notify = (message, type) => {
    if (type === 'success') {
        toast.success(message);
    } else {
        toast.error(message)
    }
}
export const InstructorSchedule = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const API_KEY = import.meta.env.VITE_API_KEY;
    const { instructor, logout } = useContext(UserContext);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [loadingLogout, setLoadingLogout] = useState(false);
    const [allCourseOnline, setAllCourseOnline] = useState([]);
    const [showCourseCommand, setShowCourseCommand] = useState(false);
    const [showContentCommand, setShowContentCommand] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [usedContents, setUsedContents] = useState([]);
    const [coursesTable, setCoursesTable] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [loadingSchedule, setLoadingSchedule] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const token = localStorage.getItem("access_token");
    const [formData, setFormData] = useState({
        user_id: '',
        course_id: '',
        content_id: '',
        proposed_start: '',
        notes: ''
    });
    const [scheduledContents, setScheduledContents] = useState([]);

    const courseCommandRef = useRef(null);
    const contentCommandRef = useRef(null);

    // phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    }
    const currentItems = coursesTable.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        if (instructor && instructor.user_id) {
            setFormData(prev => ({
                ...prev,
                user_id: instructor.user_id
            }));
        }
    }, [instructor]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (courseCommandRef.current && !courseCommandRef.current.contains(event.target)) {
                setShowCourseCommand(false);
            }
            if (contentCommandRef.current && !contentCommandRef.current.contains(event.target)) {
                setShowContentCommand(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Form validate
    const validateForm = () => {
        const newErrors = {};

        // Validate course selection
        if (!formData.course_id) {
            newErrors.course_id = 'Vui lòng chọn khóa học';
        }

        // Validate content selection
        if (!formData.content_id) {
            newErrors.content_id = 'Vui lòng chọn nội dung';
        }

        // Validate start time
        if (!formData.proposed_start) {
            newErrors.proposed_start = 'Vui lòng chọn thời gian bắt đầu';
        } else {
            const proposedDate = new Date(formData.proposed_start);
            const now = new Date();

            if (isPast(proposedDate)) {
                newErrors.proposed_start = 'Thời gian bắt đầu không thể trong quá khứ';
            } else if (isBefore(proposedDate, addHours(now, 1))) {
                newErrors.proposed_start = 'Thời gian bắt đầu phải cách hiện tại ít nhất 1 giờ';
            }
        }
        return newErrors;
    };

    const handleCourseSelect = (course) => {
        setSelectedCourse(course);
        setFormData(prev => ({
            ...prev,
            course_id: course.course_id,
            content_id: ''
        }));
        setShowCourseCommand(false);
    };

    const handleContentSelect = (content) => {
        if (!isContentUsed(content.content_id)) {
            setFormData(prev => ({
                ...prev,
                content_id: content.content_id
            }));
            setShowContentCommand(false);
        }
    };

    const isContentUsed = (contentId) => {
        return scheduledContents.includes(contentId);
    };

    // xử lý lỗi từ server trả về
    const handleErrorResponse = (status, data) => {
        switch (status) {
            case 403:
                setErrors({ form: data.message || 'Bạn không có quyền thực hiện hành động này' });
                break;
            case 404:
                setErrors({ form: data.message || 'Không tìm thấy tài nguyên yêu cầu' });
                break;
            case 422:
                setErrors({ form: data.message || 'Dữ liệu không hợp lệ' });
                break;
            default:
                setErrors({ form: 'Đã có lỗi xảy ra, vui lòng thử lại sau' });
        }
    };

    const resetForm = () => {
        setFormData({
            user_id: instructor?.id || '',
            course_id: '',
            content_id: '',
            proposed_start: '',
            notes: ''
        });
        setSelectedCourse(null);
    };

    // hàm xử lý thêm lịch cho khóa học online
    const courseOnline = async () => {
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        if (!formData.user_id) {
            setErrors({ form: 'Không tìm thấy thông tin giảng viên' });
            return;
        }
        try {

            const response = await axios.post(`${API_URL}/teacher/teaching-schedule`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-secret': API_KEY,
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.status !== 200) {
                handleErrorResponse(response.status, response.data);
            } else {
                setSuccess(true);
                setErrors({});
                resetForm();
                notify('Tạo lịch dạy thành công!', 'success');
                setTimeout(() => {
                    setSuccess(false);
                }, 3000);
                fetchCoursesTable();
            }
        } catch (error) {
            if (error.response) {
                // Lỗi từ server
                handleErrorResponse(error.response.status, error.response.data);

            } else {
                // Lỗi khác
                setErrors({ form: 'Lỗi kết nối, vui lòng thử lại sau' });
            }
        } finally {
            setLoading(false);
        }
    };
    // hàm xử lý lấy khóa học có thể học online
    const fetchCourseOnline = async () => {
        setLoadingCourses(true);
        try {
            const response = await fetch(`${API_URL}/teacher/teaching/courses/online-teacher`, {
                headers: {
                    'x-api-secret': `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                },
            });
            const result = await response.json();

            if (result.status && Array.isArray(result.data)) {
                setAllCourseOnline(result.data);
            } else {
                notify("Không có dữ liệu khóa học", "warning");
                setAllCourseOnline([]); // Đặt danh sách thành rỗng để tránh hiển thị lỗi.
            }
        } catch (error) {
            notify("Không thể tải dữ liệu khóa học", "error");
            setAllCourseOnline([]); // Đặt danh sách thành rỗng để tránh lỗi khi không có dữ liệu.
        } finally {
            setLoading(false); // Tắt trạng thái loading
        }
    };

    // hàm thay đổi css theo trạng thái
    const getStatus = (schedule) => {
        const now = new Date();
        const startTime = new Date(schedule.start_time);
        const endTime = new Date(schedule.end_time);

        if (now > endTime) {
            return { label: "Đã kết thúc", textColor: "text-white", bgColor: "bg-gray-500", disabled: true };
        } else if (now >= startTime && now <= endTime) {
            return { label: "Đang diễn ra", textColor: "text-white", bgColor: "bg-green-500", disabled: false };
        } else if (startTime - now <= 2 * 24 * 60 * 60 * 1000) {
            return { label: "Sắp diễn ra", textColor: "text-black", bgColor: "bg-blue-500", disabled: false };
        } else {
            return { label: "Chưa diễn ra", textColor: "text-white", bgColor: "bg-black", disabled: false };
        }
    };
    // hàm xử lý lấy khóa học online đã có lịch
    const fetchCoursesTable = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${API_URL}/teacher/teaching/courses/meeting-online`, {
                headers: {
                    'x-api-secret': `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                },
            });
            const result = await response.json();
            if (result.status && Array.isArray(result.data)) {
                const dataWithStatus = result.data.map((item) => {
                    const status = getStatus(item.meeting.schedule);
                    return { ...item, status };
                });
                setCoursesTable(dataWithStatus);
            } else {
                setCoursesTable([]);
                notify("Không có dữ liệu lịch dạy online", "warning");
            }
        } catch (error) {
            notify('Không thể lấy danh sách lịch dạy online')
        } finally {
            setLoading(false);
        }
    }


    // hàm xử lý đăng xuất
    const handleLogout = () => {
        setLoadingLogout(true);
        logout();
        setLoadingLogout(false);
    };

    // xuất excel
    const exportToExcel = () => {
        const flattenedData = coursesTable.map((item, index) => ({
            'STT': index + 1,
            'Tên khóa học': item.course.title,
            'Nội dung': item.name_content,
            'Ngày bắt đầu': new Date(item.meeting.schedule.start_time).toLocaleString('vi-VN'),
            'Ghi chú': item.meeting.notes ?? 'Không có ghi chú'
        }));

        const worksheet = XLSX.utils.json_to_sheet(flattenedData);

        const columnWidths = [
            { wch: 5 },
            { wch: 40 },
            { wch: 30 },
            { wch: 20 },
            { wch: 20 }
        ];
        worksheet['!cols'] = columnWidths;

        // Tạo workbook và thêm worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, worksheet, 'OnlineCourses');

        // Xuất file
        XLSX.writeFile(wb, 'onlinecourses.xlsx');
    };

    useEffect(() => {
        fetchCourseOnline();
        fetchCoursesTable();
    }, []);

    useEffect(() => {
        if (coursesTable.length > 0) {
            const usedContentIds = coursesTable.map(item => item.content_id);
            setScheduledContents(usedContentIds);
        }
    }, [coursesTable]);


    // hàm xử lý trạng thái

    return (
        <>
            <section className="instructor-schedule">
                <div className="flex bg-gray-100 h-sc">
                    {/* Sidebar */}
                    <div className="h-screen w-72 bg-white shadow-md border-gray-100 border-r-[1px] lg:block hidden">
                        <div className="p-3">
                            {/* logo */}
                            <div className="p-4 flex justify-between items-center">
                                <div className="logo">
                                    <img src="/src/assets/images/antlearn.png" alt="Edumall Logo" className="w-20 h-14 object-cover" />
                                </div>
                                <div className="logout">
                                    <Link to="/">
                                        <img src="/src/assets/images/logout.svg" className="w-7" alt="" />
                                    </Link>
                                </div>
                            </div>
                            {/* ul list */}
                            <ul className="">
                                <li className="mb-3">
                                    <Link to="/instructor" className="flex items-center px-4 py-2 rounded-2xl text-gray-700 hover:bg-gray-100 ">
                                        <div className="  mr-3 px-1  rounded-full">
                                            <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/dashboard.svg" className="w-7" alt="" />
                                        </div>
                                        <p className="font-semibold text-base">Bảng điều khiển</p>
                                    </Link>

                                </li>
                                <li className="mb-3">
                                    <Link to="/instructor/lessson" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100">
                                        <div className=" mr-3 px-1 rounded-full">
                                            <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/lesson.svg" className="w-7" alt="" />
                                        </div>
                                        <p className="font-semibold text-base">Bài học của tôi</p>
                                    </Link>
                                </li>
                                <li className="mb-3">
                                    <Link to="/instructor/history" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100">
                                        <div className=" mr-3 px-1 rounded-full">
                                            <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/history.svg" className="w-7" alt="" />
                                        </div>
                                        <p className="font-semibold text-base">Lịch sử mua hàng</p>
                                    </Link>
                                </li>
                                <li className="mb-3">
                                    <Link to="/instructor/notification" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100">
                                        <div className=" mr-3 px-1 rounded-full">
                                            <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/notification.svg" className="w-7" alt="" />
                                        </div>
                                        <p className="font-semibold text-base">Thông báo</p>
                                    </Link>
                                </li>
                                <li className="mb-3">
                                    <Link to="/instructor/profile" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100">
                                        <div className=" mr-3 px-1 rounded-full">
                                            <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/user.svg" className="w-7" alt="" />
                                        </div>
                                        <p className="font-semibold text-base">Thông tin tài khoản</p>
                                    </Link>
                                </li>
                                <li className="mb-3">
                                    <Link to="/instructor/schedule" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 bg-gray-100">
                                        <div className="bg-yellow-400 mr-3 px-1 rounded-full">
                                            <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/instructorschedule.svg" className="w-7" alt="" />
                                        </div>
                                        <p className="font-semibold text-base">Thông tin lịch học</p>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Header */}
                        <div className="bg-white shadow-sm p-2">
                            <div className="flex items-center justify-between px-4 py-3">
                                <h1 className="text-xl font-semibold ">
                                    <Link to="/">
                                        <div className="flex items-center gap-2">
                                            <img src="/src/assets/images/home.svg" className="w-6" alt="" />
                                            <p className="text-slate-600">Trang chủ</p>
                                        </div>
                                    </Link>
                                </h1>
                                <div className="flex items-center space-x-4">
                                    <button className="p-1 rounded-full hover:bg-gray-100">
                                        <img src="./src/assets/images/notification.svg" className="w-7" alt="" />

                                    </button>

                                    <div className="flex items-center gap-3">
                                        {/* avatar */}
                                        {instructor?.avatar ? (
                                            <img
                                                src={instructor.avatar}
                                                alt="User Avatar"
                                                className="w-10 h-10 object-cover rounded-full"
                                            />
                                        ) : (

                                            <img src="./src/assets/images/user.svg" className="w-8" alt="" />
                                        )}

                                        {/* user control */}
                                        <div className="text-left">
                                            <span className="font-medium text-sm">{instructor?.name}</span>
                                            <br />
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <div className="flex items-center">
                                                        <p className="text-gray-600 text-sm">{instructor?.role}</p>
                                                        <svg className="w-4 h-4 ml-1 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent >
                                                    <div className="p-3">
                                                        <DropdownMenuItem>
                                                            <span className="cursor-pointer" onClick={handleLogout}>Đăng xuất</span>
                                                        </DropdownMenuItem>
                                                    </div>
                                                </DropdownMenuContent>

                                            </DropdownMenu>
                                        </div>
                                        {/* toggler */}
                                        <div className="">
                                            <Sheet>
                                                <SheetTrigger>
                                                    <div className="w-5 lg:hidden block">
                                                        <box-icon name='menu'></box-icon>
                                                    </div>
                                                </SheetTrigger>
                                                <SheetContent>
                                                    <SheetHeader>
                                                        <SheetTitle>
                                                            <div className="p-4 flex justify-between items-center border-b-[1px]">
                                                                <div className="logo ">
                                                                    <img src="/src/assets/images/antlearn.png" alt="Edumall Logo" className="w-20 h-14 object-cover" />
                                                                </div>
                                                            </div>
                                                        </SheetTitle>
                                                        <SheetDescription>
                                                            <ul className="">
                                                                <li className="mb-3">
                                                                    <Link to="/instructor" className="flex items-center px-4 py-2 rounded-2xl text-gray-700 hover:bg-gray-100 ">
                                                                        <div className="  mr-3 px-1  rounded-full">
                                                                            <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/dashboard.svg" className="w-7" alt="" />
                                                                        </div>
                                                                        <p className="font-semibold text-base">Bảng điều khiển</p>
                                                                    </Link>

                                                                </li>
                                                                <li className="mb-3">
                                                                    <Link to="/instructor/lessson" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100">
                                                                        <div className=" mr-3 px-1 rounded-full">
                                                                            <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/lesson.svg" className="w-7" alt="" />
                                                                        </div>
                                                                        <p className="font-semibold text-base">Bài học của tôi</p>
                                                                    </Link>
                                                                </li>
                                                                <li className="mb-3">
                                                                    <Link to="/instructor/history" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100">
                                                                        <div className=" mr-3 px-1 rounded-full">
                                                                            <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/history.svg" className="w-7" alt="" />
                                                                        </div>
                                                                        <p className="font-semibold text-base">Lịch sử mua hàng</p>
                                                                    </Link>
                                                                </li>
                                                                <li className="mb-3">
                                                                    <Link to="/instructor/notification" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100">
                                                                        <div className=" mr-3 px-1 rounded-full">
                                                                            <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/notification.svg" className="w-7" alt="" />
                                                                        </div>
                                                                        <p className="font-semibold text-base">Thông báo</p>
                                                                    </Link>
                                                                </li>
                                                                <li className="mb-3">
                                                                    <Link to="/instructor/profile" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100">
                                                                        <div className=" mr-3 px-1 rounded-full">
                                                                            <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/user.svg" className="w-7" alt="" />
                                                                        </div>
                                                                        <p className="font-semibold text-base">Thông tin tài khoản</p>
                                                                    </Link>
                                                                </li>
                                                                <li className="mb-3">
                                                                    <Link to="/instructor/schedule" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 bg-gray-100">
                                                                        <div className="bg-yellow-400 mr-3 px-1 rounded-full">
                                                                            <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/instructorschedule.svg" className="w-7" alt="" />
                                                                        </div>
                                                                        <p className="font-semibold text-base">Thông tin lịch học</p>
                                                                    </Link>
                                                                </li>
                                                            </ul>
                                                        </SheetDescription>
                                                    </SheetHeader>
                                                </SheetContent>
                                            </Sheet>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Schedule content */}
                        <div className=" md:p-6 p-2 max-lg:h-screen">

                            {/* action */}
                            <div className="flex justify-end gap-2">

                                {/* add online couse */}
                                <div className="">
                                    <Dialog>
                                        <DialogTrigger>
                                            <Button className="bg-gradient-to-br from-yellow-400 to-orange-800 text-white hover:bg-white">
                                                Thêm lịch khóa học online
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogDescription>
                                                    <div className="max-w-lg mx-auto p-6">
                                                        <form onSubmit={courseOnline} className="space-y-4">

                                                            {/* thông báo */}
                                                            {errors.form && (
                                                                <div className="bg-red-50 p-4 rounded text-red-600">{errors.form}</div>
                                                            )}

                                                            {success && (
                                                                <div className="bg-green-50 p-4 rounded text-green-600">
                                                                    Tạo lịch dạy thành công!
                                                                </div>
                                                            )}

                                                            {/* chọn khóa học */}
                                                            <div className="space-y-2">
                                                                <label className=" font-medium text-lg text-black">
                                                                    Khóa học:
                                                                </label>
                                                                <div className="relative" ref={courseCommandRef}>
                                                                    <input
                                                                        type="text"
                                                                        value={selectedCourse ? `${selectedCourse.course_id} - ${selectedCourse.course_title}` : ''}
                                                                        onClick={() => setShowCourseCommand(true)}
                                                                        readOnly
                                                                        className="w-full p-2 border rounded cursor-pointer"
                                                                        placeholder="Chọn khóa học..."
                                                                    />
                                                                    {showCourseCommand && (
                                                                        <div className="absolute w-full z-10 bg-white border rounded-md shadow-lg mt-1">
                                                                            <Command>
                                                                                <CommandInput placeholder="Tìm khóa học..." />
                                                                                <CommandList>
                                                                                    <CommandEmpty>Không tìm thấy khóa học.</CommandEmpty>
                                                                                    <CommandGroup>
                                                                                        {allCourseOnline.map((course) => (
                                                                                            <CommandItem
                                                                                                key={course.course_id}
                                                                                                onSelect={() => handleCourseSelect(course)}
                                                                                            >
                                                                                                {course.course_id} - {course.course_title}
                                                                                            </CommandItem>
                                                                                        ))}
                                                                                    </CommandGroup>
                                                                                </CommandList>
                                                                            </Command>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {errors.course_id && (
                                                                    <p className="text-red-500 text-sm mt-1">{errors.course_id}</p>
                                                                )}
                                                            </div>

                                                            {/* chọn nội dung */}
                                                            <div className="space-y-2">
                                                                <label className=" font-medium text-lg text-black">
                                                                    Nội dung:
                                                                </label>
                                                                <div className="relative" ref={contentCommandRef}>
                                                                    <input
                                                                        type="text"
                                                                        value={
                                                                            selectedCourse?.contents?.find((c) => c.content_id === formData.content_id)
                                                                                ? `${formData.content_id} - ${selectedCourse.contents.find((c) => c.content_id === formData.content_id).name_content}`
                                                                                : ''
                                                                        }
                                                                        onClick={() => selectedCourse && setShowContentCommand(true)}
                                                                        readOnly
                                                                        className={`w-full p-2 border rounded ${selectedCourse ? 'cursor-pointer' : 'bg-gray-100 cursor-not-allowed'
                                                                            }`}
                                                                        placeholder={selectedCourse ? 'Chọn nội dung...' : 'Vui lòng chọn khóa học trước'}
                                                                    />
                                                                    {showContentCommand && selectedCourse && (
                                                                        <div className="absolute w-full z-10 bg-white border rounded-md shadow-lg mt-1">
                                                                            <Command>
                                                                                <CommandInput placeholder="Tìm nội dung..." />
                                                                                <CommandList>
                                                                                    <CommandEmpty>Không tìm thấy nội dung.</CommandEmpty>
                                                                                    <CommandGroup>
                                                                                        {selectedCourse.contents.map((content) => {
                                                                                            const isUsed = isContentUsed(content.content_id);
                                                                                            return (
                                                                                                <CommandItem
                                                                                                    key={content.content_id}
                                                                                                    onSelect={() => !isUsed && handleContentSelect(content)}
                                                                                                    className={`flex items-center justify-between ${isUsed ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                                                                                        }`}
                                                                                                    disabled={isUsed}
                                                                                                >
                                                                                                    <div className="flex items-center gap-2">
                                                                                                        <span>
                                                                                                            {content.content_id} - {content.name_content}
                                                                                                        </span>
                                                                                                    </div>
                                                                                                    {isUsed && (
                                                                                                        <p className="text-sm font-semibold text-black bg-red-600 px-2 py-1 rounded">
                                                                                                            Đã thêm
                                                                                                        </p>
                                                                                                    )}
                                                                                                </CommandItem>
                                                                                            );
                                                                                        })}
                                                                                    </CommandGroup>
                                                                                </CommandList>
                                                                            </Command>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {errors.content_id && (
                                                                    <p className="text-red-500 text-sm mt-1">{errors.content_id}</p>
                                                                )}
                                                            </div>

                                                            {/* chọn ngày */}
                                                            <div>
                                                                <label className="block mb-1 font-medium">Thời gian bắt đầu</label>
                                                                <input
                                                                    type="datetime-local"
                                                                    value={formData.proposed_start}
                                                                    onChange={(e) =>
                                                                        setFormData({ ...formData, proposed_start: e.target.value })
                                                                    }
                                                                    className="w-full p-2 border rounded"
                                                                />

                                                                {errors.proposed_start && (
                                                                    <p className="text-red-500 text-sm mt-1">{errors.proposed_start}</p>
                                                                )}
                                                            </div>

                                                            {/* chọn ghi chú */}
                                                            <div>
                                                                <label className="block mb-1 font-medium">Ghi chú</label>
                                                                <textarea
                                                                    value={formData.notes}
                                                                    onChange={(e) =>
                                                                        setFormData({ ...formData, notes: e.target.value })
                                                                    }
                                                                    className="w-full p-2 border rounded"
                                                                    maxLength={255}
                                                                />
                                                                {errors.notes && (
                                                                    <p className="text-red-500 text-sm mt-1">{errors.notes}</p>
                                                                )}
                                                            </div>
                                                            <button
                                                                type="button"
                                                                disabled={loading}
                                                                onClick={courseOnline}
                                                                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                                                            >
                                                                {loading ? 'Đang xử lý...' : 'Tạo lịch dạy'}
                                                            </button>
                                                        </form>
                                                    </div>
                                                </DialogDescription>
                                            </DialogHeader>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                {/* xuất */}
                                <div className="">
                                    <Button className="duration-300  bg-white text-black border hover:bg-gray-100" onClick={exportToExcel}>
                                        <div className="">
                                            <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/download.svg" className="w-5" alt="" />
                                        </div>
                                        <div className="">
                                            <p>Xuất</p>
                                        </div>
                                    </Button>
                                </div>
                            </div>
                            <div className="w-full bg-white rounded-xl my-5">
                                <div className="p-3">
                                    <h1 className="text-lg font-semibold text-yellow-500">Chú thích:</h1>
                                    <p className="text-sm text-gray-500">Bạn có thể tham gia link meeting trực tiếp thông qua click vào trạng thái</p>
                                </div>
                            </div>
                            <div className=" bg-white rounded-3xl p-3">

                                {/* bảng khóa học online */}
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-cyan-950 md:text-base text-xs w-20">STT</TableHead>
                                            <TableHead className="text-cyan-950 md:text-base text-xs w-32">Trạng thái</TableHead>
                                            <TableHead className="text-cyan-950 md:text-base text-xs w-full sm:w-auto">Tên khóa học</TableHead>
                                            <TableHead className="text-cyan-950 md:text-base text-xs">Nội dung</TableHead>
                                            <TableHead className="text-cyan-950 md:text-base text-xs">Ngày bắt đầu</TableHead>
                                            <TableHead className="text-cyan-950 md:text-base text-xs">Ghi chú</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <>
                                                {Array.from({ length: 4 }).map((_, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>
                                                            <Skeleton className="h-4 w-7" />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Skeleton className="h-4 w-60 rounded-xl" />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Skeleton className="h-4 w-8/12 md:w-11/12" />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Skeleton className="h-4 w-20" />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Skeleton className="h-4 w-40" />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </>
                                        ) : currentItems.length > 0 ? (
                                            currentItems.map((item, index) => {
                                                const { label, bgColor, textColor, disabled } = item.status;
                                                return (
                                                    <TableRow key={index}>
                                                        <TableCell>{index + 1}</TableCell>
                                                        <TableCell>
                                                            <Link to={item.meeting.meeting_url} className={`hover:${textColor}`}>
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger>
                                                                            <Badge className={`p-2 ${bgColor} ${textColor} text-white rounded-lg hover:bg-yellow-500 duration-300`}>
                                                                                {disabled ? (
                                                                                    label
                                                                                ) : (
                                                                                    <p >
                                                                                        {label}
                                                                                    </p>
                                                                                )}
                                                                            </Badge>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p>Click để tham gia trực tiếp</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                            </Link>
                                                        </TableCell>
                                                        <TableCell>{item.course.title}</TableCell>
                                                        <TableCell>{item.name_content}</TableCell>
                                                        <TableCell>
                                                            {new Date(item.meeting.schedule.start_time).toLocaleString("vi-VN")}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className="p-2">
                                                                {item.meeting.notes || "Không có ghi chú"}
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center">
                                                    Không có lịch cho khóa học online nào
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>

                                </Table>

                                {/* phân trang */}
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href="#"
                                                onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)}
                                            />
                                        </PaginationItem>
                                        {Array.from({ length: Math.max(1, Math.ceil(coursesTable.length / itemsPerPage)) }).map((_, index) => (
                                            <PaginationItem key={index}>
                                                <PaginationLink
                                                    href="#"
                                                    onClick={() => handlePageChange(index + 1)}
                                                    className={currentPage === index + 1 ? "active" : ""}
                                                >
                                                    {index + 1}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}
                                        <PaginationItem>
                                            <PaginationNext
                                                href="#"
                                                onClick={() =>
                                                    handlePageChange(
                                                        currentPage < Math.ceil(coursesTable.length / itemsPerPage)
                                                            ? currentPage + 1
                                                            : currentPage
                                                    )
                                                }
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>


                            </div>
                        </div>

                    </div>
                </div>
            </section>
            <Toaster />
        </>
    )
}
