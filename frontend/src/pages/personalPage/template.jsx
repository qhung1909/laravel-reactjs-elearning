import React from 'react';
import { Camera, MapPin, Briefcase, GraduationCap, Heart, Share2, MessageCircle, Mail, Calendar, Star, Users, BookOpen, FacebookIcon, TwitterIcon, LinkedinIcon, Trophy, ChevronRight } from 'lucide-react'; import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaceIcon } from '@radix-ui/react-icons';
import TwitchPlayer from 'react-player/twitch';

export const templatePage = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Cover Section with max-width constraint */}
            <div className="relative max-w-[1440px] mx-auto">
                <div className="h-[280px] sm:h-[350px] w-full overflow-hidden bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                    <img
                        src="/api/placeholder/1440/350"
                        alt="Cover"
                        className="w-full h-full object-cover opacity-85 hover:opacity-95 transition-opacity duration-300"
                    />
                    <Button
                        variant="secondary"
                        className="absolute bottom-4 right-4 gap-2 shadow-lg hover:shadow-xl transition-all"
                    >
                        <Camera className="h-4 w-4" /> Chỉnh sửa ảnh bìa
                    </Button>
                </div>

                {/* Profile Container */}
                <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
                    <div className="flex flex-col md:flex-row gap-6 relative -mt-8 mb-4">
                        {/* Enhanced Avatar */}
                        <div className="relative group">
                            <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-white shadow-lg">
                                <AvatarImage src="/api/placeholder/160/160" className="hover:scale-105 transition-transform duration-300" />
                                <AvatarFallback className="text-2xl">GV</AvatarFallback>
                            </Avatar>
                            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer">
                                <Camera className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                            </div>
                        </div>

                        {/* Enhanced Basic Info */}
                        <div className="flex-1 pt-4">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        Nguyễn Văn A
                                    </h1>
                                    <p className="text-gray-600 mt-1 text-lg">Giảng viên cao cấp | Chuyên gia Machine Learning</p>
                                    <div className="flex flex-wrap gap-3 mt-3">
                                        <Badge variant="secondary" className="gap-1 py-1.5 px-3 hover:bg-gray-200 transition-colors">
                                            <Star className="w-3.5 h-3.5 text-yellow-500" /> 4.9/5
                                        </Badge>
                                        <Badge variant="secondary" className="gap-1 py-1.5 px-3 hover:bg-gray-200 transition-colors">
                                            <Users className="w-3.5 h-3.5 text-blue-500" /> 1.2k học viên
                                        </Badge>
                                        <Badge variant="secondary" className="gap-1 py-1.5 px-3 hover:bg-gray-200 transition-colors">
                                            <BookOpen className="w-3.5 h-3.5 text-green-500" /> 15 khóa học
                                        </Badge>
                                    </div>
                                    {/* Social Links */}
                                    <div className="flex gap-3 mt-4">

                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                    <Button className="gap-2 w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                        <MessageCircle className="w-4 h-4" /> Nhắn tin
                                    </Button>
                                    <Button variant="outline" className="gap-2 w-full sm:w-auto hover:bg-gray-50">
                                        <Share2 className="w-4 h-4" /> Chia sẻ
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Tabs */}
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="w-full justify-start h-12 bg-transparent border-b rounded-none p-0 space-x-2">
                            {['overview', 'courses', 'reviews'].map((tab) => (
                                <TabsTrigger
                                    key={tab}
                                    value={tab}
                                    className="h-12 px-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500
                           data-[state=active]:text-blue-600 transition-all duration-200 hover:bg-gray-50"
                                >
                                    {tab === 'overview' && 'Tổng quan'}
                                    {tab === 'courses' && 'Khóa học'}
                                    {tab === 'reviews' && 'Đánh giá'}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <TabsContent value="overview" className="mt-6">
                            <div className="grid md:grid-cols-3 gap-6">
                                {/* Enhanced Left Column */}
                                <div className="space-y-6">
                                    <Card className="hover:shadow-md transition-shadow">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Trophy className="w-5 h-5 text-yellow-500" />
                                                Giới thiệu
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {[
                                                { icon: MapPin, text: "Hà Nội, Việt Nam", color: "text-red-500" },
                                                { icon: Briefcase, text: "10 năm kinh nghiệm", color: "text-blue-500" },
                                                { icon: GraduationCap, text: "Tiến sĩ AI - ĐH Stanford", color: "text-green-500" },
                                                { icon: Mail, text: "contact@example.com", color: "text-purple-500" },
                                                { icon: Calendar, text: "Tham gia từ 03/2020", color: "text-orange-500" }
                                            ].map(({ icon: Icon, text, color }, index) => (
                                                <div key={index} className="flex gap-2 text-gray-600 items-center hover:bg-gray-50 p-2 rounded-md transition-colors">
                                                    <Icon className={`w-5 h-5 ${color}`} />
                                                    <span>{text}</span>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>

                                    <Card className="hover:shadow-md transition-shadow overflow-hidden">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Star className="w-5 h-5 text-yellow-500" />
                                                Chứng chỉ
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            {[
                                                { gradient: "from-yellow-400 to-yellow-600", text: "Google Certified Instructor" },
                                                { gradient: "from-blue-400 to-blue-600", text: "Microsoft MVP 2023" },
                                                { gradient: "from-purple-400 to-purple-600", text: "AWS Certified Solutions Architect" }
                                            ].map((badge, index) => (
                                                <Badge
                                                    key={index}
                                                    className={`bg-gradient-to-r ${badge.gradient} hover:scale-105 transition-transform cursor-pointer`}
                                                >
                                                    {badge.text}
                                                </Badge>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Enhanced Main Content */}
                                <div className="md:col-span-2 space-y-6">
                                    <Card className="hover:shadow-md transition-shadow">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Trophy className="w-5 h-5 text-yellow-500" />
                                                Thành tựu nổi bật
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {[
                                                {
                                                    gradient: "from-blue-50 to-indigo-50",
                                                    icon: "🏆",
                                                    title: "Top 1 giảng viên 2023",
                                                    description: "Được bình chọn bởi cộng đồng với hơn 10,000 lượt đánh giá"
                                                },
                                                {
                                                    gradient: "from-purple-50 to-pink-50",
                                                    icon: "📚",
                                                    title: "15 khóa học chất lượng",
                                                    description: "Đào tạo hơn 50,000 học viên với tỷ lệ hoàn thành 92%"
                                                },
                                                {
                                                    gradient: "from-green-50 to-emerald-50",
                                                    icon: "💡",
                                                    title: "Chuyên gia công nghệ",
                                                    description: "10+ năm kinh nghiệm trong lĩnh vực AI và Machine Learning"
                                                }
                                            ].map((achievement, index) => (
                                                <div
                                                    key={index}
                                                    className={`p-4 rounded-lg bg-gradient-to-r ${achievement.gradient}
                                    hover:scale-[1.02] transition-transform cursor-pointer`}
                                                >
                                                    <h3 className="font-semibold text-lg mb-2">
                                                        {achievement.icon} {achievement.title}
                                                    </h3>
                                                    <p className="text-gray-600">{achievement.description}</p>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>

                                    <Card className="hover:shadow-md transition-shadow">
                                        <CardHeader className="flex flex-row items-center justify-between">
                                            <CardTitle className="flex items-center gap-2">
                                                <BookOpen className="w-5 h-5 text-blue-500" />
                                                Khóa học nổi bật
                                            </CardTitle>
                                            <Button variant="ghost" className="gap-1">
                                                Xem tất cả <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid sm:grid-cols-2 gap-6">
                                                {[
                                                    {
                                                        title: "Machine Learning from Zero to Hero",
                                                        rating: "4.9",
                                                        reviews: "2,400"
                                                    },
                                                    {
                                                        title: "Deep Learning Masterclass 2024",
                                                        rating: "4.8",
                                                        reviews: "1,800"
                                                    }
                                                ].map((course, index) => (
                                                    <div
                                                        key={index}
                                                        className="group cursor-pointer hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden"
                                                    >
                                                        <div className="aspect-video rounded-lg overflow-hidden">
                                                            <img
                                                                src="/api/placeholder/400/225"
                                                                alt={course.title}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                        </div>
                                                        <div className="p-4">
                                                            <h3 className="font-medium group-hover:text-blue-600 transition-colors">
                                                                {course.title}
                                                            </h3>
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <Star className="w-4 h-4 text-yellow-500" />
                                                                <span className="text-sm text-gray-600">
                                                                    {course.rating} ({course.reviews} đánh giá)
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};
