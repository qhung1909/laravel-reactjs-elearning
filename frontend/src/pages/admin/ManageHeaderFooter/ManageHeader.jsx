import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { SideBarUI } from "../sidebarUI"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export const ManageHeader = () => {
    return (
        <>
            <SidebarProvider>
                <SideBarUI />
                <SidebarInset>
                    <header className="absolute left-1 top-3">
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
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>

                    <div className="absolute top-14 px-6 bg-gray-50 w-full">
                    <h1 className="text-2xl font-bold mb-4">Bảng Điều Khiển Quản Trị</h1>

                    <Tabs defaultValue="images">
                        <TabsList>
                        <TabsTrigger value="images">Quản Lý Hình Ảnh</TabsTrigger>
                        <TabsTrigger value="header">Quản Lý Header</TabsTrigger>
                        <TabsTrigger value="footer">Quản Lý Footer</TabsTrigger>
                        </TabsList>

                        <TabsContent value="images">
                        <Card>
                            <CardHeader>
                            <CardTitle>Quản Lý Hình Ảnh</CardTitle>
                            <CardDescription>Tải lên, xem và quản lý hình ảnh của bạn</CardDescription>
                            </CardHeader>
                            <CardContent>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="picture">Tải lên hình ảnh</Label>
                                <Input id="picture" type="file" />
                            </div>
                            <Button className="mt-4">Tải Lên</Button>
                            </CardContent>
                        </Card>
                        </TabsContent>

                        <TabsContent value="header">
                        <Card>
                            <CardHeader>
                            <CardTitle>Quản Lý Header</CardTitle>
                            <CardDescription>Chỉnh sửa logo và menu trên header</CardDescription>
                            </CardHeader>
                            <CardContent>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="logo">Logo</Label>
                                <Input id="logo" type="file" />
                            </div>
                            <Button className="mt-4">Cập Nhật Logo</Button>
                            </CardContent>
                        </Card>
                        </TabsContent>

                        <TabsContent value="footer">
                        <Card>
                            <CardHeader>
                            <CardTitle>Quản Lý Footer</CardTitle>
                            <CardDescription>Chỉnh sửa thông tin liên hệ và liên kết trong footer</CardDescription>
                            </CardHeader>
                            <CardContent>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="contact">Thông Tin Liên Hệ</Label>
                                <Input id="contact" type="text" placeholder="Nhập thông tin liên hệ" />
                            </div>
                            <Button className="mt-4">Cập Nhật Footer</Button>
                            </CardContent>
                        </Card>
                        </TabsContent>
                    </Tabs>
                    </div>

                </SidebarInset>
            </SidebarProvider>
        </>
    )
}
