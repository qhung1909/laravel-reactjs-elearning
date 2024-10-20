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
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import axios from "axios";

export const InstructorProfile = () => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;
    const [userName, setUserName] = useState('');
    const [role, setRole] = useState('');

    const fetchUserProfile = async () =>{
        const token = localStorage.getItem("access_token");
        try{
            const response = await axios.get(`${API_URL}/auth/me`,{
                headers: {
                    'x-api-secret': `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                },
            });

            const userData = response.data;
            setUserName(userData.name || '');
            setRole(userData.role || '')

        }catch(error){
            console.log('Error fetching user profile', error)
        }
    }

    useEffect(()=>{
        fetchUserProfile();
    },[])

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
                                    <Link to="/">
                                        <img src="./src/assets/images/logout.svg" className="w-7" alt="" />
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
                                        <div className="flex items-center gap-2">
                                        <img src="./src/assets/images/home.svg" className="w-6" alt="" />
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
                                        <Avatar>
                                            <AvatarImage src="./src/assets/images/doremon.jpg" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>

                                        {/* user control */}
                                        <div className="text-left">
                                            <span className="font-medium text-sm">{userName}</span>
                                            <br />
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <div className="flex items-center">
                                                        <p className="text-gray-600 text-sm">{role}</p>
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
