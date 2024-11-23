import React, { useState } from "react";
import { CalendarDays, Clock, Video, GraduationCap, Users, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const ScheduleManagement = () => {
    const [date, setDate] = useState(new Date());

    const upcomingClasses = [
        {
            id: 1,
            courseName: "JavaScript Nâng Cao",
            instructor: "Nguyễn Văn A",
            time: "09:00 - 10:30",
            date: "2024-11-22",
            topic: "ES6 Features & Modern JavaScript",
            meetingLink: "https://zoom.us/j/123456789",
            students: 25,
            status: "upcoming"
        },
        {
            id: 2,
            courseName: "React Fundamentals",
            instructor: "Trần Thị B",
            time: "14:00 - 15:30",
            date: "2024-11-22",
            topic: "Hooks and State Management",
            meetingLink: "https://zoom.us/j/987654321",
            students: 30,
            status: "ongoing"
        }
    ];

    const getStatusBadge = (status) => {
        const statusConfig = {
            upcoming: {
                text: "Sắp diễn ra",
                className: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
            },
            ongoing: {
                text: "Đang diễn ra",
                className: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
            },
            completed: {
                text: "Đã kết thúc",
                className: "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
            }
        };
        return statusConfig[status];
    };

    return (


        <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/50 p-6">

            {/* Header Section */}
            <div className="max-w-7xl mx-auto mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Quản lý Giờ học Online
                </h1>
                <p className="text-gray-600 mt-2 text-lg">
                    Theo dõi và tham gia các buổi học trực tuyến của bạn
                </p>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-lg transition-all duration-200">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3">
                                    <Clock className="h-6 w-6" />
                                    <span className="font-medium">Hôm nay</span>
                                </div>
                                <div className="text-3xl font-bold mt-3">2 Buổi học</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white hover:shadow-lg transition-all duration-200">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3">
                                    <GraduationCap className="h-6 w-6" />
                                    <span className="font-medium">Tuần này</span>
                                </div>
                                <div className="text-3xl font-bold mt-3">8 Buổi</div>
                            </CardContent>
                        </Card>
                    </div>


                    {/* Calendar */}
                </div>


                {/* Right Column */}
                <div className="lg:col-span-2">
                    <Card className="border shadow-xl">
                        <CardHeader className="border-b bg-gray-50/50">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    Lớp học sắp tới
                                </CardTitle>
                                <Select defaultValue="today">
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Chọn thời gian" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="today">Hôm nay</SelectItem>
                                        <SelectItem value="week">Tuần này</SelectItem>
                                        <SelectItem value="month">Tháng này</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {upcomingClasses.map((class_) => (
                                    <Card
                                        key={class_.id}
                                        className="hover:shadow-md transition-all duration-200 border border-gray-100"
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-blue-50 rounded-lg">
                                                            <BookOpen className="h-5 w-5 text-blue-600" />
                                                        </div>
                                                        <h3 className="font-semibold text-xl text-gray-900">
                                                            {class_.courseName}
                                                        </h3>
                                                    </div>
                                                    <div className="flex items-center gap-6 text-sm text-gray-600">
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-4 w-4" />
                                                            <span>{class_.time}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Users className="h-4 w-4" />
                                                            <span>{class_.students} học viên</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2 text-sm text-gray-600">
                                                        <p className="flex items-center gap-2">
                                                            <span className="font-medium">Giảng viên:</span>
                                                            {class_.instructor}
                                                        </p>
                                                        <p className="flex items-center gap-2">
                                                            <span className="font-medium">Chủ đề:</span>
                                                            {class_.topic}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge
                                                    variant="outline"
                                                    className={getStatusBadge(class_.status).className}
                                                >
                                                    {getStatusBadge(class_.status).text}
                                                </Badge>
                                            </div>
                                            <div className="mt-6 flex justify-end">
                                                <button
                                                    className={`
                                                        inline-flex items-center gap-2 px-6 py-2.5
                                                        ${class_.status === 'ongoing'
                                                            ? 'bg-green-600 hover:bg-green-700'
                                                            : 'bg-blue-600 hover:bg-blue-700'}
                                                        text-white rounded-lg shadow-sm
                                                        hover:shadow-md transition-all duration-200
                                                    `}
                                                    onClick={() => window.open(class_.meetingLink)}
                                                >
                                                    <Video className="h-4 w-4" />
                                                    {class_.status === 'ongoing' ? 'Vào lớp ngay' : 'Tham gia lớp học'}
                                                </button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Notfication */}
            <div className="">
                
            </div>
        </div>

    );

};

export default ScheduleManagement;
