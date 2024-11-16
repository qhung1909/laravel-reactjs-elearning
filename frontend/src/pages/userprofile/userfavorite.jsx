import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { formatCurrency } from '@/components/Formatcurrency/formatCurrency';
import './userprofile.css';
import { ExternalLink, Eye, Heart, Trash2 } from 'lucide-react';
const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

export const UserFavorite = () => {
    const [user, setUser] = useState({});
    // Fetch thông tin user đang đăng nhập
    const fetchUser = async () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            console.error("Người dùng chưa đăng nhập.");
            return;
        }
        try {
            const res = await axios.get(`${API_URL}/auth/me`, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                },
            });
            // Kiểm tra cấu trúc dữ liệu trả về
            if (res.data && res.data) {
                setUser(res.data);
            } else {
                console.error(
                    "Không tìm thấy thông tin người dùng trong phản hồi."
                );
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin người dùng:", error);
            if (error.response) {
                console.error("Chi tiết lỗi:", error.response.data);
                console.error("Trạng thái lỗi:", error.response.status);
            } else {
                console.error("Lỗi mạng hoặc không có phản hồi từ máy chủ.");
            }
        }
    };
    useEffect(() => {
        fetchUser();
    }, []);

    const [favorites, setFavorites] = useState([]);
    // Hàm lấy danh sách yêu thích
    const fetchFavorites = async () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            console.error("Người dùng chưa đăng nhập.");
            return;
        }
        try {
            const response = await axios.get(`${API_URL}/favorites`, {
                headers: {
                    "x-api-secret": API_KEY,
                    "Accept": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });

            // Kiểm tra và xử lý dữ liệu trả về
            if (response.data && Array.isArray(response.data)) {
                setFavorites(response.data);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách yêu thích:", error);
        }
    };

    useEffect(() => {
        fetchUser();
        fetchFavorites();
    }, []);

    // Hàm để xóa khóa học yêu thích
    const deleteFavorite = async (favorites_id, courseId) => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            console.error("Token không hợp lệ.");
            return;
        }

        try {
            const response = await axios.delete(`${API_URL}/favorites`, {
                headers: {
                    "x-api-secret": API_KEY,
                    "Accept": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                data: {
                    course_id: courseId,
                    user_id: user.user_id
                }
            });

            if (response.data) {
                setFavorites((prevFavorites) =>
                    prevFavorites.filter(favorite => favorite.favorites_id !== favorites_id)
                );
                fetchFavorites();
            } else {
                console.error("Không có dữ liệu trả về từ API.");
            }
        } catch (error) {
            // Log chi tiết lỗi
            console.error("Lỗi khi xóa khóa học yêu thích:", error.response || error);
            if (error.response) {
                console.error("Lỗi từ API:", error.response.data);
            }
        }
    };



    return (
        <>
            <section className="usernoti my-10 mx-auto px-4 lg:px-10 xl:px-20">
                <div className="border border-gray-200 rounded-xl px-10 py-5 shadow-lg">
                    <div className="py-5 border-b">
                        <span className="font-semibold text-xl">Cài đặt</span>
                        <p className="text-gray-500 text-sm">Quản lý cài đặt tài khoản của bạn</p>
                    </div>
                    <div className="lg:grid grid-cols-4 gap-5">
                        <div className="col-span-1 my-3 lg:my-5">
                            <ul className="gap-3 text-sm font-medium max-lg:items-center flex lg:flex-col">
                                <li className="py-1 lg:py-2 px-3 rounded-md">
                                    <Link className="hover:underline" to="/user/profile">
                                        <p>Hồ sơ cá nhân</p>
                                    </Link>
                                </li>
                                <li className="py-3 lg:py-2 px-3 rounded-md">
                                    <Link className="hover:underline" to="/user/orderhistory">
                                        <p>Lịch sử mua hàng</p>
                                    </Link>
                                </li>
                                <li className="py-3 lg:py-2 px-3 rounded-md">
                                    <Link className="hover:underline" to="/user/noti">
                                        <p>Thông báo</p>
                                    </Link>
                                </li>
                                <li className="bg-gray-100 py-3 lg:py-2 px-3 rounded-md">
                                    <Link to="/user/noti">
                                        <p>Yêu thích</p>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="col-span-3 my-3 lg:my-5">
                            <div className="border-b border-gray-200 pb-5">
                                <h2 className="text-xl font-semibold text-gray-800">Khóa học yêu thích của bạn</h2>
                                <p className="mt-2 text-sm text-gray-500">Những khóa học bạn thích nhưng vẫn chưa có dịp mua, chúng tôi sẽ giúp bạn lưu lại.</p>
                            </div>
                            <div className="mt-8">
                                <div className="grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
                                    {favorites.length > 0 ? (
                                        favorites.map(favorite => {
                                            return (
                                                <div
                                                    key={favorite.favorites_id}
                                                    className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
                                                >
                                                    <div className="relative overflow-hidden">
                                                        <img
                                                            src={favorite.course.img}
                                                            className="w-full h-48 object-cover transform transition-transform duration-500 ease-out group-hover:scale-110"
                                                            alt={favorite.course.title}
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    </div>
                                                    <div className="p-4 space-y-3 flex flex-col">
                                                        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 min-h-[3.5rem] hover:text-yellow-600 transition-colors duration-300">
                                                            {favorite.course.title}
                                                        </h3>
                                                        <p className="text-sm font-medium text-gray-600 flex items-center">
                                                            <span className="text-yellow-600 mr-1">Giá:</span>
                                                            {formatCurrency(favorite.course.price_discount)}
                                                        </p>
                                                        <div className="pt-3 flex flex-col justify-center gap-4">
                                                            {/* View Details Button */}
                                                            <Link
                                                                to={`/detail/${favorite.course.slug}`}
                                                                className="group flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 border border-amber-200 transition-all duration-300"
                                                            >
                                                                <Eye className="w-5 h-5 text-amber-600" />
                                                                <span className="text-xs font-medium text-amber-700 text-center w-full">
                                                                    Xem chi tiết
                                                                </span>
                                                            </Link>

                                                            {/* Remove Button */}
                                                            <button
                                                                onClick={() => deleteFavorite(favorite.favorites_id, favorite.course.course_id)}
                                                                className="group flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 border border-rose-200 transition-all duration-300"
                                                            >
                                                                <Heart className="w-5 h-5 text-rose-600" />
                                                                <span className="text-xs font-medium text-rose-700 text-center w-full">
                                                                    Bỏ thích
                                                                </span>
                                                            </button>
                                                        </div>


                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="col-span-full flex flex-col items-center justify-center py-16">
                                            <p className="text-gray-500 text-lg mb-2">Không có khóa học yêu thích nào.</p>
                                            <p className="text-sm text-gray-400">Hãy thêm các khóa học yêu thích để xem sau nhé!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
