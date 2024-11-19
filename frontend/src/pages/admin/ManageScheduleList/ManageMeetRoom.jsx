import React, { useState } from 'react'
import { ChevronDown, FileDown, Search, Menu } from 'lucide-react'
import * as XLSX from 'xlsx'

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarProvider,
    SidebarTrigger,
    SidebarInset,
} from '@/components/ui/sidebar'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { SideBarUI } from '../sidebarUI'

// Sample data for the schedule
const scheduleData = [
    { id: 1, teacherName: 'Nguyễn Văn A', date: '2024-11-18', note: 'Lớp học Python cơ bản' },
    { id: 2, teacherName: 'Trần Thị B', date: '2024-11-19', note: 'Lớp học JavaScript nâng cao' },
    { id: 3, teacherName: 'Lê Văn C', date: '2024-1-20', note: 'Workshop Machine Learning' },
    { id: 4, teacherName: 'Phạm Thị D', date: '2024-11-21', note: 'Lớp học React.js' },
    { id: 5, teacherName: 'Hoàng Văn E', date: '2024-10-22', note: 'Seminar Blockchain' },
]

export default function ManageMeetRoom() {
    const [searchTerm, setSearchTerm] = useState('')
    const [filterCriteria, setFilterCriteria] = useState('all')

    const filterOptions = [
        { value: 'all', label: 'Tất cả giảng viên' },
        { value: 'today', label: 'Lịch dạy hôm nay' },
        { value: 'week', label: 'Lịch dạy tuần này' },
        { value: 'month', label: 'Lịch dạy tháng này' },
    ]

    const filteredData = scheduleData.filter(item =>
        item.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.note.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Schedule Data')
        XLSX.writeFile(wb, 'teacher_schedule.xlsx')
    }

    return (
        <SidebarProvider>
            <SideBarUI />
            <SidebarInset>
                <header className="absolute left-1 top-3 font-sans">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger />
                        <Separator orientation="vertical" className="h-6" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/admin">Trang chủ</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/schedule-list">Quản lý phòng Jitsi Meet</BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="absolute top-16 px-6 bg-gray-50 w-full font-sans overflow-auto p-6">
                    <div className="flex justify-between items-center mb-2 mr-6 ml-2">
                        <h1 className="text-2xl font-semibold mb-4">Quản lý phòng Jitsi Meet</h1>
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-wrap w-full md:w-auto">
                            <div className="relative flex-1 md:flex-initial">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Tìm kiếm giảng viên hoặc lớp học..."
                                    className="pl-9 pr-4 py-2 w-full"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="flex items-center gap-2">
                                            {filterOptions.find(option => option.value === filterCriteria)?.label || 'Tất cả giảng viên'}
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-[200px]">
                                        {filterOptions.map((option) => (
                                            <DropdownMenuItem
                                                key={option.value}
                                                onClick={() => setFilterCriteria(option.value)}
                                            >
                                                {option.label}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Button variant="outline" className="flex items-center gap-2" onClick={exportToExcel}>
                                    <FileDown className="h-4 w-4" />
                                    Xuất Excel
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-md border">
                        <Table>
                            <TableCaption>Danh sách lịch dạy của giảng viên.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px] text-center bg-yellow-100 text-md font-bold py-4 px-3 text-yellow-900">STT</TableHead>
                                    <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-3 text-yellow-900">Tên giảng viên</TableHead>
                                    <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-3 text-yellow-900">Khóa học</TableHead>
                                    <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-3 text-yellow-900">Bài học</TableHead>
                                    <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-3 text-yellow-900">Ngày dạy</TableHead>
                                    <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-3 text-yellow-900">Khung giờ</TableHead>
                                    <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-3 text-yellow-900">Link meet</TableHead>
                                    <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-3 text-yellow-900">Ghi chú</TableHead>
                                    <TableHead className="text-center bg-yellow-100 text-md font-bold py-4 px-3 text-yellow-900">Trạng thái</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.map((item, index) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium text-center">{index + 1}</TableCell>
                                        <TableCell className="text-center">{item.teacherName}</TableCell>
                                        <TableCell className="text-center">{item.note}</TableCell>
                                        <TableCell className="text-center">Bài học</TableCell>
                                        <TableCell className="text-center">{item.date}</TableCell>
                                        <TableCell className="text-center">Khung giờ</TableCell>
                                        <TableCell className="text-center">Link meet</TableCell>
                                        <TableCell className="text-center">Ghi chú</TableCell>
                                        <TableCell className="text-center">đang cập nhật</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
