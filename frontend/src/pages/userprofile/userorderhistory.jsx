import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatCurrency } from '@/components/Formatcurrency/formatCurrency';
import { formatDate } from '@/components/FormatDay/Formatday';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink, Eye, Heart, Trash2, User, History, Bell } from 'lucide-react';
import { Link } from "react-router-dom";

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

export const UserOrderHistory = () => {
    const [orderHistory, setOrderHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [user, setUser] = useState({});

    // Fetch thông tin user đang đăng nhập
    const fetchUser = async () => {
        setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchOrderHistory = async () => {
        const token = localStorage.getItem("access_token");
        const userId = user.user_id;

        if (!userId) {
            console.log("User ID not found");
            return;
        }

        try {
            const response = await axios.get(`${API_URL}/orders/user/${userId}`, {
                headers: {
                    'x-api-secret': `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                }
            });
            const filteredOrders = response.data.data.filter(order => order.status === 'success');
            setOrderHistory(filteredOrders);
        } catch (error) {
            console.log('Error fetching order history', error);
        }
    };

    useEffect(() => {
        if (user.user_id) {
            fetchOrderHistory();
        }
    }, [user.user_id]);

    const searchOrderHistory = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("access_token");
        setLoading(true);

        try {
            const response = await axios.get(`${API_URL}/auth/orders/searchHistory`, {
                headers: {
                    'x-api-secret': `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                },
                params: { keyword: searchQuery }
            });
            setOrderHistory(response.data);
        } catch (error) {
            console.log('Error searching order history', error);
        }
        setLoading(false);
    };

    const renderOrderHistory = () => {
        if (loading) {
            return (
                <div className="flex flex-wrap justify-center items-center">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div className="bg-gray-100 h-10 w-20 rounded-lg animate-pulse mx-2" key={index}></div>
                    ))}
                </div>
            );
        }
        if (orderHistory.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                        <div className="flex flex-col items-center">
                            <svg width="100%" height="177" viewBox="0 0 139 142" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* SVG content */}
                            </svg>
                            <p className="text-gray-500">
                                <p className="font-semibold sm:text-base text-sm text-black-900">{searchQuery ? "Không có kết quả tìm kiếm" : "Bạn chưa đăng ký khóa học nào"}</p>
                            </p>
                        </div>
                    </TableCell>
                </TableRow>
            );
        }

        return orderHistory.map((item, index) => (
            <TableRow key={index} className="sm:p-4 p-0">
                <TableCell className="sm:p-4 py-2 px-0 lg:text-base sm:text-sm text-xs">
                    {index + 1}
                </TableCell>
                <TableCell className="sm:p-4 py-2 px-0 xl:w-[400px] lg:w-[250px] md:w-[200px] w-fit font-medium lg:text-base sm:text-sm text-xs">
                    <p className="line-clamp-2">
                        {item.order_details && item.order_details.length > 0 ?
                            item.order_details.map(detail => detail.course.title).join(", ") :
                            "Đang tải tên khóa học"}
                    </p>
                </TableCell>
                <TableCell className="sm:p-4 py-2 px-0 lg:text-base sm:text-sm text-xs">
                    <span className={`${item.status === "success" ? "bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full" : ""}`}>
                        {item.status === "success" ? "Thành công" : item.status}
                    </span>
                </TableCell>
                <TableCell className="sm:p-4 py-2 px-0 lg:text-base sm:text-sm text-xs">
                    <img src="/src/assets/images/logo-vnpay.jpg" alt="VNPay" className="w-32 h-14 object-contain pr-4" />
                </TableCell>
                <TableCell className="sm:p-4 py-2 px-0 lg:text-base sm:text-sm text-xs">
                    {formatDate(item.created_at)}
                </TableCell>
                <TableCell className="sm:p-4 py-2 px-0 lg:text-base sm:text-sm text-xs">
                    {formatCurrency(item.total_price)}
                </TableCell>
            </TableRow>
        ));
    };

    return (
        <section className="my-10 mx-auto px-4 lg:px-10 xl:px-20">
            <div className="border-0 rounded-xl px-8 py-6 shadow-xl bg-white">
                {/* Header */}
                <div className="py-6 border-b border-gray-200/80">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-50 rounded-xl">
                            <History className="w-5 h-5 text-yellow-500" />
                        </div>
                        <div>
                            <h2 className="font-bold text-xl bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                                Lịch sử mua hàng
                            </h2>
                            <p className="text-gray-500 text-sm">Xem lại những giao dịch bạn đã hoàn thành.</p>
                        </div>
                    </div>
                </div>

                <div className="lg:grid grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="col-span-1 my-6">
                        <ul className="gap-2 text-sm font-medium flex lg:flex-col">
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
                                    className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-white"
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
                                    className="flex items-center gap-2 p-3 rounded-xl hover:bg-yellow-50 transition-all duration-200"
                                >
                                    <Heart className="w-4 h-4" />
                                    <span>Yêu thích</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Main Content */}
                    <div className="col-span-3 my-6">
                        <div className="pb-6 mb-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold">Lịch sử mua hàng của bạn</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Xem lại những giao dịch bạn đã hoàn thành.
                            </p>
                        </div>

                        <div>
                            <form onSubmit={searchOrderHistory}>
                                <div className="mb-4 flex items-center gap-2">
                                    <Input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Nhập để tìm kiếm khóa học của bạn..."
                                        className="border p-5 rounded-lg w-1/2"
                                    />
                                    <Button type="submit" className="bg-blue-500 text-white p-5 rounded">
                                        Tìm kiếm
                                    </Button>
                                </div>
                            </form>
                        </div>

                        <div className="mb-5">
                            <Table>
                                <TableHeader>
                                    <TableRow className="text-center">
                                        <TableHead className="p-4 lg:text-base text-sm text-gray-700 font-medium min-w-[50px]">STT</TableHead>
                                        <TableHead className="p-4 lg:text-base text-sm text-gray-700 font-medium min-w-[200px]">Tên khóa học</TableHead>
                                        <TableHead className="p-4 lg:text-base text-sm text-gray-700 font-medium min-w-[150px]">Trạng thái</TableHead>
                                        <TableHead className="p-4 lg:text-base text-sm text-gray-700 font-medium min-w-[150px]">Phương thức</TableHead>
                                        <TableHead className="p-4 lg:text-base text-sm text-gray-700 font-medium min-w-[150px]">Ngày mua</TableHead>
                                        <TableHead className="p-4 lg:text-base text-sm text-gray-700 font-medium min-w-[100px]">Giá</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {renderOrderHistory()}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};