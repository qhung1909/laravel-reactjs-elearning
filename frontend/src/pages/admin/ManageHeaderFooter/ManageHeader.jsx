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
                    <header className="absolute left-1 top-3 font-sans">
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

                    <div className="absolute top-14 px-6 bg-gray-50 w-full font-sans">
                        <h1 className="text-2xl font-bold mb-4">Bảng Điều Khiển Quản Trị</h1>

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
                    </div>

                </SidebarInset>
            </SidebarProvider>
        </>
    )
}
