import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { CartesianGrid, XAxis, YAxis, Line, LineChart, Tooltip, ResponsiveContainer } from "recharts"; // Added YAxis and Tooltip to imports
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom"
import { formatCurrency } from "@/components/Formatcurrency/formatCurrency";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { TrendingUp } from "lucide-react"
import PropTypes from 'prop-types';
const notify = (message, type) => {
    if (type === 'success') {
        toast.success(message);
    } else {
        toast.error(message)
    }
}
import { UserContext } from "../context/usercontext";
export const Instructor = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const API_KEY = import.meta.env.VITE_API_KEY;
    const { instructor, logout, refreshToken } = useContext(UserContext);
    const [loadingLogout, setLoadingLogout] = useState(false);
    const [_success] = useState("");
    const navigate = useNavigate();
    const [teacherCourses, setTeacherCourses] = useState([]);
    const [teacherRevenue, setTeacherRevenue] = useState([]);
    const [teacherRank, setTeacherRank] = useState([]);
    const [teacherProgress, setTeacherProgress] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem("access_token");

    // hàm xử lý lấy doanh thu của giảng viên
    const fetchRevenueData = async () => {
        try {
            const response = await fetch(`${API_URL}/teacher/revenue`, {
                headers: {
                    'x-api-secret': `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            const transformedData = Array.from({ length: 12 }, (_, index) => ({
                month: `T${index + 1}`,
                revenue: 0,
            }));
            const currentMonth = new Date().getMonth();
            const totalRevenue = Number(data.data.summary.total_revenue);
            transformedData[currentMonth].revenue = totalRevenue;

            setChartData(transformedData);
            setTeacherRevenue(totalRevenue);
        } catch (error) {
            notify('Không thể tải dữ liệu doanh thu', error);
        } finally {
            setIsLoading(false);
        }
    };

    const calculateRevenueGrowth = (chartData) => {
        // Kiểm tra dữ liệu đầu vào
        if (!chartData || !Array.isArray(chartData) || chartData.length < 2) {
            return {
                growthPercentage: 0,
                trend: 'neutral',
                message: 'Chưa có đủ dữ liệu'
            };
        }

        // Lọc dữ liệu hợp lệ
        const validData = chartData.filter(item =>
            item &&
            typeof item.revenue === 'number' &&
            !isNaN(item.revenue)
        );

        if (validData.length < 2) {
            return {
                growthPercentage: 0,
                trend: 'neutral',
                message: 'Chưa có đủ dữ liệu'
            };
        }

        // Lấy dữ liệu 2 tháng gần nhất
        const currentMonth = validData[validData.length - 1];
        const previousMonth = validData[validData.length - 2];

        const currentRevenue = Number(currentMonth.revenue) || 0;
        const previousRevenue = Number(previousMonth.revenue) || 0;

        // Xử lý trường hợp đặc biệt khi previousRevenue = 0
        if (previousRevenue === 0) {
            if (currentRevenue > 0) {
                return {
                    growthPercentage: 100,
                    trend: 'increase',
                    message: 'Có xu hướng tăng'
                };
            }
            return {
                growthPercentage: 0,
                trend: 'neutral',
                message: 'Không đổi'
            };
        }

        // Tính phần trăm tăng trưởng
        const growthPercentage = ((currentRevenue - previousRevenue) / previousRevenue) * 100;

        // Xử lý kết quả
        if (isNaN(growthPercentage)) {
            return {
                growthPercentage: 0,
                trend: 'neutral',
                message: 'Không xác định'
            };
        }

        const roundedGrowth = Number(growthPercentage.toFixed(1));

        return {
            growthPercentage: roundedGrowth,
            trend: roundedGrowth > 0 ? 'increase' : roundedGrowth < 0 ? 'decrease' : 'neutral',
            message: `Có xu hướng ${roundedGrowth > 0 ? 'tăng' : 'giảm'}`
        };
    };

    const GrowthTrendDisplay = ({ chartData }) => {
        const growth = calculateRevenueGrowth(chartData);

        const trendColors = {
            increase: 'text-green-500',
            decrease: 'text-red-500',
            neutral: 'text-gray-500',
        };

        const currentMonthIndex = new Date().getMonth();
        const currentRevenue = chartData[currentMonthIndex]?.revenue || 0;

        return (
            <div className="flex items-center gap-2 font-medium leading-none">

                <div className="flex gap-2 text-xl">
                    Doanh thu tháng này:
                    {isLoading ? (
                        <Skeleton className="w-20 h-6 mt-2" />
                    ) : (
                        <div className="">
                            {formatCurrency(currentRevenue)}
                        </div>
                    )}
                </div>
                <TrendingUp className={`h-4 w-4 ${trendColors[growth.trend]}`} />
            </div>
        );
    };

    GrowthTrendDisplay.propTypes = {
        chartData: PropTypes.arrayOf(
            PropTypes.shape({
                month: PropTypes.string.isRequired,
                revenue: PropTypes.number.isRequired,
            })
        ).isRequired,
    };

    // hàm xử lý lấy danh sách khóa học của giảng viên
    const fetchTeacherCourse = async () => {
        try {
            const response = await axios.get(`${API_URL}/teacher/course`, {
                headers: {
                    'x-api-secret': `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                },
            });
            setTeacherCourses(response.data.courses)
        } catch (error) {
            notify('Không thể tải danh sách khóa học', 'error');
        }
    }

    // hàm xử lý lấy danh sách sinh viên hoàn thành khóa học của giảng viên
    const fetchTeacherProgress = async (teacherId) => {
        try {
            const response = await axios.get(`${API_URL}/teacher/${teacherId}/courses/completion-stats`, {
                headers: {
                    'x-api-secret': `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.status) {
                setTeacherProgress(response.data.data.total_unique_students);
            }
        } catch (error) {
            notify('Không thể tải thông tin tiến độ học viên', 'error');
        }
    }

    // hàm lấy xếp hạng của giảng viên
    const fetchTeacherRank = async () => {
        try {
            const response = await axios.get(`${API_URL}/teacher/rank`, {
                headers: {
                    'x-api-secret': `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                },
            });
            setTeacherRank(response.data[0].rank)
        } catch (error) {
            notify('Không thể tải thông tin xếp hạng', 'error');
        }
    }
    // hàm xử lý đăng xuất
    const handleLogout = () => {
        try {
            setLoadingLogout(true);
            logout();
            navigate('/login');
        } catch (error) {
            notify('Có lỗi xảy ra khi đăng xuất', 'error');
        } finally {
            setLoadingLogout(false);
        }
    };

    // hàm xử lý refreshtoken
    const handleRefreshToken = async () => {
        const newToken = await refreshToken();
        if (newToken) {
            alert('Token has been refreshed successfully!');
        } else {
            alert('Failed to refresh token. Please log in again.');
        }
    };

    useEffect(() => {
        if (!instructor) {
            notify('Vui lòng đăng nhập để truy cập trang này', 'error');
            navigate('/login');
            return;
        }
        if (instructor && instructor.user_id) {
            fetchTeacherCourse();
            fetchTeacherRank();
            fetchTeacherProgress(instructor.user_id);
            fetchRevenueData();
        }
    }, [instructor]);

    return (
        <>
            <section className="instructor-home">
                <div className="flex bg-gray-100 h-sc">
                    {/* Sidebar */}
                    <div className=" w-72 bg-white shadow-md border-gray-100 border-r-[1px] lg:block hidden">
                        <div className="p-3">
                            {/* logo */}
                            <div className="p-4 flex justify-between items-center">
                                <div className="logo ">
                                    <img src="./src/assets/images/antlearn.png" alt="Edumall Logo" className="w-20 h-14 object-cover" />
                                </div>
                                <div className="logout">
                                    <Link to="/">
                                        <img src="./src/assets/images/logout.svg" className="w-7" alt="" />
                                    </Link>

                                </div>
                            </div>
                            {/* ul list */}
                            <ul className="">
                                <li className="mb-3">
                                    <Link to="/instructor" className="flex items-center px-4 py-2 rounded-2xl text-gray-700  bg-gray-100">
                                        <div className="bg-yellow-400  mr-3 px-1 rounded-full">
                                            <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/dashboard.svg" className="w-7" alt="" />
                                        </div>
                                        <p className="font-semibold text-base">Bảng điều khiển</p>
                                    </Link>

                                </li>
                                <li className="mb-3">
                                    <Link to="/instructor/lesson" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100">
                                        <div className=" mr-3 px-1 rounded-full">
                                            <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/lesson.svg" className="w-7" alt="" />
                                        </div>
                                        <p className="font-semibold text-base">Bài học của tôi</p>
                                    </Link>
                                </li>
                                <li className="mb-3">
                                    <Link to="/instructor/history" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100">
                                        <div className=" mr-3 px-1 rounded-full">
                                            <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/history.svg" className="w-7" alt="" />
                                        </div>
                                        <p className="font-semibold text-base">Lịch sử mua hàng</p>
                                    </Link>
                                </li>
                                <li className="mb-3">
                                    <Link to="/instructor/notification" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100">
                                        <div className=" mr-3 px-1 rounded-full">
                                            <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/notification.svg" className="w-7" alt="" />
                                        </div>
                                        <p className="font-semibold text-base">Thông báo</p>
                                    </Link>
                                </li>
                                <li className="mb-3">
                                    <Link to="/instructor/profile" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100">
                                        <div className=" mr-3 px-1 rounded-full">
                                            <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/user.svg" className="w-7" alt="" />
                                        </div>
                                        <p className="font-semibold text-base">Thông tin tài khoản</p>
                                    </Link>
                                </li>
                                <li className="mb-3">
                                    <Link to="/instructor/schedule" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100">
                                        <div className=" mr-3 px-1 rounded-full">
                                            <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/instructorschedule.svg" className="w-7" alt="" />
                                        </div>
                                        <p className="font-semibold text-base">Thông tin lịch học</p>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Header */}
                        <div className="bg-white shadow-sm p-2">
                            <div className="flex items-center justify-between px-4 py-3">
                                {/* content */}
                                <h1 className="text-xl font-semibold ">
                                    <Link to="/">
                                        <div className="flex items-center gap-2">
                                            <img src="./src/assets/images/home.svg" className="w-6" alt="" />
                                            <p className="text-slate-600">Trang chủ</p>
                                        </div>

                                    </Link>
                                </h1>

                                {/* user info */}
                                <div className="flex items-center space-x-4">
                                    {isLoading ? (
                                        <div className="flex justify-between items-center gap-2 me-5">
                                            <div className="">
                                                <Skeleton className="w-12 h-12 rounded-full" />
                                            </div>
                                            <div className="space-y-2">
                                                <Skeleton className="w-20 h-3 " />
                                                <Skeleton className="w-20 h-3 " />

                                            </div>
                                        </div>

                                    ) : (
                                        <div className="flex items-center gap-2">
                                            {/* avatar */}
                                            {instructor?.avatar ? (
                                                <img
                                                    src={instructor.avatar}
                                                    alt="User Avatar"
                                                    className="w-10 h-10 object-cover rounded-full"
                                                />
                                            ) : (
                                                <img src="./src/assets/images/user.svg" className="w-8" alt="" />
                                            )}

                                            {/* user control */}
                                            <div className="text-left">
                                                <span className="font-medium text-sm">{instructor?.name}</span>
                                                <br />
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger>
                                                        <div className="flex items-center">
                                                            <p className="text-gray-600 text-sm">{instructor?.role}</p>
                                                            <svg className="w-4 h-4 ml-1 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </div>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <div className="p-3">
                                                            <DropdownMenuItem>
                                                                <span className="cursor-pointer" onClick={handleLogout}>Đăng xuất</span>
                                                            </DropdownMenuItem>
                                                        </div>
                                                    </DropdownMenuContent>

                                                </DropdownMenu>
                                            </div>
                                            {/* toggler */}
                                            <div className="">
                                                <Sheet>
                                                    <SheetTrigger>
                                                        <div className="w-5 lg:hidden block">
                                                            <box-icon name='menu'></box-icon>

                                                        </div>
                                                        {/* <img src="./src/assets/images/toggle.png"  alt="" /> */}
                                                    </SheetTrigger>
                                                    <SheetContent>
                                                        <SheetHeader>
                                                            <SheetTitle>
                                                                <div className="p-4 flex justify-between items-center border-b-[1px]">
                                                                    <div className="logo ">
                                                                        <img src="/src/assets/images/antlearn.png" alt="Edumall Logo" className="w-20 h-14 object-cover" />
                                                                    </div>
                                                                </div>
                                                            </SheetTitle>
                                                            <SheetDescription>
                                                                <ul className="">
                                                                    <li className="mb-3">
                                                                        <Link to="/instructor" className="flex items-center px-4 py-2 rounded-2xl text-gray-700  bg-gray-100">
                                                                            <div className="bg-yellow-400  mr-3 px-1 rounded-full">
                                                                                <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/dashboard.svg" className="w-7" alt="" />
                                                                            </div>
                                                                            <p className="font-semibold text-base">Bảng điều khiển</p>
                                                                        </Link>

                                                                    </li>
                                                                    <li className="mb-3">
                                                                        <Link to="/instructor/lesson" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100">
                                                                            <div className=" mr-3 px-1 rounded-full">
                                                                                <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/lesson.svg" className="w-7" alt="" />
                                                                            </div>
                                                                            <p className="font-semibold text-base">Bài học của tôi</p>
                                                                        </Link>
                                                                    </li>
                                                                    <li className="mb-3">
                                                                        <Link to="/instructor/history" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100">
                                                                            <div className=" mr-3 px-1 rounded-full">
                                                                                <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/history.svg" className="w-7" alt="" />
                                                                            </div>
                                                                            <p className="font-semibold text-base">Lịch sử mua hàng</p>
                                                                        </Link>
                                                                    </li>
                                                                    <li className="mb-3">
                                                                        <Link to="/instructor/notification" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100">
                                                                            <div className=" mr-3 px-1 rounded-full">
                                                                                <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/notification.svg" className="w-7" alt="" />
                                                                            </div>
                                                                            <p className="font-semibold text-base">Thông báo</p>
                                                                        </Link>
                                                                    </li>
                                                                    <li className="mb-3">
                                                                        <Link to="/instructor/profile" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100">
                                                                            <div className=" mr-3 px-1 rounded-full">
                                                                                <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/user.svg" className="w-7" alt="" />
                                                                            </div>
                                                                            <p className="font-semibold text-base">Thông tin tài khoản</p>
                                                                        </Link>
                                                                    </li>
                                                                    <li className="mb-3">
                                                                        <Link to="/instructor/schedule" className="flex items-center px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-100">
                                                                            <div className=" mr-3 px-1 rounded-full">
                                                                                <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/instructorschedule.svg" className="w-7" alt="" />
                                                                            </div>
                                                                            <p className="font-semibold text-base">Thông tin lịch học</p>
                                                                        </Link>
                                                                    </li>
                                                                </ul>
                                                            </SheetDescription>
                                                        </SheetHeader>
                                                    </SheetContent>
                                                </Sheet>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                        {/* Dashboard Content */}
                        <div className="p-6">
                            {/* Mini section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
                                <div className="bg-white rounded-lg shadow-lg p-4 flex items-center">
                                    <div className="bg-red-100 rounded-full p-3 mr-4 text-2xl">📚</div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-semibold">Tổng khóa học</p>
                                        <p className="text-xl font-semibold">
                                            {isLoading ? (
                                                <Skeleton className="w-5 h-6 mt-2" />
                                            ) : (
                                                <div className="">
                                                    {teacherCourses.length}
                                                </div>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white rounded-lg shadow-lg p-4 flex items-center">
                                    <div className="bg-green-100 rounded-full p-3 mr-4 text-2xl">✅</div>
                                    <div>
                                        <p className="text-sm text-gray-600">Số khóa học đã hoàn thành</p>
                                        <p className="text-xl font-semibold">
                                            {isLoading ? (
                                                <Skeleton className="w-5 h-6 mt-2" />
                                            ) : (
                                                <div className="">
                                                    {teacherProgress}
                                                </div>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white rounded-lg shadow-lg p-4 flex items-center">
                                    <div className="bg-gray-100 rounded-full p-3 mr-4 text-2xl">⏱️</div>
                                    <div>
                                        <p className="text-sm text-gray-600">Tổng doanh thu:</p>

                                        <p className="text-xl font-semibold">
                                            {isLoading ? (
                                                <Skeleton className="w-20 h-6 mt-2" />
                                            ) : (
                                                <div className="">
                                                    {formatCurrency(teacherRevenue)}
                                                </div>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white rounded-lg shadow-lg p-4 flex items-center">
                                    <div className="bg-yellow-100 rounded-full p-3 mr-4 text-2xl">🏆</div>
                                    <div>
                                        <p className="text-sm text-gray-600">Xếp hạng</p>
                                        <p className="text-xl font-semibold">
                                            {isLoading ? (
                                                <Skeleton className="w-5 h-6 mt-2" />
                                            ) : (
                                                <div className="">
                                                    {teacherRank}
                                                </div>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* chart */}
                            <div className="col-span-3 mt-5 xl:mt-0">
                                <div className="w-full gap-4">
                                    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                                        <CardHeader className="pb-2">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <CardTitle className="text-2xl font-bold text-gray-800">Biểu đồ Doanh thu</CardTitle>
                                                    <CardDescription className="text-gray-600">Tháng 1 - Tháng 12 2024</CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-4">
                                            {isLoading ? (
                                                <div className="h-[430px] w-full p-4">
                                                    <div className="relative h-full w-full">
                                                        {/* Y-axis labels skeleton */}
                                                        <div className="absolute left-0 h-full flex flex-col justify-between py-4">
                                                            {[0, 1, 2, 3].map((i) => (
                                                                <Skeleton key={i} className="h-4 w-20" />
                                                            ))}
                                                        </div>

                                                        {/* Chart grid lines */}
                                                        <div className="ml-24 h-full flex flex-col justify-between">
                                                            {[0, 1, 2, 3, 4].map((i) => (
                                                                <div
                                                                    key={i}
                                                                    className="w-full border-b border-dashed border-gray-100"
                                                                    style={{ opacity: 0.5 }}
                                                                />
                                                            ))}
                                                        </div>

                                                        {/* Animated line skeleton - Horizontal straight line */}
                                                        <div className="absolute inset-0 ml-24 mt-[340px]"> {/* Adjusted position */}
                                                            <div className="relative h-[2px] w-[calc(100%-24px)]"> {/* Adjusted width */}
                                                                <div className="absolute top-0 left-0 h-full w-full">
                                                                    {/* Base line */}
                                                                    <div className="absolute h-[2px] w-full bg-gray-200" />
                                                                    {/* Animated overlay */}
                                                                    <div
                                                                        className="absolute h-[2px] w-full"
                                                                        style={{
                                                                            animation: 'shimmer 2s infinite linear',
                                                                            background: 'linear-gradient(90deg, transparent, #4CAF50 50%, transparent 100%)',
                                                                            backgroundSize: '200% 100%'
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Dot points skeleton */}
                                                        <div className="absolute bottom-12 left-24 right-0 flex justify-between">
                                                            {[...Array(12)].map((_, i) => (
                                                                <div key={i} className="flex flex-col items-center gap-2">
                                                                    <Skeleton className="w-3 h-3 rounded-full bg-white border-2 border-gray-200" />
                                                                    <Skeleton className="h-4 w-6" /> {/* Month label */}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="w-full h-[430px]">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <LineChart
                                                            data={chartData}
                                                            margin={{
                                                                top: 20,
                                                                right: 30,
                                                                left: 20,
                                                                bottom: 20,
                                                            }}
                                                        >
                                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                                            <XAxis
                                                                dataKey="month"
                                                                tickLine={false}
                                                                axisLine={false}
                                                                tickMargin={12}
                                                                stroke="#888888"
                                                            />
                                                            <YAxis
                                                                tickLine={false}
                                                                axisLine={false}
                                                                tickMargin={12}
                                                                stroke="#888888"
                                                                domain={[0, 'dataMax + 10000']}
                                                                tickFormatter={(value) =>
                                                                    new Intl.NumberFormat('vi-VN', {
                                                                        style: 'currency',
                                                                        currency: 'VND',
                                                                        notation: 'compact',
                                                                    }).format(value)
                                                                }
                                                            />
                                                            <Tooltip
                                                                contentStyle={{
                                                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                                    border: 'none',
                                                                    borderRadius: '8px',
                                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                                                }}
                                                                formatter={(value) => [
                                                                    new Intl.NumberFormat('vi-VN', {
                                                                        style: 'currency',
                                                                        currency: 'VND',
                                                                    }).format(value),
                                                                    "Doanh thu"
                                                                ]}
                                                                labelStyle={{ color: '#666' }}
                                                            />
                                                            <Line
                                                                type="monotone"
                                                                dataKey="revenue"
                                                                stroke="#4CAF50"
                                                                strokeWidth={3}
                                                                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                                                                activeDot={{ r: 6, strokeWidth: 2 }}
                                                            />
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            )}
                                        </CardContent>
                                        <CardFooter className="border-t pt-4">
                                            <div className="flex flex-col w-full gap-3 pt-4">
                                                <GrowthTrendDisplay chartData={chartData} />
                                                <div className="text-sm text-muted-foreground">
                                                    Hiển thị doanh thu trong 12 tháng qua
                                                </div>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
            <Toaster />

        </>
    )
}
