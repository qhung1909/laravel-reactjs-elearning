import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

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

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const NewPassword = () => {
    const [password, setPassword] = useState("");
    const [password_confirmation, setConfimationPW] = useState("");
    const [error, setError] = useState("");
    const [_success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [token, setToken] = useState("");

    const setCookie = (name, value, days) => {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
    };

    const getCookie = (name) => {
        return document.cookie.split('; ').reduce((r, v) => {
            const parts = v.split('=');
            return parts[0] === name ? decodeURIComponent(parts[1]) : r
        }, '');
    };

    const deleteCookie = (name) => {
        setCookie(name, '', -1);
    };


    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const tokenFromURL = query.get("token");

        if (tokenFromURL) {
            setCookie("reset-token", tokenFromURL, 1);
            setToken(tokenFromURL);
            window.history.replaceState({}, "", "/new-password");
        } else {
            const savedToken = getCookie("reset-token");
            if (savedToken) setToken(savedToken);
        }
    }, []);

    const newPassword = async () => {
        setLoading(false);

        if (password.length < 6) {
            setError('Mật khẩu phải ít nhất 6 kí tự');
            return;
        }

        if (!password || !password_confirmation) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        if (password !== password_confirmation) {
            setError('Mật khẩu không khớp');
            return;
        }

        const token = getCookie("reset-token");
        if (!token) {
            setError("Không tìm thấy token hoặc token không hợp lệ.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const res = await fetch(`${API_URL}/reset-password/${token}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ password, password_confirmation })
            });

            if (res.status === 422) {
                setError('Mật khẩu mới không được trùng với mật khẩu cũ!');
                return;
            }

            if (res.status === 400) {
                setError("Token không hợp lệ hoặc đã hết hạn.");
                return;
            }

            if (!res.ok) {
                const errorData = await res.json();
                console.log(errorData);
                notify('Có lỗi xảy ra!');
                return;
            }

            if (res.ok) {
                await res.json();
                notify('Đổi mật khẩu thành công', 'success');
                deleteCookie("reset-token");
            }

            setTimeout(() => {
                navigate('/login');
            }, 2000)

        } catch (error) {
            setError('Đã xảy ra lỗi: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        newPassword();
    };



    return (
        <>
            {loading && (
                <div className='loading'>
                    <div className='loading-spin'></div>
                </div>
            )}
            <div className="relative m-auto h-screen overflow-hidden items-center shadow-inner lg:grid  lg:grid-cols-2 pt-32 lg:pt-0">
                <Link className='absolute top-1 left-0 xl:top-8 xl:left-8' to='/'>
                    <div className="flex items-center gap-3">
                        <box-icon name='arrow-back' color='gray' ></box-icon>
                        <p className="text-gray-600">Trang chủ</p>
                    </div>
                </Link>

                <div className=" flex items-center justify-center">

                    <form onSubmit={submit} className="relative mx-auto grid w-[350px] gap-6">
                        <input type="hidden" name="token" value={token} />
                        <div className="text-center">
                            <box-icon name='key' size='lg'></box-icon>
                        </div>
                        <div className="grid gap-2">
                            <h1 className="text-3xl font-bold text-center">Đặt mật khẩu mới</h1>

                        </div>
                        <div className="grid gap-4">

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Mật khẩu</Label>

                                </div>
                                <Input type="password" placeholder="Nhập mật khẩu mới" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Nhập lại mật khẩu</Label>
                                </div>
                                <Input type="password" placeholder="Nhập lại mật khẩu" value={password_confirmation} onChange={(e) => setConfimationPW(e.target.value)} />
                            </div>
                            <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600">
                                Xác nhận
                            </Button>
                            {error && <p className="text-red-500 text-sm pt-2">{error}</p>}
                        </div>
                        <Link
                            to="/login"
                            onClick={() => {
                                deleteCookie("reset-token");
                            }}
                            className="font-medium hover:text-yellow-500 duration-700"
                        >
                            <div className="flex justify-center items-center gap-3">
                                <box-icon name='arrow-back' color='gray'></box-icon>
                                <p className="text-gray-600">Trở về Đăng nhập</p>
                            </div>
                        </Link>

                    </form>
                </div>
                <div className="hidden bg-muted lg:block">
                    <img
                        src="/src/assets/images/login-bg.jpg"
                        alt="Image"
                        className=" object-cover dark:brightness-[0.2] dark:grayscale"
                        width='100%'
                    />
                </div>
            </div>
            <Toaster />
        </>
    )
}
