import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@radix-ui/react-dropdown-menu"
import { Link } from "react-router-dom"
import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';

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
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
        }
    };

    const fetchUserProfile = async () => {
        const token = localStorage.getItem("access_token");
        try {
            const response = await axios.get(`${API_URL}/auth/me`, {
                headers: {
                    'x-api-secret': `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            const userData = response.data;
            setUserName(userData.name || '');
            setEmail(userData.email || '')
            setAvatar(userData.avatar ? `${API_URL}/${userData.avatar}` : null);
        } catch (error) {
            console.log('Error fetching user profile', error)
        }
    }

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
            const response = await axios.put(`${API_URL}/auth/user/profile`, {
                name: userName,
                email: email,

            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'x-api-secret': `${API_KEY}`,
                },
            });
            notify('Cập nhật thành công', 'success');
            setSuccess('Cập nhật thành công');

        } catch (error) {
            console.log('Error updating profile', error);
        }
    };



    useEffect(() => {
        fetchUserProfile();
    }, [])


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
                                    <Link to="/userprofile">
                                        <p>Hồ sơ cá nhân</p>
                                    </Link>
                                </li>
                                <li className="py-3 lg:py-2 px-3 rounded-md">
                                    <Link className="hover:underline" to="/useraccount">
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
                                            <div className="rounded-xl px-10 py-14 border-gray-300 border">
                                                {avatar ? (
                                                    <img src={URL.createObjectURL(avatar)} alt="Avatar Preview" className="rounded-xl" width="150" height="150" />
                                                ) : (
                                                    <p className="font-bold">Ảnh</p>
                                                )}
                                            </div>
                                            <div>
                                                <Label className="font-medium text-sm mb-2">Nhập ảnh của bạn vào đây để cập nhật avatar</Label>
                                                <Input id="picture" type="file" onChange={handleFileChange} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* name */}
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
