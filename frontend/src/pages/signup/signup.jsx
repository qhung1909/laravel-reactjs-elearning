import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const notify = (message, type) => {
    if (type === 'success') {
        toast.success(message,{
            style:{
                padding: '16px'
            }
        });
    }
}

export const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [error, setError] = useState('');
    const [_success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.name || !formData.email || !formData.password || !formData.password_confirmation) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        if (formData.password !== formData.password_confirmation) {
            setError('Mật khẩu không khớp');
            return;
        }

        if (formData.password.length < 6 || formData.password_confirmation.length < 6) {
            setError('Mật khẩu phải từ 6 kí tự trở lên');
            return
        }

        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    password_confirmation: formData.password_confirmation
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                const emailError = errorData.errors.email[0]
                setError(emailError || errorData.message || 'Đăng ký thất bại');
                return;
            }

            const data = await res.json();
            localStorage.setItem('access_token', data.access_token);
            notify('Đăng ký thành công', 'success');
            // setSuccess('Đăng ký thành công!');

            setFormData({
                name: '',
                email: '',
                password: '',
                password_confirmation: '',
            });

            setTimeout(() => {
                navigate('/login');
            }, 2000)

        } catch (error) {
            console.log(error);
            setError('Đã xảy ra lỗi. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            {loading && (
                <div className='loading'>
                    <div className='loading-spin'></div>
                </div>
            )}
            <div className="relative m-auto h-screen items-center shadow-inner lg:grid  lg:grid-cols-2 pt-32 lg:pt-20 xl:pt-0">
                <Link className='absolute top-1 left-0 xl:top-8 xl:left-8' to='/'>
                    <div className="flex items-center gap-3">
                        <box-icon name='arrow-back' color='gray' ></box-icon>
                        <p className="text-gray-600">Trang chủ</p>
                    </div>
                </Link>

                <form onSubmit={submit} className=" flex items-center justify-center">

                    <div className="relative mx-auto grid w-[350px] gap-6">
                        <div className="grid gap-2">
                            <h1 className="text-3xl font-bold">Tạo tài khoản</h1>
                            <p className="text-balance text-muted-foreground">
                                Đăng ký và bắt đầu khám phá khóa học của bạn
                            </p>
                        </div>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Tên</Label>
                                <Input
                                    name="name"
                                    type="text"
                                    placeholder="Nhập tên..."
                                    className="p-5"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    name="email"
                                    type="email"
                                    className="p-5"
                                    placeholder="m@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Mật khẩu</Label>
                                    <Link
                                        to="#"
                                        className="ml-auto inline-block text-sm underline"
                                    >
                                    </Link>
                                </div>
                                <Input name="password" type="password" className="p-5" placeholder="Nhập mật khẩu" value={formData.password} onChange={handleChange}
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Xác nhận mật khẩu</Label>
                                    <Link
                                        to="#"
                                        className="ml-auto inline-block text-sm underline"
                                    >
                                    </Link>
                                </div>
                                <Input name="password_confirmation" className="p-5" type="password" placeholder="Xác nhận mật khẩu" value={formData.password_confirmation} onChange={handleChange} />
                            </div>
                            <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600">
                                Đăng ký
                            </Button>
                            {error && <p className="text-red-500 text-sm pt-2">{error}</p>}

                            <Button type='button' variant="outline" className="w-full">
                                <svg
                                    className="flex-none mr-3"
                                    id="google"
                                    preserveAspectRatio="xMidYMid"
                                    viewBox="0 0 256 262"
                                    width="5%"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                                        fill="#4285F4" />
                                    <path
                                        d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                                        fill="#34A853" />
                                    <path
                                        d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                                        fill="#FBBC05" />
                                    <path
                                        d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                                        fill="#EB4335" />
                                </svg>
                                Đăng nhập với Google
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Bạn đã có tài khoản?{" "}
                            <Link to="/login" className="underline font-medium hover:text-yellow-500 duration-700">
                                Đăng nhập
                            </Link>
                        </div>
                    </div>
                </form>
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
