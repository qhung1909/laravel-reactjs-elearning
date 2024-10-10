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
export const InstructorLesson = () =>{
    return (
        <>
             <section className="instructor-home">
                <div className="flex bg-gray-100 h-sc">
                    {/* Sidebar */}
                    <div className=" w-72 bg-white shadow-md border-gray-100 border-r-[1px] lg:block hidden">
                        <div className="pe-3">
                            {/* logo */}
                            <div className="p-4 flex justify-between items-center">
                                <div className="logo">
                                    <img src="./src/assets/images/antlearn.png" alt="Edumall Logo" className="w-28 h-20" />
                                </div>
                                <div className="logout">
                                    <svg width="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="duration-200 ease-out transition transform">
                                        <rect width="36" height="36" rx="10" fill="#F9F9FB"></rect><g clipPath="url(#clip0_2285_3955)">
                                            <path d="M15.5015 13.8337C15.5116 12.0211 15.5919 11.0395 16.2322 10.3992C16.9645 9.66699 18.143 9.66699 20.5 9.66699L21.3334 9.66699C23.6904 9.66699 24.8689 9.66699 25.6011 10.3992C26.3334 11.1315 26.3334 12.31 26.3334 14.667L26.3334 21.3337C26.3334 23.6907 26.3334 24.8692 25.6011 25.6014C24.8689 26.3337 23.6904 26.3337 21.3334 26.3337L20.5 26.3337C18.143 26.3337 16.9645 26.3337 16.2322 25.6014C15.5919 24.9611 15.5116 23.9795 15.5015 22.167" stroke="#B9C0D4" strokeWidth="1.5" strokeLinecap="round"></path><path d="M20.5 18L9.66667 18M9.66667 18L12.5833 15.5M9.66667 18L12.5833 20.5" stroke="#B9C0D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></g><defs><clipPath id="clip0_2285_3955"><rect x="8" y="8" width="20" height="20" rx="5" fill="white">
                                            </rect></clipPath></defs>
                                    </svg>
                                </div>
                            </div>
                            {/* ul list */}
                            <ul className="">
                                <li className="mb-3">
                                    <a href="#" className="flex items-center px-4 py-2 rounded-2xl text-gray-700 bg-gray-100">
                                        <div className=" bg-yellow-400 mr-3 pt-1 px-1  rounded-full">
                                            <box-icon   box-icon name='sidebar' color='#ffffff' ></box-icon>
                                        </div>
                                        <p className="font-semibold text-lg">Bảng điều khiển</p>
                                    </a>
                                </li>
                                <li className="mb-3">
                                    <a href="#" className="flex items-center px-4 py-2 rounded-2xl  text-gray-600 hover:bg-gray-100">
                                        <div className="mr-3 pt-1 px-1 rounded-full">
                                            <box-icon name='book-open'></box-icon>
                                        </div>
                                        <p className="font-semibold text-lg">Bài học của tôi</p>
                                    </a>
                                </li>
                                <li className="mb-3">
                                    <a href="#" className="flex items-center px-4 py-2 rounded-2xl  text-gray-600 hover:bg-gray-100">
                                        <div className=" mr-3 pt-1 px-1 rounded-full">
                                            <box-icon name='credit-card' ></box-icon>
                                        </div>
                                        <p className="font-semibold text-lg">Lịch sử mua hàng</p>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100">
                                        <div className=" mr-3 pt-1 px-1 rounded-full">
                                            <box-icon type='solid' name='user-circle'></box-icon>
                                        </div>
                                        <p className="font-semibold text-lg">Thông tin tài khoản</p>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Header */}
                        <div className="bg-white shadow-sm p-2">
                            <div className="flex items-center justify-between px-4 py-3">
                                <h1 className="text-xl font-semibold">Trang chủ</h1>
                                <div className="flex items-center space-x-4">
                                    <button className="p-1 rounded-full hover:bg-gray-100">
                                        <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                    </button>
                                    <button className="p-1 rounded-full hover:bg-gray-100">
                                        <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </button>
                                    <div className="flex items-center gap-3">
                                        {/* avatar */}
                                        <Avatar>
                                            <AvatarImage src="./src/assets/images/doremon.jpg" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>

                                        {/* user control */}
                                        <div className="text-left">
                                            <span className="font-medium text-sm">Chấn Toàn</span>
                                            <br />
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <div className="flex items-center">
                                                        <p className="text-gray-600 text-sm">Giảng viên</p>
                                                        <svg className="w-4 h-4 ml-1 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <div className="p-3">
                                                        <DropdownMenuItem>Tài khoản của tôi</DropdownMenuItem>
                                                        <DropdownMenuItem>Đăng xuất</DropdownMenuItem>
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
                                                    {/* <img src="./src/assets/images/toggle.png"  alt="" /> */}
                                                </SheetTrigger>
                                                <SheetContent>
                                                    <SheetHeader>
                                                        <SheetTitle>
                                                            <div className="p-4 flex justify-between items-center border-b-[1px]">
                                                                <div className="logo">
                                                                    <img src="./src/assets/images/antlearn.png" alt="Edumall Logo" className="w-28 h-10 object-cover" />
                                                                </div>
                                                            </div>
                                                        </SheetTitle>
                                                        <SheetDescription>
                                                            <ul className="">
                                                                <li className="mb-2">
                                                                    <a href="#" className="flex items-center px-4 py-4 rounded-2xl text-gray-700 bg-gray-100">
                                                                        <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                                                        </svg>
                                                                        <p className="font-semibold text-sm">Bảng điều khiển</p>
                                                                    </a>
                                                                </li>
                                                                <li className="mb-2">
                                                                    <a href="#" className="flex items-center px-4 py-4  text-gray-600 hover:bg-gray-100">
                                                                        <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                                                        </svg>
                                                                        <p className="font-semibold text-sm">Bài học của tôi</p>
                                                                    </a>
                                                                </li>
                                                                <li className="mb-2">
                                                                    <a href="#" className="flex items-center px-4 py-4  text-gray-600 hover:bg-gray-100">
                                                                        <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                                        </svg>
                                                                        <p className="font-semibold text-sm">Lịch sử mua hàng</p>
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a href="#" className="flex items-center px-4 py-4  text-gray-600 hover:bg-gray-100">
                                                                        <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                        </svg>
                                                                        <p className="font-semibold text-sm">Thông tin tài khoản</p>
                                                                    </a>
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
                        {/* Dashboard Content */}

                    </div>
                </div>
            </section>
        </>
    )
}
