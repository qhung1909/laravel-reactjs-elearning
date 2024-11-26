import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { formatCurrency } from '@/components/Formatcurrency/formatCurrency';
import { ExternalLink, Eye, Heart, Trash2, User, History, Bell } from 'lucide-react';
import './userprofile.css';
import { UserContext } from '../context/usercontext';
import { Skeleton } from "@/components/ui/skeleton"
const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

export const UserFavorite = () => {
    const { user } = useContext((UserContext));
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    // Fetch thông tin user đang đăng nhập

    // Hàm lấy danh sách yêu thích
    const fetchFavorites = async () => {
        const token = localStorage.getItem("access_token");
        setLoading(true)
        if (!token) {
            console.error("Người dùng chưa đăng nhập.");
            setLoading(false);
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
            }else {
                setFavorites([]);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách yêu thích:", error);
            setFavorites([]);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        // Chỉ gọi fetchFavorites khi có user
        if (user) {
            fetchFavorites();
        }
    }, [user]);

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
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
            <section className="userfavorite py-12  mx-auto px-4 lg:px-10 xl:px-20">
                <div className="border-0 rounded-xl px-8 py-6 shadow-xl bg-white">
                    {/* Header */}
                    <div className="py-6 border-b border-gray-200/80">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-50 rounded-xl">
                                <Heart className="w-5 h-5 text-yellow-500" />
                            </div>
                            <div>
                                <h2 className="font-bold text-2xl bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                                    Yêu thích
                                </h2>
                                <p className="text-gray-500 text-sm">Quản lý các khóa học yêu thích của bạn</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:grid grid-cols-4 gap-8">
                        {/* Sidebar */}
                        <div className="col-span-1 my-6">
                            <ul className="gap-2 text-sm font-medium max-w-screen-md:grid grid-cols-2 lg:flex-col space-y-3">
                                <li className="w-full">
                                    <Link
                                        to="/user/profile"
                                        className="flex items-center gap-2 p-3 rounded-xl hover:bg-yellow-50x transition-all duration-200"
                                    >
                                        <User className="w-4 h-4" />
                                        <span>Hồ sơ cá nhân</span>
                                    </Link>
                                </li>
                                <li className="w-full">
                                    <Link
                                        to="/user/orderhistory"
                                        className="flex items-center gap-3 p-3 hover:bg-yellow-50 rounded-xl transition-colors"
                                    >
                                        <History className="w-4 h-4" />
                                        <span>Lịch sử mua hàng</span>
                                    </Link>
                                </li>
                                <li className="w-full">
                                    <Link
                                        to="/user/noti"
                                        className="flex items-center gap-3 p-3  rounded-xl transition-colors"
                                    >
                                        <Bell className="w-4 h-4" />
                                        <span>Thông báo</span>
                                    </Link>
                                </li>
                                <li className="w-full">
                                    <Link
                                        to="/user/favorite"
                                        className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-xl transition-colors"
                                    >
                                        <Heart className="w-4 h-4" />
                                        <span>Yêu thích</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Main Content */}
                        <div className="col-span-3 my-6">
                            <div className="border-b pb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-yellow-50 rounded-xl">
                                        <Heart className="w-5 h-5 text-yellow-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold">Yêu thích của bạn</h3>
                                        <p className="text-sm text-gray-500">
                                            Xem lại những khóa học yêu thích của bạn, hãy hẹn nhau trong tương lai nhé.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className='mt-5'>
                                {loading ? (
                                    <div className="space-y-2">
                                        <Skeleton className="w-[300px] h-[170px] rounded-xl" />
                                        <Skeleton className="p-3 w-[300px] h-[20px]" />
                                        <Skeleton className="p-3 w-[300px] h-[20px]" />
                                    </div>
                                ) : (
                                    favorites.length === 0 ? (
                                        <div className="justify-center flex-col items-center grid-cols-none">
                                            <svg width="100%" height="177" viewBox="0 0 139 142" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                {/* SVG code */}
                                            </svg>
                                            <p className="text-gray-500 text-center">
                                                <p className="font-semibold sm:text-base text-sm text-black-900">
                                                    Bạn chưa có khóa học yêu thích nào
                                                </p>
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
                                            {favorites.map(favorite => (
                                                <div
                                                    key={favorite.favorites_id}
                                                    className="group rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-300"
                                                >
                                                    {/* Image Container */}
                                                    <div className="relative aspect-video overflow-hidden">
                                                        <img
                                                            src={favorite.course.img}
                                                            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                                                            alt={favorite.course.title}
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>

                                                    {/* Content */}
                                                    <div className="p-4 space-y-4">
                                                        <h3 className="font-semibold text-gray-800 line-clamp-2 min-h-[3rem] group-hover:text-yellow-500 transition-colors">
                                                            {favorite.course.title}
                                                        </h3>

                                                        <div className="flex items-center justify-between">
                                                            <p className="text-sm font-medium">
                                                                <span className="text-yellow-500">Giá: </span>
                                                                <span className="text-gray-900">{formatCurrency(favorite.course.price_discount)}</span>
                                                            </p>
                                                        </div>

                                                        <div className="flex flex-col gap-2 pt-2">
                                                            <Link
                                                                to={`/detail/${favorite.course.slug}`}
                                                                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-white hover:shadow-md transition-all duration-300"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                                <span className="text-sm font-medium">Xem chi tiết</span>
                                                            </Link>

                                                            <button
                                                                onClick={() => deleteFavorite(favorite.favorites_id, favorite.course.course_id)}
                                                                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                                                            >
                                                                <Heart className="w-4 h-4 text-rose-500" />
                                                                <span className="text-sm font-medium text-gray-700">Bỏ thích</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                    )
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

    );

};
