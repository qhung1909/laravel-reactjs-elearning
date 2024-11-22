import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { formatCurrency } from '@/components/Formatcurrency/formatCurrency';
import { ExternalLink, Eye, Heart, Trash2, User, History, Bell } from 'lucide-react';

import './userprofile.css';
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
                                        className="flex items-center gap-2 p-3 rounded-xl hover:bg-yellow-50 transition-all duration-200"
                                    >
                                        <User className="w-4 h-4" />
                                        <span>Hồ sơ cá nhân</span>
                                    </Link>
                                </li>
                                <li className="w-full">
                                    <Link
                                        to="/user/orderhistory"
                                        className="flex items-center gap-2 p-3 rounded-xl hover:bg-yellow-50 transition-all duration-200"
                                    >
                                        <History className="w-4 h-4" />
                                        <span>Lịch sử mua hàng</span>
                                    </Link>
                                </li>
                                <li className="w-full">
                                    <Link
                                        to="/user/noti"
                                        className="flex items-center gap-2 p-3 rounded-xl hover:bg-yellow-50 transition-all duration-200"
                                    >
                                        <Bell className="w-4 h-4" />
                                        <span>Thông báo</span>
                                    </Link>
                                </li>
                                <li className="w-full">
                                    <Link
                                        to="/user/favorite"
                                        className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-white"
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
                                {favorites.length > 0 ? (
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
                                ) : (
                                    <div className="justify-center flex-col items-center grid-cols-none">
                                        <svg width="100%" height="177" viewBox="0 0 139 142" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M71.5016 125.45C104.302 125.45 130.902 99.0496 130.902 66.4496C130.902 33.8496 104.302 7.44958 71.5016 7.44958C38.7016 7.44958 12.1016 33.8496 12.1016 66.4496C12.1016 99.0496 38.7016 125.45 71.5016 125.45Z" fill="#EAEEF9">
                                            </path>
                                            <path d="M117.002 58.7495V94.8495C117.002 102.35 110.902 108.45 103.302 108.45H39.9017C32.4017 108.45 26.3017 102.45 26.2017 94.9495C26.2017 94.8495 26.2017 94.8495 26.2017 94.7495V58.7495C26.2017 58.6495 26.2017 58.6495 26.2017 58.5495C26.2017 58.3495 26.2017 58.1495 26.3017 57.9495C26.4017 57.6495 26.5017 57.4495 26.6017 57.1495L43.6017 24.6495C44.2017 23.3495 45.5017 22.6495 46.9017 22.6495H96.2017C97.6017 22.6495 98.8017 23.3495 99.5017 24.6495L116.502 57.1495C116.602 57.3495 116.702 57.6495 116.802 57.9495C117.002 58.1495 117.002 58.4495 117.002 58.7495Z" fill="#D5DDEA"></path><g filter="url(#filter0_d_0_17276)"><path d="M117.002 58.7496V98.5496C117.002 104.05 112.602 108.45 107.002 108.45H36.2017C30.7017 108.45 26.2017 104.05 26.2017 98.5496V58.5496C26.2017 58.3496 26.2017 58.1496 26.3017 57.9496H49.1017C52.5017 57.9496 55.3017 60.6496 55.3017 64.1496C55.3017 65.8496 56.0017 67.4496 57.1017 68.5496C58.3017 69.7496 59.7017 70.3496 61.5017 70.3496H81.8017C85.2017 70.3496 88.0017 67.6496 88.0017 64.1496C88.0017 62.4496 88.7017 60.8496 89.8017 59.7496C91.0017 58.5496 92.4017 57.9496 94.1017 57.9496H116.802C117.002 58.1496 117.002 58.4496 117.002 58.7496Z" fill="url(#paint0_linear_0_17276)"></path></g><path d="M129.384 38.2496C131.648 38.2496 133.484 36.4139 133.484 34.1496C133.484 31.8852 131.648 30.0496 129.384 30.0496C127.119 30.0496 125.284 31.8852 125.284 34.1496C125.284 36.4139 127.119 38.2496 129.384 38.2496Z" fill="#EAEEF9"></path><path d="M125.284 24.9496C126.83 24.9496 128.084 23.696 128.084 22.1496C128.084 20.6032 126.83 19.3496 125.284 19.3496C123.737 19.3496 122.484 20.6032 122.484 22.1496C122.484 23.696 123.737 24.9496 125.284 24.9496Z" fill="#EAEEF9"></path><path d="M11.8837 34.1496C13.4301 34.1496 14.6837 32.896 14.6837 31.3496C14.6837 29.8032 13.4301 28.5496 11.8837 28.5496C10.3373 28.5496 9.08374 29.8032 9.08374 31.3496C9.08374 32.896 10.3373 34.1496 11.8837 34.1496Z" fill="#EAEEF9"></path><path d="M5.58379 95.7496C8.45567 95.7496 10.7838 93.4215 10.7838 90.5496C10.7838 87.6777 8.45567 85.3496 5.58379 85.3496C2.71191 85.3496 0.383789 87.6777 0.383789 90.5496C0.383789 93.4215 2.71191 95.7496 5.58379 95.7496Z" fill="#EAEEF9"></path><path d="M96.6216 10.6187C97.9267 24.8658 98.5792 28.1285 95.6244 41.0313C94.6635 43.8998 93.7026 47.0416 91.6435 49.2271C88.7607 52.642 83.5443 54.1446 79.2889 53.0518C74.8961 51.9591 71.327 48.1343 70.5033 43.49C69.817 40.6215 70.7779 37.2065 73.2488 35.4308C75.857 33.7916 79.5634 34.2014 81.7598 36.2504C84.2307 38.2993 85.1916 41.4411 85.0543 44.4462C84.9171 47.4513 83.8189 50.4565 82.3089 53.0518C78.8954 59.4335 77.4901 59.41 70.5034 69.8911" stroke="#ABB5CC" strokeWidth="2" strokeMiterlimit="10" strokeDasharray="4 4"></path><path d="M104.275 5.31244C103.753 7.21624 101.666 7.90853 99.579 6.69702C97.3179 5.65858 95.7525 4.79322 96.1004 3.06249C96.6222 1.33177 98.7093 1.15869 101.144 0.985622C104.101 0.639477 104.623 3.40864 104.275 5.31244Z" fill="#DAE2EB"></path><path d="M87.4039 7.04302C88.2736 8.60068 90.7086 9.63911 92.4479 8.08146C94.3611 6.35073 95.9264 5.13922 95.0568 3.4085C94.1872 1.85084 92.7957 2.37006 89.8389 2.71621C87.4039 3.23542 86.3604 5.3123 87.4039 7.04302Z" fill="#DAE2EB"></path><path d="M95.0569 0.639542C96.2744 0.466469 97.4919 1.15876 97.8397 2.1972C98.0137 2.54334 98.1876 3.06256 98.1876 3.4087C98.5355 5.83172 97.6658 7.90859 96.2744 8.08167C94.709 8.42781 93.1437 6.69708 92.9697 4.44714C92.9697 3.75485 92.9697 3.4087 92.9697 2.88949C93.1437 1.67798 93.8394 0.812615 95.0569 0.639542C95.2308 0.639542 95.0569 0.639542 95.0569 0.639542Z" fill="#989FB0"></path><path d="M60.192 84.7092C61.4591 84.7092 62.4863 83.682 62.4863 82.4149C62.4863 81.1478 61.4591 80.1206 60.192 80.1206C58.9249 80.1206 57.8977 81.1478 57.8977 82.4149C57.8977 83.682 58.9249 84.7092 60.192 84.7092Z" fill="#989FB0"></path><path d="M83.0108 84.7092C84.278 84.7092 85.3051 83.682 85.3051 82.4149C85.3051 81.1478 84.278 80.1206 83.0108 80.1206C81.7437 80.1206 80.7166 81.1478 80.7166 82.4149C80.7166 83.682 81.7437 84.7092 83.0108 84.7092Z" fill="#989FB0"></path><path d="M75.322 99.7772H68.129C67.0129 99.7772 66.0828 98.8471 66.0828 97.731C66.0828 96.6148 67.0129 95.6847 68.129 95.6847H75.2599C76.3761 95.6847 77.3062 96.6148 77.3062 97.731C77.3682 98.8471 76.4381 99.7772 75.322 99.7772Z" fill="#989FB0"></path><defs><filter id="filter0_d_0_17276" x="4.20166" y="46.9496" width="134.8" height="94.5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dy="11"></feOffset><feGaussianBlur stdDeviation="11"></feGaussianBlur><feColorMatrix type="matrix" values="0 0 0 0 0.397708 0 0 0 0 0.47749 0 0 0 0 0.575 0 0 0 0.27 0"></feColorMatrix><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_17276"></feBlend><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_17276" result="shape"></feBlend></filter><linearGradient id="paint0_linear_0_17276" x1="71.5721" y1="56.7815" x2="71.5721" y2="108.994" gradientUnits="userSpaceOnUse"><stop stopColor="#FDFEFF"></stop><stop offset="0.9964" stopColor="#ECF0F5"></stop></linearGradient></defs>
                                        </svg>
                                        <p className="text-gray-500 text-center">
                                            <p className="font-semibold sm:text-base text-sm text-black-900">
                                                Bạn chưa có khóa học yêu thích nào
                                            </p>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

    );

};
