import { Link, redirect, useNavigate } from 'react-router-dom';
import './login.css'
import { useCallback, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const debounce = (func, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

    const debouncedLogin = useCallback(debounce(async () => {
        if (!email || !password) {
            setError('Vui lòng nhập đầy đủ thông tin');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) {
                const errorData = await res.json();
                setError(errorData.message || 'Đăng nhập thất bại');
                return;
            }

            const data = await res.json();
            localStorage.setItem('access_token', data.access_token);
            setSuccess('Đăng nhập thành công');
            alert('Đăng nhập thành công');
            navigate('/');
        } catch (error) {
            setError('Đã xảy ra lỗi: ' + error.message);
        } finally {
            setLoading(false);
        }
    }, 300), [email, password]);

    const submit = (e) => {
        e.preventDefault();
        setLoading(true);
        debouncedLogin();
    };



    return (
        <div className="max-w-7xl mx-auto py-0 md:py-2 xl:py-12">
            <div className="grid grid-cols-1 py-6 md:py-6 lg:py-12 lg:grid-cols-2">
                <div className="img-signup">
                    <img
                        alt=""
                        className="w-full hidden md:pl-64 lg:pl-12 lg:block"
                        src="/src/assets/images/signup.jpg"
                    />
                    <img
                        alt=""
                        className="w-full px-6 sm:px-24 md:px-48 block lg:hidden"
                        src="/src/assets/images/signup-mb.png"
                    />
                </div>
                <form onSubmit={submit} className="w-full px-6 sm:px-24 md:px-48 lg:px-16 xl:px-24 mx-auto">
                    <h1 className="text-center text-2xl lg:text-3xl font-semibold pb-3 md:pb-10 pt-3 lg:pt-0">
                        Đăng nhập để tiếp tục cuộc hành trình của bạn
                    </h1>
                    <div className="relative py-1">
                        <input
                            className="input-form peer"
                            placeholder=""
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label className="label-form">
                            Email
                        </label>
                    </div>
                    <div className="relative py-1">
                        <input
                            className="input-form peer"
                            placeholder=""
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label className="label-form">
                            Mật khẩu
                        </label>

                    </div>
                    <div className="py-2">
                        <button type='submit' className="h-16 w-full bg-yellow-500 font-bold">
                            Đăng nhập
                        </button>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                    </div>
                    <div className="flex items-center justify-center my-4">
                        <div className="flex-grow border-t border-gray-400" />
                        <span className="mx-2">
                            Tùy chọn khác
                        </span>
                        <div className="flex-grow border-t border-gray-400" />
                    </div>
                    <div className="py-2">
                        <button  className="h-16 w-full border border-black flex gap-3 m-auto justify-center place-items-center">
                            <svg
                                className="flex-none"
                                id="google"
                                preserveAspectRatio="xMidYMid"
                                viewBox="0 0 256 262"
                                width="5%"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                                    fill="#34A853"
                                />
                                <path
                                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                                    fill="#EB4335"
                                />
                            </svg>
                            <p className="flex-none">
                                Đăng nhập bằng Google
                            </p>
                        </button>

                    </div>
                    <div className="pt-2">
                        <h3 className="text-lg lg:text-xl">
                            Chưa có tài khoản?{' '}
                            <Link className='text-black font-medium underline' to='/signup'>Đăng ký</Link>

                        </h3>
                    </div>
                </form>
            </div>
        </div>
    )
}
