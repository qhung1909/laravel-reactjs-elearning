import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@radix-ui/react-dropdown-menu"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { UserContext } from "../usercontext/usercontext";
const notify = (message, type) => {
    if (type === 'success') {
        toast.success(message, {
            style: {
                padding: '16px'
            }
        });
    } else {
        toast.error(message, {
            style: {
                padding: '16px'
            }
        })
    }
}

export const UserProfile = () => {
    const { user, updateUserProfile, updatePassword } = useContext(UserContext);
    const [_success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [currentAvatar, setCurrentAvatar] = useState('');
    const [userName, setUserName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState(""); // Trạng thái lưu mật khẩu
    const [current_password, setCurrentPassword] = useState("");
    const [password_confirmation, setPassword_Confirmation] = useState("")
    const [isCurrentPasswordCorrect, setIsCurrentPasswordCorrect] = useState(false);
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


    // Hàm xử lý validate current password
    const validateCurrentPassword = async () => {
        // Kiểm tra mật khẩu hiện tại
        const isUpdated = await updatePassword(current_password, '', ''); // Chỉ kiểm tra mật khẩu hiện tại
        if (isUpdated) {
            setIsCurrentPasswordCorrect(true);
            setError('');
        } else {
            console.log('Mật khẩu hiện tại sai');
            setError('Mật khẩu hiện tại không chính xác');
            setIsCurrentPasswordCorrect(false);
        }
    };



    // hàm xử lý thay đổi mk
    const handleChangePassword = async (e) => {
        e.preventDefault();

        await validateCurrentPassword();

        if (!isCurrentPasswordCorrect) {
            return;
        }

        if (password !== password_confirmation) {
            setError("Mật khẩu xác nhận không khớp");
            return;
        }

        const isUpdated = await updatePassword(current_password, password, password_confirmation);
        if (isUpdated) {
            toast.success("Cập nhật mật khẩu thành công");
            setCurrentPassword('');
            setPassword('');
            setPassword_Confirmation('');
            setError(''); // Xóa lỗi nếu có
        }
        else {
            setError('Có lỗi xảy ra khi cập nhật mật khẩu');
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
                                    <Link className="hover:underline" to="/user/account">
                                        <p>Cài đặt</p>
                                    </Link>
                                </li>
                                <li className="py-3 lg:py-2 px-3 rounded-md">
                                    <Link className="hover:underline" to="/usernoti">
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
                                <form onSubmit={handleUpdateProfile}>

                                    {/* img */}
                                    <div className="image mb-5">
                                        <p className="font-bold text-sm my-3">Ảnh hồ sơ</p>
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
                                </form>

                                {/* password */}

                                <form onSubmit={handleChangePassword}>
                                    <div>
                                        <Label className="font-medium text-sm">Mật khẩu hiện tại</Label>
                                        <Input
                                            placeholder="Nhập mật khẩu hiện tại..."
                                            className="text-sm py-7"
                                            type="password"
                                            value={current_password}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                        />
                                        {error && <p className="text-red-500">{error}</p>}
                                    </div>
                                    {isCurrentPasswordCorrect && (

                                        <div className="flex">

                                            <div>
                                                <Label className="font-medium text-sm">Mật khẩu mới</Label>
                                                <Input
                                                    placeholder="Nhập mật khẩu mới..."
                                                    className="text-sm py-7"
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Label className="font-medium text-sm">Xác nhận mật khẩu</Label>
                                                <Input
                                                    placeholder="Xác nhận mật khẩu mới..."
                                                    className="text-sm py-7"
                                                    type="password"
                                                    value={password_confirmation}
                                                    onChange={(e) => setPassword_Confirmation(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="mb-5">
                                        <div className="">
                                            <Button type="submit" className=" text-xs px-3 hover:text-white duration-300">Update password</Button>
                                        </div>
                                    </div>
                                </form>


                                <div className="mb-5">
                                    <div className="">
                                        <Button type="submit" className=" text-xs px-3 hover:text-white duration-300">Update hồ sơ</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
            <Toaster />

        </>
    )
}
