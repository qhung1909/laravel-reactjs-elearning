/* eslint-disable no-unused-vars */
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
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
                padding: '16px',
                textAlign: 'center',
                width: '310px'
            }
        })
    }
}

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [passwordAttempts, setPasswordAttempts] = useState(0);
    const MAX_PASSWORD_ATTEMPTS = 5;
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;
    const [user, setUser] = useState(null);
    const [instructor, setInstructor] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [_success, setSuccess] = useState("");
    const [logined, setLogined] = useState(() => {
        const token = localStorage.getItem("access_token");
        return token || null;
    });

    const navigate = useNavigate();

    // Khởi tạo instance axios với config mặc định
    const api = axios.create({
        baseURL: API_URL,
        headers: {
            'x-api-secret': API_KEY
        }
    });

    // Biến để kiểm soát quá trình refresh token
    let isRefreshing = false;
    let failedQueue = [];

    const processQueue = (error, token = null) => {
        failedQueue.forEach(prom => {
            if (error) {
                prom.reject(error);
            } else {
                prom.resolve(token);
            }
        });
        failedQueue = [];
    };

    // Xử lý refresh token
    const refreshToken = async () => {
        const checkGetAccessToken = localStorage.getItem('access_token')
        if(!checkGetAccessToken){
            return false;
        }


        const storedRefreshToken = localStorage.getItem('refresh_token');
        if (!storedRefreshToken) {
            navigate('/login');
            return null;
        }

        try {
            const response = await fetch(`${API_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refresh_token: storedRefreshToken })
            });

            if (!response.ok) {
                throw new Error('Refresh token failed');
            }

            const data = await response.json();
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            return data.access_token;
        } catch {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setUser(null);
            setLogined(null);
            // notify('Phiên đăng nhập đã hết hạn', 'error');
            navigate('/login');
            return null;
        }
    };

    // Interceptor cho request
    api.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('access_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Interceptor cho response
    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            if (error.response?.status === 401 && !originalRequest._retry) {
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                        .then(token => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            return api(originalRequest);
                        })
                        .catch(err => Promise.reject(err));
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    const newToken = await refreshToken();
                    if (newToken) {
                        processQueue(null, newToken);
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        return api(originalRequest);
                    }
                    return Promise.reject(error);
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }
            return Promise.reject(error);
        }
    );

    // API lấy thông tin người dùng
    const fetchUserData = async () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            // console.error("Người dùng chưa đăng nhập.");
            return;
        }
        setLoading(true);
        try {
            const res = await api.get(`${API_URL}/auth/me`);
            if (res.data) {
                setUser(res.data);
                setLogined(token);

                if (res.data.role === "teacher") {
                    setInstructor(res.data);
                }
                if (res.data.role === "admin") {
                    setAdmin(res.data);
                }
            }
        } catch (error) {
            // console.error("Lỗi khi lấy thông tin người dùng:", error);
        } finally {
            setLoading(false);
        }
    };

    // Hàm thay đổi mật khẩu
    const updatePassword = async (current_password, password, password_confirmation) => {
        if (!current_password || !password || !password_confirmation) {
            notify('Vui lòng điền đầy đủ thông tin', 'error');
            return false;
        }

        if (password !== password_confirmation) {
            notify('Mật khẩu xác nhận không khớp', 'error');
            return false;
        }

        try {
            const response = await api.post('/auth/user/updatePassword', {
                current_password,
                password,
                password_confirmation,
            });

            if (response.status === 200) {
                setPasswordAttempts(0);
                notify('Cập nhật mật khẩu thành công', 'success');
                return true;
            }
        } catch (error) {
            if (error.response?.status === 403) {
                notify(error.response.data.message, 'error');
                setTimeout(() => {
                    navigate('/login');
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    setUser(null);
                    setLogined(null);
                }, 2000);
            } else {
                const newAttempts = passwordAttempts + 1;
                setPasswordAttempts(newAttempts);

                if (newAttempts >= MAX_PASSWORD_ATTEMPTS) {
                    notify('Bạn đã nhập sai quá nhiều lần. Mời đăng nhập lại', 'error');
                    setTimeout(() => {
                        navigate('/login');
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        setUser(null);
                        setLogined(null);
                    }, 1000);
                } else {
                    const remainingAttempts = MAX_PASSWORD_ATTEMPTS - newAttempts;
                    notify(`Mật khẩu hiện tại không đúng! Còn ${remainingAttempts} lần thử`, 'error');
                }
            }
            return false;
        }
        return false;
    };

    // Cập nhật thông tin người dùng
    const updateUserProfile = async (userName, email, avatar) => {
        if (!userName.trim()) {
            notify('Tên tài khoản không được để trống', 'error');
            return;
        }
        try {
            const formData = new FormData();
            formData.append('name', userName);
            formData.append('email', email);
            if (avatar) {
                formData.append('file', avatar);
            }
            const response = await api.post('/auth/user/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 200) {
                await fetchUserData();
            }
        } catch (error) {
            console.error('Error updating profile', error);
            notify("Cập nhật thất bại", 'error');
        }
    };

    // Đăng xuất
    const logout = () => {
        setError("");
        setSuccess("");
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        setLogined(null);
        notify('Đăng xuất thành công', 'success');
        navigate('/login');
    };

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token && !user) {
            fetchUserData();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <UserContext.Provider value={{
            user,
            logined,
            loading,
            instructor,
            admin,
            fetchUserData,
            logout,
            refreshToken,
            updateUserProfile,
            updatePassword
        }}>
            {children}
            <Toaster />
        </UserContext.Provider>
    );
};

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
