import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-dropdown-menu"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState, useContext } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import toast, { Toaster } from 'react-hot-toast';
import { UserContext } from "../context/usercontext";


export const UserProfile = () => {
    const { user, updateUserProfile, updatePassword } = useContext(UserContext);
    const [_success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [currentAvatar, setCurrentAvatar] = useState('');
    const [userName, setUserName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState("");
    const [current_password, setCurrentPassword] = useState("");
    const [password_confirmation, setPassword_Confirmation] = useState("")
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
    const handleUpdateProfile = (e) => {
        e.preventDefault();
        updateUserProfile(userName, email, avatar);
    };


    // hàm xử lý validate thay đổi mật khẩu
    const handleChangePassword = async (e) => {
        e.preventDefault();
        const isUpdated = await updatePassword(current_password, password, password_confirmation);
        if (isUpdated) {
            setCurrentPassword('');
            setPassword('');
            setPassword_Confirmation('');
            setError('');
        }
    };

    return (
        <>

            <section className="userprofile my-10 mx-auto  px-4 lg:px-10 xl:px-20">
                <div className="border border-gray-200 rounded-xl px-10 py-5 shadow-lg">
                    <div className="py-5 border-b">
                        <span className="font-semibold text-xl">Cài đặt</span>
                        <p className="text-gray-500 text-sm">Quản lý cài đặt tài khoản của bạn</p>
                    </div>
                    <div className="lg:grid grid-cols-4 gap-5 ">
                        <div className="col-span-1 my-3 lg:my-5 ">
                            <ul className="gap-3 text-sm font-medium max-lg:items-center flex lg:flex-col">
                                <li className="bg-gray-100 py-1 lg:py-2 px-3 rounded-md">
                                    <Link to="/user/profile">
                                        <p>Hồ sơ cá nhân</p>
                                    </Link>
                                </li>
                                <li className="py-3 lg:py-2 px-3 rounded-md">
                                    <Link className="hover:underline" to="/user/orderhistory">
                                        <p>Lịch sử mua hàng</p>
                                    </Link>
                                </li>
                                <li className="py-3 lg:py-2 px-3 rounded-md">
                                    <Link className="hover:underline" to="/user/noti">
                                        <p>Thông báo</p>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="col-span-3 my-3 lg:my-5">
                            <div className="border-b pb-5">
                                <span className="font-medium">Thông tin cơ bản</span>
                                <p className="text-sm text-gray-500 ">Người khác sẽ nhìn ra bạn với những thông tin dưới đây</p>
                            </div>
                            <div className="my-5">
                                <Tabs defaultValue="profile" className="w-full">
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

                                    {/* account */}
                                    <TabsContent value="profile">
                                        <form onSubmit={handleUpdateProfile}>
                                            {/* img */}
                                            <div className="image mb-5">
                                                <p className="font-bold text-sm my-5">Ảnh hồ sơ</p>
                                                <div className="flex items-center gap-20">
                                                    <div className=" border-gray-300 border rounded-2xl">
                                                        <div className="w-52">
                                                            {currentAvatar ? (
                                                                <img src={currentAvatar} alt="User Avatar" className="rounded-2xl w-full h-full object-cover" />
                                                            ) : (
                                                                <span className="text-gray-500 flex justify-center p-10">Ảnh</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Label className="font-medium text-sm mb-2">Nhập ảnh của bạn vào đây để cập nhật avatar</Label>
                                                        <Input id="picture" type="file" onChange={handleFileChange} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* name  */}
                                            <div className="mb-5">
                                                <div className="space-y-2">
                                                    <Label className="font-medium text-sm">Tên tài khoản</Label>
                                                    <Input

                                                        placeholder="Nhập tên tài khoản của bạn tại đây..."
                                                        className="text-sm py-7"
                                                        value={userName}
                                                        onChange={(e) => setUserName(e.target.value)}
                                                    />
                                                    <p className="text-xs text-gray-500">Đây là tên hiển thị công khai của bạn. Nó có thể là tên thật hoặc biệt danh của bạn.</p>
                                                </div>
                                            </div>

                                            {/* email */}
                                            <div className="mb-5">
                                                <div className="space-y-2">
                                                    <Label className="font-medium text-sm">Email</Label>
                                                    <Input
                                                        disabled
                                                        placeholder="Nhập email của bạn tại đây..."
                                                        className="text-sm py-7"
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                    <p className="text-xs text-gray-500">Mỗi tài khoản chỉ sử dụng một email.</p>
                                                </div>
                                            </div>
                                            <div className="my-5">
                                                <button className="bg-yellow-400 p-3 font-bold rounded-xl">Lưu hồ sơ</button>
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
                                                    <div className="my-5 gap-5">
                                                        <div className="w-[100%]">
                                                            <Label htmlFor="password" className="flex gap-2 text-base"><span className="text-red-600">*</span><p className="text-sm">Mật khẩu hiện tại</p></Label>
                                                            <Input
                                                                placeholder="Nhập mật khẩu hiện tại..."
                                                                className="text-sm py-7"
                                                                type="password"
                                                                value={current_password}
                                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* new password */}
                                                    <div className="my-5 gap-5">
                                                        <div className="w-[100%]">
                                                            <Label htmlFor="newpassword" className="flex gap-2 text-base"><span className="text-red-600">*</span><p className="text-sm">Mật khẩu mới</p></Label>
                                                            <Input
                                                                placeholder="Nhập mật khẩu mới..."
                                                                className="text-sm py-7"
                                                                type="password"
                                                                value={password}
                                                                onChange={(e) => setPassword(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* confirm password */}
                                                    <div className="my-5 gap-5">
                                                        <div className="w-[100%]">
                                                            <Label htmlFor="confirmpassword" className="flex gap-2 text-base"><span className="text-red-600">*</span><p className="text-sm">Xác nhận mật khẩu</p></Label>
                                                            <Input
                                                                placeholder="Xác nhận mật khẩu mới..."
                                                                className="text-sm py-7"
                                                                type="password"
                                                                value={password_confirmation}
                                                                onChange={(e) => setPassword_Confirmation(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* save button */}
                                                    <div className="my-5">
                                                        <button className="bg-yellow-400 p-3 font-bold rounded-xl">Lưu mật khẩu</button>
                                                    </div>
                                                </div>
                                            </div>

                                        </form>
                                    </TabsContent>
                                </Tabs>


                            </div>
                        </div>
                    </div>
                </div>

            </section>
            <Toaster />

        </>
    )
}
