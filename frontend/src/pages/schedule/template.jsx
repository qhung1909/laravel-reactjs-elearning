import React, { useState, useEffect } from "react";
import axios from "axios";
import { CalendarDays, Clock, Video, GraduationCap, Users, BookOpen, Calendar as CalendarIcon, ArrowRight, CheckCircle2 } from "lucide-react";
import { format, isSameDay, isSameWeek } from "date-fns";
import { vi } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ScheduleManagement = () => {
    const [meetings, setMeetings] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState("today");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;
    const API_KEY = import.meta.env.VITE_API_KEY;
    const token = localStorage.getItem("access_token");

    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const response = await axios.get(`${API_URL}/meetings/student/upcoming-meeting`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-Key': API_KEY,
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data?.status === "success") {
                    // Xử lý dữ liệu từ API
                    const processedMeetings = Object.values(response.data.data).map(meeting => ({
                        meeting_id: meeting.meeting_id || meeting.course?.course_id,
                        content_name: meeting.content_name,
                        course_title: meeting.course?.title,
                        teacher_name: meeting.course?.teacher?.name,
                        start_time: meeting.start_time,
                        end_time: meeting.end_time,
                        status: meeting.status || determineStatus(meeting.start_time, meeting.end_time),
                        meeting_url: meeting.meeting_url
                    }));
                    
                    console.log("Processed meetings:", processedMeetings);
                    setMeetings(processedMeetings);
                } else {
                    setError("Invalid data format received from API");
                }
            } catch (error) {
                console.error("Error fetching meetings:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMeetings();
    }, [API_URL, API_KEY, token]);

    const determineStatus = (startTime, endTime) => {
        const now = new Date();
        const start = new Date(startTime);
        const end = new Date(endTime);

        if (now < start) return "upcoming";
        if (now >= start && now <= end) return "ongoing";
        return "completed";
    };

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
        return statusConfig[status] || statusConfig.upcoming;
    };

    const getFilteredMeetings = () => {
        const today = new Date();
        
        return meetings.filter(meeting => {
            if (!meeting.start_time) return false;
            const meetingDate = new Date(meeting.start_time);
            
            switch (selectedFilter) {
                case "today":
                    return isSameDay(meetingDate, today);
                case "week":
                    return isSameWeek(meetingDate, today, { weekStartsOn: 1 });
                default:
                    return true;
            }
        });
    };

    const filteredMeetings = getFilteredMeetings();
    
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-red-600">Có lỗi xảy ra: {error}</p>
        </div>
    );

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
                {/* Left Column - Stats Cards */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-lg transition-all duration-200">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3">
                                    <Clock className="h-6 w-6" />
                                    <span className="font-medium">Hôm nay</span>
                                </div>
                                <div className="text-3xl font-bold mt-3">
                                    {meetings.filter(meeting => 
                                        meeting.start_time && isSameDay(new Date(meeting.start_time), new Date())
                                    ).length} Buổi học
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white hover:shadow-lg transition-all duration-200">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3">
                                    <GraduationCap className="h-6 w-6" />
                                    <span className="font-medium">Tuần này</span>
                                </div>
                                <div className="text-3xl font-bold mt-3">
                                    {meetings.filter(meeting => 
                                        meeting.start_time && isSameWeek(new Date(meeting.start_time), new Date(), { weekStartsOn: 1 })
                                    ).length} Buổi
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Right Column - Meetings List */}
                <div className="lg:col-span-2">
                    <Card className="border shadow-xl">
                        <CardHeader className="border-b bg-gray-50/50">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    Lớp học sắp tới
                                </CardTitle>
                                <Select
                                    value={selectedFilter}
                                    onValueChange={setSelectedFilter}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Chọn thời gian" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="today">Hôm nay</SelectItem>
                                        <SelectItem value="week">Tuần này</SelectItem>
                                        <SelectItem value="all">Tất cả</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {filteredMeetings.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        Không có lớp học nào trong thời gian này
                                    </div>
                                ) : (
                                    filteredMeetings.map((meeting) => (
                                        <Card
                                            key={meeting.meeting_id}
                                            className="hover:shadow-md transition-all duration-200 border border-gray-100"
                                        >
                                            <CardContent className="p-6">
                                                <div className="flex items-start justify-between">
                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-blue-50 rounded-lg">
                                                                <BookOpen className="h-5 w-5 text-blue-600" />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-semibold text-xl text-gray-900">
                                                                    {meeting.content_name}
                                                                </h3>
                                                                {meeting.course_title && (
                                                                    <p className="text-sm text-gray-600">
                                                                        {meeting.course_title}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-2 text-sm text-gray-600">
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="h-4 w-4" />
                                                                <span>
                                                                    {format(new Date(meeting.start_time), "HH:mm", { locale: vi })} - {format(new Date(meeting.end_time), "HH:mm", { locale: vi })}
                                                                </span>
                                                            </div>
                                                            {meeting.teacher_name && (
                                                                <div className="flex items-center gap-2">
                                                                    <Users className="h-4 w-4" />
                                                                    <span>{meeting.teacher_name}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-2 items-end">
                                                        <Badge
                                                            variant="outline"
                                                            className={getStatusBadge(meeting.status).className}
                                                        >
                                                            {getStatusBadge(meeting.status).text}
                                                        </Badge>
                                                        {meeting.meeting_url && meeting.status !== "completed" && (
                                                            <a 
                                                                href={meeting.meeting_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                                                            >
                                                                <Video className="h-4 w-4" />
                                                                Vào lớp học
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ScheduleManagement;