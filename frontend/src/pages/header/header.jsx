import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    Cloud,
    CreditCard,
    Github,
    LifeBuoy,
    LogOut,
    Mail,
    MessageSquare,
    Plus,
    PlusCircle,
    Settings,
    User,
    UserPlus,
    Users,
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    Avatar,
    AvatarImage,
} from "@/components/ui/avatar"

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

export const Header = () => {

    const [logined, setLogined] = useState(null);

    useEffect(() => {
        const user = localStorage.getItem('access_token');
        if (user) {
            setLogined(user);
        }
    }, [])

    const logout = () => {
        localStorage.removeItem('access_token');
        setLogined(null);
    }


    return (
        <>
            <header>
                <nav className="navbar flex items-center justify-center w-full mx-auto py-2 z-10 ps-3 xl:max-w-screen-2xl border-b-[1px] border-gray-200">

                    {/* header - logo */}
                    <div className="navbar-logo mx-2 w-28 h-24 object-cover flex items-center">
                        <Link to="/">
                            <img
                                src="./src/assets/images/antlearn.png"
                                alt=""
                                className="w-40"
                            />
                        </Link>
                    </div>

                    {/* header - search */}
                    <div className="navbar-search xl:w-[100%]  xl:px-0 w-[100%] p-2">
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
                                <div className="navbar-content xl:static xl:min-h-fit  bg-white xl:flex xl:items-center px-10 max-xl:w-full gap-2 xl:block hidden">
                                    <div className="navbar-icons flex items-center gap-2 xl:mx-3">
                                        <div className="navbar-noti cursor-pointer">
                                            <Link to="/instructor">
                                                <box-icon type='solid' name='bell'></box-icon>
                                            </Link>

                                        </div>
                                        <div className="navbar-language cursor-pointer">
                                            <box-icon type='solid' name='brightness'></box-icon>
                                        </div>
                                        <div className="">
                                            <Link to='/cart'>
                                                <box-icon name='cart-alt' type='solid'></box-icon>
                                            </Link>
                                        </div>
                                        <div className="">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <box-icon name='user-circle' type='solid' ></box-icon>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-56">
                                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
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
                                                    <DropdownMenuGroup>
                                                        <DropdownMenuItem>
                                                            <Users className="mr-2 h-4 w-4" />
                                                            <span>Team</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSub>
                                                            <DropdownMenuSubTrigger>
                                                                <UserPlus className="mr-2 h-4 w-4" />
                                                                <span>Invite users</span>
                                                            </DropdownMenuSubTrigger>
                                                            <DropdownMenuPortal>
                                                                <DropdownMenuSubContent>
                                                                    <DropdownMenuItem>
                                                                        <Mail className="mr-2 h-4 w-4" />
                                                                        <span>Email</span>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem>
                                                                        <MessageSquare className="mr-2 h-4 w-4" />
                                                                        <span>Message</span>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem>
                                                                        <PlusCircle className="mr-2 h-4 w-4" />
                                                                        <span>More...</span>
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuSubContent>
                                                            </DropdownMenuPortal>
                                                        </DropdownMenuSub>
                                                        <DropdownMenuItem>
                                                            <Plus className="mr-2 h-4 w-4" />
                                                            <span>New Team</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuGroup>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>
                                                        <Github className="mr-2 h-4 w-4" />
                                                        <span>GitHub</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <LifeBuoy className="mr-2 h-4 w-4" />
                                                        <span>Support</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem disabled>
                                                        <Cloud className="mr-2 h-4 w-4" />
                                                        <span>API</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>
                                                        <LogOut className="mr-2 h-4 w-4" />
                                                        <span onClick={logout}>Log out</span>
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
                                                            <box-icon name='user-circle' type='solid' ></box-icon>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent className="w-56">
                                                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
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
                                                            <DropdownMenuGroup>
                                                                <DropdownMenuItem>
                                                                    <Users className="mr-2 h-4 w-4" />
                                                                    <span>Team</span>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSub>
                                                                    <DropdownMenuSubTrigger>
                                                                        <UserPlus className="mr-2 h-4 w-4" />
                                                                        <span>Invite users</span>
                                                                    </DropdownMenuSubTrigger>
                                                                    <DropdownMenuPortal>
                                                                        <DropdownMenuSubContent>
                                                                            <DropdownMenuItem>
                                                                                <Mail className="mr-2 h-4 w-4" />
                                                                                <span>Email</span>
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem>
                                                                                <MessageSquare className="mr-2 h-4 w-4" />
                                                                                <span>Message</span>
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuSeparator />
                                                                            <DropdownMenuItem>
                                                                                <PlusCircle className="mr-2 h-4 w-4" />
                                                                                <span>More...</span>
                                                                            </DropdownMenuItem>
                                                                        </DropdownMenuSubContent>
                                                                    </DropdownMenuPortal>
                                                                </DropdownMenuSub>
                                                                <DropdownMenuItem>
                                                                    <Plus className="mr-2 h-4 w-4" />
                                                                    <span>New Team</span>
                                                                </DropdownMenuItem>
                                                            </DropdownMenuGroup>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem>
                                                                <Github className="mr-2 h-4 w-4" />
                                                                <span>GitHub</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <LifeBuoy className="mr-2 h-4 w-4" />
                                                                <span>Support</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem disabled>
                                                                <Cloud className="mr-2 h-4 w-4" />
                                                                <span>API</span>
                                                            </DropdownMenuItem>
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
                                                        <box-icon name='cart-alt' type='solid'></box-icon>
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
                                                        <div className="logo ml-[-35px]">
                                                            <img src="./src/assets/images/antlearn.png" alt="Edumall Logo" className="w-32 h-14 object-cover" />
                                                        </div>
                                                        <div className="flex">
                                                            <div className="navbar-language cursor-pointer">
                                                                <box-icon type='solid' name='brightness'></box-icon>
                                                            </div>
                                                            <div className="">
                                                                <div className="navbar-noti cursor-pointer">
                                                                    <Link to="/instructor">
                                                                        <box-icon type='solid' name='bell'></box-icon>
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
                                                            <Link to="/courses" className="hover:text-gray-500">
                                                                Khóa học
                                                            </Link>
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
                            <div className="navbar-content xl:static xl:min-h-fit  bg-white xl:flex xl:items-center px-10 max-xl:w-full gap-2 xl:block hidden">
                                <ul className="items-center max-xl:pt-3 gap-3 flex text-base xl:text-base w-52">
                                    <li className="max-xl:mb-4">
                                        <Link to="/courses" className="hover:text-gray-500">
                                            Khóa học
                                        </Link>
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
                                <div className="navbar-icons flex items-center gap-2 xl:mx-3">
                                    <div className="navbar-noti cursor-pointer">
                                        <Link to="/instructor">
                                            <box-icon type='solid' name='bell'></box-icon>
                                        </Link>

                                    </div>
                                    <div className="navbar-language cursor-pointer">
                                        <box-icon type='solid' name='brightness'></box-icon>
                                    </div>
                                    <div className="">
                                        <Link to='/cart'>
                                            <box-icon name='cart-alt' type='solid'></box-icon>
                                        </Link>
                                    </div>
                                </div>
                                <div className="xl:flex max-xl:flex-col items-center">
                                    <div className="navbar-login max-xl:mb-2">
                                        <Link to="/login">
                                            <button className="w-28 py-2 me-3 border rounded-3xl font-semibold border-gray-400 p-1 hover:border-1 hover:border-white hover:bg-black hover:text-white duration-300">
                                                Đăng nhập
                                            </button>
                                        </Link>
                                    </div>
                                    <div className="navbar-register">
                                        <Link to="/register">
                                            <button className="w-24 py-2 me-3 border rounded-3xl font-semibold p-1 bg-yellow-500 hover:border-1 hover:border-black hover:bg-black hover:text-white duration-300">
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
                                                    <box-icon type='solid' name='bell'></box-icon>
                                                </Link>
                                            </div>
                                            <div className="">
                                                <Link to='/cart'>
                                                    <box-icon name='cart-alt' type='solid'></box-icon>
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
                                                    <div className="logo ml-[-35px]">
                                                        <img src="./src/assets/images/antlearn.png" alt="Edumall Logo" className="w-32 h-14 object-cover" />
                                                    </div>
                                                    <div className="navbar-language cursor-pointer">
                                                        <box-icon type='solid' name='brightness'></box-icon>
                                                    </div>
                                                </div>
                                            </SheetTitle>
                                            <SheetDescription>

                                                {/* nav list */}
                                                <ul className="max-xl:pt-3 gap-3 text-base xl:text-base text-left">
                                                    <li className="max-xl:mb-4">
                                                        <Link to="/courses" className="hover:text-gray-500">
                                                            Khóa học
                                                        </Link>
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
        </>
    );
}

