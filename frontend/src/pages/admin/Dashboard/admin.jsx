import React, { useEffect, useState } from 'react';
import { TrendingUp } from "lucide-react"
import { CartesianGrid, XAxis, YAxis, Line, LineChart, Tooltip } from "recharts"; // Added YAxis and Tooltip to imports
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
    const GrowthTrendDisplay = ({ chartData }) => {
        const growth = calculateRevenueGrowth(chartData);

        // Xác định màu sắc dựa trên xu hướng
        const trendColors = {
            increase: 'text-green-500',
            decrease: 'text-red-500',
            neutral: 'text-gray-500'
        };

        // Chỉ hiển thị phần trăm nếu có sự thay đổi
        const displayText = growth.trend === 'neutral'
            ? growth.message
            : `${growth.message} ${Math.abs(growth.growthPercentage)}% trong tháng này`;

        return (
            <div className="flex items-center gap-2 font-medium leading-none">
                Doanh thu tháng này: {formatCurrency(chartData[chartData.length - 1]?.revenue || 0)}
                <TrendingUp className={`h-4 w-4 ${trendColors[growth.trend]}`} />
            </div>
        );
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

    return (
        <SidebarProvider className="">
            <SideBarUI />
            <SidebarInset className='relative'>

                {/* header */}
                <header className="absolute left-0 top-3 font-sans">
                    {/* <header className="flex top-0 h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"> */}
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
                        <Card className="xl:w-3/5">
                            <CardHeader>
                                <CardTitle>Biểu đồ Doanh thu</CardTitle>
                                <CardDescription>Tháng 1 - Tháng 12 2024</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {!isLoading && (
                                    <div className="w-full h-[300px]">
                                        <LineChart
                                            width={800}
                                            height={300}
                                            data={chartData}
                                            margin={{
                                                top: 5,
                                                right: 30,
                                                left: 20,
                                                bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="month"
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={8}
                                            />
                                            <YAxis
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={8}
                                                domain={[0, 'dataMax + 10000']}
                                                tickFormatter={(value) => new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                }).format(value)}
                                                interval={0} // Đảm bảo hiển thị tất cả các ticks
                                            />

                                            <Tooltip formatter={(value) => new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND',
                                            }).format(value)} />
                                            <Line
                                                type="monotone"
                                                dataKey="revenue"
                                                stroke="#4CAF50"
                                                strokeWidth={2}
                                                dot={false}
                                            />
                                        </LineChart>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <div className="flex w-full items-start gap-2 text-sm">
                                    <div className="grid gap-2">
                                        <GrowthTrendDisplay chartData={chartData} />

                                        <div className="flex items-center gap-2 leading-none text-muted-foreground">
                                            Hiển thị doanh thu trong 12 tháng qua
                                        </div>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>

                </div>


            </SidebarInset>
        </SidebarProvider>
    )
}
