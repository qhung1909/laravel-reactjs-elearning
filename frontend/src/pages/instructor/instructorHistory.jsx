import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState, useContext } from "react";
import axios from "axios";

import toast, { Toaster } from 'react-hot-toast';

const notify = (message, type) => {
    if (type === 'success') {
        toast.success(message);
    } else {
        toast.error(message)
    }
}
import { UserContext } from "../context/usercontext";
import { formatCurrency } from "@/components/Formatcurrency/formatCurrency";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button"
import * as XLSX from 'xlsx';
export const InstructorHistory = () => {
    const { instructor, logout, refreshToken } = useContext(UserContext);
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;
    const [loading, setLoading] = useState(false);
    const [loadingLogout, setLoadingLogout] = useState(false);
    const navigate = useNavigate();
    const [_success] = useState("");
    const [teacherOrders, setTeacherOrders] = useState([])
    const token = localStorage.getItem("access_token");
    const [searchTerm, setSearchTerm] = useState("");

    // tìm kiếm
    const handleSearch = (event) => {
        setSearchTerm(event.target.value)
    }
    const filteredOrders = teacherOrders.filter((order) =>
        order.course_title && order.course_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.student_name && order.student_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    }
    const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);


    // hàm xử lý lịch sử mua hàng
    const fetchTeacherOrders = async (teacherId) => {
        setLoading(true)
        try {
            const response = await axios.get(`${API_URL}/teacher/${teacherId}/orders`, {
                headers: {
                    'x-api-secret': `${API_KEY}`,
                    Authorization: `Bearer: ${token}`,
                },
            });
            if (response.data.status) {
                setTeacherOrders(response.data.data.orders)
                console.log(response.data.data.orders)
            }
        } catch (error) {
            console.log('error fetching teacher orders', error)
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        if (instructor && instructor.user_id) {
            fetchTeacherOrders(instructor.user_id)
        }
    }, [instructor])


    const renderTeacherOrder = loading ? (
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
        currentItems.map((item, index) => (
            <TableRow key={index}>
                <TableCell>
                    {index + 1}
                </TableCell>
                <TableCell className="font-medium md:text-base text-sm text-yellow-700 w-auto">
                    <p className="line-clamp-3">{item.student_name}</p>
                </TableCell>
                <TableCell className="font-medium md:text-base text-sm">
                    <p className="line-clamp-2">{item.course_title}</p>
                </TableCell>
                <TableCell className="font-medium md:text-base text-sm">
                    {formatCurrency(item.price)}
                </TableCell>
                <TableCell className="font-medium md:text-base text-sm">
                    <p className="line-clamp-3">{item.order_date}</p>
                </TableCell>
            </TableRow>
        ))
    ) : (
        <TableRow>
            <TableCell colSpan={6}>
                <div className="py-5">
                    <svg width="100%" height="177" viewBox="0 0 139 142" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M71.5016 125.45C104.302 125.45 130.902 99.0496 130.902 66.4496C130.902 33.8496 104.302 7.44958 71.5016 7.44958C38.7016 7.44958 12.1016 33.8496 12.1016 66.4496C12.1016 99.0496 38.7016 125.45 71.5016 125.45Z" fill="#EAEEF9">
                        </path>
                        <path d="M117.002 58.7495V94.8495C117.002 102.35 110.902 108.45 103.302 108.45H39.9017C32.4017 108.45 26.3017 102.45 26.2017 94.9495C26.2017 94.8495 26.2017 94.8495 26.2017 94.7495V58.7495C26.2017 58.6495 26.2017 58.6495 26.2017 58.5495C26.2017 58.3495 26.2017 58.1495 26.3017 57.9495C26.4017 57.6495 26.5017 57.4495 26.6017 57.1495L43.6017 24.6495C44.2017 23.3495 45.5017 22.6495 46.9017 22.6495H96.2017C97.6017 22.6495 98.8017 23.3495 99.5017 24.6495L116.502 57.1495C116.602 57.3495 116.702 57.6495 116.802 57.9495C117.002 58.1495 117.002 58.4495 117.002 58.7495Z" fill="#D5DDEA"></path><g filter="url(#filter0_d_0_17276)"><path d="M117.002 58.7496V98.5496C117.002 104.05 112.602 108.45 107.002 108.45H36.2017C30.7017 108.45 26.2017 104.05 26.2017 98.5496V58.5496C26.2017 58.3496 26.2017 58.1496 26.3017 57.9496H49.1017C52.5017 57.9496 55.3017 60.6496 55.3017 64.1496C55.3017 65.8496 56.0017 67.4496 57.1017 68.5496C58.3017 69.7496 59.7017 70.3496 61.5017 70.3496H81.8017C85.2017 70.3496 88.0017 67.6496 88.0017 64.1496C88.0017 62.4496 88.7017 60.8496 89.8017 59.7496C91.0017 58.5496 92.4017 57.9496 94.1017 57.9496H116.802C117.002 58.1496 117.002 58.4496 117.002 58.7496Z" fill="url(#paint0_linear_0_17276)"></path></g><path d="M129.384 38.2496C131.648 38.2496 133.484 36.4139 133.484 34.1496C133.484 31.8852 131.648 30.0496 129.384 30.0496C127.119 30.0496 125.284 31.8852 125.284 34.1496C125.284 36.4139 127.119 38.2496 129.384 38.2496Z" fill="#EAEEF9"></path><path d="M125.284 24.9496C126.83 24.9496 128.084 23.696 128.084 22.1496C128.084 20.6032 126.83 19.3496 125.284 19.3496C123.737 19.3496 122.484 20.6032 122.484 22.1496C122.484 23.696 123.737 24.9496 125.284 24.9496Z" fill="#EAEEF9"></path><path d="M11.8837 34.1496C13.4301 34.1496 14.6837 32.896 14.6837 31.3496C14.6837 29.8032 13.4301 28.5496 11.8837 28.5496C10.3373 28.5496 9.08374 29.8032 9.08374 31.3496C9.08374 32.896 10.3373 34.1496 11.8837 34.1496Z" fill="#EAEEF9"></path><path d="M5.58379 95.7496C8.45567 95.7496 10.7838 93.4215 10.7838 90.5496C10.7838 87.6777 8.45567 85.3496 5.58379 85.3496C2.71191 85.3496 0.383789 87.6777 0.383789 90.5496C0.383789 93.4215 2.71191 95.7496 5.58379 95.7496Z" fill="#EAEEF9"></path><path d="M96.6216 10.6187C97.9267 24.8658 98.5792 28.1285 95.6244 41.0313C94.6635 43.8998 93.7026 47.0416 91.6435 49.2271C88.7607 52.642 83.5443 54.1446 79.2889 53.0518C74.8961 51.9591 71.327 48.1343 70.5033 43.49C69.817 40.6215 70.7779 37.2065 73.2488 35.4308C75.857 33.7916 79.5634 34.2014 81.7598 36.2504C84.2307 38.2993 85.1916 41.4411 85.0543 44.4462C84.9171 47.4513 83.8189 50.4565 82.3089 53.0518C78.8954 59.4335 77.4901 59.41 70.5034 69.8911" stroke="#ABB5CC" strokeWidth="2" strokeMiterlimit="10" strokeDasharray="4 4"></path><path d="M104.275 5.31244C103.753 7.21624 101.666 7.90853 99.579 6.69702C97.3179 5.65858 95.7525 4.79322 96.1004 3.06249C96.6222 1.33177 98.7093 1.15869 101.144 0.985622C104.101 0.639477 104.623 3.40864 104.275 5.31244Z" fill="#DAE2EB"></path><path d="M87.4039 7.04302C88.2736 8.60068 90.7086 9.63911 92.4479 8.08146C94.3611 6.35073 95.9264 5.13922 95.0568 3.4085C94.1872 1.85084 92.7957 2.37006 89.8389 2.71621C87.4039 3.23542 86.3604 5.3123 87.4039 7.04302Z" fill="#DAE2EB"></path><path d="M95.0569 0.639542C96.2744 0.466469 97.4919 1.15876 97.8397 2.1972C98.0137 2.54334 98.1876 3.06256 98.1876 3.4087C98.5355 5.83172 97.6658 7.90859 96.2744 8.08167C94.709 8.42781 93.1437 6.69708 92.9697 4.44714C92.9697 3.75485 92.9697 3.4087 92.9697 2.88949C93.1437 1.67798 93.8394 0.812615 95.0569 0.639542C95.2308 0.639542 95.0569 0.639542 95.0569 0.639542Z" fill="#989FB0"></path><path d="M60.192 84.7092C61.4591 84.7092 62.4863 83.682 62.4863 82.4149C62.4863 81.1478 61.4591 80.1206 60.192 80.1206C58.9249 80.1206 57.8977 81.1478 57.8977 82.4149C57.8977 83.682 58.9249 84.7092 60.192 84.7092Z" fill="#989FB0"></path><path d="M83.0108 84.7092C84.278 84.7092 85.3051 83.682 85.3051 82.4149C85.3051 81.1478 84.278 80.1206 83.0108 80.1206C81.7437 80.1206 80.7166 81.1478 80.7166 82.4149C80.7166 83.682 81.7437 84.7092 83.0108 84.7092Z" fill="#989FB0"></path><path d="M75.322 99.7772H68.129C67.0129 99.7772 66.0828 98.8471 66.0828 97.731C66.0828 96.6148 67.0129 95.6847 68.129 95.6847H75.2599C76.3761 95.6847 77.3062 96.6148 77.3062 97.731C77.3682 98.8471 76.4381 99.7772 75.322 99.7772Z" fill="#989FB0"></path><defs><filter id="filter0_d_0_17276" x="4.20166" y="46.9496" width="134.8" height="94.5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dy="11"></feOffset><feGaussianBlur stdDeviation="11"></feGaussianBlur><feColorMatrix type="matrix" values="0 0 0 0 0.397708 0 0 0 0 0.47749 0 0 0 0 0.575 0 0 0 0.27 0"></feColorMatrix><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_17276"></feBlend><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_17276" result="shape"></feBlend></filter><linearGradient id="paint0_linear_0_17276" x1="71.5721" y1="56.7815" x2="71.5721" y2="108.994" gradientUnits="userSpaceOnUse"><stop stopColor="#FDFEFF"></stop><stop offset="0.9964" stopColor="#ECF0F5"></stop></linearGradient></defs>
                    </svg>
                    <br />
                    <p className="text-center font-bold text-black">Không tìm thấy dữ liệu.</p>
                    <p className="text-center text-slate-600 font-semibold mt-1">Chưa có dữ liệu, Hãy thử lại</p>
                </div>
            </TableCell>
        </TableRow>
    )

    // hàm xử lý đăng xuất
    const handleLogout = () => {
        setLoadingLogout(true);
        logout();
        setLoadingLogout(false);
    };

    // hàm xử lý refreshtoken
    const handleRefreshToken = async () => {
        const newToken = await refreshToken();
        if (newToken) {
            alert('Token has been refreshed successfully!');
        } else {
            alert('Failed to refresh token. Please log in again.');
        }
    };

    // xuất excel
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(teacherOrders)
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, worksheet, ' TeacherOrders');
        XLSX.writeFile(wb, 'teacher_orders.xlsx')
    }
    return (
        <>
            <section className="instructor-history">
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
                                    <Link to="/instructor/history" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 bg-gray-100">
                                        <div className="bg-yellow-400 mr-3 px-1 rounded-full">
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
                                    <Link to="/instructor/schedule" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100">
                                        <div className=" mr-3 px-1 rounded-full">
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
                                                                    <Link to="/instructor/history" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 bg-gray-100">
                                                                        <div className="bg-yellow-400 mr-3 px-1 rounded-full">
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
                                                                    <Link to="/instructor/schedule" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100">
                                                                        <div className=" mr-3 px-1 rounded-full">
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
                        {/* History content */}
                        <div className="md:p-6 p-2 max-lg:h-screen">

                            {/* xuất excel */}
                            <div className="flex justify-end">
                                <Button className="duration-300 bg-white text-black border hover:bg-gray-100" onClick={exportToExcel}>
                                    <div className="">
                                        <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/download.svg" className="w-5" alt="" />
                                    </div>
                                    <div className="">
                                        <p>Xuất</p>
                                    </div>
                                </Button>
                            </div>
                            {/* tìm kiếm học viên - tìm kiếm khóa học*/}
                            <div className=" flex justify-center p-3 md:p-0 my-5">
                                <input type="text" value={searchTerm} onChange={handleSearch} placeholder="Tìm kiếm khóa học và sinh viên..." className="md:w-full w-[80%] p-3 rounded-tl-lg rounded-bl-lg" />
                                <button className="w-28 bg-yellow-400 hover:bg-blue-500 hover:text-white duration-300 p-2 rounded-tr-lg rounded-br-lg font-semibold xl:text-base md:text-sm text-sm">
                                    <p className="">Tìm kiếm</p>
                                </button>
                            </div>

                            <div className="my-5 bg-white rounded-3xl p-3">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-cyan-950 md:text-base text-xs w-20">STT</TableHead>
                                            <TableHead className="text-cyan-950 md:text-base text-xs w-full sm:w-auto">Tên học viên</TableHead>
                                            <TableHead className="text-cyan-950 md:text-base text-xs">Tên khóa học</TableHead>
                                            <TableHead className="text-cyan-950 md:text-base text-xs">Giá</TableHead>
                                            <TableHead className="text-cyan-950 md:text-base text-xs">Ngày mua</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {renderTeacherOrder}
                                    </TableBody>
                                </Table>
                                <Pagination>
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
