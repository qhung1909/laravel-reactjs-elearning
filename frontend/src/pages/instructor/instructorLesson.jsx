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
import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom"
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { Skeleton } from "@/components/ui/skeleton";
const notify = (message, type) => {
    if (type === 'success') {
        toast.success(message);
    } else {
        toast.error(message)
    }
}
import { UserContext } from "../context/usercontext";
export const InstructorLesson = () => {
    const { instructor, logout, refreshToken } = useContext(UserContext);
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;
    const [loading, setLoading] = useState(false)
    const [loadingLogout, setLoadingLogout] = useState(false);
    const [_success, setSuccess] = useState("");
    const [userCourses, setUserCourses] = useState([]);
    const navigate = useNavigate();
    const fetchUserCourses = async (userId) => {
        const token = localStorage.getItem("access_token");
        try {
            const response = await axios.get(`${API_URL}/userCourses/${userId}`, {
                headers: {
                    'x-api-secret': `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data)
            setUserCourses(response.data)
        } catch (error) {
            console.log('Error fetching users Courses', error)
        }
    }
    const renderUserCourses = loading ? (
        <>
            {Array.from({ length: 4 }).map((_, index) => (
                <TableRow key={index}>
                    <TableCell>
                        <Skeleton className="h-[125px] w-11/12 rounded-xl" />
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-col space-y-2">
                            <Skeleton className="h-4 w-8/12 md:w-11/12" />
                            <Skeleton className="h-4 w-5/12 md:w-9/12" />
                        </div>
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-24" />
                    </TableCell>
                </TableRow>

            ))}
        </>
    ) :
        Array.isArray(userCourses) && userCourses.length > 0 ? (
            userCourses.map((item, index) => (
                <TableRow key={index}>
                    <TableCell className="font-medium sm:p-4 p-0">
                        <img src={`${item.img}`} className="rounded-sm " alt="" />
                    </TableCell>
                    <TableCell className="lg:text-sm sm:text-sm text-xs md:line-clamp-none line-clamp-2">{item.title}</TableCell>
                    <TableCell className="font-medium sm:text-sm text-xs">1.290.000đ</TableCell>
                    <TableCell className="font-medium sm:text-sm text-xs">1200</TableCell>
                    <TableCell className="font-medium sm:text-sm text-xs">1200</TableCell>
                    <TableCell className="font-medium sm:text-sm text-xs">24-10-2024</TableCell>
                </TableRow>
            ))
        ) : (
            <p> chưa có dữ liệu</p>
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
    return (
        <>
            <section className="instructor-home">
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
                                    <Link to="/instructor" className="flex items-center px-4 py-2 rounded-2xl text-gray-700 hover:bg-gray-100">
                                        <div className="  mr-3 pt-1 px-1  rounded-full">
                                            <box-icon name='sidebar'></box-icon>
                                        </div>
                                        <p className="font-semibold text-base">Bảng điều khiển</p>
                                    </Link>
                                </li>
                                <li className="mb-3">
                                    <Link to="/instructor/lessson" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 bg-gray-100">
                                        <div className="bg-yellow-400 mr-3 pt-1 px-1 rounded-full">
                                            <box-icon name='book-open' color='#ffffff'></box-icon>
                                        </div>
                                        <p className="font-semibold text-base">Bài học của tôi</p>
                                    </Link>
                                </li>
                                <li className="mb-3">
                                    <Link to="/instructor/history" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100">
                                        <div className=" mr-3 pt-1 px-1 rounded-full">
                                            <box-icon name='credit-card' ></box-icon>
                                        </div>
                                        <p className="font-semibold text-base">Lịch sử mua hàng</p>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/instructor/profile" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100">
                                        <div className=" mr-3 pt-1 px-1 rounded-full">
                                            <box-icon type='solid' name='user-circle'></box-icon>
                                        </div>
                                        <p className="font-semibold text-base">Thông tin tài khoản</p>
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
                                                <DropdownMenuContent>
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
                                                                    <img src="./src/assets/images/antlearn.png" alt="Edumall Logo" className="w-20 h-14 object-cover" />
                                                                </div>
                                                            </div>
                                                        </SheetTitle>
                                                        <SheetDescription>
                                                            <ul className="">
                                                                <li className="mb-3">
                                                                    <Link to="/instructor" className="flex items-center px-4 py-2 rounded-2xl text-gray-700 hover:bg-gray-100">
                                                                        <div className="  mr-3 pt-1 px-1  rounded-full">
                                                                            <box-icon name='sidebar'></box-icon>
                                                                        </div>
                                                                        <p className="font-semibold text-base">Bảng điều khiển</p>
                                                                    </Link>
                                                                </li>
                                                                <li className="mb-3">
                                                                    <Link to="/instructor/lessson" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 bg-gray-100">
                                                                        <div className="bg-yellow-400 mr-3 pt-1 px-1 rounded-full">
                                                                            <box-icon name='book-open' color='#ffffff'></box-icon>
                                                                        </div>
                                                                        <p className="font-semibold text-base">Bài học của tôi</p>
                                                                    </Link>
                                                                </li>
                                                                <li className="mb-3">
                                                                    <Link to="/instructor/history" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100">
                                                                        <div className=" mr-3 pt-1 px-1 rounded-full">
                                                                            <box-icon name='credit-card' ></box-icon>
                                                                        </div>
                                                                        <p className="font-semibold text-base">Lịch sử mua hàng</p>
                                                                    </Link>
                                                                </li>
                                                                <li>
                                                                    <Link to="/instructor/profile" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100">
                                                                        <div className=" mr-3 pt-1 px-1 rounded-full">
                                                                            <box-icon type='solid' name='user-circle'></box-icon>
                                                                        </div>
                                                                        <p className="font-semibold text-base">Thông tin tài khoản</p>
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
                        {/* Lesson content */}
                        <div className="md:p-6 p-2 max-lg:h-screen">

                            <div className="my-5 bg-white rounded-3xl p-3">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="xl:w-[250px] lg:w-[250px] md:w-[200px] w-[150px] text-cyan-950 md:text-sm text-xs">Hình ảnh</TableHead>
                                            <TableHead className="text-cyan-950 md:text-sm text-xs xl:w-[200px] lg:w-[150px] md:w-[150px] sm:w-[200px] w-[200px]">Tên</TableHead>
                                            <TableHead className="text-cyan-950 md:text-sm text-xs">Giá</TableHead>
                                            <TableHead className="text-cyan-950 md:text-sm text-xs">Lượt bán</TableHead>
                                            <TableHead className="text-cyan-950 md:text-sm text-xs">Lượt xem</TableHead>
                                            <TableHead className="text-cyan-950 md:text-sm text-xs">Ngày tạo</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {renderUserCourses}
                                    </TableBody>
                                </Table>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Toaster />
        </>
    )
}
