import React, { useEffect, useState } from 'react';
import { TrendingUp } from "lucide-react"
import { CartesianGrid, XAxis, YAxis, Line, LineChart, Tooltip, ResponsiveContainer } from "recharts"; // Added YAxis and Tooltip to imports
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
    mobile: {
        label: "Mobile",
        color: "hsl(var(--chart-2))",
    },
}
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
} from "@/components/ui/collapsible"

import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { SideBarUI } from "../sidebarUI"
import { Link } from "react-router-dom"
import { Input } from "@/components/ui/input"
import PropTypes from 'prop-types'; // Import PropTypes


const API_KEY = import.meta.env.VITE_API_KEY
const API_URL = import.meta.env.VITE_API_URL
export default function Dashboard() {
    const [summaryData, setSummaryData] = useState({
        total_revenue: 0,
        total_courses_sold: 0,
        total_lessons: 0
    });
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSummaryData = async () => {
        try {
            const response = await fetch(`${API_URL}/admin/summary`, {
                headers: {
                    'x-api-secret': API_KEY
                }
            });
            const data = await response.json();
            setSummaryData(data);
        } catch (error) {
            console.error('Error fetching summary data:', error);
        }
    };

    const fetchRevenueData = async () => {
        try {
            const response = await fetch(`${API_URL}/admin/revenue-chart`, {
                headers: {
                    'x-api-secret': API_KEY
                }
            });
            const data = await response.json();
            const transformedData = Object.entries(data).map(([month, revenue]) => ({
                month: `T${month}`,
                revenue: revenue
            }));
            setChartData(transformedData);
        } catch (error) {
            console.error('Error fetching revenue data:', error);
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

    // Component hiển thị xu hướng
    // const GrowthTrendDisplay = ({ chartData }) => {
    //     const growth = calculateRevenueGrowth(chartData);

    //     // Xác định màu sắc dựa trên xu hướng
    //     const trendColors = {
    //         increase: 'text-green-500',
    //         decrease: 'text-red-500',
    //         neutral: 'text-gray-500'
    //     };

    //     // Chỉ hiển thị phần trăm nếu có sự thay đổi
    //     const displayText = growth.trend === 'neutral'
    //         ? growth.message
    //         : `${growth.message} ${Math.abs(growth.growthPercentage)}% trong tháng này`;

    //     return (
    //         <div className="flex items-center gap-2 font-medium leading-none">
    //             Doanh thu tháng này: {formatCurrency(chartData[chartData.length - 1]?.revenue || 0)}
    //             <TrendingUp className={`h-4 w-4 ${trendColors[growth.trend]}`} />
    //         </div>
    //     );
    // };

    const GrowthTrendDisplay = ({ chartData }) => {
        const growth = calculateRevenueGrowth(chartData);

        // Xác định màu sắc dựa trên xu hướng
        const trendColors = {
            increase: 'text-green-500',
            decrease: 'text-red-500',
            neutral: 'text-gray-500',
        };

        // Chỉ hiển thị phần trăm nếu có sự thay đổi
        const displayText =
            growth.trend === 'neutral'
                ? growth.message
                : `${growth.message} ${Math.abs(growth.growthPercentage)}% trong tháng này`;

        return (
            <div className="flex items-center gap-2 font-medium leading-none">
                Doanh thu tháng này: {formatCurrency(chartData[chartData.length - 1]?.revenue || 0)}
                <TrendingUp className={`h-4 w-4 ${trendColors[growth.trend]}`} />
            </div>
        );
    };

    // Thêm PropTypes để xác thực kiểu dữ liệu của chartData
    GrowthTrendDisplay.propTypes = {
        chartData: PropTypes.arrayOf(
            PropTypes.shape({
                month: PropTypes.string.isRequired,
                revenue: PropTypes.number.isRequired,
            })
        ).isRequired,
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    useEffect(() => {
        fetchSummaryData();
        fetchRevenueData();
    }, []);


    /* Quản lí tài chính */
    const revenue = 500000;
    const expenses = 200000;
    const profit = revenue - expenses;
    const profitMargin = ((profit / revenue) * 100).toFixed(2);

    // Mock data for transactions
    const transactions = [
        { id: 1, date: '2024-11-10', amount: 150000, status: 'Success' },
        { id: 2, date: '2024-11-09', amount: 200000, status: 'Success' },
        { id: 3, date: '2024-11-08', amount: 250000, status: 'Success' },
        { id: 4, date: '2024-11-10', amount: 150000, status: 'Success' },
        { id: 5, date: '2024-11-09', amount: 200000, status: 'Success' },
        { id: 6, date: '2024-11-08', amount: 250000, status: 'Success' },
    ];

    const revenueData = [
        { month: "Tháng 1", revenue: 800 },
        { month: "Tháng 2", revenue: 950 },
        { month: "Tháng 3", revenue: 850 },
        { month: "Tháng 4", revenue: 1000 },
        { month: "Tháng 5", revenue: 1200 },
        { month: "Tháng 6", revenue: 1300 },
        { month: "Tháng 7", revenue: 800 },
        { month: "Tháng 8", revenue: 950 },
        { month: "Tháng 9", revenue: 850 },
        { month: "Tháng 10", revenue: 1000 },
        { month: "Tháng 11", revenue: 1200 },
        { month: "Tháng 12", revenue: 1300 },
    ]

    const expenseData = [
        { month: "Tháng 1", expense: 800 },
        { month: "Tháng 2", expense: 950 },
        { month: "Tháng 3", expense: 850 },
        { month: "Tháng 4", expense: 1000 },
        { month: "Tháng 5", expense: 1200 },
        { month: "Tháng 6", expense: 1300 },
        { month: "Tháng 7", expense: 800 },
        { month: "Tháng 8", expense: 950 },
        { month: "Tháng 9", expense: 850 },
        { month: "Tháng 10", expense: 1000 },
        { month: "Tháng 11", expense: 1200 },
        { month: "Tháng 12", expense: 1300 },
    ]
    const maxRevenue = Math.max(...revenueData.map(item => item.revenue));
    /* ------------------------- */

    return (
        <SidebarProvider className="">
            <SideBarUI />
            <SidebarInset className='relative'>
                {/* header */}
                <header className="absolute left-0 top-3 font-sans">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/">
                                        Trang chủ
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/admin">
                                        Dashboard
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="absolute top-12 w-full font-sans">
                    <div className="mx-auto p-4">
                        <div className="flex justify-between items-center mb-6">

                            {/* admin - page */}
                            <div>
                                <h1 className="text-xl sm:text-2xl font-semibold">Admin</h1>
                                <div className="text-gray-500 text-sm mt-1">
                                    <Link to="/" className="text-xs sm:text-sm">Trang chủ</Link> &gt; <span className="text-xs sm:text-sm">Dashboard</span>
                                </div>
                            </div>

                            {/* search */}
                            <div className="flex items-center gap-2">
                                <Input
                                    type="text"
                                    placeholder="Search..."
                                    className="border rounded-md px-3 py-1 text-gray-700"
                                />

                                {/* notification */}
                                <div className="">
                                    <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/notification.svg" className="w-10" alt="" />
                                </div>

                                {/* useer */}
                                <div className="">
                                    <img src="https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474120nrt/anh-avatar-shin-cute-nhat_014815307.jpg" alt="User" className="w-10 rounded-full" />
                                </div>

                            </div>
                        </div>
                        <div className="grid lg:grid-cols-4 grid-cols-2 gap-3 mb-6">

                            {/* doanh thu */}
                            <div className="bg-white shadow rounded p-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="xl:text-base lg:text-sm text-xs font-semibold text-green-500 uppercase">
                                        Tổng doanh thu
                                    </h2>
                                </div>
                                <div className="my-2 text-2xl font-semibold">
                                    {formatCurrency(summaryData.total_revenue)}
                                </div>
                                <div className="text-sm mt-1">
                                    <p>2024</p>
                                </div>
                            </div>

                            {/* tổng khóa học */}
                            <div className="bg-white shadow rounded p-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="xl:text-base lg:text-sm text-xs font-semibold text-red-500 uppercase">
                                        Tổng khóa học
                                    </h2>
                                </div>
                                <div className="my-2 text-2xl font-semibold">
                                    {summaryData.total_courses_sold}
                                </div>
                                <div className="text-sm mt-1">Đã bán</div>
                            </div>

                            {/* tổng bài học */}
                            <div className="bg-white shadow rounded p-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="xl:text-base lg:text-sm text-xs font-semibold text-blue-500 uppercase">
                                        Bài học
                                    </h2>
                                </div>
                                <div className="my-2 text-2xl font-semibold">
                                    {summaryData.total_lessons}
                                </div>
                                <div className="text-sm mt-1">Tổng cộng</div>
                            </div>

                            {/* Đánh giá trung bình */}
                            <div className="bg-white shadow rounded p-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="xl:text-base lg:text-sm text-xs font-semibold text-yellow-500 uppercase">Đánh giá</h2>
                                </div>
                                <div className="my-2 text-2xl font-semibold">4.5</div>
                                <div className="text-sm mt-1">Điểm trung bình</div>
                            </div>

                        </div>
                    </div>
                    <div className="xl:flex w-full gap-4 px-4 mb-10">
                        <Card className="xl:w-4/5 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-2xl font-bold text-gray-800">Biểu đồ Doanh thu</CardTitle>
                                        <CardDescription className="text-gray-600">Tháng 1 - Tháng 12 2024</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                {!isLoading && (
                                    <div className="w-full h-[400px]">
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
                                <div className="flex flex-col w-full gap-3">
                                    <GrowthTrendDisplay chartData={chartData} />
                                    <div className="text-sm text-muted-foreground">
                                        Hiển thị doanh thu trong 12 tháng qua
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                    <div>
                        {/* Tổng quan tài chính */}
                        <section className="bg-white p-5 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold mb-4">Tổng quan tài chính</h2>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-gray-100 p-4 rounded-lg">
                                    <h3 className="font-semibold">Doanh thu</h3>
                                    <p>{revenue.toLocaleString()} VND</p>
                                </div>
                                <div className="bg-gray-100 p-4 rounded-lg">
                                    <h3 className="font-semibold">Chi phí</h3>
                                    <p>{expenses.toLocaleString()} VND</p>
                                </div>
                                <div className="bg-gray-100 p-4 rounded-lg">
                                    <h3 className="font-semibold">Lợi nhuận</h3>
                                    <p>{profit.toLocaleString()} VND</p>
                                    <p className="text-green-600">Lợi nhuận gộp: {profitMargin}%</p>
                                </div>
                            </div>
                        </section>

                        {/* Danh sách giao dịch */}
                        <section className="mt-6 bg-white p-5 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold mb-4">Danh sách giao dịch</h2>
                            <table className="min-w-full table-auto">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="px-2 py-2 text-center">Mã giao dịch</th>
                                        <th className="px-4 py-2 text-center">Ngày</th>
                                        <th className="px-4 py-2 text-center">Số tiền</th>
                                        <th className="px-4 py-2 text-center">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map(transaction => (
                                        <tr key={transaction.id}>
                                            <td className="px-2 py-2 text-center">{transaction.id}</td>
                                            <td className="px-4 py-2 text-center">{transaction.date}</td>
                                            <td className="px-4 py-2 text-center">{transaction.amount.toLocaleString()} VND</td>
                                            <td className={`px-4 py-2 text-center ${transaction.status === 'Success' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                {transaction.status}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>

                        {/* Báo cáo tài chính */}
                        <section className="mt-6 bg-white p-5 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Báo cáo tài chính</h2>
                            <Card className="bg-gray-100 p-4 rounded-lg shadow-lg">
                                <CardHeader>
                                    <CardTitle className="font-semibold text-lg text-gray-800">Doanh thu tháng</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="relative h-[300px]">
                                        <div className="absolute inset-0 flex items-end justify-between gap-6">
                                            {revenueData.map((item) => (
                                                <div key={item.month} className="flex flex-col items-center flex-1">
                                                    <div className="w-full flex flex-col items-center">
                                                        <div
                                                            className="w-2/3 bg-orange-500/20 hover:bg-orange-500/30 transition-colors duration-300 rounded-t-sm shadow-md"
                                                            style={{
                                                                height: `${(item.revenue / maxRevenue) * 240}px`, // Tính chiều cao cột
                                                                transition: "height 0.3s ease-in-out", // Thêm hiệu ứng khi thay đổi chiều cao
                                                            }}
                                                        />
                                                        <div className="mt-3 text-sm font-medium text-gray-600">{item.month}</div>
                                                        <div className="mt-1 text-sm font-semibold text-gray-800">
                                                            {item.revenue.toLocaleString()} VND
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                    </div>

                </div>


            </SidebarInset>
        </SidebarProvider>
    )
}
