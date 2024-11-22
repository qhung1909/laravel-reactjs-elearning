import { Link, useNavigate } from 'react-router-dom';
import { useCallback, useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from 'axios';
axios
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

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [_success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const debounce = (func, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

    const getUserInfo = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            return;
        }
        setLoading(true);
        try {
            const res = await makeApiRequest(`${API_URL}/auth/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (res.ok) {
                const userData = await res.json();
                setUser(userData);
            } else {
                throw new Error('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            notify('Không thể lấy thông tin người dùng');
        } finally {
            setLoading(false);
        }
    };

    const refreshToken = async () => {
        const storedRefreshToken = localStorage.getItem('refresh_token');
        if (!storedRefreshToken) {
            notify('Phiên đăng nhập đã hết hạn');
            navigate('/login');
            return;
        }
        try {
            const res = await fetch(`${API_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refresh_token: storedRefreshToken })
            });

            if (!res.ok) {
                throw new Error('Failed to refresh token');
            }

            const data = await res.json();
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            return true;
        } catch (error) {
            console.error('Token refresh error:', error);
            notify('Phiên đăng nhập đã hết hạn');
            navigate('/login');
            return false;
        }
    };

    const makeApiRequest = async (url, options) => {
        const accessToken = localStorage.getItem('access_token');

        if (isTokenExpired(accessToken)) {
            const refreshSuccess = await refreshToken();
            if (!refreshSuccess) return null;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                }
            });

            if (response.status === 401) {
                const refreshSuccess = await refreshToken();
                if (!refreshSuccess) return null;

                return await fetch(url, {
                    ...options,
                    headers: {
                        ...options.headers,
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    }
                });
            }

            return response;
        } catch (error) {
            console.error('API request error:', error);
            throw error;
        }
    };

    const isTokenExpired = (token) => {
        if (!token) return true;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const exp = payload.exp * 1000;
            return Date.now() > exp;
        } catch (error) {
            console.error('Token parsing error:', error);
            return true;
        }
    };

    const debouncedLogin = useCallback(debounce(async () => {
        if (!email || !password) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            // Thực hiện yêu cầu POST bằng axios
            const res = await axios.post(`${API_URL}/auth/login`, {
                email,
                password
            });

            const data = res.data; // Lấy dữ liệu từ phản hồi
            if (res.status === 401) {
                setError('Tài khoản hoặc mật khẩu chưa chính xác!');
                return;
            }

            if (res.status === 403) {
                const errorMessage = res.data.error || 'Tài khoản của bạn đã bị khóa. Vui lòng thử lại sau.';
                setError(errorMessage);
                notify(errorMessage, 'error');
                return;
            }

            // Kiểm tra dữ liệu trả về
            if (!data.access_token || !data.refresh_token) {
                throw new Error('Invalid token data received');
            }

            // Lưu token vào localStorage
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);

            notify('Đăng nhập thành công', 'success');
            setSuccess('Đăng nhập thành công');
            await getUserInfo();

            const previousPage = sessionStorage.getItem('previousPage');
            sessionStorage.removeItem('previousPage');

            if (previousPage) {
                navigate(previousPage);
                window.location.reload();
            } else {
                navigate('/');
                window.location.reload();

            }
        } catch (error) {
            console.error('Login error:', error);

            const errorMessage = error.response && error.response.data && error.response.data.error
                ? error.response.data.error
                : 'Đã xảy ra lỗi: ' + error.message;

            setError(errorMessage);
            notify(errorMessage);
        } finally {
            setLoading(false);
        }
    }, 300), [email, password, navigate]);

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            const state = Math.random().toString(36).substring(7);
            sessionStorage.setItem('oauth_state', state);

            const response = await fetch(`${API_URL}/auth/google/url?state=${state}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error('Server response was not in JSON format');
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to get Google OAuth URL');
            }

            const data = await response.json();

            if (!data.auth_url) {
                throw new Error('No authentication URL received');
            }

            const currentPath = window.location.pathname;
            sessionStorage.setItem('previousPage', currentPath);

            window.location.href = data.auth_url;
        } catch (error) {
            console.error('Google Login Error:', error);
            notify(error.message || 'Không thể kết nối với Google');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleCallback = async (code, state) => {
        const storedState = sessionStorage.getItem('oauth_state');
        console.log('Google Callback:');
        console.log('Code:', code);
        console.log('State:', state);
        console.log('Stored State:', storedState);
        if (state !== storedState) {
            notify('Phiên xác thực không hợp lệ');
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/auth/google/callback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    code,
                    state,
                    redirect_uri: window.location.origin + '/login'
                })
            });

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error('Server response was not in JSON format');
            }

            if (!response.ok) {
                try {
                    const errorData = await response.json();
                    console.error('Error Data:', errorData);
                    throw new Error(errorData.message || 'Xác thực Google thất bại');
                } catch (e) {
                    throw new Error('Failed to parse error response from server');
                }
            }


            const data = await response.json();

            if (!data.access_token || !data.refresh_token) {
                throw new Error('Invalid token data received');
            }

            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);

            notify('Đăng nhập thành công', 'success');

            setTimeout(() => {
                navigate('/');
                window.location.reload();
            }, 1000);


            sessionStorage.removeItem('oauth_state');
            sessionStorage.removeItem('previousPage');

        } catch (error) {
            console.error('Google Callback Error:', error);
            notify(error.message || 'Đăng nhập Google thất bại');
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Vui lòng nhập đầy đủ thông tin');
            notify('Vui lòng nhập đầy đủ thông tin', 'error');
            return;
        }
        debouncedLogin();
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');

        if (code && state) {
            handleGoogleCallback(code, state);
        }
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const token = localStorage.getItem('access_token');
            if (token && isTokenExpired(token)) {
                refreshToken();
            }
        }, 1800000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <>
            {loading && (
                <div className='loading'>
                    <div className='loading-spin'></div>
                </div>
            )}
            <div className="relative m-auto h-screen overflow-hidden items-center shadow-inner lg:grid lg:grid-cols-2 pt-32 lg:pt-0">
                <Link className='absolute top-1 left-0 xl:top-8 xl:left-8' to='/'>
                    <div className="flex items-center gap-3">
                        <box-icon name='arrow-back' color='gray'></box-icon>
                        <p className="text-gray-600">Trang chủ</p>
                    </div>
                </Link>

                <div className="flex items-center justify-center">
                    <form onSubmit={submit} className="relative mx-auto grid w-[350px] gap-6">
                        <div className="grid gap-2">
                            <h1 className="text-3xl font-bold">Chào mừng trở lại</h1>
                            <p className="text-balance text-muted-foreground">
                                Chào mừng trở lại! Hãy nhập thông tin của bạn
                            </p>
                        </div>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    tabIndex="1"
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Mật khẩu</Label>
                                    <Link
                                        to="/reset-password"
                                        className="ml-auto inline-block text-sm underline"
                                    >
                                        Quên mật khẩu?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    tabIndex="2"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600" disabled={loading}>
                                Đăng nhập
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={handleGoogleLogin}
                                disabled={loading}
                            >
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

                            <div
                                className="cf-turnstile"
                                data-sitekey="0x4AAAAAAA0TLiwUkgt4o_4P"
                            ></div>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Bạn chưa có tài khoản?{" "}
                            <Link to="/register" className="underline font-medium hover:text-yellow-500 duration-700">
                                Đăng ký
                            </Link>
                        </div>
                    </form>
                </div>
                <div className="hidden bg-muted lg:block">
                    <img
                        src="/src/assets/images/login-bg.jpg"
                        alt="Image"
                        className="object-cover dark:brightness-[0.2] dark:grayscale"
                        width='100%'
                    />
                </div>
            </div>
            <Toaster />
        </>
    )
}
