import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-dropdown-menu"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState, useContext } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import toast, { Toaster } from 'react-hot-toast';
import { UserContext } from "../context/usercontext";
import { User, History, Bell, Heart, Camera, Mail, Lock, Key } from "lucide-react";

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

    const navigate = useNavigate();

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
                                <p className="text-gray-500 text-sm mt-1">Quản lý cài đặt và thông tin tài khoản của bạn</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:grid grid-cols-4 gap-8">
                        {/* Sidebar */}
                        <div className="col-span-1 my-6">
                            <ul className="gap-2 text-sm font-medium flex lg:flex-col">
                                <li className="w-full">
                                    <Link 
                                        to="/user/profile"
                                        className="flex items-center gap-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
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
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-yellow-50 rounded-xl">
                                        <User className="w-5 h-5 text-yellow-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Thông tin cơ bản</h3>
                                        <p className="text-sm text-gray-500">Thông tin hiển thị công khai của bạn</p>
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
