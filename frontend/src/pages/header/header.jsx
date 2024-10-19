import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    CreditCard,
    LogOut,
    Settings,
    User,
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
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
import axios from "axios";

import { Skeleton } from "@/components/ui/skeleton"

export const Header = () => {
    const location = useLocation();
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;
    const [categories, setCategories] = useState([]);
    const [logined, setLogined] = useState(null);
    const [user, setUser] = useState([]);
    const [loadingLogout, setLoadingLogout] = useState(false);
    const [loading, setLoading] = useState(false);
    const isBlogPage = location.pathname === "/blog";
    const isContactPage = location.pathname === "/contact";
    const categoryImages = {
        javascript: "./src/assets/images/javascript.svg",
        python: "./src/assets/images/python.svg",
        reactjs: "./src/assets/images/reactjs.svg",
        angular: "./src/assets/images/angular.svg",
        css: "./src/assets/images/css.svg",
        html: "./src/assets/images/html.svg",
        next: "./src/assets/images/next.svg",
        asp: "./src/assets/images/asp.svg",
        nodejs: "./src/assets/images/nodejs.svg",

    };


    const navigate = useNavigate();

    const logout = () => {
        setLoadingLogout(true)
        setTimeout(() => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setLogined(null);
            setLoadingLogout(false)
        }, 800)

    }


    const refreshToken = async () => {
        const storedRefreshToken = localStorage.getItem('refresh_token');
        if (!storedRefreshToken) {
            alert('Session expired. Please log in again.');
            navigate('/login');
            return;
        }
        try {
            const res = await fetch(`${API_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refresh_token: storedRefreshToken })
            });

            if (!res.ok) {
                alert('Session expired. Please log in again.');
                navigate('/login');
                return;
            }

            const data = await res.json();
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            return data.access_token;
        } catch {
            alert('Session expired. Please log in again.');
            navigate('/login');
        }
    };


    const fetchUser = async () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            console.error("Người dùng chưa đăng nhập.");
            return;
        }
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/auth/me`, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                },
            });
            // Kiểm tra cấu trúc dữ liệu trả về
            if (res.data && res.data) {
                setUser(res.data);
            } else {
                console.error(
                    "Không tìm thấy thông tin người dùng trong phản hồi."
                );
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin người dùng:", error);
            if (error.response) {
                if (error.response.status === 401) {
                    const newToken = await refreshToken();
                    if (newToken) {
                        await fetchUser();
                    }
                } else {
                    console.error("Chi tiết lỗi:", error.response.data);
                    console.error("Trạng thái lỗi:", error.response.status);
                }
            } else {
                console.error("Lỗi mạng hoặc không có phản hồi từ máy chủ.");
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${API_URL}/categories`, {
                headers: {
                    'x-api-secret': `${API_KEY}`,
                },
            });
            const allCategories = response.data;

            setCategories(allCategories)
        } catch (error) {
            console.log('Error fetching categories', error)
        } finally {
            setLoading(false)
        }
    }

    const renderCategories = () => {
        return loading ? (
            <div className="flex flex-wrap justify-center items-center">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div className="bg-gray-100 h-10 w-20 rounded-lg animate-pulse mx-2" key={index}></div>
                ))}
            </div>
        ) : Array.isArray(categories) && categories.length > 0 ? (
            categories.map((item) => {
                const categoryImage = categoryImages[item.slug] || "./src/assets/images/default.svg";
                return (
                    <div key={item.slug} className="duration-300 cursor-pointer py-1">
                        <DropdownMenuItem>
                            <Link className="flex gap-3 hover:text-yellow-400 duration-300 py-1 rounded-md">
                                {/* tạo một mảng hình ảnh */}
                                <img src={categoryImage} className="w-5" alt={item.name} />
                                <span className="font-semibold text-base">{item.name}</span>
                            </Link>
                        </DropdownMenuItem>
                    </div>
                )
            })
        ) : (
            <p>Không có danh mục phù hợp ngay lúc này, thử lại sau</p>
        )
    }

    useEffect(() => {
        const userToken = localStorage.getItem('access_token');
        if (userToken) {
            console.log("Fetching data...");
            setLogined(userToken);
            fetchUser();
        };

        fetchCategories();
    }, []);

    console.log('API Key being used:', API_KEY);


    return (
        <>
            {loadingLogout && (
                <div className='loading'>
                    <div className='loading-spin'></div>
                </div>
            )}
            <header>
                <nav className="navbar flex items-center justify-center w-full mx-auto py-2 z-10 ps-3 xl:max-w-screen-2xl">

                    {/* header - logo */}
                    <div className="navbar-logo mx-2 w-20 h-24 object-cover flex items-center">
                        <Link to="/">
                            <img
                                src="/src/assets/images/antlearn.png"
                                alt=""
                                className="w-40"
                            />
                        </Link>
                    </div>

                    {/* header - search */}
                    <div className="navbar-search xl:w-1/2  xl:px-0 sm:w-3/4 w-2/3 p-2">
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="border rounded-full p-2 w-full hover:duration-300"
                        />
                    </div>
                    {logined ? (
                        <>
                            <>
                                {/* header - content */}
                                <div className="navbar-content  bg-white xl:flex xl:items-center px-10 max-xl:w-full xl:block hidden">
                                    <ul className="max-xl:pt-3 gap-4 font-semibold flex text-base xl:text-base w-full items-center justify-center">
                                        <li className="max-xl:mb-4 ">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <Link to="/courses" className="hover:text-gray-500 border-none p-3">
                                                        Khóa học
                                                    </Link>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <div className="grid grid-cols-2 gap-3 ">
                                                        <div className="grid-1 border-r border-gray-100 px-5">
                                                            <DropdownMenuLabel className="text-base text-blue-900 uppercase font-bold">Loại</DropdownMenuLabel>
                                                            <div className=" duration-300 cursor-pointer">
                                                                <DropdownMenuItem>
                                                                    <Link to="/courses" className="flex gap-3 hover:text-yellow-400 duration-300 py-1 rounded-md">
                                                                        <svg width="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 8C4 5.17157 4 3.75736 4.87868 2.87868C5.75736 2 7.17157 2 10 2H14C16.8284 2 18.2426 2 19.1213 2.87868C20 3.75736 20 5.17157 20 8V16C20 18.8284 20 20.2426 19.1213 21.1213C18.2426 22 16.8284 22 14 22H10C7.17157 22 5.75736 22 4.87868 21.1213C4 20.2426 4 18.8284 4 16V8Z" stroke="currentColor" strokeWidth="2"></path><path d="M19.8978 16H7.89778C6.96781 16 6.50282 16 6.12132 16.1022C5.08604 16.3796 4.2774 17.1883 4 18.2235" stroke="currentColor" strokeWidth="2"></path><path d="M8 7H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path><path d="M8 10.5H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path></svg>
                                                                        <span className="font-semibold text-base">Tất cả khóa học</span>
                                                                    </Link>
                                                                </DropdownMenuItem>

                                                            </div>
                                                        </div>
                                                        <div className="grid-2 px-5">
                                                            <DropdownMenuLabel className=" text-base text-blue-900 uppercase font-bold">Danh mục</DropdownMenuLabel>
                                                            {renderCategories()}
                                                        </div>
                                                    </div>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </li>
                                        <li>
                                            <Link to="/contact" className={`p-3 rounded ${isContactPage ? "bg-yellow-100 " : "hover:bg-gray-100"}`}>
                                                Liên hệ
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/blog" className={` p-3 rounded ${isBlogPage ? "bg-yellow-100" : "hover:bg-gray-100"}`}>
                                                Blog
                                            </Link>
                                        </li>
                                    </ul>
                                    <div className="navbar-icons flex items-center gap-3 xl:mx-3">
                                        <div className="navbar-noti cursor-pointer">
                                            <Link to="/instructor">
                                                <img src="./src/assets/images/notification.svg" className="w-12" alt="" />
                                            </Link>

                                        </div>
                                        <div className="navbar-language cursor-pointer">
                                            <img src="./src/assets/images/language.svg" className="w-12" alt="" />
                                        </div>
                                        <div className="">
                                            <Link to='/cart'>
                                                <img src="./src/assets/images/cart.svg" className="w-12" alt="" />
                                            </Link>
                                        </div>
                                        <div className="">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <img src="./src/assets/images/user.svg" className="w-12" alt="" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-56">
                                                    {loading ? (
                                                        <Skeleton className="h-4 w-[250px]" />
                                                    ) : (
                                                        <DropdownMenuLabel>Xin chào, {user.name}</DropdownMenuLabel>
                                                    )}
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuGroup>
                                                        <DropdownMenuItem>
                                                            <User className="mr-2 h-4 w-4" />
                                                            <Link to="/userprofile">
                                                                <span>Thông tin cá nhân</span>
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <CreditCard className="mr-2 h-4 w-4" />
                                                            <Link>
                                                                <span>Billing</span>
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Settings className="mr-2 h-4 w-4" />
                                                            <Link>
                                                                <span>Cài đặt</span>
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuGroup>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>
                                                        <LogOut className="mr-2 h-4 w-4" />
                                                        <span onClick={logout}>Đăng xuất</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </div>
                                {/* // toggle */}
                                <div className="w-[92px] xl:hidden  mx-auto flex items-center justify-center">
                                    <Sheet>
                                        <SheetTrigger>
                                            {/* icons*/}
                                            <div className="navbar-icons flex items-center gap-2 xl:mx-3 my-5">
                                                <div className="cursor-pointer">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <img src="./src/assets/images/user.svg" className="w-20" alt="" />
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent className="w-56">
                                                            {loading ? (
                                                                <Skeleton className="mr-2 h-4 w-4" />
                                                            ) : (
                                                                <DropdownMenuLabel>Xin chào, {user.name}</DropdownMenuLabel>
                                                            )}
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuGroup>
                                                                <DropdownMenuItem>
                                                                    <User className="mr-2 h-4 w-4" />
                                                                    <span>Profile</span>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem>
                                                                    <CreditCard className="mr-2 h-4 w-4" />
                                                                    <span>Billing</span>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem>
                                                                    <Settings className="mr-2 h-4 w-4" />
                                                                    <span>Settings</span>
                                                                </DropdownMenuItem>
                                                            </DropdownMenuGroup>

                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem>
                                                                <LogOut className="mr-2 h-4 w-4" />
                                                                <span onClick={logout}>Log out</span>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                                <div className="">
                                                    <Link to='/cart'>
                                                        <img src="./src/assets/images/cart.svg" className="w-20" alt="" />
                                                    </Link>
                                                </div>
                                                <div className="flex items-center">
                                                    <box-icon name='menu'></box-icon>
                                                </div>
                                            </div>
                                        </SheetTrigger>
                                        <SheetContent>
                                            <SheetHeader>
                                                <SheetTitle>
                                                    <div className="p-4 flex justify-between items-center border-b-[1px]">
                                                        <div className="logo">
                                                            <img src="./src/assets/images/antlearn.png" alt="Edumall Logo" className=" w-20 h-14 object-cover" />
                                                        </div>
                                                        <div className="flex gap-3">
                                                            <div className="navbar-language cursor-pointer">
                                                                <img src="./src/assets/images/language.svg" className="w-7" alt="" />
                                                            </div>
                                                            <div className="">
                                                                <div className="navbar-noti cursor-pointer">
                                                                    <Link to="/instructor">
                                                                        <img src="./src/assets/images/notification.svg" className="w-7" alt="" />
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </SheetTitle>
                                                <SheetDescription>

                                                    {/* nav list */}
                                                    <ul className="max-xl:pt-3 gap-3 text-base xl:text-base text-left">
                                                        <li className="max-xl:mb-4">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger>
                                                                    <Link to="/courses" className="hover:text-gray-500 border-none">
                                                                        Khóa học
                                                                    </Link>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent>
                                                                    <div className="px-5">
                                                                        <div className="top">
                                                                            <DropdownMenuLabel className=" text-base text-blue-900 uppercase font-bold">Loại</DropdownMenuLabel>
                                                                            <div className=" duration-300 cursor-pointer">
                                                                                <DropdownMenuItem>
                                                                                    <Link to="/courses" className="flex gap-3 hover:text-yellow-400 duration-300  py-1 rounded-md">
                                                                                        <svg width="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 8C4 5.17157 4 3.75736 4.87868 2.87868C5.75736 2 7.17157 2 10 2H14C16.8284 2 18.2426 2 19.1213 2.87868C20 3.75736 20 5.17157 20 8V16C20 18.8284 20 20.2426 19.1213 21.1213C18.2426 22 16.8284 22 14 22H10C7.17157 22 5.75736 22 4.87868 21.1213C4 20.2426 4 18.8284 4 16V8Z" stroke="currentColor" strokeWidth="2"></path><path d="M19.8978 16H7.89778C6.96781 16 6.50282 16 6.12132 16.1022C5.08604 16.3796 4.2774 17.1883 4 18.2235" stroke="currentColor" strokeWidth="2"></path><path d="M8 7H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path><path d="M8 10.5H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path></svg>
                                                                                        <span className="font-semibold text-base">Tất cả khóa học</span>
                                                                                    </Link>
                                                                                </DropdownMenuItem>

                                                                            </div>
                                                                        </div>
                                                                        <div className="bottom">
                                                                            <DropdownMenuLabel className="text-base text-blue-900 uppercase font-bold">Danh mục</DropdownMenuLabel>
                                                                            {renderCategories()}
                                                                        </div>
                                                                    </div>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </li>
                                                        <li className="max-xl:mb-4">
                                                            <Link to="/contact" className="hover:text-gray-500">
                                                                Liên hệ
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link to="/blog" className="hover:text-gray-500">
                                                                Bài viết
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </SheetDescription>
                                            </SheetHeader>
                                        </SheetContent>
                                    </Sheet>
                                </div>
                            </>

                        </>
                    ) : (
                        <>
                            {/* header - content */}
                            <div className="navbar-content  bg-white xl:flex xl:items-center px-5 max-xl:w-full xl:block hidden">
                                <ul className="max-xl:pt-3 gap-4 font-semibold flex text-base xl:text-base w-full items-center justify-center">
                                    <li className="max-xl:mb-4">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <Link to="/courses" className="hover:text-gray-500 border-none">
                                                    Khóa học
                                                </Link>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <div className="grid grid-cols-2 gap-3 ">
                                                    <div className="grid-1 border-r border-gray-100 px-5">
                                                        <DropdownMenuLabel className="text-base text-blue-900 uppercase font-bold">Loại</DropdownMenuLabel>
                                                        <div className=" duration-300 cursor-pointer">
                                                            <DropdownMenuItem>
                                                                <Link to="/courses" className="flex gap-3 hover:text-yellow-400 duration-300 py-1 rounded-md">
                                                                    <svg width="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 8C4 5.17157 4 3.75736 4.87868 2.87868C5.75736 2 7.17157 2 10 2H14C16.8284 2 18.2426 2 19.1213 2.87868C20 3.75736 20 5.17157 20 8V16C20 18.8284 20 20.2426 19.1213 21.1213C18.2426 22 16.8284 22 14 22H10C7.17157 22 5.75736 22 4.87868 21.1213C4 20.2426 4 18.8284 4 16V8Z" stroke="currentColor" strokeWidth="2"></path><path d="M19.8978 16H7.89778C6.96781 16 6.50282 16 6.12132 16.1022C5.08604 16.3796 4.2774 17.1883 4 18.2235" stroke="currentColor" strokeWidth="2"></path><path d="M8 7H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path><path d="M8 10.5H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path></svg>
                                                                    <span className="font-semibold text-base">Tất cả khóa học</span>
                                                                </Link>
                                                            </DropdownMenuItem>

                                                        </div>
                                                    </div>
                                                    <div className="grid-2 px-5">
                                                        <DropdownMenuLabel className=" text-base text-blue-900 uppercase font-bold">Danh mục</DropdownMenuLabel>
                                                        {renderCategories()}
                                                    </div>
                                                </div>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </li>
                                    <li>
                                        <Link to="/contact" className={`p-3 rounded ${isContactPage ? "bg-yellow-100 " : "hover:bg-gray-100"}`}>
                                            Liên hệ
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/blog" className={` p-3 rounded ${isBlogPage ? "bg-yellow-100" : "hover:bg-gray-100"}`}>
                                            Blog
                                        </Link>
                                    </li>
                                </ul>
                                <div className="navbar-icons flex items-center gap-2 xl:mx-3">
                                    <div className="navbar-noti cursor-pointer">
                                        <Link to="/instructor">
                                            <img src="./src/assets/images/notification.svg" className="w-16" alt="" />
                                        </Link>

                                    </div>
                                    <div className="navbar-language cursor-pointer">
                                        <img src="./src/assets/images/language.svg" className="w-16" alt="" />
                                    </div>
                                    <div className="">
                                        <Link to='/cart'>
                                            <img src="./src/assets/images/cart.svg" className="w-16" alt="" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="xl:flex max-xl:flex-col items-center gap-1">
                                    <div className="navbar-login max-xl:mb-2">
                                        <Link to="/login">
                                            <button className="w-28 py-2  border rounded-3xl font-semibold border-gray-400 p-1 hover:border-1 hover:border-white hover:bg-black hover:text-white duration-300">
                                                Đăng nhập
                                            </button>
                                        </Link>
                                    </div>
                                    <div className="navbar-register">
                                        <Link to="/register">
                                            <button className="w-24 py-2 border rounded-3xl font-semibold p-1 bg-yellow-500 hover:border-1 hover:border-black hover:bg-black hover:text-white duration-300">
                                                Đăng ký
                                            </button>
                                        </Link>
                                    </div>
                                </div>


                            </div>
                            {/* // toggle */}
                            <div className="w-[92px] xl:hidden  mx-auto flex items-center justify-center">
                                <Sheet>
                                    <SheetTrigger>
                                        {/* icons*/}
                                        <div className="navbar-icons flex items-center gap-2 xl:mx-3 my-5">
                                            <div className="navbar-noti cursor-pointer">
                                                <Link to="/instructor">
                                                    <img src="./src/assets/images/notification.svg" className="w-16" alt="" />
                                                </Link>
                                            </div>
                                            <div className="">
                                                <Link to='/cart'>
                                                    <img src="./src/assets/images/cart.svg" className="w-16" alt="" />
                                                </Link>
                                            </div>
                                            <div className="flex items-center">
                                                <box-icon name='menu'></box-icon>
                                            </div>
                                        </div>

                                    </SheetTrigger>
                                    <SheetContent>
                                        <SheetHeader>
                                            <SheetTitle>
                                                <div className="p-4 flex justify-between items-center border-b-[1px]">
                                                    <div className="logo ">
                                                        <img src="./src/assets/images/antlearn.png" alt="Edumall Logo" className="w-20 h-14 object-cover" />
                                                    </div>
                                                    <div className="navbar-language cursor-pointer">
                                                        <img src="./src/assets/images/language.svg" className="w-7" alt="" />
                                                    </div>
                                                </div>
                                            </SheetTitle>
                                            <SheetDescription>

                                                {/* nav list */}
                                                <ul className="max-xl:pt-3 gap-3 text-base xl:text-base text-left">
                                                    <li className="max-xl:mb-4">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger>
                                                                <Link to="/courses" className="hover:text-gray-500 border-none">
                                                                    Khóa học
                                                                </Link>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent>
                                                                <div className="px-5">
                                                                    <div className="top">
                                                                        <DropdownMenuLabel className=" text-base text-blue-900 uppercase font-bold">Loại</DropdownMenuLabel>
                                                                        <div className=" duration-300 cursor-pointer">
                                                                            <DropdownMenuItem>
                                                                                <Link to="/courses" className="flex gap-3 hover:text-yellow-400 duration-300  py-1 rounded-md">
                                                                                    <svg width="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 8C4 5.17157 4 3.75736 4.87868 2.87868C5.75736 2 7.17157 2 10 2H14C16.8284 2 18.2426 2 19.1213 2.87868C20 3.75736 20 5.17157 20 8V16C20 18.8284 20 20.2426 19.1213 21.1213C18.2426 22 16.8284 22 14 22H10C7.17157 22 5.75736 22 4.87868 21.1213C4 20.2426 4 18.8284 4 16V8Z" stroke="currentColor" strokeWidth="2"></path><path d="M19.8978 16H7.89778C6.96781 16 6.50282 16 6.12132 16.1022C5.08604 16.3796 4.2774 17.1883 4 18.2235" stroke="currentColor" strokeWidth="2"></path><path d="M8 7H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path><path d="M8 10.5H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path></svg>
                                                                                    <span className="font-semibold text-base">Tất cả khóa học</span>
                                                                                </Link>
                                                                            </DropdownMenuItem>

                                                                        </div>
                                                                    </div>
                                                                    <div className="bottom">
                                                                        <DropdownMenuLabel className="text-base text-blue-900 uppercase font-bold">Danh mục</DropdownMenuLabel>
                                                                        {renderCategories()}
                                                                    </div>
                                                                </div>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </li>
                                                    <li className="max-xl:mb-4">
                                                        <Link to="/contact" className="hover:text-gray-500">
                                                            Liên hệ
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link to="/blog" className="hover:text-gray-500">
                                                            Bài viết
                                                        </Link>
                                                    </li>
                                                </ul>

                                                <div className="xl:flex max-xl:flex-col items-center my-5">
                                                    <div className="navbar-login max-xl:mb-2">
                                                        <Link to="/login">
                                                            <button className="w-full py-2 me-3 border rounded-3xl font-semibold border-gray-400 p-1 hover:border-1 hover:border-white hover:bg-black hover:text-white duration-300">
                                                                Đăng nhập
                                                            </button>
                                                        </Link>
                                                    </div>
                                                    <div className="navbar-register">
                                                        <Link to="/register">
                                                            <button className="w-full py-2 me-3 border rounded-3xl font-semibold p-1 bg-yellow-500 hover:border-1 hover:border-black hover:bg-black hover:text-white duration-300">
                                                                Đăng ký
                                                            </button>
                                                        </Link>
                                                    </div>
                                                </div>


                                            </SheetDescription>
                                        </SheetHeader>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </>
                    )}

                </nav>
            </header>
            <hr />
        </>
    );
}

