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
                padding: '16px'
            }
        })
    }
}
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;
    const [user, setUser] = useState(null);
    const [logined, setLogined] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [_success, setSuccess] = useState("");
    const [password, setPassword] = useState(""); // Trạng thái lưu mật khẩu
    const [current_password, setCurrentPassword] = useState("");
    const [password_confirmation, setPassword_Confirmation] = useState("")

    const navigate = useNavigate();


    // API thông tin người dùng
    const fetchUser = async () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            console.error("Người dùng chưa đăng nhập.");
            return;
        }
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/auth/me`, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.data) {
                setUser(res.data);
                setLogined(token);
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin người dùng:", error);
        } finally {
            setLoading(false);
        }
    };

    // hàm thay đổi mật khẩu
    const updatePassword = async (current_password, password, password_confirmation) => {
        const token = localStorage.getItem('access_token');
        try {
            const response = await axios.post(`${API_URL}/auth/user/updatePassword`, {
                current_password: current_password,
                password: password,
                password_confirmation: password_confirmation,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "x-api-secret": `${API_KEY}`,
                },
            });
            console.log(response)
            if (response.status === 200) {
                console.log('Cập nhật mật khẩu thành công');
                return true;
            }
        } catch (error) {
            console.error('Lỗi cập nhật mật khẩu', error);
            return false;
        }
        return false;
    };

    // refreshtoken
    const refreshToken = async () => {
        const storedRefreshToken = localStorage.getItem('refresh_token');
        if (!storedRefreshToken) {
            alert('Session expired. Please log in again.');
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
                alert('Session expired. Please log in again.');
                navigate('/login');
                return;
            }

            const data = await res.json();
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            return data.access_token;
        } catch {
            alert('Session expired. Please log in again.');
            navigate('/login');
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
        navigate('login')
    };

    // update thông tin người dùng
    const updateUserProfile = async (userName, email, avatar) => {
        const token = localStorage.getItem("access_token");
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
            const response = await axios.post(`${API_URL}/auth/user/profile`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                    'x-api-secret': `${API_KEY}`,
                },
            });
            notify('Cập nhật thành công', 'success');
            fetchUser(); // Refresh user data
        } catch (error) {
            console.log('Error updating profile', error);
            notify("Cập nhật thất bại", 'error');
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, logined, loading, fetchUser, logout, refreshToken, updateUserProfile,updatePassword }}>
            {children}
            <Toaster/>
        </UserContext.Provider>
    );
};
UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
