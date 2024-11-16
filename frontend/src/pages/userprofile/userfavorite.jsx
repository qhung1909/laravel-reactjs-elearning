import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { formatCurrency } from '@/components/Formatcurrency/formatCurrency';
import './userprofile.css';
const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;
export const UserFavorite = () => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        const fetchFavorites = async () => {
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

        fetchFavorites();
    }, []);

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
                                <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
                                    {favorites.length > 0 ? (
                                        favorites.map(favorites => {
                                            return (
                                                <div
                                                    key={favorites.favorites_id}
                                                    className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                                                >
                                                    <div className="aspect-square overflow-hidden">
                                                        <img
                                                            src={favorites.course.img}
                                                            className="w-full h-60 object-cover rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out group-hover:scale-105"
                                                            alt={favorites.course.title}
                                                        />

                                                    </div>
                                                    <div className="p-4 space-y-3">
                                                        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 min-h-[3.5rem]">
                                                            {favorites.course.title}
                                                        </h3>
                                                        <p className="text-sm font-medium text-gray-600">
                                                            Giá: {formatCurrency(favorites.course.price_discount)}
                                                        </p>
                                                        <div className="pt-2">
                                                            <Link
                                                                to={`/detail/${favorites.course.slug}`}
                                                                className="block w-full"
                                                            >
                                                                <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 rounded-lg transition-colors duration-300">
                                                                    Xem chi tiết
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="col-span-full text-center py-10">
                                            <p className="text-gray-500 text-lg">Không có khóa học yêu thích nào.</p>
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
