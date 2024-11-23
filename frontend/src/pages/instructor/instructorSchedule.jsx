import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
    TableCaption,
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
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, { useEffect, useState, useContext, useRef } from "react";
import { X } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom"
import toast, { Toaster } from 'react-hot-toast';
import { UserContext } from "../context/usercontext";
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { format, addHours, isPast, isBefore } from 'date-fns';
import * as XLSX from 'xlsx';
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
    const { instructor, updateUserProfile, logout, updatePassword } = useContext(UserContext);
    const [userName, setUserName] = useState('');
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [currentAvatar, setCurrentAvatar] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [loadingLogout, setLoadingLogout] = useState(false);
    const [allCourseOnline, setAllCourseOnline] = useState([]);
    const [showCourseCommand, setShowCourseCommand] = useState(false);
    const [showContentCommand, setShowContentCommand] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [usedContents, setUsedContents] = useState([]);
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

    const courseCommandRef = useRef(null);
    const contentCommandRef = useRef(null);

    useEffect(() => {
        fetchCourseOnline();
    }, []);

    useEffect(() => {
        if (showContentCommand) {
            fetchUsedContents();
        }
    }, [showContentCommand]);

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

    // hàm xử lý đăng xuất
    const handleLogout = () => {
        setLoadingLogout(true);
        logout();
        setLoadingLogout(false);
    };

    const fetchCourseOnline = async () => {
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
                setAllCourseOnline([]);
                notify('Không có dữ liệu khóa học', 'warning');
            }
        } catch (error) {
            setAllCourseOnline([]);
            notify('Không thể tải dữ liệu khóa học', 'error');
        }
    };

    const fetchUsedContents = async () => {
        try {
            const response = await fetch(`${API_URL}/teacher/teaching-schedule`, {
                headers: {
                    'x-api-secret': `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                },
            });
            const result = await response.json();

            if (result.status && Array.isArray(result.data)) {
                const usedContentIds = result.data.map(schedule => schedule.content_id);
                setUsedContents(usedContentIds);
            }
        } catch (error) {
            console.error('Không thể tải danh sách nội dung đã sử dụng:', error);
        }
    };

    // Form validate
    const validateForm = () => {
        const newErrors = {};

        if (!formData.user_id) newErrors.user_id = 'ID giảng viên là bắt buộc';
        if (!formData.course_id) newErrors.course_id = 'ID khóa học là bắt buộc';
        if (!formData.content_id) newErrors.content_id = 'ID nội dung là bắt buộc';
        if (!formData.proposed_start) newErrors.proposed_start = 'Thời gian bắt đầu là bắt buộc';

        const proposedDate = new Date(formData.proposed_start);
        const now = new Date();

        if (isPast(proposedDate)) {
            newErrors.proposed_start = 'Không thể tạo lịch dạy do thời gian không đúng';
        } else if (isBefore(proposedDate, addHours(now, 1))) {
            newErrors.proposed_start = 'Thời gian bắt đầu phải cách hiện tại ít nhất 1 giờ';
        }

        if (formData.notes && formData.notes.length > 255) {
            newErrors.notes = 'Ghi chú không được vượt quá 255 ký tự';
        }

        return newErrors;
    };

    const handleCourseSelect = (course) => {
        setSelectedCourse(course);
        setFormData(prev => ({
            ...prev,
            course_id: course.course_id,
            content_id: '' // Reset content when course changes
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
        return usedContents.includes(contentId);
    };

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

    const courseOnline = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/teacher/teaching-schedule`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-secret': `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                handleErrorResponse(response.status, data);
            } else {
                setSuccess(true);
                setErrors({});
                resetForm();
                await fetchUsedContents();
                notify('Tạo lịch dạy thành công!', 'success');
                setTimeout(() => {
                    setSuccess(false);
                }, 3000);
            }
        } catch (error) {
            setErrors({ form: 'Lỗi kết nối, vui lòng thử lại sau' });
        }
        setLoading(false);
    };

    // xuất excel
    // const exportToExcel = () => {
    //     const worksheet = XLSX.utils.json_to_sheet(teacherCourses);

    //     const wb = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, worksheet, 'TeacherCourses');

    //     XLSX.writeFile(wb, 'teacher_courses.xlsx');
    // };
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
                                                            {errors.form && (
                                                                <div className="bg-red-50 p-4 rounded text-red-600">
                                                                    {errors.form}
                                                                </div>
                                                            )}

                                                            {success && (
                                                                <div className="bg-green-50 p-4 rounded text-green-600">
                                                                    Tạo lịch dạy thành công!
                                                                </div>
                                                            )}

                                                            <div className="space-y-2">
                                                                <label className="block mb-1">ID Khóa học *</label>
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
                                                                            <div className="flex justify-between items-center p-2 border-b">
                                                                                <span className="font-medium">Chọn khóa học</span>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => setShowCourseCommand(false)}
                                                                                    className="p-1 hover:bg-gray-100 rounded-full"
                                                                                >
                                                                                    <X size={16} />
                                                                                </button>
                                                                            </div>
                                                                            <Command>
                                                                                <CommandInput placeholder="Tìm khóa học..." />
                                                                                <CommandList>
                                                                                    <CommandEmpty>Không tìm thấy khóa học.</CommandEmpty>
                                                                                    <CommandGroup heading="Danh sách khóa học">
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
                                                                {errors.course_id && <p className="text-red-500 text-sm mt-1">{errors.course_id}</p>}
                                                            </div>

                                                            <div className="space-y-2">
                                                                <label className="block mb-1">ID Nội dung *</label>
                                                                <div className="relative" ref={contentCommandRef}>
                                                                    <input
                                                                        type="text"
                                                                        value={
                                                                            selectedCourse?.contents?.find(c => c.content_id === formData.content_id)
                                                                                ? `${formData.content_id} - ${selectedCourse.contents.find(c => c.content_id === formData.content_id).name_content}`
                                                                                : ''
                                                                        }
                                                                        onClick={() => selectedCourse && setShowContentCommand(true)}
                                                                        readOnly
                                                                        className={`w-full p-2 border rounded ${selectedCourse ? 'cursor-pointer' : 'bg-gray-100 cursor-not-allowed'}`}
                                                                        placeholder={selectedCourse ? "Chọn nội dung..." : "Vui lòng chọn khóa học trước"}
                                                                    />
                                                                    {showContentCommand && selectedCourse && (
                                                                        <div className="absolute w-full z-10 bg-white border rounded-md shadow-lg mt-1">
                                                                            <div className="flex justify-between items-center p-2 border-b">
                                                                                <span className="font-medium">Chọn nội dung</span>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => setShowContentCommand(false)}
                                                                                    className="p-1 hover:bg-gray-100 rounded-full"
                                                                                >
                                                                                    <X size={16} />
                                                                                </button>
                                                                            </div>
                                                                            <Command>
                                                                                <CommandInput placeholder="Tìm nội dung..." />
                                                                                <CommandList>
                                                                                    <CommandEmpty>Không tìm thấy nội dung.</CommandEmpty>
                                                                                    <CommandGroup heading="Danh sách nội dung">
                                                                                        {selectedCourse.contents.map((content) => {
                                                                                            const isUsed = isContentUsed(content.content_id);
                                                                                            return (
                                                                                                <CommandItem
                                                                                                    key={content.content_id}
                                                                                                    onSelect={() => !isUsed && handleContentSelect(content)}
                                                                                                    className={`flex items-center justify-between ${isUsed ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                                                                    disabled={isUsed}
                                                                                                >
                                                                                                    <div className="flex items-center gap-2">
                                                                                                        <span>{content.content_id} - {content.name_content}</span>
                                                                                                    </div>
                                                                                                    {isUsed && (
                                                                                                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                                                                            Đã thêm
                                                                                                        </span>
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
                                                                {errors.content_id && <p className="text-red-500 text-sm mt-1">{errors.content_id}</p>}
                                                            </div>

                                                            <div>
                                                                <label className="block mb-1">Thời gian bắt đầu *</label>
                                                                <input
                                                                    type="datetime-local"
                                                                    value={formData.proposed_start}
                                                                    onChange={e => setFormData({ ...formData, proposed_start: e.target.value })}
                                                                    className="w-full p-2 border rounded"
                                                                />
                                                                {errors.proposed_start && <p className="text-red-500 text-sm mt-1">{errors.proposed_start}</p>}
                                                            </div>

                                                            <div>
                                                                <label className="block mb-1">Ghi chú</label>
                                                                <textarea
                                                                    value={formData.notes}
                                                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                                                    className="w-full p-2 border rounded"
                                                                    maxLength={255}
                                                                />
                                                                {errors.notes && <p className="text-red-500 text-sm mt-1">{errors.notes}</p>}
                                                            </div>

                                                            <button
                                                                type="submit"
                                                                disabled={loading}
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
                                {/* <div className="">
                                    <Button className="duration-300  bg-white text-black border hover:bg-gray-100" onClick={exportToExcel}>
                                        <div className="">
                                            <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/download.svg" className="w-5" alt="" />
                                        </div>
                                        <div className="">
                                            <p>Xuất</p>
                                        </div>
                                    </Button>
                                </div> */}
                            </div>

                            <div className="my-5 bg-white rounded-3xl p-3">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-cyan-950 md:text-base text-xs w-20">STT</TableHead>
                                            <TableHead className="text-cyan-950 md:text-base text-xs w-full sm:w-auto">Tên khóa học</TableHead>
                                            <TableHead className="text-cyan-950 md:text-base text-xs">Nội dung</TableHead>
                                            <TableHead className="text-cyan-950 md:text-base text-xs">Ngày bắt đầu</TableHead>
                                            <TableHead className="text-cyan-950 md:text-base text-xs">Ghi chú</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {allCourseOnline.map((course, index) => (
                                            <React.Fragment key={course.course_id}>
                                                {course.contents.map((content, contentIndex) => (
                                                    <TableRow key={`${course.course_id}-${content.content_id}`}>
                                                        <TableCell>{index + 1}</TableCell>
                                                        <TableCell>{course.course_title}</TableCell>
                                                        <TableCell>{content.name_content}</TableCell>
                                                        <TableCell>Ngày bắt đầu</TableCell>
                                                        <TableCell>
                                                            <span className={`px-2 py-1 rounded-full text-sm ${content.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                                }`}>
                                                                Ghi chú
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </TableBody>
                                </Table>
                                {/* <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href="#"
                                                onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)}
                                            />
                                        </PaginationItem>
                                        {Array.from({ length: Math.max(1, Math.ceil(teacherOrders.length / itemsPerPage)) }).map((_, index) => (
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
                                                        currentPage < Math.ceil(teacherOrders.length / itemsPerPage)
                                                            ? currentPage + 1
                                                            : currentPage
                                                    )
                                                }
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination> */}


                            </div>
                        </div>

                    </div>
                </div>
            </section>
            <Toaster />
        </>
    )
}
