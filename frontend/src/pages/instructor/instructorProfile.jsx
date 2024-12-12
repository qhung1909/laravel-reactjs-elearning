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
import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom"
import toast, { Toaster } from 'react-hot-toast';
import { UserContext } from "../context/usercontext";
import { Skeleton } from "@/components/ui/skeleton";

const notify = (message, type) => {
    if (type === 'success') {
        toast.success(message);
    } else {
        toast.error(message)
    }
}
export const InstructorProfile = () => {
    const { instructor, updateUserProfile, logout, updatePassword } = useContext(UserContext);
    const [userName, setUserName] = useState('');
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [currentAvatar, setCurrentAvatar] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [loadingLogout, setLoadingLogout] = useState(false);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(true)
    const [current_password, setCurrentPassword] = useState("");
    const [password_confirmation, setPassword_Confirmation] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
    const [showPasswordTab, setShowPasswordTab] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);

        const timer = setTimeout(() => {
            if (instructor) {
                setUserName(instructor.name);
                setEmail(instructor.email);
                setCurrentAvatar(instructor.avatar);
                setRole(instructor.role);
                setLoading(false);
            }
            if (instructor && instructor.google_id) {
                setShowPasswordTab(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [instructor]);

    // hàm xử lý thay đổi file
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            setCurrentAvatar(URL.createObjectURL(file));
        }
    };

    // hàm xử lý update user profile
    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        if (userName === instructor.name && !avatar) {
            toast.error("Vui lòng thay đổi thông tin trước khi cập nhật")
            return;
        }
        const specialCharRegex = /^[a-zA-Z0-9_]+$/;
        if (!specialCharRegex.test(userName)) {
            toast.error("Tên người dùng không được chứa ký tự đặc biệt");
            return;
        }

        if (avatar) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (!allowedTypes.includes(avatar.type)) {
                toast.error("Chỉ cho phép tải lên ảnh định dạng JPG, PNG, GIF");
                return;
            }

            if (avatar.size > maxSize) {
                toast.error("Kích thước ảnh không được vượt quá 5MB");
                return;
            }
        }

        if (isProfileSubmitting) return;
        setIsProfileSubmitting(true);
        try {
            await updateUserProfile(userName, email, avatar);
            setSuccess(true);
            toast.success("Cập nhật hồ sơ thành công!");
        } catch (error) {
            setError("Cập nhật không thành công, vui lòng thử lại.");
            toast.error(error.message);
        } finally {
            setIsProfileSubmitting(false);
        }
    };

    // hàm xử lý đăng xuất
    const handleLogout = () => {
        try {
            setLoadingLogout(true);
            logout();
            navigate('/login');
        } catch (error) {
            notify('Có lỗi xảy ra khi đăng xuất', 'error');
        } finally {
            setLoadingLogout(false);
        }
    };


    // hàm xử lý validate thay đổi mật khẩu
    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        const isUpdated = await updatePassword(
            current_password,
            password,
            password_confirmation
        );
        setIsSubmitting(false);

        if (isUpdated) {
            setCurrentPassword("");
            setPassword("");
            setPassword_Confirmation("");
        }
    };
    useEffect(() => {
        if (success) {
            window.location.reload();
        }
    }, [success]);
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
                                    <Link to="/instructor/lesson" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100">
                                        <div className=" mr-3  px-1 rounded-full">
                                            <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/lesson.svg" className="w-7" alt="" />
                                        </div>
                                        <p className="font-semibold text-base">Khóa học của tôi</p>
                                    </Link>
                                </li>
                                <li className="mb-3">
                                    <Link to="/instructor/history" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100">
                                        <div className=" mr-3 px-1 rounded-full">
                                            <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/history.svg" className="w-7" alt="" />
                                        </div>
                                        <p className="font-semibold text-base">Lịch sử mua hàng</p>
                                    </Link>
                                </li>
                                <li className="mb-3">
                                    <Link to="/instructor/notification" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100 ">
                                        <div className=" mr-3  px-1 rounded-full">
                                            <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/notification.svg" className="w-7" alt="" />
                                        </div>
                                        <p className="font-semibold text-base">Thông báo</p>
                                    </Link>
                                </li>
                                <li className="mb-3">
                                    <Link to="/instructor/profile" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 bg-gray-100">
                                        <div className="bg-yellow-400 mr-3 px-1 rounded-full">
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

                                {/* user info */}
                                <div className="flex items-center space-x-4">
                                    {loading ? (
                                        <div className="flex justify-between items-center gap-2 me-5">
                                            <div className="">
                                                <Skeleton className="w-12 h-12 rounded-full" />
                                            </div>
                                            <div className="space-y-2">
                                                <Skeleton className="w-20 h-3 " />
                                                <Skeleton className="w-20 h-3 " />

                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
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
                                                            <p className="text-gray-600 text-sm">
                                                                {instructor?.role === "teacher" ? 'Giảng viên' : instructor?.role}
                                                            </p>

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
                                                        {/* <img src="./src/assets/images/toggle.png"  alt="" /> */}
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
                                                                        <Link to="/instructor" className="flex items-center px-4 py-2 rounded-2xl text-gray-700  hover:bg-gray-100">
                                                                            <div className=" mr-3 px-1 rounded-full">
                                                                                <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/dashboard.svg" className="w-7" alt="" />
                                                                            </div>
                                                                            <p className="font-semibold text-base">Bảng điều khiển</p>
                                                                        </Link>

                                                                    </li>
                                                                    <li className="mb-3">
                                                                        <Link to="/instructor/lesson" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100">
                                                                            <div className=" mr-3 px-1 rounded-full">
                                                                                <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/lesson.svg" className="w-7" alt="" />
                                                                            </div>
                                                                            <p className="font-semibold text-base">Khóa học của tôi</p>
                                                                        </Link>
                                                                    </li>
                                                                    <li className="mb-3">
                                                                        <Link to="/instructor/history" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100">
                                                                            <div className=" mr-3 px-1 rounded-full">
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
                                                                        <Link to="/instructor/profile" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 bg-gray-100">
                                                                            <div className="bg-yellow-400  mr-3 px-1 rounded-full">
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
                                    )}

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
                                        {showPasswordTab && (
                                            <TabsTrigger value="password" className="rounded-xl">
                                                <div className=" py-2 text-base font-bold text-gray-600">
                                                    Mật khẩu
                                                </div>
                                            </TabsTrigger>
                                        )}
                                    </div>
                                </TabsList>
                                {/* tabs - content */}
                                <div className="my-5">


                                    {/* profile */}
                                    <TabsContent value="profile" className="">
                                        <form onSubmit={handleUpdateProfile}>
                                            <div className="bg-white rounded-xl py-5  w-full mx-auto">
                                                <div className="">
                                                    {/* header */}
                                                    <div className="flex justify-between items-center px-8">
                                                        <div className="">
                                                            <span className="text-xl font-bold">Sửa hồ sơ của bạn</span>
                                                            <p>Điều này sẽ được chia sẻ với các học viên khác</p>
                                                        </div>
                                                        <div className="">
                                                            <button
                                                                className="bg-yellow-400 px-4 py-2 rounded-xl font-bold sm:block hidden"
                                                                disabled={isProfileSubmitting}
                                                            >
                                                                {isProfileSubmitting ? "Đang lưu..." : "Lưu"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <hr className="my-5" />
                                                    {/* content */}
                                                    <div className="px-8">

                                                        {/* img */}
                                                        <div className="image mb-5">
                                                            <p className="font-bold text-sm my-3">Ảnh hồ sơ</p>
                                                            <div className="flex items-center gap-20">
                                                                <div className="rounded-xl border-gray-300 border">
                                                                    {currentAvatar ? (
                                                                        <img src={currentAvatar} alt="Avatar" className="rounded-xl" width="150" height="150" />
                                                                    ) : (
                                                                        <p className="font-bold px-14 py-10">Ảnh</p>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <Label className="font-medium text-sm mb-2">Nhập ảnh của bạn vào đây để cập nhật avatar</Label>
                                                                    <Input id="picture" type="file" onChange={handleFileChange} />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* name  */}
                                                        <div className="w-full my-5">
                                                            <Label htmlFor="firstname" className="flex gap-2 text-base"><span className="text-red-600">*</span><p className="text-sm">Tên</p></Label>
                                                            <Input value={userName} onChange={(e) => setUserName(e.target.value)} type="firstname" id="firstname" placeholder="Tên" className="p-6 mt-2 rounded-xl font-semibold text-base" />
                                                        </div>

                                                        {/* email  */}
                                                        <div className="w-full my-5 gap-5">
                                                            <div className="">
                                                                <Label htmlFor="email" className="flex gap-2 text-base"><p className="text-sm">Email</p></Label>
                                                                <Input disabled type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="p-6 mt-2 rounded-xl font-semibold" />
                                                            </div>

                                                        </div>

                                                        {/* button - hidden */}
                                                        <div className="">
                                                            <button className="bg-yellow-400 px-4 py-2 rounded-xl font-bold sm:hidden block">Lưu</button>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </form>

                                    </TabsContent>

                                    {/* password */}
                                    <TabsContent value="password">
                                        <form onSubmit={handleChangePassword}>
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
                                                            <Input
                                                                placeholder="Nhập mật khẩu hiện tại..."
                                                                className="text-sm py-7"
                                                                type="password"
                                                                value={current_password}
                                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                            />                                                    </div>
                                                    </div>

                                                    {/* new password */}
                                                    <div className="my-10 gap-5">
                                                        <div className="w-[100%]">
                                                            <Label htmlFor="newpassword" className="flex gap-2 text-base"><span className="text-red-600">*</span><p className="text-sm">Mật khẩu mới</p></Label>
                                                            <Input
                                                                placeholder="Nhập mật khẩu mới..."
                                                                className="text-sm py-7"
                                                                type="password"
                                                                value={password}
                                                                onChange={(e) => setPassword(e.target.value)}
                                                            />                                                    </div>
                                                    </div>

                                                    {/* confirm password */}
                                                    <div className="my-10 gap-5">
                                                        <div className="w-[100%]">
                                                            <Label htmlFor="confirmpassword" className="flex gap-2 text-base"><span className="text-red-600">*</span><p className="text-sm">Xác nhận mật khẩu</p></Label>
                                                            <Input
                                                                placeholder="Xác nhận mật khẩu mới..."
                                                                className="text-sm py-7"
                                                                type="password"
                                                                value={password_confirmation}
                                                                onChange={(e) => setPassword_Confirmation(e.target.value)}
                                                            />                                                    </div>
                                                    </div>

                                                    {/* save button */}
                                                    <div className="my-5">
                                                        <button className="bg-yellow-400 p-3 font-bold rounded-xl">Lưu mật khẩu</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>

                                    </TabsContent>
                                </div>
                            </Tabs>


                        </div>
                    </div>
                </div>
            </section>
            <Toaster />
        </>
    )
}
