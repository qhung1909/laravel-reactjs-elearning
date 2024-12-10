import { useEffect, useState, useContext } from 'react';
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
import PropTypes from 'prop-types';
import { UserContext } from '@/pages/context/usercontext';

const API_KEY = import.meta.env.VITE_API_KEY
const API_URL = import.meta.env.VITE_API_URL
export default function Dashboard() {
    const [summaryData, setSummaryData] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [overview, setOverview] = useState([]);
    const [users, setUsers] = useState([]);

    // hàm xử lý lấy tất cả users
    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_URL}/users`, {
                headers: {
                    'x-api-secret': API_KEY
                }
            });
            const result = await response.json();
            setUsers(result.data);
        } catch (error) {
            console.error('Error fetching summary data:', error);
        }
    };

    const fetchOverview = async () => {
        try {
            const response = await fetch(`${API_URL}/admin/overview`, {
                headers: {
                    'x-api-secret': API_KEY
                }
            });
            const resuit = await response.json();
            setOverview(resuit.data);
            console.log(resuit.data)
        } catch (error) {
            console.error('Error fetching summary data:', error);
        }
    };


    // doanh thu tổng - khóa học đã bán - tổng bài học
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


    // biểu đồ doanh thu
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
        fetchOverview();
        fetchUsers();
        fetchSummaryData();
        fetchRevenueData();
    }, []);


    // Mock data for transactions
    const transactions = [
        { id: 1, date: '2024-11-10', amount: 150000, status: 'Success' },
        { id: 2, date: '2024-11-09', amount: 200000, status: 'Success' },
        { id: 3, date: '2024-11-08', amount: 250000, status: 'Success' },
        { id: 4, date: '2024-11-10', amount: 150000, status: 'Success' },
        { id: 5, date: '2024-11-09', amount: 200000, status: 'Success' },
        { id: 6, date: '2024-11-08', amount: 250000, status: 'Success' },
    ];


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

                {/* content */}
                <div className="absolute top-12 w-full font-sans">

                    {/* heading content */}
                    <div className="mx-auto p-4">



                        {/* admin - page */}
                        <div className="grid lg:grid-cols-2 grid-cols-2 gap-3">
                            <div className="">
                                <div className="mb-6 p-5 rounded border border-gray-200 shadow-md h-full">
                                    <h1 className="text-xl sm:text-2xl font-semibold">Trang quản trị</h1>
                                    <span className='text-sm text-gray-500'>Trang dành riêng cho quản trị viên, quản lí tất cả sản phẩm, khóa học, danh mục, header, footer, người dùng, nội dung...</span>
                                </div>

                            </div>
                            <div className=" grid grid-cols-2 gap-2">

                                {/* tổng doanh thu */}
                                <Card className="col-span-1 bg-orange-200 text-white relative overflow-hidden">
                                    <CardContent className="p-5">
                                        <div className="">
                                            <div className="space-y-1">
                                                <div className="p-1 bg-orange-400 rounded w-10 ">
                                                    <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/revenue.svg" className='w-20' alt="" />
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <div className="">
                                                        <p className='text-2xl font-semibold text-black'>
                                                            {formatCurrency(summaryData.total_revenue)}
                                                        </p>
                                                        <p className='font-semibold text-gray-700 mt-3'>Tổng doanh thu</p>
                                                    </div>
                                                    <div className="">
                                                        <div className="flex justify-center items-center">
                                                            <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/revenue2.svg" className='w-16 z-10' alt="" />
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                        </div>
                                    </CardContent>
                                    <div className="absolute top-0 right-14 h-40 w-40 translate-x-8 translate-y-[-50%] rounded-full bg-orange-500/20" />
                                    <div className="absolute top-5 right-0 h-44 w-44 translate-x-8 translate-y-[-50%] rounded-full bg-orange-400" />
                                </Card>
                                {/* tổng khóa học đã bán */}
                                <Card className="col-span-1 bg-green-200 text-white relative overflow-hidden">
                                    <CardContent className="p-5">
                                        <div className="">
                                            <div className="space-y-1">
                                                <div className="p-1 bg-green-400 rounded w-10 ">
                                                    <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/profitadmin.svg" className='w-20' alt="" />
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <div className="">
                                                        <p className='text-2xl font-semibold text-black'>
                                                            {formatCurrency(overview.admin_revenue)}
                                                        </p>
                                                        <p className='font-semibold text-gray-700 mt-3'>Lợi nhuận</p>
                                                    </div>
                                                    <div className="">
                                                        <div className="flex justify-center items-center">
                                                            <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/profitadmin2.svg" className='w-16 z-10' alt="" />
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                        </div>
                                    </CardContent>
                                    <div className="absolute top-0 right-14 h-40 w-40 translate-x-8 translate-y-[-50%] rounded-full bg-green-500/20" />
                                    <div className="absolute top-5 right-0 h-44 w-44 translate-x-8 translate-y-[-50%] rounded-full bg-green-400" />
                                </Card>

                            </div>


                        </div>
                    </div>

                    {/* bottom content */}
                    <div className="w-full p-4 xl:grid grid-cols-4 gap-3">

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
                                        {!isLoading && (
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
                        {/* revenue */}
                        <div className="col-span-1 space-y-5">
                            {/* card 1 */}
                            <Card className="col-span-1 bg-purple-800 text-white relative overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="mt-8">
                                        <div className="space-y-2">
                                            <div className="p-1 bg-purple-900 rounded w-10 ">
                                                <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/useradmin.svg" className='w-20' alt="" />
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="">
                                                    <p className='text-2xl font-semibold'>
                                                        {users.length}
                                                    </p>
                                                    <p className='font-semibold text-gray-200 mt-3'>Tổng học viên</p>
                                                </div>
                                                <div className="">
                                                    <div className="flex justify-center items-center">
                                                        <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/useradmin2.svg" className='w-16 z-10' alt="" />
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                </CardContent>
                                <div className="absolute top-0 right-14 h-40 w-40 translate-x-8 translate-y-[-50%] rounded-full bg-purple-500/20" />
                                <div className="absolute top-5 right-0 h-44 w-44 translate-x-8 translate-y-[-50%] rounded-full bg-purple-900" />
                            </Card>

                            {/* card 1 */}
                            <Card className="col-span-1 bg-blue-800 text-white relative overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="mt-8">
                                        <div className="space-y-2">
                                            <div className="p-1 bg-blue-900 rounded w-10 ">
                                                <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/courseadmin.svg" className='w-20' alt="" />
                                            </div>
                                            <div className="flex justify-between items-center gap-5">
                                                <div className="">
                                                    <p className='text-2xl font-semibold'>{summaryData.total_lessons}</p>
                                                    <p className='font-semibold text-gray-200 mt-3'>Tổng bài học</p>
                                                </div>
                                                <div className="">
                                                    <div className="flex justify-center items-center">
                                                        <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/courseadmin2.svg" className='w-20 z-10' alt="" />
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                </CardContent>
                                <div className="absolute top-0 right-14 h-40 w-40 translate-x-8 translate-y-[-50%] rounded-full bg-blue-500/20" />
                                <div className="absolute top-5 right-0 h-44 w-44 translate-x-8 translate-y-[-50%] rounded-full bg-blue-900" />
                            </Card>
                            {/* card 1 */}
                            <Card className="col-span-1 bg-gray-800 text-white relative overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="mt-8">
                                        <div className="space-y-2">
                                            <div className="p-1 bg-gray-900 rounded w-10 ">
                                                <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/selladmin.svg" className='w-20' alt="" />
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="">
                                                    <p className='text-2xl font-semibold'>{summaryData.total_lessons}</p>
                                                    <p className='font-semibold text-gray-200 mt-3'>Tổng đơn hàng đã bán</p>
                                                </div>
                                                <div className="">
                                                    <div className="flex justify-center items-center">
                                                        <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/selladmin2.svg" className='w-16 z-10' alt="" />
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                </CardContent>
                                <div className="absolute top-0 right-14 h-40 w-40 translate-x-8 translate-y-[-50%] rounded-full bg-gray-500/20" />
                                <div className="absolute top-5 right-0 h-44 w-44 translate-x-8 translate-y-[-50%] rounded-full bg-gray-900" />
                            </Card>
                        </div>
                    </div>
                </div>


            </SidebarInset>
        </SidebarProvider>
    )
}
