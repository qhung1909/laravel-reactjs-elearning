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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { Link } from "react-router-dom"
export const InstructorProfile = () => {
    return (
        <>
            <section className="instructor-profile">
                <div className="flex bg-gray-100 h-sc">
                    {/* Sidebar */}
                    <div className="h-auto w-72 bg-white shadow-md border-gray-100 border-r-[1px] lg:block hidden">
                        <div className="p-3">
                            {/* logo */}
                            <div className="p-4 flex justify-between items-center">
                            <div className="logo ">
                                    <img src="./src/assets/images/antlearn.png" alt="Edumall Logo" className="w-20 h-14 object-cover" />
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
                                    <Link to="/instructor" className="flex items-center px-4 py-2 rounded-2xl text-gray-700 hover:bg-gray-100">
                                        <div className="  mr-3 pt-1 px-1  rounded-full">
                                            <box-icon name='sidebar'></box-icon>
                                        </div>
                                        <p className="font-semibold text-base">Bảng điều khiển</p>
                                    </Link>
                                </li>
                                <li className="mb-3">
                                    <Link to="/instructorlessson" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100">
                                        <div className=" mr-3 pt-1 px-1 rounded-full">
                                            <box-icon name='book-open' ></box-icon>
                                        </div>
                                        <p className="font-semibold text-base">Bài học của tôi</p>
                                    </Link>
                                </li>
                                <li className="mb-3">
                                    <Link to="/instructorhistory" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100">
                                        <div className="  mr-3 pt-1 px-1 rounded-full">
                                            <box-icon name='credit-card'  ></box-icon>
                                        </div>
                                        <p className="font-semibold text-base">Lịch sử mua hàng</p>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/instructorprofile" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 bg-gray-100">
                                        <div className="bg-yellow-400 mr-3 pt-1 px-1 rounded-full">
                                            <box-icon type='solid' name='user-circle' color='#ffffff'></box-icon>
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
                                        <div className="flex items-center gap-1">
                                            <box-icon name='home-alt-2' color='#daddf1' ></box-icon>
                                            <p className="text-slate-600">Trang chủ</p>
                                        </div>
                                    </Link>
                                </h1>
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
                                                                    <Link to="/instructorlessson" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100">
                                                                        <div className=" mr-3 pt-1 px-1 rounded-full">
                                                                            <box-icon name='book-open' ></box-icon>
                                                                        </div>
                                                                        <p className="font-semibold text-base">Bài học của tôi</p>
                                                                    </Link>
                                                                </li>
                                                                <li className="mb-3">
                                                                    <Link to="/instructorhistory" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100">
                                                                        <div className="  mr-3 pt-1 px-1 rounded-full">
                                                                            <box-icon name='credit-card'  ></box-icon>
                                                                        </div>
                                                                        <p className="font-semibold text-base">Lịch sử mua hàng</p>
                                                                    </Link>
                                                                </li>
                                                                <li>
                                                                    <Link to="/instructorprofile" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 bg-gray-100">
                                                                        <div className="bg-yellow-400 mr-3 pt-1 px-1 rounded-full">
                                                                            <box-icon type='solid' name='user-circle' color='#ffffff'></box-icon>
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

                        {/* Profile content */}
                        <div className="md:p-6 ">
                            <Tabs defaultValue="profile" className="w-[100%] py-10 md:py-0">
                                {/* tabs - header */}
                                <TabsList>
                                    <div className="bg-gray-200 p-1 rounded-xl">
                                        {/* header 1 */}
                                        <TabsTrigger value="profile" className="rounded-xl">
                                            <div className=" py-2 text-base font-bold text-gray-600">
                                                Chỉnh sửa hồ sơ
                                            </div>
                                        </TabsTrigger>
                                        {/* header 2 */}
                                        <TabsTrigger value="password" className="rounded-xl">
                                            <div className=" py-2 text-base font-bold text-gray-600">
                                                Mật khẩu
                                            </div>
                                        </TabsTrigger>
                                    </div>
                                </TabsList>
                                {/* tabs - content */}
                                <div className="my-16">
                                    {/* tabs - profile */}
                                    <TabsContent value="profile" className="">
                                        <div className="bg-white rounded-xl py-5  w-full mx-auto">
                                            <div className="">
                                                {/* header */}
                                                <div className="flex justify-between items-center px-8">
                                                    <div className="">
                                                        <span className="text-xl font-bold">Sửa hồ sơ của bạn</span>
                                                        <p>Điều này sẽ được chia sẻ với các học viên khác</p>
                                                    </div>
                                                    <div className="">
                                                        <button className="bg-yellow-400 px-4 py-2 rounded-xl font-bold sm:block hidden">Lưu</button>
                                                    </div>
                                                </div>
                                                <hr className="my-5" />
                                                {/* content */}
                                                <div className="px-8">

                                                    {/* img */}
                                                    <div className="image">
                                                        <p className="font-bold text-sm my-3">Ảnh hồ sơ</p>
                                                        <div className="flex items-center gap-20">
                                                            <div className="rounded-xl px-10 py-14 border-gray-300 border ">
                                                                <p className="font-bold">Ảnh</p>
                                                            </div>
                                                            <div className="">
                                                                <p className="font-bold text-gray-600 lg:text-lg sm:text-sm sm:block hidden">PNG hoặc JPG có chiều rộng và chiều cao không lớn hơn 800px</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* name  */}
                                                    <div className="w-[49%] my-5">
                                                        <Label htmlFor="firstname" className="flex gap-2 text-base"><span className="text-red-600">*</span><p className="text-sm">Tên</p></Label>
                                                        <Input type="firstname" id="firstname" placeholder="Tên" className="p-6 mt-2 rounded-xl font-semibold text-base" />
                                                    </div>

                                                    {/* email - phone */}
                                                    <div className="sm:flex my-5 gap-5">
                                                        <div className="sm:w-[50%] w-[100%]">
                                                            <Label htmlFor="email" className="flex gap-2 text-base"><p className="text-sm">Email</p></Label>
                                                            <Input type="email" id="email" placeholder="Email" className="p-6 mt-2 rounded-xl font-semibold" />
                                                        </div>
                                                        <div className="sm:w-[50%] w-[100%] my-5 sm:m-0">
                                                            <Label htmlFor="phone" className="flex gap-2 text-base"><p className="text-sm">Số điện thoại</p></Label>
                                                            <Input type="phone" id="phone" placeholder="Số điện thoại" className="p-6 mt-2 rounded-xl font-semibold" />
                                                        </div>
                                                    </div>

                                                    {/* description */}
                                                    <div className="w-[100%] my-5">
                                                        <Label htmlFor="address" className="flex gap-2 text-base"><p className="text-sm">Mô tả</p></Label>
                                                        <Textarea placeholder="Mô tả" className=" mt-2 rounded-xl font-semibold h-40" />
                                                    </div>

                                                    {/* button - hidden */}
                                                    <div className="">
                                                        <button className="bg-yellow-400 px-4 py-2 rounded-xl font-bold sm:hidden block">Lưu</button>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </TabsContent>

                                    {/* tabs - password */}
                                    <TabsContent value="password">
                                        <div className="bg-white rounded-xl py-5">
                                            {/* header */}
                                            <div className="px-8">
                                                <div className="">
                                                    <span className="text-xl font-bold">Thay đổi mật khẩu</span>
                                                </div>
                                            </div>
                                            <hr className="my-5" />
                                            {/* content */}
                                            <div className="px-8">

                                                {/* current password */}
                                                <div className="my-10 gap-5">
                                                    <div className="w-[100%]">
                                                        <Label htmlFor="password" className="flex gap-2 text-base"><span className="text-red-600">*</span><p className="text-sm">Mật khẩu hiện tại</p></Label>
                                                        <Input type="password" id="password" placeholder="Mật khẩu hiện tại" className="p-6 mt-2 rounded-xl font-semibold text-base" />
                                                    </div>
                                                </div>

                                                {/* new password */}
                                                <div className="my-10 gap-5">
                                                    <div className="w-[100%]">
                                                        <Label htmlFor="newpassword" className="flex gap-2 text-base"><span className="text-red-600">*</span><p className="text-sm">Mật khẩu mới</p></Label>
                                                        <Input type="newpassword" id="newpassword" placeholder="Mật khẩu mới" className="p-6 mt-2 rounded-xl font-semibold text-base" />
                                                    </div>
                                                </div>

                                                {/* confirm password */}
                                                <div className="my-10 gap-5">
                                                    <div className="w-[100%]">
                                                        <Label htmlFor="confirmpassword" className="flex gap-2 text-base"><span className="text-red-600">*</span><p className="text-sm">Xác nhận mật khẩu</p></Label>
                                                        <Input type="confirmpassword" id="confirmpassword" placeholder="Xác nhận mật khẩu" className="p-6 mt-2 rounded-xl font-semibold text-base" />
                                                    </div>
                                                </div>

                                                {/* save button */}
                                                <div className="my-5">
                                                    <button className="bg-yellow-400 p-3 font-bold rounded-xl">Lưu mật khẩu</button>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </div>
                            </Tabs>

                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
