import React from 'react';
import { Camera, MapPin, Briefcase, GraduationCap, Share2, MessageCircle, Mail, Calendar, Star, Users, BookOpen, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

export const PersonalPage = () => {
  return (
    <div className="bg-gray-50  mb-72">
      <div className="relative max-w-[1920px] mx-auto ">
        {/* Cover Image Container */}
        <div className="relative h-[280px] sm:h-[350px] w-full ">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            <img
              src="/api/placeholder/1920/350"
              alt="Cover"
              className="w-full h-full object-cover opacity-85 hover:opacity-95 transition-opacity duration-300"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/20">
            <Button variant="secondary" className="gap-2 shadow-lg hover:shadow-xl transition-all">
              <Camera className="h-4 w-4" /> Chỉnh sửa ảnh bìa
            </Button>
          </div>
        </div>

        {/* Profile Section with White Background */}
        <div className="bg-white ">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
            <div className="flex flex-col md:flex-row gap-6 pt-8 pb-6">
              {/* Avatar */}
              <div className="relative group -mt-24">
                <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-white shadow-lg">
                  <AvatarImage src="/api/placeholder/160/160" />
                  <AvatarFallback className="text-2xl">GV</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer">
                  <Camera className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Basic Info */}
              <div className="flex-1">
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

            {/* Tabs Navigation */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start h-12 bg-transparent border-b rounded-none p-0 space-x-2">
                {['overview', 'courses'].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="h-12 px-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500
                             data-[state=active]:text-blue-600 transition-all duration-200 hover:bg-gray-50"
                  >
                    {tab === 'overview' && 'Tổng quan'}
                    {tab === 'courses' && 'Khóa học'}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Overview Tab Content */}
              <TabsContent value="overview" className="mt-6">
                <div className="grid md:grid-cols-4 gap-8">
                  {/* Left Column - Teacher Info */}
                  <div className="space-y-6">
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-blue-500" />
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

                    {/* Certificates Section */}
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-500" />
                          Chứng chỉ đã cấp
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="p-4 border rounded-lg">
                          <div className="text-sm text-gray-600">Tổng số chứng chỉ đã cấp</div>
                          <div className="text-2xl font-semibold mt-1">2,405</div>
                          <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
                            <span>↑ 12% so với tháng trước</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Main Content - Course Grid */}
                  <div className="md:col-span-3">
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-blue-500" />
                          Khóa học
                        </CardTitle>
                        <Button variant="ghost" className="gap-1">
                          Xem tất cả <ChevronRight className="w-4 h-4" />
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="grid sm:grid-cols-3 gap-6">
                          {[
                            {
                              title: "Machine Learning from Zero to Hero",
                              price: "999.000₫",
                              rating: "4.9",
                              reviews: "2,400",
                              status: "published"
                            },
                            {
                              title: "Deep Learning Masterclass 2024",
                              price: "1.299.000₫",
                              rating: "4.8",
                              reviews: "1,800",
                              status: "published"
                            },
                            {
                              title: "AI Applications in Business",
                              price: "899.000₫",
                              rating: "4.7",
                              reviews: "1,500",
                              status: "published"
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
                                <h3 className="font-medium group-hover:text-blue-600 transition-colors line-clamp-2">
                                  {course.title}
                                </h3>
                                <div className="mt-2 flex justify-between items-center">
                                  <span className="text-lg font-semibold text-blue-600">
                                    {course.price}
                                  </span>
                                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                                    {course.status}
                                  </Badge>
                                </div>
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
    </div>
  );
};

export default PersonalPage;
