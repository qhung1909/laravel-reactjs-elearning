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
import { Input } from "@/components/ui/input"

import { Link } from "react-router-dom"
export const InstructorLesson = () => {
    return (
        <>
            <section className="instructor-home">
                <div className="flex bg-gray-100 h-sc">
                    {/* Sidebar */}
                    <div className="h-screen w-72 bg-white shadow-md border-gray-100 border-r-[1px] lg:block hidden">
                        <div className="p-3">
                            {/* logo */}
                            <div className="p-4 flex justify-between items-center">
                                <div className="logo ml-[-35px]">
                                    <img src="./src/assets/images/antlearn.png" alt="Edumall Logo" className="w-32 h-14 object-cover" />
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
                                    <Link to="/instructorlessson" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 bg-gray-100">
                                        <div className="bg-yellow-400 mr-3 pt-1 px-1 rounded-full">
                                            <box-icon name='book-open' color='#ffffff'></box-icon>
                                        </div>
                                        <p className="font-semibold text-base">Bài học của tôi</p>
                                    </Link>
                                </li>
                                <li className="mb-3">
                                    <Link to="/instructorhistory" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100">
                                        <div className=" mr-3 pt-1 px-1 rounded-full">
                                            <box-icon name='credit-card' ></box-icon>
                                        </div>
                                        <p className="font-semibold text-base">Lịch sử mua hàng</p>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/instructorprofile" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100">
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
                                                                <div className="logo ml-[-35px]">
                                                                    <img src="./src/assets/images/antlearn.png" alt="Edumall Logo" className="w-32 h-14 object-cover" />
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
                                                                    <Link to="/instructorlessson" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 bg-gray-100">
                                                                        <div className="bg-yellow-400 mr-3 pt-1 px-1 rounded-full">
                                                                            <box-icon name='book-open' color='#ffffff'></box-icon>
                                                                        </div>
                                                                        <p className="font-semibold text-base">Bài học của tôi</p>
                                                                    </Link>
                                                                </li>
                                                                <li className="mb-3">
                                                                    <Link to="/instructorhistory" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100">
                                                                        <div className=" mr-3 pt-1 px-1 rounded-full">
                                                                            <box-icon name='credit-card' ></box-icon>
                                                                        </div>
                                                                        <p className="font-semibold text-base">Lịch sử mua hàng</p>
                                                                    </Link>
                                                                </li>
                                                                <li>
                                                                    <Link to="/instructorprofile" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100">
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
                        <div className="p-6 max-lg:h-screen">
                            <div className="lg:w-[50%] w-[100%]">
                                <Input type="email" placeholder="Tìm kiếm..." className="rounded-full p-5"/>
                            </div>
                            <div className="my-20">
                                <svg width="100%" height="231" viewBox="0 0 499 147" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_3315_48041)">
                                        <path d="M0 146.554C0 146.554 224.061 23.1072 499 145.973L0 146.554Z" fill="url(#paint0_linear_3315_48041)"></path><path d="M170.362 101.458V113.651" stroke="#C1C3CA" strokeWidth="5" strokeMiterlimit="10"></path><path d="M176.279 95.2999C172.15 81.2511 170.455 79.7969 170.455 79.7969C170.455 79.7969 169.161 81.344 164.661 95.2999C160.717 107.461 167.681 107.523 169.561 107.338C169.53 107.338 180.285 108.947 176.279 95.2999Z" fill="#E5E7EA"></path><path d="M304.563 92.3911V105.017" stroke="#C1C3CA" strokeWidth="5" strokeMiterlimit="10"></path><path d="M310.665 86.0164C306.381 71.4725 304.625 69.9873 304.625 69.9873C304.625 69.9873 303.3 71.5964 298.616 86.0164C294.548 98.611 301.76 98.673 303.67 98.4871C303.7 98.4871 314.825 100.127 310.665 86.0164Z" fill="#E5E7EA"></path><path d="M323.576 101.489V111.082" stroke="#C1C3CA" strokeWidth="5" strokeMiterlimit="10"></path><path d="M328.229 96.6617C324.963 85.6143 323.669 84.4692 323.669 84.4692C323.669 84.4692 322.652 85.6762 319.108 96.6617C316.026 106.192 321.481 106.254 322.96 106.13C322.929 106.13 331.372 107.368 328.229 96.6617Z" fill="#E5E7EA"></path><path d="M211.809 27.4378L272.608 22.0225C272.608 22.0225 287.306 22.7342 288.879 40.8988C290.45 59.0635 291.929 69.6466 291.929 69.6466L236.123 76.3928L232.517 45.8191C232.055 41.8581 230.545 38.1138 228.08 34.9883C225.06 31.1821 220.037 27.2521 211.809 27.4378Z" fill="#E3E5EA"></path><path d="M237.971 76.0523L200.469 80.3226L196.679 48.5731C195.415 37.9899 203.058 28.4588 213.627 27.4067C223.858 26.4165 233.01 33.8124 234.212 44.0861L237.971 76.0523ZM245.028 74.9996V86.171H254.951L254.827 74.1024L245.028 74.9996Z" fill="#C1C3CA"></path><path d="M200.068 80.6631L195.292 96.5689C194.553 98.766 194.245 101.087 194.398 103.407C194.707 107.771 196.771 113.279 205.338 113.063C210.638 112.908 215.137 110.928 218.712 108.545C223.704 105.202 227.556 100.437 229.959 94.9288L238.28 76.4238L200.068 80.6631Z" fill="#D0D2D6"></path><path d="M255.752 85.645H244.381V111.855H255.752V85.645Z" fill="#CDCFD4"></path><path d="M231.192 36.4736L198.22 60.1775M231.931 36.9691L200.592 79.8587M218.249 78.1566L231.839 38.5163M212.117 50.2754C212.117 50.2754 218.804 48.4495 218.773 54.0815C218.773 54.0815 225.214 52.6272 224.844 59.0947M203.242 56.8048C203.242 56.8048 211.717 54.979 211.871 63.891C211.871 63.891 218.65 61.3847 221.269 68.595" stroke="#CDCFD4" strokeWidth="3" strokeMiterlimit="10"></path><path fillRule="evenodd" clipRule="evenodd" d="M165.802 13.6051L165.309 13.5741V14.3787L165.802 14.4097V13.6051ZM165.894 12.1509L165.401 12.12L165.34 12.9245L165.833 12.9554L165.894 12.1509ZM165.956 10.6964L165.463 10.6655L165.432 11.47L165.925 11.501L165.956 10.6964ZM165.833 17.9376L165.34 17.9685C165.37 18.247 165.37 18.5255 165.401 18.7731L165.894 18.7421C165.833 18.4946 165.833 18.2161 165.833 17.9376ZM165.771 16.4831H165.278C165.278 16.7616 165.278 17.0402 165.309 17.2877H165.802C165.802 17.0402 165.771 16.7616 165.771 16.4831ZM165.771 15.0597H165.278V15.8643H165.771V15.0597ZM166.356 22.2387L165.894 22.3625L166.079 23.1671L166.541 23.0434L166.356 22.2387ZM166.11 20.8154L165.617 20.8774C165.648 21.1559 165.71 21.4343 165.74 21.6818L166.233 21.589C166.172 21.3724 166.141 21.0939 166.11 20.8154ZM165.925 19.392L165.432 19.4539C165.463 19.7325 165.493 20.011 165.524 20.2585L166.018 20.1966C165.987 19.9181 165.956 19.6706 165.925 19.392ZM167.743 26.3235L167.312 26.5401C167.435 26.7877 167.558 27.0353 167.681 27.2828L168.113 27.0353C167.959 26.8187 167.867 26.5711 167.743 26.3235ZM167.188 25.0238L166.726 25.1785L167.035 25.9521L167.466 25.7664L167.188 25.0238ZM166.726 23.6624L166.264 23.8171C166.326 24.0956 166.418 24.3432 166.511 24.5907L166.973 24.436C166.88 24.1575 166.788 23.9099 166.726 23.6624ZM170.086 29.975L169.685 30.2844L170.239 30.9033L170.609 30.5629L170.086 29.975ZM169.192 28.8302L168.791 29.1087C168.945 29.3254 169.13 29.542 169.284 29.7586L169.685 29.4492C169.53 29.2635 169.346 29.0468 169.192 28.8302ZM168.421 27.6233L167.99 27.8708C168.113 28.1184 168.267 28.335 168.421 28.5826L168.822 28.3041C168.699 28.0875 168.544 27.8399 168.421 27.6233ZM173.198 32.9459L172.889 33.3481C173.105 33.5337 173.351 33.6575 173.568 33.8123L173.845 33.4101C173.629 33.2553 173.413 33.1006 173.198 32.9459ZM172.088 32.0175L171.749 32.3888C171.965 32.5745 172.15 32.7602 172.366 32.9149L172.674 32.5436C172.489 32.3888 172.273 32.2032 172.088 32.0175ZM171.041 31.0272L170.671 31.3676C170.855 31.5533 171.041 31.7699 171.256 31.9556L171.595 31.5842C171.41 31.4295 171.225 31.2129 171.041 31.0272ZM176.926 35.0809L176.742 35.545C176.988 35.6379 177.234 35.7616 177.512 35.8545L177.697 35.3903C177.419 35.2975 177.173 35.2047 176.926 35.0809ZM175.632 34.462L175.386 34.9262L176.125 35.2975L176.341 34.8333L175.632 34.462ZM174.399 33.7503L174.122 34.1836L174.831 34.5858L175.077 34.1836L174.399 33.7503ZM181.056 36.2879L180.994 36.783C181.271 36.814 181.549 36.8759 181.826 36.8759L181.857 36.3807C181.579 36.3498 181.302 36.3188 181.056 36.2879ZM179.638 36.0092L179.515 36.5044L180.347 36.6591L180.439 36.164L179.638 36.0092ZM178.282 35.607L178.128 36.0712C178.375 36.164 178.652 36.2259 178.899 36.3187L179.022 35.8546C178.775 35.7618 178.529 35.6999 178.282 35.607ZM185.308 36.164L185.401 36.6591C185.678 36.5972 185.955 36.5353 186.202 36.4734L186.078 36.0092C185.832 36.0402 185.585 36.1021 185.308 36.164ZM183.89 36.3807L183.921 36.8759C184.199 36.8449 184.476 36.814 184.753 36.783L184.692 36.2879C184.445 36.3188 184.168 36.3498 183.89 36.3807ZM182.473 36.4118V36.9068C182.75 36.9068 183.027 36.9378 183.305 36.9068V36.4118C183.027 36.4427 182.75 36.4118 182.473 36.4118ZM189.16 34.4001L189.468 34.7715C189.683 34.5858 189.869 34.3692 190.084 34.1835L189.714 33.8431C189.53 34.0287 189.345 34.2144 189.16 34.4001ZM187.989 35.2048L188.235 35.6381C188.482 35.4833 188.698 35.3285 188.944 35.2048L188.667 34.8026C188.42 34.9264 188.205 35.081 187.989 35.2048ZM186.695 35.7929L186.849 36.257C187.095 36.1642 187.373 36.0404 187.619 35.9476L187.403 35.4834C187.188 35.5763 186.941 35.7 186.695 35.7929ZM191.101 30.7797L191.594 30.8106C191.625 30.5321 191.594 30.2227 191.563 29.9442L191.07 30.0061C191.132 30.2536 191.132 30.5322 191.101 30.7797ZM190.793 32.1413L191.256 32.327C191.378 32.0484 191.44 31.7699 191.502 31.4914L191.009 31.3986C190.978 31.6462 190.885 31.8937 190.793 32.1413ZM190.115 33.348L190.516 33.6266C190.67 33.379 190.824 33.1624 190.978 32.9148L190.546 32.6672C190.393 32.9148 190.269 33.1314 190.115 33.348ZM188.913 27.7161L189.037 27.2211C188.759 27.1592 188.482 27.0973 188.174 27.0663L188.143 27.5614C188.42 27.6233 188.667 27.6542 188.913 27.7161ZM190.146 28.3349L190.454 27.9635C190.207 27.7779 189.961 27.6231 189.683 27.4994L189.468 27.9635C189.714 28.0564 189.93 28.1802 190.146 28.3349ZM190.947 29.4181L191.409 29.2325C191.317 28.954 191.163 28.6755 190.978 28.4588L190.608 28.7683C190.731 28.954 190.855 29.1706 190.947 29.4181ZM184.876 28.4588L184.63 28.0255C184.507 28.0874 184.383 28.1802 184.291 28.2731C184.168 28.3659 184.044 28.4278 183.952 28.5206L184.26 28.9229C184.352 28.8301 184.476 28.7682 184.568 28.6754C184.661 28.5825 184.753 28.5207 184.876 28.4588ZM186.171 27.84L186.017 27.3758C185.863 27.4068 185.739 27.4686 185.616 27.5305C185.493 27.5924 185.37 27.6542 185.215 27.7161L185.431 28.1494C185.555 28.0875 185.677 28.0256 185.801 27.9947C185.925 27.9328 186.017 27.8709 186.171 27.84ZM187.527 27.5923L187.496 27.0972C187.342 27.0972 187.219 27.1281 187.064 27.1281C186.91 27.1281 186.787 27.159 186.633 27.19L186.726 27.6852C186.849 27.6542 186.972 27.6232 187.095 27.6232C187.219 27.6232 187.403 27.5923 187.527 27.5923ZM182.134 31.6152L181.672 31.4295C181.549 31.6771 181.456 31.9555 181.363 32.2031L181.826 32.3578C181.949 32.1103 182.042 31.8627 182.134 31.6152ZM182.843 30.3774L182.442 30.0989C182.35 30.2227 182.288 30.3465 182.195 30.4393C182.134 30.5631 182.042 30.6869 181.98 30.8107L182.411 31.0582C182.473 30.9344 182.535 30.8416 182.627 30.7178C182.688 30.594 182.75 30.5012 182.843 30.3774ZM183.767 29.3252L183.428 28.9538C183.336 29.0467 183.213 29.1395 183.12 29.2633C183.028 29.3562 182.935 29.4799 182.843 29.5728L183.213 29.8822C183.305 29.7894 183.367 29.6656 183.459 29.6037C183.582 29.5109 183.675 29.4181 183.767 29.3252Z" fill="#C1C3CA"></path><path fillRule="evenodd" clipRule="evenodd" d="M181.425 35.8238L180.932 35.8548C180.932 36.1333 180.963 36.4118 180.994 36.6903L181.487 36.6284C181.456 36.3499 181.425 36.0714 181.425 35.8238ZM181.456 34.3693L180.963 34.3074C180.932 34.5859 180.932 34.8644 180.901 35.1429H181.394C181.425 34.8954 181.425 34.6478 181.456 34.3693ZM181.672 32.977L181.21 32.8533C181.148 33.1318 181.086 33.4102 181.056 33.6887L181.549 33.7506C181.58 33.5031 181.61 33.2246 181.672 32.977ZM182.257 40.0322L181.795 40.1869C181.887 40.4345 181.98 40.713 182.073 40.9606L182.535 40.7749C182.442 40.5273 182.35 40.2798 182.257 40.0322ZM181.826 38.6397L181.363 38.7635C181.425 39.042 181.518 39.2896 181.58 39.5681L182.042 39.4133C181.98 39.1658 181.887 38.9182 181.826 38.6397ZM181.549 37.2472L181.056 37.3091C181.086 37.5876 181.148 37.8661 181.21 38.1137L181.703 38.0208C181.641 37.7733 181.58 37.5257 181.549 37.2472ZM184.199 43.8695L183.798 44.1481L184.261 44.8288L184.661 44.5194L184.199 43.8695ZM183.459 42.6317L183.028 42.8793L183.429 43.5911L183.86 43.3435L183.459 42.6317ZM182.812 41.3631L182.35 41.5797C182.473 41.8273 182.566 42.0748 182.688 42.3224L183.12 42.1058L182.812 41.3631ZM187.034 47.1187L186.695 47.4902L187.311 48.0471L187.619 47.6757L187.034 47.1187ZM186.017 46.1285L185.647 46.4689L186.202 47.0568L186.571 46.6855L186.017 46.1285ZM185.062 45.0454L184.692 45.3548L185.216 45.9737L185.586 45.6643L185.062 45.0454ZM190.516 49.6563L190.269 50.0895L190.978 50.4918L191.225 50.0585L190.516 49.6563ZM189.283 48.9135L189.006 49.3158L189.714 49.78L189.961 49.3468L189.283 48.9135ZM188.143 48.0779L187.835 48.4492L188.482 48.9444L188.759 48.5421L188.143 48.0779ZM194.46 51.3272L194.337 51.8223L195.138 52.0389L195.231 51.5437L194.46 51.3272ZM193.105 50.8941L192.951 51.3583L193.721 51.6367L193.875 51.1416L193.105 50.8941ZM191.779 50.3372L191.594 50.7703L192.334 51.1108L192.519 50.6466L191.779 50.3372ZM170.393 5.15763C170.393 5.15763 169.962 7.69513 172.366 8.09738C172.366 8.09738 173.814 7.04529 173.136 5.6218C172.489 4.22928 170.393 5.15763 170.393 5.15763Z" fill="#C1C3CA"></path><path fillRule="evenodd" clipRule="evenodd" d="M170.055 5.34316C170.055 5.34316 169.809 7.97353 172.119 8.34486C172.119 8.34486 171.134 9.4589 170.209 8.80907C169.346 8.22113 168.73 7.10708 168.946 6.08586C169.007 5.83832 169.13 5.59074 169.346 5.43601C169.531 5.37412 169.778 5.28127 170.055 5.34316Z" fill="#C1C3CA"></path><path fillRule="evenodd" clipRule="evenodd" d="M168.421 6.27137C168.421 6.20954 167.219 7.57111 167.497 8.56135C167.497 8.56135 166.788 8.93268 166.819 9.3659C166.819 9.3659 167.343 8.83986 167.805 9.08739C167.805 9.08739 168.73 10.1395 170.178 9.3659C170.208 9.33493 168.544 8.40658 168.421 6.27137ZM170.239 4.72415C169.5 4.1362 168.945 3.33166 168.606 2.43425C168.513 2.21763 168.452 2.00104 168.452 1.75348C168.421 1.38214 168.544 1.0108 168.76 0.670405C168.914 0.422846 169.068 0.206186 169.345 0.0824064C169.869 -0.165153 170.548 0.175241 170.825 0.701306C171.102 1.22737 171.071 1.8463 170.979 2.43425C170.887 3.11504 170.701 3.8268 170.455 4.47665C170.393 4.60043 170.332 4.72415 170.239 4.72415C170.147 4.75509 170.055 4.66229 169.962 4.6004C169.099 3.703 167.928 3.2079 166.788 2.77468C166.542 2.68184 166.264 2.58895 166.018 2.558C165.71 2.558 165.432 2.6509 165.155 2.77468C164.785 2.96035 164.446 3.23879 164.292 3.64107C164.138 4.04336 164.23 4.50757 164.538 4.75512C164.724 4.90985 164.97 4.94081 165.217 5.0027C166.85 5.28121 168.513 5.21933 170.116 4.7861" fill="#C1C3CA"></path><path d="M237.602 75.9287L200.5 80.168L196.741 48.7281C195.477 38.2687 203.058 28.7995 213.504 27.8093C223.642 26.819 232.702 34.153 233.873 44.303L237.602 75.9287Z" stroke="#C1C3CA" strokeWidth="5" strokeMiterlimit="10"></path><path d="M277.354 14.9048L287.245 22.2078C287.646 22.4862 287.523 23.1361 287.03 23.2599L283.054 24.1883L283.393 28.3659C283.424 28.8919 282.839 29.2013 282.438 28.8609L272.454 20.1035L277.354 14.9048Z" fill="var(--saas-primary-color, #2143D5)"></path><path d="M268.571 36.4731C269.78 36.4731 270.759 35.4756 270.759 34.2451C270.759 33.0146 269.78 32.0171 268.571 32.0171C267.363 32.0171 266.383 33.0146 266.383 34.2451C266.383 35.4756 267.363 36.4731 268.571 36.4731Z" fill="#949BA9"></path><path d="M269.372 33.1309C269.742 31.2743 270.112 29.4176 270.482 27.5609C270.728 26.2611 271.005 24.9615 271.252 23.6309C271.375 23.0738 271.684 22.2383 271.622 21.6813C271.653 22.0836 271.129 22.3003 271.684 21.8051C271.992 21.5266 272.3 21.1862 272.577 20.8768C273.502 19.9484 274.426 18.9891 275.32 18.0608C276.645 16.6992 278.001 15.3066 279.326 13.9451C280.312 12.9548 278.771 11.4076 277.816 12.4288C276.398 13.8832 275.011 15.3066 273.594 16.7611C272.7 17.6894 271.807 18.6177 270.883 19.5152C270.451 19.9484 269.835 20.4126 269.558 21.0005C269.311 21.5576 269.28 22.3002 269.157 22.8572C268.91 24.126 268.664 25.4256 268.386 26.6943C267.986 28.6439 267.616 30.6244 267.215 32.5739C267.03 33.9045 269.126 34.4925 269.372 33.1309Z" fill="#949BA9"></path><path d="M337.936 13.389C339.724 13.389 339.724 10.604 337.936 10.604C336.149 10.604 336.149 13.389 337.936 13.389Z" fill="url(#paint1_linear_3315_48041)"></path></g><defs><linearGradient id="paint0_linear_3315_48041" x1="246.083" y1="42.0463" x2="247.319" y2="216.023" gradientUnits="userSpaceOnUse"><stop offset="0.1653" stopColor="#E3E5EA"></stop><stop offset="0.3741" stopColor="#F4F5F7" stopOpacity="0.6199"></stop><stop offset="0.5962" stopColor="#F6F7F8" stopOpacity="0"></stop></linearGradient><linearGradient id="paint1_linear_3315_48041" x1="337.918" y1="13.3803" x2="337.954" y2="10.5954" gradientUnits="userSpaceOnUse"><stop offset="0.1653" stopColor="#E3E5EA"></stop><stop offset="0.2826" stopColor="#EDEFF1" stopOpacity="0.8497"></stop><stop offset="0.4662" stopColor="#F4F5F7" stopOpacity="0.6143"></stop><stop offset="0.9455" stopColor="#F6F7F8" stopOpacity="0"></stop></linearGradient><clipPath id="clip0_3315_48041"><rect width="499" height="147" fill="white"></rect></clipPath></defs>
                                </svg>
                                <p className="text-center">Dữ liệu hiện đang được cập nhật</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
