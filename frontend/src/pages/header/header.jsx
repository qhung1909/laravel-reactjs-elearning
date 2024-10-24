import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";

import {
    CreditCard,
    LogOut,
    Settings,
    User,
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

export const Header = () => {
    const {searchValue,setSearchValue,filteredProducts,isOpen,setIsOpen,debouncedFetchSearchResults} = useContext(CoursesContext);
    const { categories } = useContext(CategoriesContext);
    const { user, logined, logout, refreshToken } = useContext(UserContext);
    const location = useLocation();
    const [loadingLogout, setLoadingLogout] = useState(false);
    const isBlogPage = location.pathname === "/blog";
    const isContactPage = location.pathname === "/contact";
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


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

    useEffect(() => {
        setSearchValue("");
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
                    <div key={item.slug} className="duration-300 cursor-pointer py-1">
                        <DropdownMenuItem>
                            <Link className="flex gap-3 hover:text-yellow-400 duration-300 py-1 rounded-md">
                                <img src={categoryImage} className="w-5" alt={item.name} />
                                <span className="font-semibold text-base">{item.name}</span>
                            </Link>
                        </DropdownMenuItem>
                    </div>
                );
            })
        ) : (
            <p>Không có danh mục phù hợp ngay lúc này, thử lại sau</p>
        );
    };
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
                                    onKeyDown={handleKeyPress}  // Đổi từ onKeyPress sang onKeyDown
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
                                                        Hãy nhập để tìm
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
                                                            <DropdownMenuItem className="flex justify-center items-center">
                                                                <div className="">
                                                                    <svg width="184" height="152" viewBox="0 0 184 152" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><g transform="translate(24 31.67)"><ellipse fillOpacity=".8" fill="#F5F5F7" cx="67.797" cy="106.89" rx="67.797" ry="12.668"></ellipse><path d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z" fill="#AEB8C2"></path><path d="M101.537 86.214L80.63 61.102c-1.001-1.207-2.507-1.867-4.048-1.867H31.724c-1.54 0-3.047.66-4.048 1.867L6.769 86.214v13.792h94.768V86.214z" fill="url(#linearGradient-1)" transform="translate(13.56)"></path><path d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z" fill="#F5F5F7"></path><path d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z" fill="#DCE0E6"></path></g><path d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z" fill="#DCE0E6"></path><g transform="translate(149.65 15.383)" fill="#FFF"><ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815"></ellipse><path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z"></path></g></g></svg>
                                                                    <p className="text-center text-blue-900 font-medium">Chưa có thông báo</p>
                                                                </div>
                                                            </DropdownMenuItem>
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
                                                                            }
                                                                        }}
                                                                    >
                                                                        Thông tin cá nhân
                                                                    </span>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem>
                                                                    <CreditCard className="mr-2 h-4 w-4" />
                                                                    <span className="cursor-pointer">Billing</span>
                                                                </DropdownMenuItem>
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
                                                                                    <DropdownMenuItem className="flex justify-center items-center">
                                                                                        <div className="">
                                                                                            <svg width="184" height="152" viewBox="0 0 184 152" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><g transform="translate(24 31.67)"><ellipse fillOpacity=".8" fill="#F5F5F7" cx="67.797" cy="106.89" rx="67.797" ry="12.668"></ellipse><path d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z" fill="#AEB8C2"></path><path d="M101.537 86.214L80.63 61.102c-1.001-1.207-2.507-1.867-4.048-1.867H31.724c-1.54 0-3.047.66-4.048 1.867L6.769 86.214v13.792h94.768V86.214z" fill="url(#linearGradient-1)" transform="translate(13.56)"></path><path d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z" fill="#F5F5F7"></path><path d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z" fill="#DCE0E6"></path></g><path d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z" fill="#DCE0E6"></path><g transform="translate(149.65 15.383)" fill="#FFF"><ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815"></ellipse><path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z"></path></g></g></svg>
                                                                                            <p className="text-center text-blue-900 font-medium">Chưa có thông báo</p>
                                                                                        </div>
                                                                                    </DropdownMenuItem>
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
                                                        <DropdownMenuItem className="flex justify-center items-center">
                                                            <div className="">
                                                                <svg width="184" height="152" viewBox="0 0 184 152" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><g transform="translate(24 31.67)"><ellipse fillOpacity=".8" fill="#F5F5F7" cx="67.797" cy="106.89" rx="67.797" ry="12.668"></ellipse><path d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z" fill="#AEB8C2"></path><path d="M101.537 86.214L80.63 61.102c-1.001-1.207-2.507-1.867-4.048-1.867H31.724c-1.54 0-3.047.66-4.048 1.867L6.769 86.214v13.792h94.768V86.214z" fill="url(#linearGradient-1)" transform="translate(13.56)"></path><path d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z" fill="#F5F5F7"></path><path d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z" fill="#DCE0E6"></path></g><path d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z" fill="#DCE0E6"></path><g transform="translate(149.65 15.383)" fill="#FFF"><ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815"></ellipse><path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z"></path></g></g></svg>
                                                                <p className="text-center text-blue-900 font-medium">Chưa có thông báo</p>
                                                            </div>
                                                        </DropdownMenuItem>
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
                                                                            <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/cart.svg" className="w-4" alt="" />
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
                                                                <DropdownMenuItem className="flex justify-center items-center">
                                                                    <div className="">
                                                                        <svg width="184" height="152" viewBox="0 0 184 152" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><g transform="translate(24 31.67)"><ellipse fillOpacity=".8" fill="#F5F5F7" cx="67.797" cy="106.89" rx="67.797" ry="12.668"></ellipse><path d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z" fill="#AEB8C2"></path><path d="M101.537 86.214L80.63 61.102c-1.001-1.207-2.507-1.867-4.048-1.867H31.724c-1.54 0-3.047.66-4.048 1.867L6.769 86.214v13.792h94.768V86.214z" fill="url(#linearGradient-1)" transform="translate(13.56)"></path><path d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z" fill="#F5F5F7"></path><path d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z" fill="#DCE0E6"></path></g><path d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z" fill="#DCE0E6"></path><g transform="translate(149.65 15.383)" fill="#FFF"><ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815"></ellipse><path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z"></path></g></g></svg>
                                                                        <p className="text-center text-blue-900 font-medium">Chưa có thông báo</p>
                                                                    </div>
                                                                </DropdownMenuItem>
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
            </header>
            <hr />
        </>
    );
}

