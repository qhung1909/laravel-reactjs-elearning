import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";

import {
    CreditCard,
    LogOut,
    Settings,
    User,
    BookOpen
} from "lucide-react"
import './header.css'
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
import { Command, CommandInput, CommandList } from "@/components/ui/command"
import { Skeleton } from "@/components/ui/skeleton"
import { UserContext } from "../context/usercontext";
import { CategoriesContext } from "../context/categoriescontext";
import { CoursesContext } from "../context/coursescontext";
import axios from "axios";
import { myCourses } from "../myCourses/myCourses";
export const Header = () => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;
    const { searchValue, setSearchValue, filteredProducts, isOpen, setIsOpen, debouncedFetchSearchResults } = useContext(CoursesContext);
    const { categories } = useContext(CategoriesContext);
    const { user, logined, logout, refreshToken } = useContext(UserContext);
    const { courses, fetchCourses } = useContext(CoursesContext);
    const location = useLocation();
    const [loadingLogout, setLoadingLogout] = useState(false);
    const isBlogPage = location.pathname === "/blog";
    const isContactPage = location.pathname === "/contact";
    const [loading, setLoading] = useState(false);
    const [myCourse, setMyCourse] = useState([]);
    const navigate = useNavigate();




    const handleLoginRedirect = () => {
        sessionStorage.setItem('previousPage', location.pathname);
    };


    const handleInputChange = (value) => {
        setSearchValue(value);
        debouncedFetchSearchResults(value, 3);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && searchValue.trim() !== "") {
            e.preventDefault();
            setIsOpen(false);
            navigate(`/courses?search=${encodeURIComponent(searchValue.trim())}`);
            setSearchValue("");
        }
    };

    // hàm xử lý khóa học của users
    const fetchMyCourse = async () => {
        const token = localStorage.getItem("access_token");
        try {
            const res = await axios.get(`${API_URL}/auth/enrolls`, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                },
            });
            setMyCourse(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    // hàm xử lý khóa học users
    const renderMyCourses = () => {
        return loading ? (
            <div className="flex flex-wrap justify-center items-center">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div className="bg-gray-100 h-10 w-20 rounded-lg animate-pulse mx-2" key={index}></div>
                ))}
            </div>
        ) : Array.isArray(myCourse) && myCourse.length > 0 ? (
            myCourse.map((item, index) => {
                return (
                    <DropdownMenuItem key={index}  >
                        <div className=" ">
                            <div className="grid grid-cols-5 gap-3 mb-2">
                                {/* ảnh */}
                                <div className="col-span-2">
                                    <img
                                        src={courses.find(c => c.course_id === item.course_id)?.img}
                                        className="h-20 w-36 rounded-xl"
                                        alt=""
                                    />
                                </div>
                                {/* tên khóa học */}
                                <div className="col-span-3">
                                    <div>
                                        <span className="text-base font-semibold line-clamp-2">
                                            {courses.find(c => c.course_id === item.course_id)?.title}
                                        </span>
                                    </div>
                                    <div>
                                        <Link to={`/lesson/${courses.find(c => c.course_id === item.course_id)?.slug}`}>
                                            <p className="text-yellow-500 font-semibold">Bắt đầu học</p>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DropdownMenuItem>


                );
            })
        ) : null
    };


    useEffect(() => {
        setSearchValue("");
        fetchMyCourse();
        setIsOpen(false);
    }, [location.search]);

    const categoryImages = {
        javascript: "https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/javascript.svg",
        python: "https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/python.svg",
        reactjs: "https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/reactjs.svg",
        angular: "https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/angular.svg",
        css: "https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/css.svg",
        html: "https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/html.svg",
        next: "https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/next.svg",
        asp: "https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/asp.svg",
        nodejs: "https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/nodejs.svg",
    };

    // Hàm xử lý danh mục
    const handleCategoryClick = (slug) => {
        navigate(`/courses?category=${slug}`);
    };

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

    // hàm xử lý danh mục
    const renderCategories = () => {
        return loading ? (
            <div className="flex flex-wrap justify-center items-center">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div className="bg-gray-100 h-10 w-20 rounded-lg animate-pulse mx-2" key={index}></div>
                ))}
            </div>
        ) : Array.isArray(categories) && categories.length > 0 ? (
            categories.map((item) => {
                const categoryImage = categoryImages[item.slug] || "/src/assets/images/default.svg";
                return (
                    <div key={item.slug} className="duration-300 cursor-pointer py-1" onClick={() => handleCategoryClick(item.slug)}>
                        <DropdownMenuItem>
                            <a className="cursor-pointer flex gap-3 hover:text-yellow-400 duration-300 py-1 rounded-md">
                                <img src={categoryImage} className="w-5" alt={item.name} />
                                <span className="font-semibold text-base">{item.name}</span>
                            </a>
                        </DropdownMenuItem>
                    </div>
                );
            })
        ) : (
            <p>Không có danh mục phù hợp ngay lúc này, thử lại sau</p>
        );
    };
    useEffect(() => {
        fetchCourses();
    }, []);
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
                    <div className="navbar-search xl:w-3/5 xl:px-0 sm:w-3/4 w-2/3 p-2">
                        <div className="w-full relative">
                            <Command className="rounded-full shadow-sm border w-full ">
                                <CommandInput
                                    placeholder="Tìm kiếm..."
                                    value={searchValue}
                                    onValueChange={handleInputChange}
                                    onFocus={() => setIsOpen(true)}
                                    onBlur={() => {
                                        setTimeout(() => setIsOpen(false), 200);
                                    }}
                                    onKeyDown={handleKeyPress}
                                    className="h-10"
                                />
                                <div className={`absolute w-4/5 bg-white mt-10 ${isOpen ? 'block' : 'hidden'}`}>
                                    <CommandList className="shadow-lg ">
                                        {loading ? (
                                            <div className="rounded-sm border-l border-r border-b shadow-lg p-3 text-gray-400">
                                                Đang tải...
                                            </div>
                                        ) : (
                                            <>
                                                {searchValue && filteredProducts.length === 0 ? (
                                                    <div className="rounded-sm border-l border-r border-b shadow-lg p-3 text-gray-400">
                                                        Không tìm thấy sản phẩm
                                                    </div>
                                                ) : searchValue === '' ? (
                                                    <div className="rounded-sm border-l border-r border-b shadow-lg p-3 text-gray-400">
                                                        Hãy nhập để tìm khóa học phù hợp
                                                    </div>
                                                ) : (
                                                    <div className="search-results h-auto">
                                                        <div className="p-3">
                                                            <p className="font-semibold text-lg text-yellow-300">Kết quả:</p>
                                                        </div>
                                                        {filteredProducts.map((product) => (
                                                            <div
                                                                key={product.id}
                                                                className="search-result-item "
                                                                onClick={() => {
                                                                    console.log('Selected:', product);
                                                                    setIsOpen(false);
                                                                }}
                                                            >

                                                                <div className="result">
                                                                    <Link to={`/detail/${product.slug}`}>
                                                                        <div className="flex items-center gap-3 px-3">
                                                                            <div className="">
                                                                                <img src={`${product.img}`} className="w-32 rounded-md" alt="" />
                                                                            </div>
                                                                            <div className="">
                                                                                <div className="font-semibold">
                                                                                    {product.title}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </Link>

                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </CommandList>
                                </div>
                            </Command>
                        </div>
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
                                    <div className="navbar-icons flex items-center justify-center gap-3 xl:mx-3">
                                        <div className="navbar-noti mt-2 cursor-pointer ">
                                            <DropdownMenu >
                                                <DropdownMenuTrigger>
                                                    <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/notification.svg" className="w-12" alt="" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="rounded-2xl p-3 mr-48 mt-1">
                                                    <div className=" w-96">
                                                        {/* header */}
                                                        <div className="header">
                                                            <DropdownMenuLabel className="text-base text-blue-900 font-bold">
                                                                <div className="flex justify-between items-center">
                                                                    <div className="">
                                                                        Thông báo
                                                                    </div>
                                                                    <div className="">
                                                                        <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/doublecheck.svg" className="w-4" alt="" />
                                                                    </div>
                                                                </div>
                                                            </DropdownMenuLabel>

                                                            {/* content */}
                                                            <DropdownMenuItem>
                                                                <div className="border-yellow-400 border-b-4 pb-2 cursor-pointer flex items-center gap-3 font-semibold text-yellow-400">
                                                                    <p className="text-lg ">Hệ thống</p>
                                                                    <div className="bg-pink-100 py-1 px-2 rounded-full">
                                                                        <p className="">0</p>
                                                                    </div>
                                                                </div>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuLabel className="flex justify-center items-center h-auto">
                                                                <div className=" p-5">
                                                                    <svg width="100%" height="177" viewBox="0 0 139 142" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M71.5016 125.45C104.302 125.45 130.902 99.0496 130.902 66.4496C130.902 33.8496 104.302 7.44958 71.5016 7.44958C38.7016 7.44958 12.1016 33.8496 12.1016 66.4496C12.1016 99.0496 38.7016 125.45 71.5016 125.45Z" fill="#EAEEF9">
                                                                        </path>
                                                                        <path d="M117.002 58.7495V94.8495C117.002 102.35 110.902 108.45 103.302 108.45H39.9017C32.4017 108.45 26.3017 102.45 26.2017 94.9495C26.2017 94.8495 26.2017 94.8495 26.2017 94.7495V58.7495C26.2017 58.6495 26.2017 58.6495 26.2017 58.5495C26.2017 58.3495 26.2017 58.1495 26.3017 57.9495C26.4017 57.6495 26.5017 57.4495 26.6017 57.1495L43.6017 24.6495C44.2017 23.3495 45.5017 22.6495 46.9017 22.6495H96.2017C97.6017 22.6495 98.8017 23.3495 99.5017 24.6495L116.502 57.1495C116.602 57.3495 116.702 57.6495 116.802 57.9495C117.002 58.1495 117.002 58.4495 117.002 58.7495Z" fill="#D5DDEA"></path><g filter="url(#filter0_d_0_17276)"><path d="M117.002 58.7496V98.5496C117.002 104.05 112.602 108.45 107.002 108.45H36.2017C30.7017 108.45 26.2017 104.05 26.2017 98.5496V58.5496C26.2017 58.3496 26.2017 58.1496 26.3017 57.9496H49.1017C52.5017 57.9496 55.3017 60.6496 55.3017 64.1496C55.3017 65.8496 56.0017 67.4496 57.1017 68.5496C58.3017 69.7496 59.7017 70.3496 61.5017 70.3496H81.8017C85.2017 70.3496 88.0017 67.6496 88.0017 64.1496C88.0017 62.4496 88.7017 60.8496 89.8017 59.7496C91.0017 58.5496 92.4017 57.9496 94.1017 57.9496H116.802C117.002 58.1496 117.002 58.4496 117.002 58.7496Z" fill="url(#paint0_linear_0_17276)"></path></g><path d="M129.384 38.2496C131.648 38.2496 133.484 36.4139 133.484 34.1496C133.484 31.8852 131.648 30.0496 129.384 30.0496C127.119 30.0496 125.284 31.8852 125.284 34.1496C125.284 36.4139 127.119 38.2496 129.384 38.2496Z" fill="#EAEEF9"></path><path d="M125.284 24.9496C126.83 24.9496 128.084 23.696 128.084 22.1496C128.084 20.6032 126.83 19.3496 125.284 19.3496C123.737 19.3496 122.484 20.6032 122.484 22.1496C122.484 23.696 123.737 24.9496 125.284 24.9496Z" fill="#EAEEF9"></path><path d="M11.8837 34.1496C13.4301 34.1496 14.6837 32.896 14.6837 31.3496C14.6837 29.8032 13.4301 28.5496 11.8837 28.5496C10.3373 28.5496 9.08374 29.8032 9.08374 31.3496C9.08374 32.896 10.3373 34.1496 11.8837 34.1496Z" fill="#EAEEF9"></path><path d="M5.58379 95.7496C8.45567 95.7496 10.7838 93.4215 10.7838 90.5496C10.7838 87.6777 8.45567 85.3496 5.58379 85.3496C2.71191 85.3496 0.383789 87.6777 0.383789 90.5496C0.383789 93.4215 2.71191 95.7496 5.58379 95.7496Z" fill="#EAEEF9"></path><path d="M96.6216 10.6187C97.9267 24.8658 98.5792 28.1285 95.6244 41.0313C94.6635 43.8998 93.7026 47.0416 91.6435 49.2271C88.7607 52.642 83.5443 54.1446 79.2889 53.0518C74.8961 51.9591 71.327 48.1343 70.5033 43.49C69.817 40.6215 70.7779 37.2065 73.2488 35.4308C75.857 33.7916 79.5634 34.2014 81.7598 36.2504C84.2307 38.2993 85.1916 41.4411 85.0543 44.4462C84.9171 47.4513 83.8189 50.4565 82.3089 53.0518C78.8954 59.4335 77.4901 59.41 70.5034 69.8911" stroke="#ABB5CC" strokeWidth="2" strokeMiterlimit="10" strokeDasharray="4 4"></path><path d="M104.275 5.31244C103.753 7.21624 101.666 7.90853 99.579 6.69702C97.3179 5.65858 95.7525 4.79322 96.1004 3.06249C96.6222 1.33177 98.7093 1.15869 101.144 0.985622C104.101 0.639477 104.623 3.40864 104.275 5.31244Z" fill="#DAE2EB"></path><path d="M87.4039 7.04302C88.2736 8.60068 90.7086 9.63911 92.4479 8.08146C94.3611 6.35073 95.9264 5.13922 95.0568 3.4085C94.1872 1.85084 92.7957 2.37006 89.8389 2.71621C87.4039 3.23542 86.3604 5.3123 87.4039 7.04302Z" fill="#DAE2EB"></path><path d="M95.0569 0.639542C96.2744 0.466469 97.4919 1.15876 97.8397 2.1972C98.0137 2.54334 98.1876 3.06256 98.1876 3.4087C98.5355 5.83172 97.6658 7.90859 96.2744 8.08167C94.709 8.42781 93.1437 6.69708 92.9697 4.44714C92.9697 3.75485 92.9697 3.4087 92.9697 2.88949C93.1437 1.67798 93.8394 0.812615 95.0569 0.639542C95.2308 0.639542 95.0569 0.639542 95.0569 0.639542Z" fill="#989FB0"></path><path d="M60.192 84.7092C61.4591 84.7092 62.4863 83.682 62.4863 82.4149C62.4863 81.1478 61.4591 80.1206 60.192 80.1206C58.9249 80.1206 57.8977 81.1478 57.8977 82.4149C57.8977 83.682 58.9249 84.7092 60.192 84.7092Z" fill="#989FB0"></path><path d="M83.0108 84.7092C84.278 84.7092 85.3051 83.682 85.3051 82.4149C85.3051 81.1478 84.278 80.1206 83.0108 80.1206C81.7437 80.1206 80.7166 81.1478 80.7166 82.4149C80.7166 83.682 81.7437 84.7092 83.0108 84.7092Z" fill="#989FB0"></path><path d="M75.322 99.7772H68.129C67.0129 99.7772 66.0828 98.8471 66.0828 97.731C66.0828 96.6148 67.0129 95.6847 68.129 95.6847H75.2599C76.3761 95.6847 77.3062 96.6148 77.3062 97.731C77.3682 98.8471 76.4381 99.7772 75.322 99.7772Z" fill="#989FB0"></path><defs><filter id="filter0_d_0_17276" x="4.20166" y="46.9496" width="134.8" height="94.5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dy="11"></feOffset><feGaussianBlur stdDeviation="11"></feGaussianBlur><feColorMatrix type="matrix" values="0 0 0 0 0.397708 0 0 0 0 0.47749 0 0 0 0 0.575 0 0 0 0.27 0"></feColorMatrix><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_17276"></feBlend><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_17276" result="shape"></feBlend></filter><linearGradient id="paint0_linear_0_17276" x1="71.5721" y1="56.7815" x2="71.5721" y2="108.994" gradientUnits="userSpaceOnUse"><stop stopColor="#FDFEFF"></stop><stop offset="0.9964" stopColor="#ECF0F5"></stop></linearGradient></defs>
                                                                    </svg>
                                                                    <p className="text-center text-blue-900 font-medium">Chưa có thông báo nào</p>
                                                                </div>
                                                            </DropdownMenuLabel>
                                                        </div>


                                                    </div>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <div className="navbar-language cursor-pointer">
                                            <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/language.svg" className="w-12" alt="" />
                                        </div>
                                        <div className="">
                                            <Link to='/cart'>
                                                <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/cart.svg" className="w-12" alt="" />
                                            </Link>
                                        </div>
                                        <div className="cursor-pointer">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    {/* avatar */}
                                                    {user.avatar ? (
                                                        <img
                                                            src={user.avatar}
                                                            alt="User Avatar"
                                                            className="w-14 h-8 rounded-full"
                                                        />
                                                    ) : (

                                                        <img src="/src/assets/images/user.svg" className="w-12" alt="" />
                                                    )}
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
                                                            {/* <Link to="/userprofile">
                                                                <span>Thông tin cá nhân</span>
                                                            </Link> */}
                                                            <span
                                                                className="cursor-pointer"
                                                                onClick={() => {
                                                                    if (user.role === 'user') {
                                                                        navigate('/user/profile');
                                                                    } else if (user.role === 'teacher') {
                                                                        navigate('/instructor');
                                                                    } else if (user.role === 'admin') {
                                                                        navigate('/admin');
                                                                    }
                                                                }}
                                                            >
                                                                Thông tin cá nhân
                                                            </span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            {/* khóa học của tôi */}
                                                            <DropdownMenu>
                                                                <BookOpen className="mr-2 h-4 w-4" />
                                                                <DropdownMenuTrigger>
                                                                    <span>Khóa học của tôi</span>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent className="rounded-2xl p-3 mr-14 ">
                                                                    <div className=" w-96">
                                                                        {/* header */}
                                                                        <div className="header">
                                                                            <DropdownMenuLabel className="my-3 text-base text-blue-900 font-bold">
                                                                                <div className="flex justify-between items-center">
                                                                                    <div className="">
                                                                                        <p>Khóa học của tôi</p>
                                                                                    </div>
                                                                                    <div className="">
                                                                                        <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/doublecheck.svg" className="w-4" alt="" />
                                                                                    </div>
                                                                                </div>
                                                                            </DropdownMenuLabel>


                                                                            {/* Render khóa học */}
                                                                            <div className="max-h-72 overflow-y-auto">
                                                                            {renderMyCourses()}

                                                                            </div>

                                                                            {/* Nếu không có khóa học */}
                                                                            {!loading && (!Array.isArray(myCourse) || myCourse.length === 0) && (
                                                                                <DropdownMenuLabel className="flex justify-center items-center h-auto">
                                                                                    <div className="p-5">
                                                                                        <svg width="100%" height="177" viewBox="0 0 139 142" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                            <path d="M71.5016 125.45C104.302 125.45 130.902 99.0496 130.902 66.4496C130.902 33.8496 104.302 7.44958 71.5016 7.44958C38.7016 7.44958 12.1016 33.8496 12.1016 66.4496C12.1016 99.0496 38.7016 125.45 71.5016 125.45Z" fill="#EAEEF9">
                                                                                            </path>
                                                                                            <path d="M117.002 58.7495V94.8495C117.002 102.35 110.902 108.45 103.302 108.45H39.9017C32.4017 108.45 26.3017 102.45 26.2017 94.9495C26.2017 94.8495 26.2017 94.8495 26.2017 94.7495V58.7495C26.2017 58.6495 26.2017 58.6495 26.2017 58.5495C26.2017 58.3495 26.2017 58.1495 26.3017 57.9495C26.4017 57.6495 26.5017 57.4495 26.6017 57.1495L43.6017 24.6495C44.2017 23.3495 45.5017 22.6495 46.9017 22.6495H96.2017C97.6017 22.6495 98.8017 23.3495 99.5017 24.6495L116.502 57.1495C116.602 57.3495 116.702 57.6495 116.802 57.9495C117.002 58.1495 117.002 58.4495 117.002 58.7495Z" fill="#D5DDEA"></path><g filter="url(#filter0_d_0_17276)"><path d="M117.002 58.7496V98.5496C117.002 104.05 112.602 108.45 107.002 108.45H36.2017C30.7017 108.45 26.2017 104.05 26.2017 98.5496V58.5496C26.2017 58.3496 26.2017 58.1496 26.3017 57.9496H49.1017C52.5017 57.9496 55.3017 60.6496 55.3017 64.1496C55.3017 65.8496 56.0017 67.4496 57.1017 68.5496C58.3017 69.7496 59.7017 70.3496 61.5017 70.3496H81.8017C85.2017 70.3496 88.0017 67.6496 88.0017 64.1496C88.0017 62.4496 88.7017 60.8496 89.8017 59.7496C91.0017 58.5496 92.4017 57.9496 94.1017 57.9496H116.802C117.002 58.1496 117.002 58.4496 117.002 58.7496Z" fill="url(#paint0_linear_0_17276)"></path></g><path d="M129.384 38.2496C131.648 38.2496 133.484 36.4139 133.484 34.1496C133.484 31.8852 131.648 30.0496 129.384 30.0496C127.119 30.0496 125.284 31.8852 125.284 34.1496C125.284 36.4139 127.119 38.2496 129.384 38.2496Z" fill="#EAEEF9"></path><path d="M125.284 24.9496C126.83 24.9496 128.084 23.696 128.084 22.1496C128.084 20.6032 126.83 19.3496 125.284 19.3496C123.737 19.3496 122.484 20.6032 122.484 22.1496C122.484 23.696 123.737 24.9496 125.284 24.9496Z" fill="#EAEEF9"></path><path d="M11.8837 34.1496C13.4301 34.1496 14.6837 32.896 14.6837 31.3496C14.6837 29.8032 13.4301 28.5496 11.8837 28.5496C10.3373 28.5496 9.08374 29.8032 9.08374 31.3496C9.08374 32.896 10.3373 34.1496 11.8837 34.1496Z" fill="#EAEEF9"></path><path d="M5.58379 95.7496C8.45567 95.7496 10.7838 93.4215 10.7838 90.5496C10.7838 87.6777 8.45567 85.3496 5.58379 85.3496C2.71191 85.3496 0.383789 87.6777 0.383789 90.5496C0.383789 93.4215 2.71191 95.7496 5.58379 95.7496Z" fill="#EAEEF9"></path><path d="M96.6216 10.6187C97.9267 24.8658 98.5792 28.1285 95.6244 41.0313C94.6635 43.8998 93.7026 47.0416 91.6435 49.2271C88.7607 52.642 83.5443 54.1446 79.2889 53.0518C74.8961 51.9591 71.327 48.1343 70.5033 43.49C69.817 40.6215 70.7779 37.2065 73.2488 35.4308C75.857 33.7916 79.5634 34.2014 81.7598 36.2504C84.2307 38.2993 85.1916 41.4411 85.0543 44.4462C84.9171 47.4513 83.8189 50.4565 82.3089 53.0518C78.8954 59.4335 77.4901 59.41 70.5034 69.8911" stroke="#ABB5CC" strokeWidth="2" strokeMiterlimit="10" strokeDasharray="4 4"></path><path d="M104.275 5.31244C103.753 7.21624 101.666 7.90853 99.579 6.69702C97.3179 5.65858 95.7525 4.79322 96.1004 3.06249C96.6222 1.33177 98.7093 1.15869 101.144 0.985622C104.101 0.639477 104.623 3.40864 104.275 5.31244Z" fill="#DAE2EB"></path><path d="M87.4039 7.04302C88.2736 8.60068 90.7086 9.63911 92.4479 8.08146C94.3611 6.35073 95.9264 5.13922 95.0568 3.4085C94.1872 1.85084 92.7957 2.37006 89.8389 2.71621C87.4039 3.23542 86.3604 5.3123 87.4039 7.04302Z" fill="#DAE2EB"></path><path d="M95.0569 0.639542C96.2744 0.466469 97.4919 1.15876 97.8397 2.1972C98.0137 2.54334 98.1876 3.06256 98.1876 3.4087C98.5355 5.83172 97.6658 7.90859 96.2744 8.08167C94.709 8.42781 93.1437 6.69708 92.9697 4.44714C92.9697 3.75485 92.9697 3.4087 92.9697 2.88949C93.1437 1.67798 93.8394 0.812615 95.0569 0.639542C95.2308 0.639542 95.0569 0.639542 95.0569 0.639542Z" fill="#989FB0"></path><path d="M60.192 84.7092C61.4591 84.7092 62.4863 83.682 62.4863 82.4149C62.4863 81.1478 61.4591 80.1206 60.192 80.1206C58.9249 80.1206 57.8977 81.1478 57.8977 82.4149C57.8977 83.682 58.9249 84.7092 60.192 84.7092Z" fill="#989FB0"></path><path d="M83.0108 84.7092C84.278 84.7092 85.3051 83.682 85.3051 82.4149C85.3051 81.1478 84.278 80.1206 83.0108 80.1206C81.7437 80.1206 80.7166 81.1478 80.7166 82.4149C80.7166 83.682 81.7437 84.7092 83.0108 84.7092Z" fill="#989FB0"></path><path d="M75.322 99.7772H68.129C67.0129 99.7772 66.0828 98.8471 66.0828 97.731C66.0828 96.6148 67.0129 95.6847 68.129 95.6847H75.2599C76.3761 95.6847 77.3062 96.6148 77.3062 97.731C77.3682 98.8471 76.4381 99.7772 75.322 99.7772Z" fill="#989FB0"></path><defs><filter id="filter0_d_0_17276" x="4.20166" y="46.9496" width="134.8" height="94.5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dy="11"></feOffset><feGaussianBlur stdDeviation="11"></feGaussianBlur><feColorMatrix type="matrix" values="0 0 0 0 0.397708 0 0 0 0 0.47749 0 0 0 0 0.575 0 0 0 0.27 0"></feColorMatrix><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_17276"></feBlend><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_17276" result="shape"></feBlend></filter><linearGradient id="paint0_linear_0_17276" x1="71.5721" y1="56.7815" x2="71.5721" y2="108.994" gradientUnits="userSpaceOnUse"><stop stopColor="#FDFEFF"></stop><stop offset="0.9964" stopColor="#ECF0F5"></stop></linearGradient></defs>
                                                                                        </svg>
                                                                                        <p className="text-center text-blue-900 font-medium">Bạn chưa có khóa học nào</p>
                                                                                    </div>
                                                                                </DropdownMenuLabel>
                                                                            )}

                                                                        </div>

                                                                    </div>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
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
                                                        <span className="cursor-pointer" onClick={handleLogout}>Đăng xuất</span>
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
                                                <div className="">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            {user.avatar ? (
                                                                <img
                                                                    src={user.avatar}
                                                                    alt="User Avatar"
                                                                    className="w-24 h-7 object-cover rounded-full"
                                                                />
                                                            ) : (
                                                                <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/user.svg" className="w-20" alt="" />
                                                            )}
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
                                                                    <span
                                                                        className="cursor-pointer"
                                                                        onClick={() => {
                                                                            if (user.role === 'user') {
                                                                                navigate('/user/profile');
                                                                            } else if (user.role === 'teacher') {
                                                                                navigate('/instructor');
                                                                            } else if (user.role === 'admin') {
                                                                                navigate('/admin');
                                                                            }
                                                                        }}
                                                                    >
                                                                        Thông tin cá nhân
                                                                    </span>
                                                                </DropdownMenuItem>

                                                                {/* Billing */}
                                                                <DropdownMenuItem>
                                                                    <CreditCard className="mr-2 h-4 w-4" />
                                                                    <span className="cursor-pointer">Billing</span>
                                                                </DropdownMenuItem>

                                                                {/* Khóa học của tôi */}
                                                                <DropdownMenuItem>
                                                                    <DropdownMenu >
                                                                        <BookOpen className="mr-2 h-4 w-4" />
                                                                        <DropdownMenuTrigger>
                                                                            <span>Khóa học của tôi</span>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent className="rounded-2xl p-3">
                                                                            <div className=" w-96">
                                                                                {/* header */}
                                                                                <div className="header">
                                                                                    <DropdownMenuLabel className="text-base text-blue-900 font-bold">
                                                                                        <div className="flex justify-between items-center">
                                                                                            <div className="">
                                                                                                Khóa học của tôi
                                                                                            </div>
                                                                                            <div className="">
                                                                                                <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/doublecheck.svg" className="w-4" alt="" />
                                                                                            </div>
                                                                                        </div>
                                                                                    </DropdownMenuLabel>

                                                                                    {/* content */}
                                                                                    <DropdownMenuItem>
                                                                                        <div className="border-yellow-400 border-b-4 pb-2 cursor-pointer flex items-center gap-3 font-semibold text-yellow-400">
                                                                                            <p className="text-lg ">Hệ thống</p>
                                                                                            <div className="bg-pink-100 py-1 px-2 rounded-full">
                                                                                                <p className="">0</p>
                                                                                            </div>
                                                                                        </div>
                                                                                    </DropdownMenuItem>
                                                                                    <DropdownMenuLabel className="flex justify-center items-center h-auto">
                                                                                        <div className=" p-5">
                                                                                            <svg width="100%" height="177" viewBox="0 0 139 142" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                                <path d="M71.5016 125.45C104.302 125.45 130.902 99.0496 130.902 66.4496C130.902 33.8496 104.302 7.44958 71.5016 7.44958C38.7016 7.44958 12.1016 33.8496 12.1016 66.4496C12.1016 99.0496 38.7016 125.45 71.5016 125.45Z" fill="#EAEEF9">
                                                                                                </path>
                                                                                                <path d="M117.002 58.7495V94.8495C117.002 102.35 110.902 108.45 103.302 108.45H39.9017C32.4017 108.45 26.3017 102.45 26.2017 94.9495C26.2017 94.8495 26.2017 94.8495 26.2017 94.7495V58.7495C26.2017 58.6495 26.2017 58.6495 26.2017 58.5495C26.2017 58.3495 26.2017 58.1495 26.3017 57.9495C26.4017 57.6495 26.5017 57.4495 26.6017 57.1495L43.6017 24.6495C44.2017 23.3495 45.5017 22.6495 46.9017 22.6495H96.2017C97.6017 22.6495 98.8017 23.3495 99.5017 24.6495L116.502 57.1495C116.602 57.3495 116.702 57.6495 116.802 57.9495C117.002 58.1495 117.002 58.4495 117.002 58.7495Z" fill="#D5DDEA"></path><g filter="url(#filter0_d_0_17276)"><path d="M117.002 58.7496V98.5496C117.002 104.05 112.602 108.45 107.002 108.45H36.2017C30.7017 108.45 26.2017 104.05 26.2017 98.5496V58.5496C26.2017 58.3496 26.2017 58.1496 26.3017 57.9496H49.1017C52.5017 57.9496 55.3017 60.6496 55.3017 64.1496C55.3017 65.8496 56.0017 67.4496 57.1017 68.5496C58.3017 69.7496 59.7017 70.3496 61.5017 70.3496H81.8017C85.2017 70.3496 88.0017 67.6496 88.0017 64.1496C88.0017 62.4496 88.7017 60.8496 89.8017 59.7496C91.0017 58.5496 92.4017 57.9496 94.1017 57.9496H116.802C117.002 58.1496 117.002 58.4496 117.002 58.7496Z" fill="url(#paint0_linear_0_17276)"></path></g><path d="M129.384 38.2496C131.648 38.2496 133.484 36.4139 133.484 34.1496C133.484 31.8852 131.648 30.0496 129.384 30.0496C127.119 30.0496 125.284 31.8852 125.284 34.1496C125.284 36.4139 127.119 38.2496 129.384 38.2496Z" fill="#EAEEF9"></path><path d="M125.284 24.9496C126.83 24.9496 128.084 23.696 128.084 22.1496C128.084 20.6032 126.83 19.3496 125.284 19.3496C123.737 19.3496 122.484 20.6032 122.484 22.1496C122.484 23.696 123.737 24.9496 125.284 24.9496Z" fill="#EAEEF9"></path><path d="M11.8837 34.1496C13.4301 34.1496 14.6837 32.896 14.6837 31.3496C14.6837 29.8032 13.4301 28.5496 11.8837 28.5496C10.3373 28.5496 9.08374 29.8032 9.08374 31.3496C9.08374 32.896 10.3373 34.1496 11.8837 34.1496Z" fill="#EAEEF9"></path><path d="M5.58379 95.7496C8.45567 95.7496 10.7838 93.4215 10.7838 90.5496C10.7838 87.6777 8.45567 85.3496 5.58379 85.3496C2.71191 85.3496 0.383789 87.6777 0.383789 90.5496C0.383789 93.4215 2.71191 95.7496 5.58379 95.7496Z" fill="#EAEEF9"></path><path d="M96.6216 10.6187C97.9267 24.8658 98.5792 28.1285 95.6244 41.0313C94.6635 43.8998 93.7026 47.0416 91.6435 49.2271C88.7607 52.642 83.5443 54.1446 79.2889 53.0518C74.8961 51.9591 71.327 48.1343 70.5033 43.49C69.817 40.6215 70.7779 37.2065 73.2488 35.4308C75.857 33.7916 79.5634 34.2014 81.7598 36.2504C84.2307 38.2993 85.1916 41.4411 85.0543 44.4462C84.9171 47.4513 83.8189 50.4565 82.3089 53.0518C78.8954 59.4335 77.4901 59.41 70.5034 69.8911" stroke="#ABB5CC" strokeWidth="2" strokeMiterlimit="10" strokeDasharray="4 4"></path><path d="M104.275 5.31244C103.753 7.21624 101.666 7.90853 99.579 6.69702C97.3179 5.65858 95.7525 4.79322 96.1004 3.06249C96.6222 1.33177 98.7093 1.15869 101.144 0.985622C104.101 0.639477 104.623 3.40864 104.275 5.31244Z" fill="#DAE2EB"></path><path d="M87.4039 7.04302C88.2736 8.60068 90.7086 9.63911 92.4479 8.08146C94.3611 6.35073 95.9264 5.13922 95.0568 3.4085C94.1872 1.85084 92.7957 2.37006 89.8389 2.71621C87.4039 3.23542 86.3604 5.3123 87.4039 7.04302Z" fill="#DAE2EB"></path><path d="M95.0569 0.639542C96.2744 0.466469 97.4919 1.15876 97.8397 2.1972C98.0137 2.54334 98.1876 3.06256 98.1876 3.4087C98.5355 5.83172 97.6658 7.90859 96.2744 8.08167C94.709 8.42781 93.1437 6.69708 92.9697 4.44714C92.9697 3.75485 92.9697 3.4087 92.9697 2.88949C93.1437 1.67798 93.8394 0.812615 95.0569 0.639542C95.2308 0.639542 95.0569 0.639542 95.0569 0.639542Z" fill="#989FB0"></path><path d="M60.192 84.7092C61.4591 84.7092 62.4863 83.682 62.4863 82.4149C62.4863 81.1478 61.4591 80.1206 60.192 80.1206C58.9249 80.1206 57.8977 81.1478 57.8977 82.4149C57.8977 83.682 58.9249 84.7092 60.192 84.7092Z" fill="#989FB0"></path><path d="M83.0108 84.7092C84.278 84.7092 85.3051 83.682 85.3051 82.4149C85.3051 81.1478 84.278 80.1206 83.0108 80.1206C81.7437 80.1206 80.7166 81.1478 80.7166 82.4149C80.7166 83.682 81.7437 84.7092 83.0108 84.7092Z" fill="#989FB0"></path><path d="M75.322 99.7772H68.129C67.0129 99.7772 66.0828 98.8471 66.0828 97.731C66.0828 96.6148 67.0129 95.6847 68.129 95.6847H75.2599C76.3761 95.6847 77.3062 96.6148 77.3062 97.731C77.3682 98.8471 76.4381 99.7772 75.322 99.7772Z" fill="#989FB0"></path><defs><filter id="filter0_d_0_17276" x="4.20166" y="46.9496" width="134.8" height="94.5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dy="11"></feOffset><feGaussianBlur stdDeviation="11"></feGaussianBlur><feColorMatrix type="matrix" values="0 0 0 0 0.397708 0 0 0 0 0.47749 0 0 0 0 0.575 0 0 0 0.27 0"></feColorMatrix><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_17276"></feBlend><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_17276" result="shape"></feBlend></filter><linearGradient id="paint0_linear_0_17276" x1="71.5721" y1="56.7815" x2="71.5721" y2="108.994" gradientUnits="userSpaceOnUse"><stop stopColor="#FDFEFF"></stop><stop offset="0.9964" stopColor="#ECF0F5"></stop></linearGradient></defs>
                                                                                            </svg>
                                                                                            <p className="text-center text-blue-900 font-medium">Chưa có thông báo nào</p>
                                                                                        </div>
                                                                                    </DropdownMenuLabel>
                                                                                </div>


                                                                            </div>
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                </DropdownMenuItem>

                                                                {/* Cài đặt */}
                                                                <DropdownMenuItem>
                                                                    <Settings className="mr-2 h-4 w-4" />
                                                                    <span className="cursor-pointer">Cài đặt</span>
                                                                </DropdownMenuItem>

                                                            </DropdownMenuGroup>

                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem>
                                                                <LogOut className="mr-2 h-4 w-4" />
                                                                <span className="cursor-pointer" onClick={logout}>Đăng xuất</span>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                                <div className="">
                                                    <Link to='/cart'>
                                                        <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/cart.svg" className="w-24" alt="" />
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
                                                            <img src="/src/assets/images/antlearn.png" alt="Edumall Logo" className=" w-20 h-14 object-cover" />
                                                        </div>
                                                        <div className="flex gap-3">
                                                            <div className="navbar-language cursor-pointer">
                                                                <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/language.svg" className="w-7" alt="" />
                                                            </div>
                                                            <div className="">
                                                                <div className="navbar-noti cursor-pointer ">
                                                                    <DropdownMenu >
                                                                        <DropdownMenuTrigger>
                                                                            <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/notification.svg" className="w-7" alt="" />
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent className="rounded-2xl p-3 mr-14 mt-1">
                                                                            <div className=" w-96">
                                                                                {/* header */}
                                                                                <div className="header">
                                                                                    <DropdownMenuLabel className="text-base text-blue-900 font-bold">
                                                                                        <div className="flex justify-between items-center">
                                                                                            <div className="">
                                                                                                Thông báo
                                                                                            </div>
                                                                                            <div className="">
                                                                                                <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/doublecheck.svg" className="w-4" alt="" />
                                                                                            </div>
                                                                                        </div>
                                                                                    </DropdownMenuLabel>

                                                                                    {/* content */}
                                                                                    <DropdownMenuItem>
                                                                                        <div className="border-yellow-400 border-b-4 pb-2 cursor-pointer flex items-center gap-3 font-semibold text-yellow-400">
                                                                                            <p className="text-lg ">Hệ thống</p>
                                                                                            <div className="bg-pink-100 py-1 px-2 rounded-full">
                                                                                                <p className="">0</p>
                                                                                            </div>
                                                                                        </div>
                                                                                    </DropdownMenuItem>
                                                                                    <DropdownMenuLabel className="flex justify-center items-center h-auto">
                                                                                        <div className=" p-5">
                                                                                            <svg width="100%" height="177" viewBox="0 0 139 142" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                                <path d="M71.5016 125.45C104.302 125.45 130.902 99.0496 130.902 66.4496C130.902 33.8496 104.302 7.44958 71.5016 7.44958C38.7016 7.44958 12.1016 33.8496 12.1016 66.4496C12.1016 99.0496 38.7016 125.45 71.5016 125.45Z" fill="#EAEEF9">
                                                                                                </path>
                                                                                                <path d="M117.002 58.7495V94.8495C117.002 102.35 110.902 108.45 103.302 108.45H39.9017C32.4017 108.45 26.3017 102.45 26.2017 94.9495C26.2017 94.8495 26.2017 94.8495 26.2017 94.7495V58.7495C26.2017 58.6495 26.2017 58.6495 26.2017 58.5495C26.2017 58.3495 26.2017 58.1495 26.3017 57.9495C26.4017 57.6495 26.5017 57.4495 26.6017 57.1495L43.6017 24.6495C44.2017 23.3495 45.5017 22.6495 46.9017 22.6495H96.2017C97.6017 22.6495 98.8017 23.3495 99.5017 24.6495L116.502 57.1495C116.602 57.3495 116.702 57.6495 116.802 57.9495C117.002 58.1495 117.002 58.4495 117.002 58.7495Z" fill="#D5DDEA"></path><g filter="url(#filter0_d_0_17276)"><path d="M117.002 58.7496V98.5496C117.002 104.05 112.602 108.45 107.002 108.45H36.2017C30.7017 108.45 26.2017 104.05 26.2017 98.5496V58.5496C26.2017 58.3496 26.2017 58.1496 26.3017 57.9496H49.1017C52.5017 57.9496 55.3017 60.6496 55.3017 64.1496C55.3017 65.8496 56.0017 67.4496 57.1017 68.5496C58.3017 69.7496 59.7017 70.3496 61.5017 70.3496H81.8017C85.2017 70.3496 88.0017 67.6496 88.0017 64.1496C88.0017 62.4496 88.7017 60.8496 89.8017 59.7496C91.0017 58.5496 92.4017 57.9496 94.1017 57.9496H116.802C117.002 58.1496 117.002 58.4496 117.002 58.7496Z" fill="url(#paint0_linear_0_17276)"></path></g><path d="M129.384 38.2496C131.648 38.2496 133.484 36.4139 133.484 34.1496C133.484 31.8852 131.648 30.0496 129.384 30.0496C127.119 30.0496 125.284 31.8852 125.284 34.1496C125.284 36.4139 127.119 38.2496 129.384 38.2496Z" fill="#EAEEF9"></path><path d="M125.284 24.9496C126.83 24.9496 128.084 23.696 128.084 22.1496C128.084 20.6032 126.83 19.3496 125.284 19.3496C123.737 19.3496 122.484 20.6032 122.484 22.1496C122.484 23.696 123.737 24.9496 125.284 24.9496Z" fill="#EAEEF9"></path><path d="M11.8837 34.1496C13.4301 34.1496 14.6837 32.896 14.6837 31.3496C14.6837 29.8032 13.4301 28.5496 11.8837 28.5496C10.3373 28.5496 9.08374 29.8032 9.08374 31.3496C9.08374 32.896 10.3373 34.1496 11.8837 34.1496Z" fill="#EAEEF9"></path><path d="M5.58379 95.7496C8.45567 95.7496 10.7838 93.4215 10.7838 90.5496C10.7838 87.6777 8.45567 85.3496 5.58379 85.3496C2.71191 85.3496 0.383789 87.6777 0.383789 90.5496C0.383789 93.4215 2.71191 95.7496 5.58379 95.7496Z" fill="#EAEEF9"></path><path d="M96.6216 10.6187C97.9267 24.8658 98.5792 28.1285 95.6244 41.0313C94.6635 43.8998 93.7026 47.0416 91.6435 49.2271C88.7607 52.642 83.5443 54.1446 79.2889 53.0518C74.8961 51.9591 71.327 48.1343 70.5033 43.49C69.817 40.6215 70.7779 37.2065 73.2488 35.4308C75.857 33.7916 79.5634 34.2014 81.7598 36.2504C84.2307 38.2993 85.1916 41.4411 85.0543 44.4462C84.9171 47.4513 83.8189 50.4565 82.3089 53.0518C78.8954 59.4335 77.4901 59.41 70.5034 69.8911" stroke="#ABB5CC" strokeWidth="2" strokeMiterlimit="10" strokeDasharray="4 4"></path><path d="M104.275 5.31244C103.753 7.21624 101.666 7.90853 99.579 6.69702C97.3179 5.65858 95.7525 4.79322 96.1004 3.06249C96.6222 1.33177 98.7093 1.15869 101.144 0.985622C104.101 0.639477 104.623 3.40864 104.275 5.31244Z" fill="#DAE2EB"></path><path d="M87.4039 7.04302C88.2736 8.60068 90.7086 9.63911 92.4479 8.08146C94.3611 6.35073 95.9264 5.13922 95.0568 3.4085C94.1872 1.85084 92.7957 2.37006 89.8389 2.71621C87.4039 3.23542 86.3604 5.3123 87.4039 7.04302Z" fill="#DAE2EB"></path><path d="M95.0569 0.639542C96.2744 0.466469 97.4919 1.15876 97.8397 2.1972C98.0137 2.54334 98.1876 3.06256 98.1876 3.4087C98.5355 5.83172 97.6658 7.90859 96.2744 8.08167C94.709 8.42781 93.1437 6.69708 92.9697 4.44714C92.9697 3.75485 92.9697 3.4087 92.9697 2.88949C93.1437 1.67798 93.8394 0.812615 95.0569 0.639542C95.2308 0.639542 95.0569 0.639542 95.0569 0.639542Z" fill="#989FB0"></path><path d="M60.192 84.7092C61.4591 84.7092 62.4863 83.682 62.4863 82.4149C62.4863 81.1478 61.4591 80.1206 60.192 80.1206C58.9249 80.1206 57.8977 81.1478 57.8977 82.4149C57.8977 83.682 58.9249 84.7092 60.192 84.7092Z" fill="#989FB0"></path><path d="M83.0108 84.7092C84.278 84.7092 85.3051 83.682 85.3051 82.4149C85.3051 81.1478 84.278 80.1206 83.0108 80.1206C81.7437 80.1206 80.7166 81.1478 80.7166 82.4149C80.7166 83.682 81.7437 84.7092 83.0108 84.7092Z" fill="#989FB0"></path><path d="M75.322 99.7772H68.129C67.0129 99.7772 66.0828 98.8471 66.0828 97.731C66.0828 96.6148 67.0129 95.6847 68.129 95.6847H75.2599C76.3761 95.6847 77.3062 96.6148 77.3062 97.731C77.3682 98.8471 76.4381 99.7772 75.322 99.7772Z" fill="#989FB0"></path><defs><filter id="filter0_d_0_17276" x="4.20166" y="46.9496" width="134.8" height="94.5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dy="11"></feOffset><feGaussianBlur stdDeviation="11"></feGaussianBlur><feColorMatrix type="matrix" values="0 0 0 0 0.397708 0 0 0 0 0.47749 0 0 0 0 0.575 0 0 0 0.27 0"></feColorMatrix><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_17276"></feBlend><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_17276" result="shape"></feBlend></filter><linearGradient id="paint0_linear_0_17276" x1="71.5721" y1="56.7815" x2="71.5721" y2="108.994" gradientUnits="userSpaceOnUse"><stop stopColor="#FDFEFF"></stop><stop offset="0.9964" stopColor="#ECF0F5"></stop></linearGradient></defs>
                                                                                            </svg>
                                                                                            <p className="text-center text-blue-900 font-medium">Chưa có thông báo nào</p>
                                                                                        </div>
                                                                                    </DropdownMenuLabel>
                                                                                </div>


                                                                            </div>
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
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
                                                                    <Link className="hover:text-gray-500 border-none">
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
                                    <div className="navbar-noti cursor-pointer mt-2 ">
                                        <DropdownMenu >
                                            <DropdownMenuTrigger>
                                                <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/notification.svg" className="w-16" alt="" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="rounded-2xl p-3 mr-80 mt-1">
                                                <div className=" w-96">
                                                    {/* header */}
                                                    <div className="header">
                                                        <DropdownMenuLabel className="text-base text-blue-900 font-bold">
                                                            <div className="flex justify-between items-center">
                                                                <div className="">
                                                                    Thông báo
                                                                </div>
                                                                <div className="">
                                                                    <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/doublecheck.svg" className="w-4" alt="" />
                                                                </div>
                                                            </div>
                                                        </DropdownMenuLabel>

                                                        {/* content */}
                                                        <DropdownMenuItem>
                                                            <div className="border-yellow-400 border-b-4 pb-2 cursor-pointer flex items-center gap-3 font-semibold text-yellow-400">
                                                                <p className="text-lg ">Hệ thống</p>
                                                                <div className="bg-pink-100 py-1 px-2 rounded-full">
                                                                    <p className="">0</p>
                                                                </div>
                                                            </div>
                                                        </DropdownMenuItem>

                                                        <DropdownMenuLabel className="flex justify-center items-center h-auto">
                                                            <div className=" p-5">
                                                                <svg width="100%" height="177" viewBox="0 0 139 142" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M71.5016 125.45C104.302 125.45 130.902 99.0496 130.902 66.4496C130.902 33.8496 104.302 7.44958 71.5016 7.44958C38.7016 7.44958 12.1016 33.8496 12.1016 66.4496C12.1016 99.0496 38.7016 125.45 71.5016 125.45Z" fill="#EAEEF9">
                                                                    </path>
                                                                    <path d="M117.002 58.7495V94.8495C117.002 102.35 110.902 108.45 103.302 108.45H39.9017C32.4017 108.45 26.3017 102.45 26.2017 94.9495C26.2017 94.8495 26.2017 94.8495 26.2017 94.7495V58.7495C26.2017 58.6495 26.2017 58.6495 26.2017 58.5495C26.2017 58.3495 26.2017 58.1495 26.3017 57.9495C26.4017 57.6495 26.5017 57.4495 26.6017 57.1495L43.6017 24.6495C44.2017 23.3495 45.5017 22.6495 46.9017 22.6495H96.2017C97.6017 22.6495 98.8017 23.3495 99.5017 24.6495L116.502 57.1495C116.602 57.3495 116.702 57.6495 116.802 57.9495C117.002 58.1495 117.002 58.4495 117.002 58.7495Z" fill="#D5DDEA"></path><g filter="url(#filter0_d_0_17276)"><path d="M117.002 58.7496V98.5496C117.002 104.05 112.602 108.45 107.002 108.45H36.2017C30.7017 108.45 26.2017 104.05 26.2017 98.5496V58.5496C26.2017 58.3496 26.2017 58.1496 26.3017 57.9496H49.1017C52.5017 57.9496 55.3017 60.6496 55.3017 64.1496C55.3017 65.8496 56.0017 67.4496 57.1017 68.5496C58.3017 69.7496 59.7017 70.3496 61.5017 70.3496H81.8017C85.2017 70.3496 88.0017 67.6496 88.0017 64.1496C88.0017 62.4496 88.7017 60.8496 89.8017 59.7496C91.0017 58.5496 92.4017 57.9496 94.1017 57.9496H116.802C117.002 58.1496 117.002 58.4496 117.002 58.7496Z" fill="url(#paint0_linear_0_17276)"></path></g><path d="M129.384 38.2496C131.648 38.2496 133.484 36.4139 133.484 34.1496C133.484 31.8852 131.648 30.0496 129.384 30.0496C127.119 30.0496 125.284 31.8852 125.284 34.1496C125.284 36.4139 127.119 38.2496 129.384 38.2496Z" fill="#EAEEF9"></path><path d="M125.284 24.9496C126.83 24.9496 128.084 23.696 128.084 22.1496C128.084 20.6032 126.83 19.3496 125.284 19.3496C123.737 19.3496 122.484 20.6032 122.484 22.1496C122.484 23.696 123.737 24.9496 125.284 24.9496Z" fill="#EAEEF9"></path><path d="M11.8837 34.1496C13.4301 34.1496 14.6837 32.896 14.6837 31.3496C14.6837 29.8032 13.4301 28.5496 11.8837 28.5496C10.3373 28.5496 9.08374 29.8032 9.08374 31.3496C9.08374 32.896 10.3373 34.1496 11.8837 34.1496Z" fill="#EAEEF9"></path><path d="M5.58379 95.7496C8.45567 95.7496 10.7838 93.4215 10.7838 90.5496C10.7838 87.6777 8.45567 85.3496 5.58379 85.3496C2.71191 85.3496 0.383789 87.6777 0.383789 90.5496C0.383789 93.4215 2.71191 95.7496 5.58379 95.7496Z" fill="#EAEEF9"></path><path d="M96.6216 10.6187C97.9267 24.8658 98.5792 28.1285 95.6244 41.0313C94.6635 43.8998 93.7026 47.0416 91.6435 49.2271C88.7607 52.642 83.5443 54.1446 79.2889 53.0518C74.8961 51.9591 71.327 48.1343 70.5033 43.49C69.817 40.6215 70.7779 37.2065 73.2488 35.4308C75.857 33.7916 79.5634 34.2014 81.7598 36.2504C84.2307 38.2993 85.1916 41.4411 85.0543 44.4462C84.9171 47.4513 83.8189 50.4565 82.3089 53.0518C78.8954 59.4335 77.4901 59.41 70.5034 69.8911" stroke="#ABB5CC" strokeWidth="2" strokeMiterlimit="10" strokeDasharray="4 4"></path><path d="M104.275 5.31244C103.753 7.21624 101.666 7.90853 99.579 6.69702C97.3179 5.65858 95.7525 4.79322 96.1004 3.06249C96.6222 1.33177 98.7093 1.15869 101.144 0.985622C104.101 0.639477 104.623 3.40864 104.275 5.31244Z" fill="#DAE2EB"></path><path d="M87.4039 7.04302C88.2736 8.60068 90.7086 9.63911 92.4479 8.08146C94.3611 6.35073 95.9264 5.13922 95.0568 3.4085C94.1872 1.85084 92.7957 2.37006 89.8389 2.71621C87.4039 3.23542 86.3604 5.3123 87.4039 7.04302Z" fill="#DAE2EB"></path><path d="M95.0569 0.639542C96.2744 0.466469 97.4919 1.15876 97.8397 2.1972C98.0137 2.54334 98.1876 3.06256 98.1876 3.4087C98.5355 5.83172 97.6658 7.90859 96.2744 8.08167C94.709 8.42781 93.1437 6.69708 92.9697 4.44714C92.9697 3.75485 92.9697 3.4087 92.9697 2.88949C93.1437 1.67798 93.8394 0.812615 95.0569 0.639542C95.2308 0.639542 95.0569 0.639542 95.0569 0.639542Z" fill="#989FB0"></path><path d="M60.192 84.7092C61.4591 84.7092 62.4863 83.682 62.4863 82.4149C62.4863 81.1478 61.4591 80.1206 60.192 80.1206C58.9249 80.1206 57.8977 81.1478 57.8977 82.4149C57.8977 83.682 58.9249 84.7092 60.192 84.7092Z" fill="#989FB0"></path><path d="M83.0108 84.7092C84.278 84.7092 85.3051 83.682 85.3051 82.4149C85.3051 81.1478 84.278 80.1206 83.0108 80.1206C81.7437 80.1206 80.7166 81.1478 80.7166 82.4149C80.7166 83.682 81.7437 84.7092 83.0108 84.7092Z" fill="#989FB0"></path><path d="M75.322 99.7772H68.129C67.0129 99.7772 66.0828 98.8471 66.0828 97.731C66.0828 96.6148 67.0129 95.6847 68.129 95.6847H75.2599C76.3761 95.6847 77.3062 96.6148 77.3062 97.731C77.3682 98.8471 76.4381 99.7772 75.322 99.7772Z" fill="#989FB0"></path><defs><filter id="filter0_d_0_17276" x="4.20166" y="46.9496" width="134.8" height="94.5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dy="11"></feOffset><feGaussianBlur stdDeviation="11"></feGaussianBlur><feColorMatrix type="matrix" values="0 0 0 0 0.397708 0 0 0 0 0.47749 0 0 0 0 0.575 0 0 0 0.27 0"></feColorMatrix><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_17276"></feBlend><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_17276" result="shape"></feBlend></filter><linearGradient id="paint0_linear_0_17276" x1="71.5721" y1="56.7815" x2="71.5721" y2="108.994" gradientUnits="userSpaceOnUse"><stop stopColor="#FDFEFF"></stop><stop offset="0.9964" stopColor="#ECF0F5"></stop></linearGradient></defs>
                                                                </svg>
                                                                <p className="text-center text-blue-900 font-medium">Đăng nhập để nhận thông báo</p>
                                                            </div>
                                                        </DropdownMenuLabel>
                                                    </div>


                                                </div>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="navbar-language cursor-pointer">
                                        <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/language.svg" className="w-16" alt="" />
                                    </div>
                                    <div className="">
                                        <Link to='/cart'>
                                            <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/cart.svg" className="w-16" alt="" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="xl:flex max-xl:flex-col items-center gap-1">
                                    <div className="navbar-login max-xl:mb-2">
                                        <Link to="/login">
                                            <button onClick={handleLoginRedirect} className="w-28 py-2  border rounded-3xl font-semibold border-gray-400 p-1 hover:border-1 hover:border-white hover:bg-black hover:text-white duration-300">
                                                Đăng nhập
                                            </button>
                                        </Link>
                                    </div>
                                    <div className="navbar-register">
                                        <Link to="/register">
                                            <button onClick={handleLoginRedirect} className="w-24 py-2 border rounded-3xl font-semibold p-1 bg-yellow-500 hover:border-1 hover:border-black hover:bg-black hover:text-white duration-300">
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
                                        <div className="navbar-icons flex items-center justify-center gap-2 xl:mx-3 my-5">
                                            <div className="navbar-noti cursor-pointer mt-2">
                                                <DropdownMenu >
                                                    <DropdownMenuTrigger>
                                                        <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/notification.svg" className="w-14" alt="" />
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="rounded-2xl p-3 mr-20 mt-1">
                                                        <div className=" w-96">
                                                            {/* header */}
                                                            <div className="header">
                                                                <DropdownMenuLabel className="text-base text-blue-900 font-bold">
                                                                    <div className="flex justify-between items-center">
                                                                        <div className="">
                                                                            Thông báo
                                                                        </div>
                                                                        <div className="">

                                                                            <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/doublecheck.svg" className="w-4" alt="" />
                                                                        </div>
                                                                    </div>
                                                                </DropdownMenuLabel>

                                                                {/* content */}
                                                                <DropdownMenuItem>
                                                                    <div className="border-yellow-400 border-b-4 pb-2 cursor-pointer flex items-center gap-3 font-semibold text-yellow-400">
                                                                        <p className="text-lg ">Hệ thống</p>
                                                                        <div className="bg-pink-100 py-1 px-2 rounded-full">
                                                                            <p className="">0</p>
                                                                        </div>
                                                                    </div>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuLabel className="flex justify-center items-center h-auto">
                                                                    <div className=" p-5">
                                                                        <svg width="100%" height="177" viewBox="0 0 139 142" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M71.5016 125.45C104.302 125.45 130.902 99.0496 130.902 66.4496C130.902 33.8496 104.302 7.44958 71.5016 7.44958C38.7016 7.44958 12.1016 33.8496 12.1016 66.4496C12.1016 99.0496 38.7016 125.45 71.5016 125.45Z" fill="#EAEEF9">
                                                                            </path>
                                                                            <path d="M117.002 58.7495V94.8495C117.002 102.35 110.902 108.45 103.302 108.45H39.9017C32.4017 108.45 26.3017 102.45 26.2017 94.9495C26.2017 94.8495 26.2017 94.8495 26.2017 94.7495V58.7495C26.2017 58.6495 26.2017 58.6495 26.2017 58.5495C26.2017 58.3495 26.2017 58.1495 26.3017 57.9495C26.4017 57.6495 26.5017 57.4495 26.6017 57.1495L43.6017 24.6495C44.2017 23.3495 45.5017 22.6495 46.9017 22.6495H96.2017C97.6017 22.6495 98.8017 23.3495 99.5017 24.6495L116.502 57.1495C116.602 57.3495 116.702 57.6495 116.802 57.9495C117.002 58.1495 117.002 58.4495 117.002 58.7495Z" fill="#D5DDEA"></path><g filter="url(#filter0_d_0_17276)"><path d="M117.002 58.7496V98.5496C117.002 104.05 112.602 108.45 107.002 108.45H36.2017C30.7017 108.45 26.2017 104.05 26.2017 98.5496V58.5496C26.2017 58.3496 26.2017 58.1496 26.3017 57.9496H49.1017C52.5017 57.9496 55.3017 60.6496 55.3017 64.1496C55.3017 65.8496 56.0017 67.4496 57.1017 68.5496C58.3017 69.7496 59.7017 70.3496 61.5017 70.3496H81.8017C85.2017 70.3496 88.0017 67.6496 88.0017 64.1496C88.0017 62.4496 88.7017 60.8496 89.8017 59.7496C91.0017 58.5496 92.4017 57.9496 94.1017 57.9496H116.802C117.002 58.1496 117.002 58.4496 117.002 58.7496Z" fill="url(#paint0_linear_0_17276)"></path></g><path d="M129.384 38.2496C131.648 38.2496 133.484 36.4139 133.484 34.1496C133.484 31.8852 131.648 30.0496 129.384 30.0496C127.119 30.0496 125.284 31.8852 125.284 34.1496C125.284 36.4139 127.119 38.2496 129.384 38.2496Z" fill="#EAEEF9"></path><path d="M125.284 24.9496C126.83 24.9496 128.084 23.696 128.084 22.1496C128.084 20.6032 126.83 19.3496 125.284 19.3496C123.737 19.3496 122.484 20.6032 122.484 22.1496C122.484 23.696 123.737 24.9496 125.284 24.9496Z" fill="#EAEEF9"></path><path d="M11.8837 34.1496C13.4301 34.1496 14.6837 32.896 14.6837 31.3496C14.6837 29.8032 13.4301 28.5496 11.8837 28.5496C10.3373 28.5496 9.08374 29.8032 9.08374 31.3496C9.08374 32.896 10.3373 34.1496 11.8837 34.1496Z" fill="#EAEEF9"></path><path d="M5.58379 95.7496C8.45567 95.7496 10.7838 93.4215 10.7838 90.5496C10.7838 87.6777 8.45567 85.3496 5.58379 85.3496C2.71191 85.3496 0.383789 87.6777 0.383789 90.5496C0.383789 93.4215 2.71191 95.7496 5.58379 95.7496Z" fill="#EAEEF9"></path><path d="M96.6216 10.6187C97.9267 24.8658 98.5792 28.1285 95.6244 41.0313C94.6635 43.8998 93.7026 47.0416 91.6435 49.2271C88.7607 52.642 83.5443 54.1446 79.2889 53.0518C74.8961 51.9591 71.327 48.1343 70.5033 43.49C69.817 40.6215 70.7779 37.2065 73.2488 35.4308C75.857 33.7916 79.5634 34.2014 81.7598 36.2504C84.2307 38.2993 85.1916 41.4411 85.0543 44.4462C84.9171 47.4513 83.8189 50.4565 82.3089 53.0518C78.8954 59.4335 77.4901 59.41 70.5034 69.8911" stroke="#ABB5CC" strokeWidth="2" strokeMiterlimit="10" strokeDasharray="4 4"></path><path d="M104.275 5.31244C103.753 7.21624 101.666 7.90853 99.579 6.69702C97.3179 5.65858 95.7525 4.79322 96.1004 3.06249C96.6222 1.33177 98.7093 1.15869 101.144 0.985622C104.101 0.639477 104.623 3.40864 104.275 5.31244Z" fill="#DAE2EB"></path><path d="M87.4039 7.04302C88.2736 8.60068 90.7086 9.63911 92.4479 8.08146C94.3611 6.35073 95.9264 5.13922 95.0568 3.4085C94.1872 1.85084 92.7957 2.37006 89.8389 2.71621C87.4039 3.23542 86.3604 5.3123 87.4039 7.04302Z" fill="#DAE2EB"></path><path d="M95.0569 0.639542C96.2744 0.466469 97.4919 1.15876 97.8397 2.1972C98.0137 2.54334 98.1876 3.06256 98.1876 3.4087C98.5355 5.83172 97.6658 7.90859 96.2744 8.08167C94.709 8.42781 93.1437 6.69708 92.9697 4.44714C92.9697 3.75485 92.9697 3.4087 92.9697 2.88949C93.1437 1.67798 93.8394 0.812615 95.0569 0.639542C95.2308 0.639542 95.0569 0.639542 95.0569 0.639542Z" fill="#989FB0"></path><path d="M60.192 84.7092C61.4591 84.7092 62.4863 83.682 62.4863 82.4149C62.4863 81.1478 61.4591 80.1206 60.192 80.1206C58.9249 80.1206 57.8977 81.1478 57.8977 82.4149C57.8977 83.682 58.9249 84.7092 60.192 84.7092Z" fill="#989FB0"></path><path d="M83.0108 84.7092C84.278 84.7092 85.3051 83.682 85.3051 82.4149C85.3051 81.1478 84.278 80.1206 83.0108 80.1206C81.7437 80.1206 80.7166 81.1478 80.7166 82.4149C80.7166 83.682 81.7437 84.7092 83.0108 84.7092Z" fill="#989FB0"></path><path d="M75.322 99.7772H68.129C67.0129 99.7772 66.0828 98.8471 66.0828 97.731C66.0828 96.6148 67.0129 95.6847 68.129 95.6847H75.2599C76.3761 95.6847 77.3062 96.6148 77.3062 97.731C77.3682 98.8471 76.4381 99.7772 75.322 99.7772Z" fill="#989FB0"></path><defs><filter id="filter0_d_0_17276" x="4.20166" y="46.9496" width="134.8" height="94.5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dy="11"></feOffset><feGaussianBlur stdDeviation="11"></feGaussianBlur><feColorMatrix type="matrix" values="0 0 0 0 0.397708 0 0 0 0 0.47749 0 0 0 0 0.575 0 0 0 0.27 0"></feColorMatrix><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_17276"></feBlend><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_17276" result="shape"></feBlend></filter><linearGradient id="paint0_linear_0_17276" x1="71.5721" y1="56.7815" x2="71.5721" y2="108.994" gradientUnits="userSpaceOnUse"><stop stopColor="#FDFEFF"></stop><stop offset="0.9964" stopColor="#ECF0F5"></stop></linearGradient></defs>
                                                                        </svg>
                                                                        <p className="text-center text-blue-900 font-medium">Đăng nhập để nhận thông báo</p>
                                                                    </div>
                                                                </DropdownMenuLabel>
                                                            </div>


                                                        </div>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                            <div className="">
                                                <Link to='/cart'>
                                                    <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/cart.svg" className="w-16" alt="" />
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
                                                        <img src="/src/assets/images/antlearn.png" alt="Edumall Logo" className="w-20 h-14 object-cover" />
                                                    </div>
                                                    <div className="navbar-language cursor-pointer">
                                                        <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/language.svg" className="w-7" alt="" />
                                                    </div>
                                                </div>
                                            </SheetTitle>
                                            <SheetDescription>

                                                {/* nav list */}
                                                <ul className="max-xl:pt-3 gap-3 text-base xl:text-base text-left">
                                                    <li className="max-xl:mb-4">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger>
                                                                <Link className="hover:text-gray-500 border-none">
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
            </header >
            <hr />
        </>
    );
}

