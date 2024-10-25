
import { Bar, BarChart, Line, LineChart, ResponsiveContainer } from "recharts"
import { ArrowDown, ArrowUp, BookOpen, DollarSign, GraduationCap, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import SidebarDashboard from "@/components/ui/sidebar/sidebar"

// Sample data - replace with actual data from your backend
const revenueData = [
  { name: "Tháng 1", total: 1500 },
  { name: "Tháng 2", total: 1800 },
  { name: "Tháng 3", total: 2200 },
  { name: "Tháng 4", total: 2600 },
  { name: "Tháng 5", total: 3000 },
  { name: "Tháng 6", total: 3500 },
]

const studentData = [
  { name: "Tháng 1", total: 100 },
  { name: "Tháng 2", total: 150 },
  { name: "Tháng 3", total: 200 },
  { name: "Tháng 4", total: 250 },
  { name: "Tháng 5", total: 300 },
  { name: "Tháng 6", total: 350 },
]

export default function Dashboard() {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-36">
        <SidebarDashboard />
      </div>
      <div className="flex-1 overflow-auto">
        <main className="flex-1">
          <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Trang Chủ</h2>
            </div>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Tổng Quan</TabsTrigger>
                <TabsTrigger value="analytics">Phân Tích</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Tổng Doanh Thu
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">152.000.000 ₫</div>
                      <p className="text-xs text-muted-foreground">
                        +20.1% so với tháng trước
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Học Viên Mới
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">+2350</div>
                      <p className="text-xs text-muted-foreground">
                        +180.1% so với tháng trước
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Khóa Học Mới</CardTitle>
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">+12</div>
                      <p className="text-xs text-muted-foreground">
                        +19% so với tháng trước
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Tỷ Lệ Hoàn Thành
                      </CardTitle>
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">75.5%</div>
                      <p className="text-xs text-muted-foreground">
                        +5.9% so với tháng trước
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Tổng Quan</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <ChartContainer
                        config={{
                          total: {
                            label: "Doanh Thu",
                            color: "hsl(var(--chart-1))",
                          },
                        }}
                        className="h-[300px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={revenueData}>
                            <Bar dataKey="total" fill="var(--color-total)" />
                            <ChartTooltip content={<ChartTooltipContent />} />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                  <Card className="col-span-3">
                    <CardHeader>
                      <CardTitle>Học Viên Mới</CardTitle>
                      <CardDescription>
                        Số lượng học viên đăng ký mới theo tháng
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                          total: {
                            label: "Học Viên Mới",
                            color: "hsl(var(--chart-2))",
                          },
                        }}
                        className="h-[300px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={studentData}>
                            <Line type="monotone" dataKey="total" stroke="var(--color-total)" strokeWidth={2} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                          </LineChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="analytics" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Khóa Học Bán Chạy</CardTitle>
                      <CardDescription>Top 5 khóa học bán chạy nhất tháng này</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                          sales: {
                            label: "Doanh Số",
                            color: "hsl(var(--chart-3))",
                          },
                        }}
                        className="h-[300px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={[
                            { name: "Lập Trình Web", sales: 452 },
                            { name: "Tiếng Anh Giao Tiếp", sales: 378 },
                            { name: "Marketing Online", sales: 320 },
                            { name: "Thiết Kế Đồ Họa", sales: 289 },
                            { name: "Quản Lý Dự Án", sales: 245 },
                          ]}>
                            <Bar dataKey="sales" fill="var(--color-sales)" />
                            <ChartTooltip content={<ChartTooltipContent />} />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                  <Card className="col-span-3">
                    <CardHeader>
                      <CardTitle>Tỷ Lệ Hoàn Thành Khóa Học</CardTitle>
                      <CardDescription>
                        Phần trăm học viên hoàn thành khóa học
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                          rate: {
                            label: "Tỷ Lệ Hoàn Thành",
                            color: "hsl(var(--chart-4))",
                          },
                        }}
                        className="h-[300px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={[
                            { month: "Tháng 1", rate: 65 },
                            { month: "Tháng 2", rate: 68 },
                            { month: "Tháng 3", rate: 70 },
                            { month: "Tháng 4", rate: 72 },
                            { month: "Tháng 5", rate: 75 },
                            { month: "Tháng 6", rate: 78 },
                          ]}>
                            <Line type="monotone" dataKey="rate" stroke="var(--color-rate)" strokeWidth={2} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                          </LineChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
