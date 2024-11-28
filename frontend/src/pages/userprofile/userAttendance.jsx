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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock, Calendar, Users } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

export const UserAttendance = () => {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({});
    const [attendanceList, setAttendanceList] = useState([]);
    const token = localStorage.getItem("access_token");
    const [statistics, setStatistics] = useState([]);

    // hàm xử lý điểm danh
    const fetchAttendanceList = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${API_URL}/attendance/history`, {
                headers: {
                    'x-api-secret': `${API_KEY}`,
                    Authorization: `Bearer ${token}`
                }
            });
            setAttendanceList(response.data.attendance_history);
            setStatistics(response.data.statistics)
        } catch (error) {
            console.log('Lỗi', error)
        } finally {
            setLoading(false)
        }
    }



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
                                        <h3 className="text-lg font-semibold">Điểm danh của bạn</h3>
                                        <p className="text-sm text-gray-500">
                                            Xem lại những lần điểm danh qua các ngày học của bạn.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-5">

                                <div className="space-y-6">
                                    {/* Thống kê nhanh */}
                                    {loading ? (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                            {Array.from({ length: 4 }).map((_, index) => (
                                                <div key={index} className="bg-white p-4 rounded-lg shadow">
                                                    <Skeleton className="w-20 h-4 mb-2" /> {/* Cho tiêu đề */}
                                                    <Skeleton className="w-16 h-8" /> {/* Cho số liệu */}
                                                </div>
                                            ))}
                                        </div>
                                    ) :
                                        statistics && (
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                                <div className="bg-white p-4 rounded-lg shadow">
                                                    <p className="text-sm text-gray-500">Tổng buổi học</p>
                                                    <p className="text-2xl font-semibold">{statistics.total_classes}</p>
                                                </div>
                                                <div className="bg-white p-4 rounded-lg shadow">
                                                    <p className="text-sm text-gray-500">Số buổi vắng</p>
                                                    <p className="text-2xl font-semibold">{statistics.absent}</p>
                                                </div>
                                                <div className="bg-white p-4 rounded-lg shadow">
                                                    <p className="text-sm text-gray-500">Số buổi có mặt</p>
                                                    <p className="text-2xl font-semibold">{statistics.present}</p>
                                                </div>
                                                <div className="bg-white p-4 rounded-lg shadow">
                                                    <p className="text-sm text-gray-500">Tỷ lệ tham gia</p>
                                                    <p className="text-2xl font-semibold">{statistics.attendance_rate}%</p>
                                                </div>
                                            </div>
                                        )
                                    }


                                    {/* Bảng điểm danh */}
                                    <div className="bg-white rounded-lg shadow">
                                        <div className="p-4 border-b">
                                            <h2 className="text-lg font-semibold">Lịch sử điểm danh</h2>
                                        </div>

                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-yellow-50/50">
                                                    <TableHead className="p-4 text-sm font-medium text-gray-700 w-[50px]">STT</TableHead>
                                                    <TableHead className="p-4 text-sm font-medium text-gray-700 min-w-[200px]">Ngày học</TableHead>
                                                    <TableHead className="p-4 text-sm font-medium text-gray-700 min-w-[150px]">Trạng thái</TableHead>
                                                    <TableHead className="p-4 text-sm font-medium text-gray-700 min-w-[150px]">Giờ vào học</TableHead>
                                                    <TableHead className="p-4 text-sm font-medium text-gray-700 min-w-[150px]">Giờ thoát</TableHead>
                                                </TableRow>
                                            </TableHeader>

                                            <TableBody>
                                                {loading ? (
                                                    <TableRow>
                                                        {Array.from({ length: 5 }).map((_, index) => (
                                                            <TableCell key={index}>
                                                                <Skeleton className="w-[80px] h-[20px] rounded-full" />
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                ) : !attendanceList || attendanceList.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={5} className="text-center py-8">
                                                            <div className="flex flex-col items-center space-y-4">
                                                                <svg className="w-32 h-32" viewBox="0 0 139 142" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    {/* Giữ nguyên SVG code của bạn */}
                                                                </svg>
                                                                <p className="font-semibold text-base text-gray-900">
                                                                    Không có lịch điểm danh nào
                                                                </p>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    attendanceList.map((item, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell className="p-4 text-sm">
                                                                {index + 1}
                                                            </TableCell>
                                                            <TableCell className="p-4 text-sm font-medium">
                                                                {item.attendance_date}
                                                            </TableCell>
                                                            <TableCell className="p-4 text-sm">
                                                                <span className={`px-2 py-1 rounded-full ${item.attendance_status === 'ó mặt'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-red-100 text-red-800'
                                                                    }`}>
                                                                    {item.attendance_status}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell className="p-4 text-sm">
                                                                {item.attendance_details.joined_at}
                                                            </TableCell>
                                                            <TableCell className="p-4 text-sm">
                                                                {item.attendance_details.left_at}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

    );
};
