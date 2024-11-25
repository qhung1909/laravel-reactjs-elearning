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
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
export const InstructorNotification = () => {
    const { instructor, logout, refreshToken } = useContext(UserContext);
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;
    const [loading, setLoading] = useState(false)
    const [loadingLogout, setLoadingLogout] = useState(false);
    const [_success, setSuccess] = useState("");
    const [selectedType, setSelectedType] = useState("Loại");
    const [message, setMessage] = useState("");
    const [content, setContent] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");

    const navigate = useNavigate();

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/instructor/${instructor.user_id}/students`, {
                headers: {
                    'x-api-secret': `${API_KEY}`,
                },
            });
            if (response.data.success) {
                setUsers(response.data.data);
            }
        } catch (error) {
            notify("Không thể tải danh sách học viên", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitNotification = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');
        const cleanContent = content
            .replace(/<p><br><\/p>/g, '') // Loại bỏ các thẻ `<p><br></p>`
            .replace(/<(.|\n)*?>/g, '') // Loại bỏ tất cả các thẻ HTML
            .trim();

        if (!message || !cleanContent || !selectedUser || selectedType === "Loại") {
            notify("Vui lòng điền đầy đủ thông tin", "error");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                `${API_URL}/auth/send-message`,

                {
                    message,
                    content,
                    user_id: selectedUser,
                    type: selectedType
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "x-api-secret": API_KEY,
                    },
                },
            );

            if (response.data) {
                setMessage("");
                setContent("");
                setSelectedUser("");
                setSelectedType("Loại");
                notify("Gửi thông báo thành công", "success");
                console.log('success')
            }

        } catch (error) {
            notify("Không thể gửi thông báo", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (instructor?.user_id) {
            fetchStudents();
        }
    }, [instructor?.user_id]);

    const handleSetType = (value) => {
        setSelectedType(value);
    }

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

    const getPriorityColor = (type) => {
        switch (type) {
            case 'Low': return 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800';
            case 'Medium': return 'bg-orange-100 hover:bg-orange-200 text-orange-800';
            case 'High': return 'bg-red-100 hover:bg-red-200 text-red-800';
            default: return 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800';
        }
    };
    return (
        <>
            <section className="instructor-notification">
                <div className="flex bg-gray-100 ">
                    {/* Sidebar */}
                    <div className="h-auto w-72 bg-white shadow-md border-gray-100 border-r-[1px] lg:block hidden">
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
                                    <Link to="/instructor" className="flex items-center px-4 py-2 rounded-2xl text-gray-700 hover:bg-gray-100 ">
                                        <div className=" mr-3 px-1  rounded-full">
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
                                        <p className="font-semibold text-base">Bài học của tôi</p>
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
                                    <Link to="/instructor/notification" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 bg-gray-100 ">
                                        <div className="bg-yellow-400 mr-3 px-1 rounded-full">
                                            <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/notification.svg" className="w-7" alt="" />
                                        </div>
                                        <p className="font-semibold text-base">Thông báo</p>
                                    </Link>
                                </li>
                                <li className="mb-3">
                                    <Link to="/instructor/profile" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100">
                                        <div className=" mr-3 px-1 rounded-full">
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
                                                                    <img src="/src/assets/images/antlearn.png" alt="Edumall Logo" className="w-20 h-14 object-cover" />
                                                                </div>
                                                            </div>
                                                        </SheetTitle>
                                                        <SheetDescription>
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
                                                                        <div className=" mr-3 px-1 rounded-full">
                                                                            <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/lesson.svg" className="w-7" alt="" />
                                                                        </div>
                                                                        <p className="font-semibold text-base">Bài học của tôi</p>
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
                                                                    <Link to="/instructor/notification" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 bg-gray-100 ">
                                                                        <div className="bg-yellow-400 mr-3 px-1 rounded-full">
                                                                            <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/notification.svg" className="w-7" alt="" />
                                                                        </div>
                                                                        <p className="font-semibold text-base">Thông báo</p>
                                                                    </Link>
                                                                </li>
                                                                <li className="mb-3">
                                                                    <Link to="/instructor/profile" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100">
                                                                        <div className=" mr-3 px-1 rounded-full">
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
                                </div>
                            </div>
                        </div>

                        {/* Notification content */}
                        <div className="md:p-6 p-2">
                            <div className="mx-auto p-4">
                                <Card className="shadow-lg">
                                    <CardHeader className="space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <CardTitle className="text-2xl font-bold">Tạo thông báo mới</CardTitle>
                                        </div>
                                        <Alert className="bg-yellow-50 border-yellow-200">
                                            <AlertDescription>
                                                Thông báo sẽ được gửi ngay lập tức đến người nhận được chọn
                                            </AlertDescription>
                                        </Alert>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleSubmitNotification} className="space-y-6">
                                            {/* Title Section */}
                                            <div className="space-y-2">
                                                <Label htmlFor="title" className="text-lg font-medium">
                                                    Tiêu đề thông báo
                                                </Label>
                                                <Input
                                                    id="title"
                                                    value={message}
                                                    onChange={(e) => setMessage(e.target.value)}
                                                    placeholder="Nhập tiêu đề thông báo..."
                                                    className="w-full"
                                                />
                                            </div>

                                            {/* Content Section */}
                                            <div className="space-y-2">
                                                <Label htmlFor="content" className="text-lg font-medium">
                                                    Nội dung thông báo
                                                </Label>
                                                <div className=" min-h-[200px] bg-white">
                                                    <ReactQuill
                                                        value={content}
                                                        onChange={setContent}
                                                        className="h-[150px]"
                                                        modules={{
                                                            toolbar: [
                                                                [{ header: [1, 2, 3, false] }],
                                                                ['bold', 'italic', 'underline'],
                                                                [{ list: 'ordered' }, { list: 'bullet' }],
                                                                ['link', 'clean']
                                                            ],
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Recipient Selection */}

                                            <div className="space-y-2">
                                                <span className="font-semibold text-lg">Người nhận:</span>
                                                <div className="relative">
                                                    <select
                                                        value={selectedUser}
                                                        onChange={(e) => setSelectedUser(e.target.value)}
                                                        className="w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition-colors text-gray-700 pr-10">
                                                        <option value="" disabled>Chọn người nhận...</option>
                                                        {users.map((user) => (
                                                            <option key={user.user_id} value={user.user_id}>
                                                                {user.name} - {user.email}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Priority Selection */}
                                            <div className="space-y-2">
                                                <Label className="text-lg font-medium">Mức độ ưu tiên</Label>
                                                <div className="flex gap-2">
                                                    {['Low', 'Medium', 'High'].map((type) => (
                                                        <Badge
                                                            key={type}
                                                            className={`${getPriorityColor(type)} cursor-pointer px-4 py-1 ${selectedType === type ? 'ring-2 ring-offset-2' : ''
                                                                }`}
                                                            onClick={() => setSelectedType(type)}
                                                        >
                                                            {type}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Submit Button */}
                                            <Button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                                            >
                                                {loading ? (
                                                    <div className="flex items-center space-x-2">
                                                        <span className="animate-spin">◌</span>
                                                        <span>Đang gửi...</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center space-x-2">
                                                        <span>Gửi thông báo</span>
                                                    </div>
                                                )}
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
                <Toaster />

            </section>
        </>
    )
}
