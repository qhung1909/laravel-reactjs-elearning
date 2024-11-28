import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatCurrency } from '@/components/Formatcurrency/formatCurrency';
import { formatDate } from '@/components/FormatDay/Formatday';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink, Eye, Heart, Trash2, User, History, Bell } from 'lucide-react';
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton"

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

export const UserAttendance = () => {
    const [orderHistory, setOrderHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [user, setUser] = useState({});
    const [attendanceList, setAttendanceList] = useState([]);
    const token = localStorage.getItem("access_token");

    // hàm xử lý điểm danh
    const fetchAttendanceList = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${API_KEY}/attendance/history`, {
                headers: {
                    'x-api-secret': `${API_KEY}`,
                    Authorization: `Bearer ${token}`
                }
            });
            setAttendanceList(response.data.data);
            console.log(setAttendanceList)
        } catch (error) {
            console.log('Lỗi', error)
        } finally {
            setLoading(false)
        }
    }

    const renderAttendanceList = () => {
        if (loading) {
            return (
                <TableRow>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <TableCell key={index}>
                            <Skeleton className="w-[80px] h-[20px] rounded-full" />
                        </TableCell>
                    ))}
                </TableRow>
            );
        }
        if (!attendanceList || attendanceList.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                        <div className="flex flex-col items-center">
                            <svg width="100%" height="177" viewBox="0 0 139 142" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* SVG path data... */}
                            </svg>
                            <p className="text-gray-500">
                                <p className="font-semibold sm:text-base text-sm text-black-900">
                                    {searchQuery ? "Không có kết quả tìm kiếm" : "Bạn chưa đăng ký khóa học nào"}
                                </p>
                            </p>
                        </div>
                    </TableCell>
                </TableRow>
            );
        }

        return attendanceList.map((item, index) => (
            <TableRow key={index} className="sm:p-4 p-0">
                <TableCell className="sm:p-4 py-2 px-0 lg:text-base sm:text-sm text-xs">
                    {index + 1}
                </TableCell>
                <TableCell className="sm:p-4 py-2 px-0 xl:w-[400px] lg:w-[250px] md:w-[200px] w-fit font-medium lg:text-base sm:text-sm text-xs">
                    <p className="line-clamp-2">
                        {item.attendance_status}
                    </p>
                </TableCell>
                <TableCell className="sm:p-4 py-2 px-0 lg:text-base sm:text-sm text-xs">
                    <p className="line-clamp-2">
                        {item.attendance_status}
                    </p>
                </TableCell>
                <TableCell className="sm:p-4 py-2 px-0 lg:text-base sm:text-sm text-xs">
                    <p className="line-clamp-2">
                        {item.attendance_status}
                    </p>
                </TableCell>
                <TableCell className="sm:p-4 py-2 px-0 lg:text-base sm:text-sm text-xs">
                    <p className="line-clamp-2">
                        {item.attendance_status}
                    </p>
                </TableCell>
                <TableCell className="sm:p-4 py-2 px-0 lg:text-base sm:text-sm text-xs">
                    <p className="line-clamp-2">
                        {item.attendance_status}
                    </p>
                </TableCell>
            </TableRow>
        ));
    };

    useEffect(() => {
        fetchAttendanceList();
    }, [])
    // Fetch thông tin user đang đăng nhập
    const fetchUser = async () => {
        setLoading(true);
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
            <section className="userorderhistory py-12 mx-auto px-4 lg:px-10 xl:px-20">
                <div className="border-0 rounded-xl px-8 py-6 shadow-xl bg-white/80 backdrop-blur-sm">
                    {/* Header */}
                    <div className="py-6 border-b border-gray-200/80">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-50 rounded-xl">
                                <History className="w-5 h-5 text-yellow-500" />
                            </div>
                            <div>
                                <h2 className="font-bold text-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                                    Lịch sử mua hàng
                                </h2>
                                <p className="text-gray-500 text-sm">Xem lại những giao dịch bạn đã hoàn thành.</p>
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
                                        className="flex items-center gap-3 p-3 hover:bg-yellow-50 rounded-xl transition-colors"
                                    >
                                        <History className="w-4 h-4" />
                                        <span>Lịch sử mua hàng</span>
                                    </Link>
                                </li>
                                <li className="w-full">
                                    <Link
                                        to="/user/noti"
                                        className="flex items-center gap-3 p-3 hover:bg-yellow-50 rounded-xl transition-colors"
                                    >
                                        <Bell className="w-4 h-4" />
                                        <span>Thông báo</span>
                                    </Link>
                                </li>
                                <li className="w-full">
                                    <Link
                                        to="/user/favorite"
                                        className="flex items-center gap-3 p-3 hover:bg-yellow-50 rounded-xl transition-colors"
                                    >
                                        <Heart className="w-4 h-4" />
                                        <span>Yêu thích</span>
                                    </Link>
                                </li>
                                <li className="w-full">
                                    <Link
                                        to="/user/attendance"
                                        className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-xl transition-colors"
                                    >
                                        <History className="w-4 h-4" />
                                        <span>Điểm danh</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Main Content */}
                        <div className="col-span-3 my-6">

                            <div className="border-b pb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-yellow-50 rounded-xl">
                                        <History className="w-5 h-5 text-yellow-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold">Lịch sử mua hàng của bạn</h3>
                                        <p className="text-sm text-gray-500">
                                            Xem lại những giao dịch bạn đã hoàn thành.
                                        </p>
                                    </div>
                                </div>
                            </div>


                            <div className="mb-5">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-yellow-50/50">
                                            <TableHead className="p-4 lg:text-base text-sm text-gray-700 font-medium min-w-[50px]">STT</TableHead>
                                            <TableHead className="p-4 lg:text-base text-sm text-gray-700 font-medium min-w-[200px]">Ngày học</TableHead>
                                            <TableHead className="p-4 lg:text-base text-sm text-gray-700 font-medium min-w-[150px]">Trạng thái</TableHead>
                                            <TableHead className="p-4 lg:text-base text-sm text-gray-700 font-medium min-w-[150px]">Giờ vào học</TableHead>
                                            <TableHead className="p-4 lg:text-base text-sm text-gray-700 font-medium min-w-[150px]">Giờ thoát</TableHead>
                                            {/* <TableHead className="p-4 lg:text-base text-sm text-gray-700 font-medium min-w-[100px]">Giá</TableHead> */}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {renderAttendanceList()}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

    );
};
