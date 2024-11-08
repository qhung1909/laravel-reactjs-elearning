import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, XCircle, Clock, GraduationCap, LayoutDashboard, Book, Search, Filter } from 'lucide-react';
import { SideBarUI } from '../sidebarUI';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import ReactPlayer from "react-player";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator, } from '@/components/ui/breadcrumb';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Separator } from '@radix-ui/react-context-menu';
import axios from 'axios';
import { useNavigate, } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, } from "@/components/ui/pagination"
import { formatCurrency } from '@/components/Formatcurrency/formatCurrency';


export default function Draft() {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;

    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({});
    const [activeCourse, setActiveCourse] = useState(null);
    const [activeMainTab, setActiveMainTab] = useState('info');
    const [activeLessonTab, setActiveLessonTab] = useState('content');
    const [statusFilter, setStatusFilter] = useState('pending');
    const pendingCount = courses.filter(course => course.status === 'pending').length;
    const [pendingCountContents, setPendingCountContents] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [quizContent, setQuizContent] = useState([]);
    const [contentLesson, setContentLesson] = useState([]);
    const [titleContents, setTitleContents] = useState([]);
    const navigate = useNavigate();

    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editNote, setEditNote] = useState('');

    const handleApprove = () => {
        toast.success("Khóa học đã được phê duyệt");
        setIsApproveModalOpen(false);
    };

    const handleReject = () => {
        toast.success("Khóa học đã bị từ chối");
        setIsRejectModalOpen(false);
    };

    const handleEditRequest = () => {
        toast.success("Yêu cầu chỉnh sửa đã được gửi");
        setIsEditModalOpen(false);
        setEditNote('');
    };


    /* Phân trang  */
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const totalPages = Math.ceil(courses.length / itemsPerPage);
    const indexOfLastCourse = currentPage * itemsPerPage;
    const indexOfFirstCourse = indexOfLastCourse - itemsPerPage;
    // const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);


    /* Video */
    const [isVideoLayerOpen, setVideoLayerOpen] = useState(false);
    const handleVideoOpen = () => {
        setVideoLayerOpen(true);
    };

    const renderPaginationItems = () => {
        const items = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            href="#"
                            isActive={currentPage === i}
                            onClick={() => handlePageChange(i)}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        } else {
            items.push(
                <PaginationItem key={1}>
                    <PaginationLink
                        href="#"
                        isActive={currentPage === 1}
                        onClick={() => handlePageChange(1)}
                    >
                        1
                    </PaginationLink>
                </PaginationItem>
            );

            if (currentPage > 3) {
                items.push(<PaginationItem key="left-ellipsis">...</PaginationItem>);
            }

            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(totalPages - 1, currentPage + 1);

            for (let i = startPage; i <= endPage; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            href="#"
                            isActive={currentPage === i}
                            onClick={() => handlePageChange(i)}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }

            if (currentPage < totalPages - 2) {
                items.push(<PaginationItem key="right-ellipsis">...</PaginationItem>);
            }

            items.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink
                        href="#"
                        isActive={currentPage === totalPages}
                        onClick={() => handlePageChange(totalPages)}
                    >
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return items;
    };


    const fetchCourses = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/courses`, {
                headers: {
                    'x-api-secret': API_KEY,
                },
            });
            const data = res.data;

            const pendingCourses = data.filter(course => course.status === 'pending');
            setCourses(pendingCourses);

            if (pendingCourses.length > 0) {
                const courseId = pendingCourses[0].course_id; // Lấy course_id từ khóa học đầu tiên
                fetchContentLesson(courseId); // Truyền courseId vào hàm
            } else {
                console.warn("Không có khóa học nào đang chờ phê duyệt."); // Thông báo nếu không có khóa học nào
            }
        } catch (error) {
            console.error('Lỗi khi tải danh sách khóa học:', error);
        } finally {
            setIsLoading(false);
        }
    };


    const fetchContentLesson = async (courseId) => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            toast.error("Bạn chưa đăng nhập.");
            navigate('/');
            return;
        }
        try {
            const res = await axios.get(`${API_URL}/admin/pending-contents`, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    course_id: courseId // Fetch nội dung cho khóa học được chọn
                }
            });

            // console.log("API Response Data:", res.data);
            // console.log("courseId:", courseId);

            if (res.data && res.data.success && Array.isArray(res.data.contents)) {
                // Chuyển đổi courseId sang số để đảm bảo so sánh đúng kiểu dữ liệu
                const filteredContents = res.data.contents.filter(content => content.course_id === Number(courseId));
                // console.log("Filtered Contents:", filteredContents);

                setContentLesson(filteredContents);

                const pendingCount = filteredContents.filter(content => content.status === 'pending').length;
                setPendingCountContents(pendingCount);

                if (filteredContents.length > 0) {
                    const contentId = filteredContents[0].content_id;
                    fetchQuiz(contentId);
                    fetchPendingTitleContents(contentId);
                }
            } else {
                console.error("Dữ liệu không phải là mảng hoặc không có thành công:", res.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy nội dung bài học:", error);
        }
    };


    useEffect(() => {
        fetchCourses();
    }, []);


    const fetchPendingTitleContents = async (contentId) => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            toast.error("Bạn chưa đăng nhập.");
            navigate('/');
            return;
        }
        try {
            const res = await axios.get(`${API_URL}/admin/pending-title-contents`, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    content_id: contentId
                }
            });

            // console.log("Dữ liệu nhận được từ title contents:", res.data);
            // console.log("Giá trị contentId:", contentId);

            if (res.data && res.data.success && Array.isArray(res.data.titleContents)) {
                // console.log("Title Contents:", res.data.titleContents);
                setTitleContents(res.data.titleContents);
            } else {
                console.error("Dữ liệu không phải là mảng:", res.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy nội dung tiêu đề:", error);
        }
    };

    const fetchQuiz = async (contentId) => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            toast.error("Bạn chưa đăng nhập.");
            navigate('/');
            return;
        }
        console.log("Token hợp lệ:", token); // Kiểm tra token

        try {
            const res = await axios.get(`${API_URL}/admin/pending-quizzes`, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    content_id: contentId
                }
            });

            console.log("Dữ liệu nhận được từ API:", res.data); // Kiểm tra dữ liệu từ API

            if (res.data && res.data.success && Array.isArray(res.data.quizzes)) {
                console.log("Quizzes:", res.data.quizzes);
                setQuizContent(res.data.quizzes);
            } else {
                console.error("Dữ liệu không đúng:", res.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy nội dung quiz:", error);
            toast.error("Có lỗi xảy ra khi tải quiz.");
        }
    };



    useEffect(() => {
        fetchCourses();
    }, []);

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.user.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter ? course.status === statusFilter : true;
        return matchesSearch && matchesStatus;
    });
    const currentCourses = filteredCourses;



    return (
        <SidebarProvider>
            <SideBarUI />
            <SidebarInset>
                <header className="z-10 absolute left-1 top-3">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/" className="flex items-center gap-1">
                                        <LayoutDashboard size={16} />
                                        Dashboard
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        href="/admin/draft"
                                        className="flex items-center gap-1 text-blue-600"
                                    >
                                        <GraduationCap size={16} />
                                        Quản lý khóa học
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="absolute top-14 px-6 bg-gray-50 w-full">
                    <div className="flex items-center justify-between space-y-0">
                        <h2 className="text-3xl font-bold tracking-tight mb-4">Quản lý duyệt nội dung</h2>
                        <div className="flex flex-wrap gap-4 w-full md:w-auto">
                            <Button variant="outline" className="flex items-center gap-2">
                                <Filter size={16} />
                                Lọc
                            </Button>
                            <div className="relative flex-1 md:flex-initial">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm khóa học..."
                                    className="pl-9 mb-4 pr-4 py-2 border border-gray-200 rounded-md w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Left Sidebar */}
                        <div className="lg:w-1/4">
                            <Card className="border shadow-lg">
                                <CardHeader className="pb-3 border-b">
                                    <CardTitle className="flex items-center gap-2">
                                        <div className="flex items-center gap-3">
                                            <Book className="w-6 h-6 text-blue-500" />
                                            <span className="text-base font-medium">Danh sách khóa học chờ duyệt</span>
                                        </div>
                                        <button
                                            size="sm"
                                            className="h-8 px-3"
                                            onClick={() => setStatusFilter('pending')}
                                        >
                                            {pendingCount > 0 && (
                                                <div className="px-2 py-0.5  text-sm font-medium rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
                                                    {pendingCount}
                                                </div>
                                            )}
                                        </button>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <ScrollArea className="h-min pr-4">
                                        <div className="space-y-3">
                                            {currentCourses.map((course, index) => (
                                                <div
                                                    key={course.id}
                                                    className={`group relative p-4 rounded-xl border cursor-pointer transition-all duration-200
                                                        ${activeCourse?.id === course.id
                                                            ? 'bg-yellow-50 border-yellow-200 shadow-sm'
                                                            : 'hover:bg-gray-50 hover:border-gray-300'
                                                        }`}
                                                    onClick={() => {
                                                        setActiveCourse(course);
                                                        fetchContentLesson(course.course_id);
                                                    }}
                                                >
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="font-semibold">{index + 1 + indexOfFirstCourse}</div> {/* Cập nhật chỉ số hiển thị */}
                                                        <h4 className="font-medium text-gray-900">{course.title}</h4>
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        Giảng viên: {course.user.name || 'Không rõ'}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                    </ScrollArea>
                                </CardContent>

                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                            >
                                            </button>
                                        </PaginationItem>
                                        {renderPaginationItems()}
                                        <PaginationItem>
                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                            >
                                            </button>
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>


                            </Card>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1">
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-2xl font-bold mb-6">
                                        {activeCourse ? activeCourse.title : 'Chọn một khóa học'}
                                    </h3>

                                    {/* Main Tabs */}
                                    <Tabs value={activeMainTab} onValueChange={setActiveMainTab}>
                                        <TabsList className="mb-4">
                                            <TabsTrigger value="info">Thông tin khóa học</TabsTrigger>
                                            <TabsTrigger value="lessons">Danh sách bài học</TabsTrigger>
                                            <button
                                                size="sm"
                                                className="h-8 px-3"
                                                onClick={() => setStatusFilter('pending')}
                                            >
                                                <div className="flex items-center">
                                                    {pendingCountContents > 0 ? (
                                                        <div className="px-2 py-0.5 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
                                                            {pendingCountContents}
                                                        </div>
                                                    ) : (
                                                        <div className="px-2 py-0.5 text-sm font-medium rounded-full text-gray-500">
                                                            0
                                                        </div>
                                                    )}
                                                </div>
                                            </button>
                                        </TabsList>



                                        <TabsContent value="info">
                                            {activeCourse ? (
                                                <div className="space-y-4">
                                                    <div className="flex items-center">
                                                        <label className="font-semibold mr-2">Giảng viên:</label>
                                                        <p>{activeCourse.user.name}</p>
                                                    </div>
                                                    <div className="flex items-center w-full">
                                                        <label className="font-semibold mr-2">Mô tả:</label>
                                                        <p className="break-words">{activeCourse.description}</p>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <label className="font-semibold mr-2">Thời lượng: </label>
                                                        <p>{activeCourse.duration}10 giờ</p>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <label className="font-semibold mr-2">Cấp độ:</label>
                                                        <p>{activeCourse.level}Khá</p>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <label className="font-semibold mr-2">Giá:</label>
                                                        <p>{formatCurrency(activeCourse.price)}</p>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <label className="font-semibold mr-2">Yêu cầu tiên quyết:</label>
                                                        <p className="break-words">{activeCourse.prerequisites}</p>
                                                    </div>
                                                </div>

                                            ) : (
                                                <p>Thông tin khóa học sẽ xuất hiện ở đây.</p>
                                            )}
                                        </TabsContent>

                                        <TabsContent value="lessons">
                                            {activeCourse ? (
                                                <div className="space-y-4">
                                                    <h4 className="font-semibold">Chi tiết bài học</h4>

                                                    {/* Lesson Content Tabs */}
                                                    <Tabs value={activeLessonTab} onValueChange={setActiveLessonTab}>
                                                        <TabsList>
                                                            <TabsTrigger value="content">Nội dung bài học</TabsTrigger>
                                                            <TabsTrigger value="quiz">Câu hỏi Quiz</TabsTrigger>
                                                        </TabsList>

                                                        {/* Nội dung bài học */}
                                                        <TabsContent value="content" className="mt-4">
                                                            {contentLesson.length > 0 ? (
                                                                contentLesson.map((lesson, index) => (
                                                                    <div className="hover:bg-amber-50 rounded-sm" key={lesson.content_id}>
                                                                        <Dialog >
                                                                            <DialogTrigger
                                                                                className="py-5 "
                                                                                onClick={() => {
                                                                                    fetchPendingTitleContents(lesson.content_id);
                                                                                }}
                                                                            >
                                                                                <span className="mx-2">Bài {index + 1}: </span>{lesson.name_content}
                                                                            </DialogTrigger>
                                                                            <hr />
                                                                            <DialogContent className="max-w-3xl max-h-[80vh] p-6 bg-[#fbf9c2] text-gray-800 rounded-lg shadow-lg">                                                                            <DialogHeader>
                                                                                <DialogTitle className="text-2xl font-bold text-center">{lesson.name_content}</DialogTitle>
                                                                                {titleContents.length > 0 ? (
                                                                                    <div className="mt-4">
                                                                                        <h5 className="font-semibold text-lg my-2">Tiêu đề nội dung:</h5>
                                                                                        {titleContents.map((title, index) => (
                                                                                            <div key={index} className="mb-4 p-4 bg-white rounded-lg shadow-md text-gray-900">
                                                                                                <div className="flex flex-col space-y-4">
                                                                                                    <div className="flex items-center">
                                                                                                        <DialogDescription className="flex-1 text-md ">
                                                                                                            <span className="font-bold">{index + 1}. </span>
                                                                                                            <span className="font-medium ">{title.body_content || "Nội dung không có sẵn."}</span>
                                                                                                        </DialogDescription>
                                                                                                        <Dialog>
                                                                                                            <DialogTrigger className="bg-[#6a4a3b] hover:bg-[#fbf9c2] text-white font-medium p-2 rounded-md ml-3 my-2  transition">
                                                                                                                Xem video
                                                                                                            </DialogTrigger>
                                                                                                            <DialogContent className="p-0 bg-white rounded-lg shadow-md w-full">
                                                                                                                <DialogDescription className="text-center mb-4">
                                                                                                                    <h2 className="text-xl font-semibold my-2">Xem Video</h2>
                                                                                                                    {title.video_link ? (
                                                                                                                        <div className="relative" style={{ paddingTop: '56.25%' }}>
                                                                                                                            <ReactPlayer
                                                                                                                                url={title.video_link}
                                                                                                                                className="absolute top-0 left-0 w-full h-full"
                                                                                                                                controls
                                                                                                                                width="100%"
                                                                                                                                height="100%"
                                                                                                                            />
                                                                                                                        </div>
                                                                                                                    ) : (
                                                                                                                        <p className="text-gray-500">Nội dung không có sẵn.</p>
                                                                                                                    )}
                                                                                                                </DialogDescription>
                                                                                                            </DialogContent>
                                                                                                        </Dialog>
                                                                                                    </div>
                                                                                                </div>


                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                ) : (
                                                                                    <p className="mt-4 text-center">Không có tiêu đề nào để hiển thị.</p>
                                                                                )}
                                                                            </DialogHeader>
                                                                            </DialogContent>

                                                                        </Dialog>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <p>Không có nội dung nào để hiển thị.</p>
                                                            )}
                                                        </TabsContent>

                                                        {/* Câu hỏi Quiz */}
                                                        <TabsContent value="quiz" className="mt-4">
                                                            {quizContent.map((quiz, index) => (
                                                                <div key={quiz.quiz_id} className="space-y-4">
                                                                    <p className="font-medium my-2">Đề: {quiz.title || 'Không có tiêu đề'}</p>
                                                                    <div className="space-y-2">
                                                                        <div>Câu hỏi {index + 1}: {quiz.question || 'Không có câu hỏi'}</div>
                                                                        <div className="flex items-center">
                                                                            <input type="radio" name={`q${index}`} id={`q${index}a`} className="mr-2" />
                                                                            <label htmlFor={`q${index}a`}>{quiz.option || 'Không có lựa chọn'}</label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </TabsContent>
                                                    </Tabs>
                                                </div>
                                            ) : (
                                                <p>Chi tiết bài học sẽ xuất hiện ở đây.</p>
                                            )}
                                        </TabsContent>

                                    </Tabs>

                                    {/* Action Buttons */}
                                    <div className="flex gap-4 mt-6">
                                        <AlertDialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
                                            <AlertDialogTrigger asChild>
                                                <Button className="bg-green-500 hover:bg-green-600 text-white">
                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                    Phê duyệt Bài học
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Xác nhận Phê duyệt</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Bạn có chắc chắn muốn phê duyệt bài học này không?
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel onClick={() => setIsApproveModalOpen(false)}>Hủy</AlertDialogCancel>
                                                    <AlertDialogAction onClick={handleApprove}>Phê duyệt</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>

                                        <AlertDialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive">
                                                    <XCircle className="mr-2 h-4 w-4" />
                                                    Từ chối Bài học
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Xác nhận Từ chối</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Bạn có chắc chắn muốn từ chối bài học này không?
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel onClick={() => setIsRejectModalOpen(false)}>Hủy</AlertDialogCancel>
                                                    <AlertDialogAction onClick={handleReject}>Từ chối</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>

                                        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" className="bg-yellow-500 hover:bg-yellow-600 text-white border-none">
                                                    <Clock className="mr-2 h-4 w-4" />
                                                    Yêu cầu chỉnh sửa
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Yêu cầu chỉnh sửa</DialogTitle>
                                                    <DialogDescription>
                                                        Vui lòng nhập ghi chú cho yêu cầu chỉnh sửa của bạn.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <textarea
                                                    value={editNote}
                                                    onChange={(e) => setEditNote(e.target.value)}
                                                    placeholder="Nhập ghi chú của bạn ở đây..."
                                                    className="w-full h-32 p-2 border rounded mb-4"
                                                />
                                                <DialogFooter>
                                                    <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Hủy</Button>
                                                    <Button onClick={handleEditRequest}>Gửi yêu cầu</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
