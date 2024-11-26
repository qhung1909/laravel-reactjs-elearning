import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-dropdown-menu"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState, useContext } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import toast, { Toaster } from 'react-hot-toast';
import { UserContext } from "../context/usercontext";
import { User, History, Bell, Heart, Camera, Mail, Lock, Key } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

const notify = (message, type) => {
    if (type === 'success') {
        toast.success(message);
    } else {
        toast.error(message)
    }
}

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button";
import axios from "axios";
export const UserProfile = () => {
    const { user, updateUserProfile, updatePassword } = useContext(UserContext);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [currentAvatar, setCurrentAvatar] = useState('');
    const [userName, setUserName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState("");
    const [current_password, setCurrentPassword] = useState("");
    const [password_confirmation, setPassword_Confirmation] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const navigate = useNavigate();
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("access_token");

    // hàm xử lý từ user thành teacher
    const handleTransformInstructor = async () => {
        try {
            const response = await axios.patch(`${API_URL}/update-role`,
                {
                    user_id: user.user_id
                },
                {
                    headers: {
                        "x-api-secret": API_KEY,
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            if (response.data.message === "Role updated successfully") {
                notify("Cập nhật vai trò thành công!", 'success');
                localStorage.setItem('showWelcomeDialog', 'true');
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            }

        } catch (error) {
            console.error("Lỗi khi cập nhật vai trò:", error);
        }
    }

    useEffect(() => {
        if (user) {
            setUserName(user.name);
            setEmail(user.email);
            setCurrentAvatar(user.avatar);
        }
    }, [user]);

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
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
            <section className="userprofile py-12 mx-auto px-4 lg:px-10 xl:px-20">
                <div className="border-0 rounded-2xl px-8 py-6 shadow-xl bg-white/80 backdrop-blur-sm">
                    {/* Header */}
                    <div className="py-6 border-b border-gray-200/80">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-50 rounded-xl">
                                <User className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <h2 className="font-bold text-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                                    Cài đặt tài khoản
                                </h2>
                                <p className="text-gray-500 text-sm ">Quản lý cài đặt và thông tin tài khoản của bạn</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:grid grid-cols-4 gap-8">
                        {/* Sidebar */}
                        <div className="col-span-1 my-6">
                            <ul className="gap-2 text-sm font-medium max-w-screen-md:grid grid-cols-2 lg:flex-col space-y-3">
                                <li className="w-full">
                                    <Link
                                        to="/user/profile"
                                        className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-white transition-all duration-200"
                                    >
                                        <User className="w-4 h-4" />
                                        <span>Hồ sơ cá nhân</span>
                                    </Link>
                                </li>
                                <li className="w-full">
                                    <Link
                                        to="/user/orderhistory"
                                        className="flex items-center gap-3 p-3 hover:bg-yellow-50 rounded-xl transition-colors"
                                    >
                                        <History className="w-4 h-4" />
                                        <span>Lịch sử mua hàng</span>
                                    </Link>
                                </li>
                                <li className="w-full">
                                    <Link
                                        to="/user/noti"
                                        className="flex items-center gap-3 p-3 hover:bg-yellow-50 rounded-xl transition-colors"
                                    >
                                        <Bell className="w-4 h-4" />
                                        <span>Thông báo</span>
                                    </Link>
                                </li>
                                <li className="w-full">
                                    <Link
                                        to="/user/favorite"
                                        className="flex items-center gap-3 p-3 hover:bg-yellow-50 rounded-xl transition-colors"
                                    >
                                        <Heart className="w-4 h-4" />
                                        <span>Yêu thích</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Main Content */}
                        <div className="col-span-3 my-6">
                            <div className="border-b pb-6">
                                <div className="md:flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-yellow-50 rounded-xl">
                                            <User className="w-5 h-5 text-yellow-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">Thông tin cơ bản</h3>
                                            <p className="text-sm text-gray-500">Thông tin hiển thị công khai của bạn</p>
                                        </div>
                                    </div>
                                    <div className="mt-5 lg:mt-0">
                                        <Dialog>
                                            <DialogTrigger>
                                                <div className="rounded bg-gradient-to-br  from-purple-500 to-indigo-600 p-3">
                                                    <p className="text-white font-semibold px-3">
                                                        Bạn là một giảng viên?
                                                    </p>
                                                </div>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-[900px]">
                                                <DialogHeader>
                                                    <DialogTitle className="text-left border-b border-gray-300 pb-3">
                                                        Hãy trở thành một trong những giảng viên chính thức tại Antlearn!
                                                    </DialogTitle>
                                                    <DialogDescription className="max-h-96 overflow-y-auto">
                                                        <div className="max-w-4xl text-left space-y-6">
                                                            <div className="">
                                                                <h1 className="text-xl font-bold text-gray-800">Điều khoản trở thành Giảng viên   </h1>
                                                            </div>

                                                            {/* Yêu cầu chuyên môn */}
                                                            <div className="bg-white rounded-lg  ">
                                                                <h2 className="text-lg font-semibold text-gray-800 mb-4">I. Yêu cầu chuyên môn</h2>
                                                                <div className="space-y-3">
                                                                    <p className="text-gray-700">1. Tốt nghiệp đại học chính quy từ các trường đại học có uy tín, chuyên ngành phù hợp với lĩnh vực giảng dạy</p>
                                                                    <p className="text-gray-700">2. Có ít nhất 2 năm kinh nghiệm làm việc thực tế trong lĩnh vực đăng ký giảng dạy</p>
                                                                    <p className="text-gray-700">3. Có chứng chỉ sư phạm hoặc kinh nghiệm giảng dạy là một lợi thế</p>
                                                                    <p className="text-gray-700">4. Khả năng diễn đạt tốt, kỹ năng truyền đạt rõ ràng, logic</p>
                                                                </div>
                                                            </div>

                                                            {/* Yêu cầu về thời gian và cam kết */}
                                                            <div className="bg-white rounded-lg  ">
                                                                <h2 className="text-lg font-semibold text-gray-800 mb-4">II. Yêu cầu về thời gian và cam kết</h2>
                                                                <div className="space-y-3">
                                                                    <p className="text-gray-700">1. Cam kết dành ít nhất 10 giờ/tuần để giảng dạy và tương tác với học viên</p>
                                                                    <p className="text-gray-700">2. Tham gia đầy đủ các buổi đào tạo giảng viên do AntLearn tổ chức</p>
                                                                    <p className="text-gray-700">3. Cập nhật và phát triển nội dung khóa học thường xuyên</p>
                                                                    <p className="text-gray-700">4. Phản hồi thắc mắc của học viên trong vòng 24 giờ</p>
                                                                </div>
                                                            </div>

                                                            {/* Yêu cầu về tài liệu và nội dung giảng dạy */}
                                                            <div className="bg-white rounded-lg  ">
                                                                <h2 className="text-lg font-semibold text-gray-800 mb-4">III. Yêu cầu về tài liệu và nội dung giảng dạy</h2>
                                                                <div className="space-y-3">
                                                                    <p className="text-gray-700">1. Xây dựng giáo án chi tiết cho mỗi khóa học</p>
                                                                    <p className="text-gray-700">2. Chuẩn bị tài liệu học tập chất lượng cao, bài tập thực hành</p>
                                                                    <p className="text-gray-700">3. Thiết kế nội dung phù hợp với chuẩn đầu ra của khóa học</p>
                                                                    <p className="text-gray-700">4. Tuân thủ quy định về bản quyền và sở hữu trí tuệ</p>
                                                                </div>
                                                            </div>

                                                            {/* Quyền lợi của giảng viên */}
                                                            <div className="bg-white rounded-lg  ">
                                                                <h2 className="text-lg font-semibold text-gray-800 mb-4">IV. Quyền lợi của giảng viên</h2>
                                                                <div className="space-y-3">
                                                                    <p className="text-gray-700">1. Thu nhập hấp dẫn dựa trên số giờ giảng dạy và số lượng học viên</p>
                                                                    <p className="text-gray-700">2. Được đào tạo và phát triển chuyên môn liên tục</p>
                                                                    <p className="text-gray-700">3. Có cơ hội networking với cộng đồng giáo dục trực tuyến</p>
                                                                    <p className="text-gray-700">4. Được hỗ trợ về mặt kỹ thuật và công nghệ giảng dạy</p>
                                                                </div>
                                                            </div>

                                                            {/* Quy trình trở thành giảng viên */}
                                                            <div className="bg-white rounded-lg  ">
                                                                <h2 className="text-lg font-semibold text-gray-800 mb-4">V. Quy trình trở thành giảng viên</h2>
                                                                <div className="space-y-3">
                                                                    <p className="text-gray-700">1. Nộp hồ sơ ứng tuyển trực tuyến</p>
                                                                    <p className="text-gray-700">2. Tham gia phỏng vấn chuyên môn</p>
                                                                    <p className="text-gray-700">3. Thực hiện bài giảng thử</p>
                                                                    <p className="text-gray-700">4. Tham gia khóa đào tạo giảng viên</p>
                                                                    <p className="text-gray-700">5. Ký kết hợp đồng và bắt đầu giảng dạy</p>
                                                                </div>
                                                            </div>

                                                            <div className="p-4 bg-yellow-50 rounded-lg">
                                                                <p className="text-sm text-gray-600 italic">
                                                                    Lưu ý: AntLearn có quyền thay đổi các điều khoản này mà không cần thông báo trước.
                                                                    Mọi thay đổi sẽ được cập nhật trên website chính thức của chúng tôi.
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-between items-center  mt-3">
                                                            <div className="flex items-center gap-1">
                                                                <div className="">
                                                                    <Checkbox checked={isChecked} onCheckedChange={(checked) => setIsChecked(checked)} />

                                                                </div>
                                                                <div className="">
                                                                    <p>Tôi đã đọc điều khoản</p>
                                                                </div>
                                                            </div>
                                                            <div className="">
                                                                <Button disabled={!isChecked} onClick={handleTransformInstructor}>
                                                                    Trở thành giảng viên!
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </DialogDescription>
                                                </DialogHeader>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>

                            </div>

                            <div className="mt-6">
                                <Tabs defaultValue="profile" className="w-full">
                                    <TabsList className="bg-yellow-50/80 p-1 rounded-xl">
                                        <TabsTrigger
                                            value="profile"
                                            className="data-[state=active]:bg-white data-[state=active]:text-yellow-600 data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
                                        >
                                            <div className="flex items-center gap-2 py-2 px-4">
                                                <User className="w-4 h-4" />
                                                <span className="font-semibold">Chỉnh sửa hồ sơ</span>
                                            </div>
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="password"
                                            className="data-[state=active]:bg-white data-[state=active]:text-yellow-600 data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
                                        >
                                            <div className="flex items-center gap-2 py-2 px-4">
                                                <Lock className="w-4 h-4" />
                                                <span className="font-semibold">Mật khẩu</span>
                                            </div>
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="profile" className="mt-6">
                                        <form onSubmit={handleUpdateProfile}>
                                            {/* Avatar Section */}
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-8">
                                                    <div className="relative group">
                                                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                                            {currentAvatar ? (
                                                                <img src={currentAvatar} alt="Avatar" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full bg-yellow-50 flex items-center justify-center">
                                                                    <User className="w-12 h-12 text-yellow-600" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <label
                                                            htmlFor="avatar-upload"
                                                            className="absolute bottom-0 right-0 p-2 bg-yellow-500 rounded-full text-white cursor-pointer shadow-lg hover:bg-yellow-500 transition-colors"
                                                        >
                                                            <Camera className="w-4 h-4" />
                                                        </label>
                                                        <input
                                                            id="avatar-upload"
                                                            type="file"
                                                            className="hidden"
                                                            onChange={handleFileChange}
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold mb-2">Ảnh hồ sơ</h4>
                                                        <p className="text-sm text-gray-500">
                                                            Chọn ảnh đại diện. Kích thước đề xuất 200x200px
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Name Input */}
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium flex items-center gap-2">
                                                        <User className="w-4 h-4 text-gray-500" />
                                                        Tên hiển thị
                                                    </Label>
                                                    <Input
                                                        value={userName}
                                                        onChange={(e) => setUserName(e.target.value)}
                                                        className="h-12 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400"
                                                        placeholder="Nhập tên của bạn"
                                                    />
                                                </div>

                                                {/* Email Input */}
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium flex items-center gap-2">
                                                        <Mail className="w-4 h-4 text-gray-500" />
                                                        Email
                                                    </Label>
                                                    <Input
                                                        value={email}
                                                        disabled
                                                        className="h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl"
                                                    />
                                                </div>

                                                {/* Save Button */}
                                                <button
                                                    type="submit"
                                                    disabled={isProfileSubmitting}
                                                    className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-70"
                                                >
                                                    {isProfileSubmitting ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                            <span>Đang lưu...</span>
                                                        </div>
                                                    ) : (
                                                        'Lưu thay đổi'
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </TabsContent>

                                    <TabsContent value="password" className="mt-6">
                                        <form onSubmit={handleChangePassword} className="space-y-6">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-2 bg-yellow-50 rounded-xl">
                                                    <Key className="w-5 h-5 text-yellow-500" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-lg">Đổi mật khẩu</h3>
                                                    <p className="text-sm text-gray-500">Cập nhật mật khẩu mới để bảo vệ tài khoản</p>
                                                </div>
                                            </div>

                                            {/* Password Fields */}
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">Mật khẩu hiện tại</Label>
                                                    <Input
                                                        type="password"
                                                        value={current_password}
                                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                                        className="h-12 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">Mật khẩu mới</Label>
                                                    <Input
                                                        type="password"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        className="h-12 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">Xác nhận mật khẩu</Label>
                                                    <Input
                                                        type="password"
                                                        value={password_confirmation}
                                                        onChange={(e) => setPassword_Confirmation(e.target.value)}
                                                        className="h-12 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400"
                                                    />
                                                </div>
                                            </div>

                                            {/* Save Button */}
                                            <button
                                                type="submit"
                                                className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                                            >
                                                Cập nhật mật khẩu
                                            </button>
                                        </form>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Toaster position="top-center" />
        </div>
    );
}
