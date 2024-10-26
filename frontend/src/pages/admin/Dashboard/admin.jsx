"use client"
import { TrendingUp } from "lucide-react"
import { CartesianGrid, XAxis, Line, LineChart } from "recharts"
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
const chartData = [
    { month: "T1", desktop: 186, mobile: 80 },
    { month: "T2", desktop: 305, mobile: 200 },
    { month: "T3", desktop: 237, mobile: 120 },
    { month: "T4", desktop: 73, mobile: 190 },
    { month: "T5", desktop: 209, mobile: 130 },
    { month: "T6", desktop: 220, mobile: 160 },
    { month: "T7", desktop: 240, mobile: 145 },
    { month: "T8", desktop: 245, mobile: 245 },
    { month: "T9", desktop: 200, mobile: 300 },
    { month: "T10", desktop: 140, mobile: 240 },
    { month: "T11", desktop: 240, mobile: 144 },
    { month: "T12", desktop: 305, mobile: 200 },
]
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
// import { DataTableDemo } from "./DataTable"


export default function Dashboard() {

    return (
        <SidebarProvider>
            <SideBarUI />
            <SidebarInset className='relative'>

                {/* header */}
                <header className="absolute left-0 top-3">
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
                <div className="absolute top-12 w-full">
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
                                    <h2 className="xl:text-base lg:text-sm text-xs font-semibold text-green-500 uppercase">Tổng doanh thu</h2>
                                </div>
                                <div className="my-2 text-2xl font-semibold">
                                    <p>$30</p>
                                </div>
                                <div className="text-sm  mt-1">
                                    <p>Hàng tháng</p>
                                </div>
                            </div>

                            {/* tổng khóa học */}
                            <div className="bg-white shadow rounded p-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="xl:text-base lg:text-sm text-xs font-semibold text-red-500 uppercase">Tổng khóa học</h2>
                                </div>
                                <div className="my-2 text-2xl font-semibold">21,000</div>
                                <div className="text-sm  mt-1">Đã bán</div>
                            </div>

                            {/* tổng bài học */}
                            <div className="bg-white shadow rounded p-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="xl:text-base lg:text-sm text-xs font-semibold text-blue-500 uppercase">Bài học</h2>
                                </div>
                                <div className="my-2 text-2xl font-semibold">25,000</div>
                                <div className="text-sm  mt-1">Tổng cộng</div>
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

                        {/* chart */}
                        <Card className='xl:w-3/5 '>
                            <CardHeader>
                                <CardTitle>Biểu đồ Doanh thu</CardTitle>
                                <CardDescription>Tháng 1 - Tháng 12 2024</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig}>
                                    <LineChart
                                        accessibilityLayer
                                        data={chartData}
                                        margin={{
                                            left: 12,
                                            right: 12,
                                        }}
                                    >
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="month"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                            tickFormatter={(value) => value.slice(0, 3)}
                                        />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                        <Line
                                            dataKey="desktop"
                                            type="monotone"
                                            stroke="var(--color-desktop)"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                        <Line
                                            dataKey="mobile"
                                            type="monotone"
                                            stroke="var(--color-mobile)"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                    </LineChart>
                                </ChartContainer>
                            </CardContent>
                            <CardFooter>
                                <div className="flex w-full items-start gap-2 text-sm">
                                    <div className="grid gap-2">
                                        <div className="flex items-center gap-2 font-medium leading-none">
                                            Có xu hướng tăng 5,2% trong tháng này<TrendingUp className="h-4 w-4" />
                                        </div>
                                        <div className="flex items-center gap-2 leading-none text-muted-foreground">
                                            Hiển thị tổng số khách truy cập trong 6 tháng qua
                                        </div>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                        <div className="w-2/5">
                            <>Nơi đổ dữ liệu </>
                            {/* <DataTableDemo /> */}
                        </div>
                    </div>

                </div>


            </SidebarInset>
        </SidebarProvider>
    )
}
