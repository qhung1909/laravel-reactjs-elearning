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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState, useContext } from "react";
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
    const [password, setPassword] = useState("");
    const [current_password, setCurrentPassword] = useState("");
    const [password_confirmation, setPassword_Confirmation] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        user_id: '',
        course_id: '',
        content_id: '',
        proposed_start: '',
        notes: ''
    });

    // validate form
    const validateForm = () => {
        const newErrors = {};

        // xử lý trường
        if (!formData.user_id) newErrors.user_id = 'ID giảng viên là bắt buộc';
        if (!formData.course_id) newErrors.course_id = 'ID khóa học là bắt buộc';
        if (!formData.content_id) newErrors.content_id = 'ID nội dung là bắt buộc';
        if (!formData.proposed_start) newErrors.proposed_start = 'Thời gian bắt đầu là bắt buộc';

        // xử lý thời gian
        const proposedDate = new Date(formData.proposed_start);
        const now = new Date();

        if (isPast(proposedDate)) {
            newErrors.proposed_start = 'Không thể tạo lịch dạy do thời gian không đúng';
        } else if (isBefore(proposedDate, addHours(now, 1))) {
            newErrors.proposed_start = 'Thời gian bắt đầu phải cách hiện tại ít nhất 1 giờ';
        }

        // Xử lý note
        if (formData.notes && formData.notes.length > 255) {
            newErrors.notes = 'Ghi chú không được vượt quá 255 ký tự';
        }

        return newErrors;
    };

    // hàm xử lý thêm lịch học online
    const courseOnline = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/teacher/teaching-schedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                switch (response.status) {
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
            } else {
                setSuccess(true);
                setErrors({});
                setFormData({
                    user_id: '',
                    course_id: '',
                    content_id: '',
                    proposed_start: '',
                    notes: ''
                });
            }
        } catch (error) {
            setErrors({ form: 'Lỗi kết nối, vui lòng thử lại sau' });
        }
        setLoading(false);
    };

    // hàm xử lý lấy khóa học teacher
    // const fetchTeacherCourse = async () => {
    //     setLoading(true)
    //     const token = localStorage.getItem("access_token");
    //     try {
    //         const response = await axios.get(`${API_URL}/teacher/course`, {
    //             headers: {
    //                 'x-api-secret': `${API_KEY}`,
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });
    //         console.log(response.data)
    //         setTeacherCourses(response.data.courses)
    //     } catch (error) {
    //         console.log('Error fetching users Courses', error)
    //     } finally {
    //         setLoading(false)
    //     }
    // }
    // hàm xử lý thay đổi file
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            setCurrentAvatar(URL.createObjectURL(file));
        }
    };

    // hàm xử lý update user profile
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (isProfileSubmitting) return;

        setIsProfileSubmitting(true);
        try {
            await updateUserProfile(userName, email, avatar);
            setSuccess(true);
            toast.success("Cập nhật hồ sơ thành công!");
        } catch (error) {
            setError("Cập nhật không thành công, vui lòng thử lại.");
            toast.error(error.message);
        } finally {
            setIsProfileSubmitting(false);
        }
    };

    // hàm xử lý đăng xuất
    const handleLogout = () => {
        setLoadingLogout(true);
        logout();
        setLoadingLogout(false);
    };

    // hàm xử lý validate thay đổi mật khẩu
    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        const isUpdated = await updatePassword(
            current_password,
            password,
            password_confirmation
        );
        setIsSubmitting(false);

        if (isUpdated) {
            setCurrentPassword("");
            setPassword("");
            setPassword_Confirmation("");
        }
    };

    useEffect(() => {
        if (success) {
            window.location.reload();
        }
    }, [success]);

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
                                            <Button className=" bg-gradient-to-br from-yellow-400 to-orange-800 text-white hover:bg-white">Thêm khóa học online</Button>

                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                {/* <DialogTitle>Are you absolutely sure?</DialogTitle> */}
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

                                                            {/* id khóa học */}
                                                            <div>
                                                                <label className="block mb-1">ID Khóa học *</label>
                                                                <input
                                                                    type="number"
                                                                    value={formData.course_id}
                                                                    onChange={e => setFormData({ ...formData, course_id: e.target.value })}
                                                                    className="w-full p-2 border rounded"
                                                                />
                                                                {errors.course_id && <p className="text-red-500 text-sm mt-1">{errors.course_id}</p>}
                                                            </div>

                                                            {/* nội dung */}
                                                            <div>
                                                                <label className="block mb-1">ID Nội dung *</label>
                                                                <input
                                                                    type="number"
                                                                    value={formData.content_id}
                                                                    onChange={e => setFormData({ ...formData, content_id: e.target.value })}
                                                                    className="w-full p-2 border rounded"
                                                                />
                                                                {errors.content_id && <p className="text-red-500 text-sm mt-1">{errors.content_id}</p>}
                                                            </div>

                                                            {/* thời gian bắt đầu */}
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

                                                            {/* ghi chú */}
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
                        {/* <div className="md:p-6 p-2 max-lg:h-screen">
                            <div className="my-5 bg-white rounded-3xl p-3">
                                <div className="space-y-4">
                                    <div className=" overflow-x-auto  shadow-md rounded-lg">
                                        <table className="w-full text-sm text-left">
                                            <thead className="text-xs bg-gray-50">
                                                <tr className="border-b">
                                                    <th className="py-4 px-6 font-medium whitespace-nowrap">STT</th>
                                                    <th className="py-4 px-6 font-medium">Khóa học</th>
                                                    <th className="py-4 px-6 font-medium">Bài học</th>
                                                    <th className="py-4 px-6 font-medium">Ngày dạy</th>
                                                    <th className="py-4 px-6 font-medium">Khung giờ</th>
                                                    <th className="py-4 px-6 font-medium">Link meet</th>
                                                    <th className="py-4 px-6 font-medium">Ghi chú</th>
                                                    <th className="py-4 px-6 font-medium">Trạng thái</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {sampleSchedules.map((schedule, index) => (
                                                    <tr key={schedule.id || index} className="bg-white hover:bg-gray-50">
                                                        <td className="py-4 px-6 font-medium">{index + 1}</td>
                                                        <td className="py-4 px-6 font-medium">{schedule.course_name}</td>
                                                        <td className="py-4 px-6">{schedule.lesson_name}</td>
                                                        <td className="py-4 px-6">{schedule.teaching_date}</td>
                                                        <td className="py-4 px-6">{schedule.time_slot}</td>
                                                        <td className="py-4 px-6">
                                                            <a
                                                                href={schedule.meet_link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                                                            >
                                                                <img
                                                                    src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/meet.svg"
                                                                    className="w-4 h-4"
                                                                    alt="meet"
                                                                />
                                                                Join Meet
                                                            </a>
                                                        </td>
                                                        <td className="py-4 px-6">{schedule.notes}</td>
                                                        <td className="py-4 px-6">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${schedule.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                                schedule.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                                                                    'bg-yellow-100 text-yellow-800'
                                                                }`}>
                                                                {schedule.status === 'completed' ? 'Đã hoàn thành' :
                                                                    schedule.status === 'upcoming' ? 'Sắp diễn ra' :
                                                                        'Đang diễn ra'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </section>
            <Toaster />
        </>
    )
}
