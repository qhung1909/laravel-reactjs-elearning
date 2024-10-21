import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@radix-ui/react-dropdown-menu"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { useContext } from 'react';
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
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;
    const [_success, setSuccess] = useState("");
    const [error, setError] = useState("");
    // const [userName, setUserName] = useState('');
    // const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [currentAvatar, setCurrentAvatar] = useState('');
    const navigate = useNavigate();

    const { user,fetchUser, loading } = useContext(UserContext);
    const [userName, setUserName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');

    useEffect(() => {
        if (user) {
            setUserName(user.name);
            setEmail(user.email);
            setCurrentAvatar(user.avatar);
        }
    }, [user]);

    if (loading) return <p>Đang tải...</p>;



    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            setCurrentAvatar(URL.createObjectURL(file));
        }
    };

    const updateUserProfile = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("access_token");
        if (!userName.trim()) {
            notify('Tên tài khoản không được để trống', 'error');
            setError('Thiết lập thất bại')
            return;
        }
        try {
            setSuccess("");
            setError("");
            const formData = new FormData();
            formData.append('name', userName);
            formData.append('email', email);
            if (avatar) {
                formData.append('file', avatar);
            }
            const response = await axios.post(`${API_URL}/auth/user/profile`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                    'x-api-secret': `${API_KEY}`,
                },
            });
            notify('Cập nhật thành công', 'success');
            setSuccess('Cập nhật thành công');
            fetchUser();
        } catch (error) {
            console.log('Error updating profile', error);
            setError("Cập nhật thất bại");
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
                                <form onSubmit={updateUserProfile}>

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

                                    <div className="mb-5">
                                        <div className="">
                                            <Button type="submit" className=" text-xs px-3 hover:text-white duration-300">Update hồ sơ</Button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
            <Toaster />

        </>
    )
}
