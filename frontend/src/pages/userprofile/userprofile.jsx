import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@radix-ui/react-dropdown-menu"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react";
import axios from "axios";


export const UserProfile = () => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);


    const refreshToken = async () => {
        const storedRefreshToken = localStorage.getItem('refresh_token');
        if (!storedRefreshToken) {
            alert('Session expired. Please log in again.');
            return;
        }
        try {
            const res = await fetch(`${API_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh_token: storedRefreshToken }),
            });

            if (!res.ok) {
                alert('Session expired. Please log in again.');
                return;
            }

            const data = await res.json();
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            return data.access_token;
        } catch (error) {
            alert('Session expired. Please log in again.');
        }
    };

    const updateUserProfile = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Lấy access_token từ localStorage
        let token = localStorage.getItem('access_token');
        if (!token) {
            alert('Bạn chưa đăng nhập.');
            return;
        }

        try {
            const response = await axios.put(
                `${API_URL}/auth/user/profile`,
                {
                    name: userName,
                    email: email,
                    phone: phone,
                    description: description,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'x-api-secret': `${API_KEY}`,
                    },
                }
            );
            console.log('Update hồ sơ thành công', response.data);
        } catch (error) {
            console.error('Lỗi khi cập nhật hồ sơ:', error);
            if (error.response && error.response.status === 401) {
                // Nếu token hết hạn, refresh token và thử lại
                const newToken = await refreshToken();
                if (newToken) {
                    token = newToken;
                    await updateUserProfile(e); // Thử lại với token mới
                }
            } else {
                console.error('Chi tiết lỗi:', error.response?.data);
            }
        } finally {
            setLoading(false);
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
                                    <Link to="/userprofile">
                                        <p>Hồ sơ cá nhân</p>
                                    </Link>
                                </li>
                                <li className="py-3 lg:py-2 px-3 rounded-md">
                                    <Link className="hover:underline" to="/useraccount">
                                        <p>Tài khoản</p>
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
                                    <Label htmlFor="userName">Tên người dùng</Label>
                                    <Input
                                        id="userName"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                    />

                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />

                                    <Label htmlFor="phone">Số điện thoại</Label>
                                    <Input
                                        id="phone"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />

                                    <Label htmlFor="description">Mô tả</Label>
                                    <Textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />

                                    <Button type="submit" disabled={loading}>
                                        {loading ? 'Đang cập nhật...' : 'Cập nhật hồ sơ'}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

            </section>

        </>
    )
}
