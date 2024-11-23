import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, XCircle, Clock, GraduationCap, LayoutDashboard, Book, Search, Filter, BadgeHelp, Calculator, Loader2 } from 'lucide-react';
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


export default function BrowseNewCourses() {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;
    const API_URL_GPT = 'https://api.openai.com/v1/chat/completions';
    const API_KEY_GPT = import.meta.env.VITE_GPT_KEY;
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
    const [selectedCourseId, setSelectedCourseId] = useState(null);

    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editNote, setEditNote] = useState('');

    const [selectedContentId, setSelectedContentId] = useState(null);
    const [reason, setReason] = useState('');

    const openRejectModal = (courseId) => {
        setSelectedCourseId(courseId);
        setIsRejectModalOpen(true);
    };

    const openEditModal = (courseId) => {
        setSelectedCourseId(courseId);
        setIsEditModalOpen(true);
    };


    const handleEditRequest = async () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            toast.error("Bạn chưa đăng nhập.");
            navigate('/');
            return;
        }

        if (!editNote.trim()) {
            toast.error("Vui lòng nhập ghi chú chỉnh sửa.");
            return;
        }

        console.log("Selected Course ID:", selectedCourseId);
        console.log("Edit Note:", editNote);

        try {
            const response = await axios.post(
                `${API_URL}/admin/revision`,
                {
                    course_id: selectedCourseId,
                    reason: editNote,
                },
                {
                    headers: {
                        "x-api-secret": API_KEY,
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data && response.data.success) {
                toast.success("Yêu cầu chỉnh sửa đã được gửi thành công.");
                fetchCourses();
            } else {
                console.error("Lỗi khi gửi yêu cầu chỉnh sửa:", response.data);
                toast.error("Có lỗi xảy ra khi gửi yêu cầu chỉnh sửa.");
            }
        } catch (error) {
            console.error("Lỗi khi gửi yêu cầu chỉnh sửa:", error);
            toast.error("Có lỗi xảy ra khi gửi yêu cầu chỉnh sửa.");
        } finally {
            setIsEditModalOpen(false); // Đóng modal sau khi xử lý
            setEditNote(''); // Xóa ghi chú chỉnh sửa
        }
    };



    const handleReject = async () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            toast.error("Bạn chưa đăng nhập.");
            navigate('/');
            return;
        }

        if (!reason.trim()) {
            toast.error("Vui lòng nhập lý do từ chối.");
            return;
        }

        try {
            const res = await axios.post(
                `${API_URL}/admin/reject`,
                { course_id: selectedCourseId, reason },
                {
                    headers: {
                        "x-api-secret": API_KEY,
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (res.data && res.data.success) {
                toast.success("Khóa học đã bị từ chối thành công.");
                fetchCourses();
            } else {
                console.error("Lỗi khi từ chối khóa học:", res.data);
                toast.error("Có lỗi xảy ra khi từ chối khóa học.");
            }
        } catch (error) {
            console.error("Lỗi khi gửi yêu cầu từ chối:", error);
            toast.error("Có lỗi xảy ra khi gửi yêu cầu từ chối.");
        } finally {
            setIsRejectModalOpen(false);
        }
    };




    /* Phân trang  */
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const totalPages = Math.ceil(courses.length / itemsPerPage);
    const indexOfLastCourse = currentPage * itemsPerPage;
    const indexOfFirstCourse = indexOfLastCourse - itemsPerPage;

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

    const openApproveModal = (courseId) => {
        setSelectedCourseId(courseId);
        setIsApproveModalOpen(true);
    };

    const handleApprove = () => {
        if (selectedCourseId) {
            approveCourse(selectedCourseId); // Gọi approveCourse với courseId đã được chọn
        }
        setIsApproveModalOpen(false);
    };


    const approveCourse = async (courseId) => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            toast.error("Bạn chưa đăng nhập.");
            navigate('/');
            return;
        }

        try {
            const res = await axios.post(
                `${API_URL}/admin/approve`,
                { course_id: courseId }, // Truyền giá trị course_id vào body
                {
                    headers: {
                        "x-api-secret": API_KEY,
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (res.data && res.data.success) {
                toast.success("Khóa học đã được phê duyệt thành công.");
                // Cập nhật danh sách các khóa học sau khi phê duyệt
                fetchCourses();
            } else {
                console.error("Lỗi khi phê duyệt khóa học:", res.data);
                toast.error("Có lỗi xảy ra khi phê duyệt khóa học.");
            }
        } catch (error) {
            console.error("Lỗi khi gửi yêu cầu phê duyệt:", error);
            toast.error("Có lỗi xảy ra khi gửi yêu cầu phê duyệt.");
        }
    };


    const fetchCourses = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/pending-courses`, {
                headers: {
                    'x-api-secret': API_KEY,
                },
            });
            const data = res.data;
            console.log(data);

            const pendingCourses = data.filter(course => course.status === 'pending');
            setCourses(pendingCourses);

            if (pendingCourses.length > 0) {
                const courseId = pendingCourses[0].course_id;
                fetchContentLesson(courseId);
            } else {
                console.warn("Không có khóa học nào đang chờ phê duyệt.");
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
                    course_id: courseId
                }
            });

            if (res.data && res.data.success && Array.isArray(res.data.contents)) {
                const filteredContents = res.data.contents.filter(content => content.course_id === Number(courseId));

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


            if (res.data && res.data.success && Array.isArray(res.data.titleContents)) {
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


            if (res.data && res.data.success && Array.isArray(res.data.quizzes)) {
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

    //tính điểm gpt
    const [isAutoApproveResultOpen, setIsAutoApproveResultOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [scores, setScores] = useState({
        titleScore: 0,
        descriptionScore: 0,
        priceScore: 0,
        finalScore: 0,
        explanation: ''
    });

    const analyzeContentWithGPT = async (content, type) => {
        try {
            const prompt = type === 'tiêu đề'
                ? `Đánh giá tiêu đề khóa học sau đây dựa trên các tiêu chí:
      1. Tính hấp dẫn và thu hút
      2. Độ rõ ràng và dễ hiểu
      3. Tính phù hợp với nội dung khóa học
      4. Kiểm tra nội dung nhạy cảm hoặc không phù hợp (chính trị, bạo lực, khiêu dâm, lừa đảo, vi phạm bản quyền...)

      Tiêu đề: "${content}"

      Nếu phát hiện bất kỳ từ ngữ hay nội dung nhạy cảm/không phù hợp, cho điểm 0 và giải thích lý do.
      Nếu không có vấn đề gì, đánh giá bình thường từ 0-20 điểm.

      Hãy trả về theo định dạng sau:
      Điểm: [số điểm]
      Lý do: [giải thích ngắn gọn]
      Cảnh báo: [nếu có nội dung nhạy cảm, ghi rõ vấn đề. Nếu không có thì để trống]`
                : `Đánh giá mô tả khóa học sau đây dựa trên các tiêu chí:
      1. Độ chi tiết và đầy đủ thông tin
      2. Tính rõ ràng và cấu trúc
      3. Tính thuyết phục và chuyên nghiệp
      4. Kiểm tra nội dung nhạy cảm hoặc không phù hợp (chính trị, bạo lực, khiêu dâm, lừa đảo, vi phạm bản quyền...)

      Mô tả: "${content}"

      Nếu phát hiện bất kỳ từ ngữ hay nội dung nhạy cảm/không phù hợp, cho điểm 0 và giải thích lý do.
      Nếu không có vấn đề gì, đánh giá bình thường từ 0-20 điểm.

      Hãy trả về theo định dạng sau:
      Điểm: [số điểm]
      Lý do: [giải thích ngắn gọn]
      Cảnh báo: [nếu có nội dung nhạy cảm, ghi rõ vấn đề. Nếu không có thì để trống]`;
            if (!API_KEY_GPT) {
                console.error('API key is missing');
                return { score: 0, reason: 'Thiếu API key' };
            }
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.7,
                    max_tokens: 200
                },
                {
                    headers: {
                        'Authorization': `Bearer ${API_KEY_GPT}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const result = response.data.choices[0].message.content;
            const scoreMatch = result.match(/Điểm:\s*(\d+)/i);
            const reasonMatch = result.match(/Lý do:\s*(.+)/i);

            if (!scoreMatch) {
                console.error(`Không thể trích xuất điểm từ phản hồi GPT cho ${type}:`, result);
                return { score: 0, reason: 'Không thể đánh giá' };
            }

            return {
                score: Math.min(20, Math.max(0, parseInt(scoreMatch[1], 10))),
                reason: reasonMatch ? reasonMatch[1].trim() : 'Không có giải thích'
            };
        } catch (error) {
            console.error(`Lỗi khi phân tích ${type}:`, error);
            return { score: 0, reason: `Lỗi khi đánh giá ${type}` };
        }
    };

    const calculateCourseScore = async (courseId) => {
        setIsProcessing(true);
        try {
            const courseResponse = await axios.get(`${API_URL}/admin/pending-courses/${courseId}`, {
                headers: { 'x-api-secret': API_KEY },
            });
            const courseData = courseResponse.data[0];

            if (!courseData?.title || !courseData?.description) {
                throw new Error("Thiếu thông tin khóa học cần thiết");
            }

            // Đánh giá tiêu đề
            const titleAnalysis = await analyzeContentWithGPT(courseData.title, "tiêu đề");

            // Đánh giá mô tả
            const descriptionAnalysis = await analyzeContentWithGPT(courseData.description, "mô tả");

            // Tính điểm giá
            const priceScore = courseData.price > 0 ? 10 : 0;

            // Tổng hợp điểm và giải thích
            const finalScore = titleAnalysis.score + descriptionAnalysis.score + priceScore;
            const explanation = `Tiêu đề: ${titleAnalysis.reason}. Mô tả: ${descriptionAnalysis.reason}. ${priceScore > 0 ? 'Giá hợp lệ.' : 'Giá không hợp lệ.'
                }`;

            setScores({
                titleScore: titleAnalysis.score,
                descriptionScore: descriptionAnalysis.score,
                priceScore,
                finalScore,
                explanation
            });

            return { finalScore, explanation };
        } catch (error) {
            console.error('Lỗi khi tính điểm:', error);
            toast.error('Có lỗi xảy ra khi tính điểm khóa học');
            return null;
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCalculateScore = async (courseId) => {
        const result = await calculateCourseScore(courseId);
        if (result) {
            setIsAutoApproveResultOpen(true);
        }
    };

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.user.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter ? course.status === statusFilter : true;
        return matchesSearch && matchesStatus;
    });

    const handleDateSort = () => {
        const sortedCourses = [...courses].sort((a, b) => {
            // Kiểm tra xem created_at có hợp lệ hay không trước khi tạo đối tượng Date
            const dateA = a.created_at ? new Date(a.created_at) : new Date(0); // Nếu không hợp lệ, dùng ngày 1/1/1970
            const dateB = b.created_at ? new Date(b.created_at) : new Date(0); // Nếu không hợp lệ, dùng ngày 1/1/1970

            return dateB - dateA; // Sắp xếp từ ngày mới nhất đến cũ nhất
        });

        setCourses(sortedCourses);
    };


    return (
        <SidebarProvider>
            <SideBarUI />
            <SidebarInset>
                <header className="z-10 absolute left-1 top-3 font-sans">
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
                <div className="absolute top-14 px-6 bg-gray-50 w-full font-sans">
                    <div className="flex items-center justify-between space-y-0 my-5">
                        <h2 className="text-3xl font-bold tracking-tight mb-4">Quản lý duyệt nội dung</h2>
                        <div className="flex flex-wrap gap-4 w-full md:w-auto">
                            <Button variant="outline" onClick={handleDateSort} className="flex items-center gap-2">
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
                                    <ScrollArea className="h-auto pr-4">
                                        <div className="space-y-3">
                                            {filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse).map((course, index) => (
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
                                                        <div className="font-semibold">{index + 1 + indexOfFirstCourse}</div>
                                                        <h4 className="font-medium text-gray-900  break-words">{course.title}</h4>
                                                        {/*<h4 className="font-medium text-gray-900 break-words overflow-hidden text-ellipsis whitespace-nowrap">*/}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        Giảng viên: {course.user.name || 'Không rõ'}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        Ngày: {course.created_at ? new Date(course.created_at).toLocaleDateString() : 'Không rõ'}
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
                                                <div className="grid grid-cols-2 gap-8">
                                                    {/* Left Content */}
                                                    <div className="space-y-4">
                                                        <div className="flex items-center">
                                                            <label className="font-semibold mr-2">Giảng viên:</label>
                                                            <p>{activeCourse.user.name}</p>
                                                        </div>
                                                        <div className="flex items-start gap-2 w-full">
                                                            <label className="font-semibold mr-2 mt-1 shrink-0">Mô tả:</label>
                                                            <p className="break-words">{activeCourse.description}</p>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <label className="font-semibold mr-2">Thời lượng:</label>
                                                            <p>{activeCourse.duration} 10 giờ</p>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <label className="font-semibold mr-2">Cấp độ:</label>
                                                            <p>{activeCourse.level}</p>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <label className="font-semibold mr-2">Giá:</label>
                                                            <p>{formatCurrency(activeCourse.price)}</p>
                                                        </div>
                                                        <div className="flex items-start">
                                                            <label className="font-semibold mr-2 mt-1">Yêu cầu tiên quyết:</label>
                                                            <p className="break-words">{activeCourse.prerequisites}</p>
                                                        </div>
                                                    </div>

                                                    {/* Right Content (Image) */}
                                                    <div className="w-full p-2">
                                                        <img
                                                            src={activeCourse.img}
                                                            alt="Course image"
                                                            className="w-full h-auto object-cover rounded-lg"
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <p>Course information will appear here.</p>
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
                                                        <TabsContent value="quiz" className="mt-2 space-y-4">
                                                            {quizContent.map((quiz, index) => (
                                                                <Card key={quiz.quiz_id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                                                                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 py-3">
                                                                        <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                                                                            <BadgeHelp variant="secondary" className="mr-2" />
                                                                            <span>{quiz.title || 'Không có tiêu đề'}</span>
                                                                        </CardTitle>
                                                                    </CardHeader>
                                                                    <CardContent className="pt-4">
                                                                        {quiz.questions && quiz.questions.length > 0 ? (
                                                                            quiz.questions.map((question, qIndex) => (
                                                                                <div
                                                                                    key={question.question_id}
                                                                                    className="mb-4 last:mb-0"
                                                                                >
                                                                                    <div className="flex items-center gap-2 mb-2">
                                                                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                                                                                            {qIndex + 1}
                                                                                        </span>
                                                                                        <h3 className="text-base font-medium text-gray-800">
                                                                                            {question.question || 'Không có câu hỏi'}
                                                                                        </h3>
                                                                                    </div>

                                                                                    <div className="space-y-2 pl-8">
                                                                                        {question.options && question.options.map((option, oIndex) => (
                                                                                            <div
                                                                                                key={option.option_id}
                                                                                                className={`
                                                                                                flex items-center p-2 rounded-lg transition-colors duration-200
                                                                                                ${option.is_correct === 1
                                                                                                        ? 'bg-green-50 border border-green-200'
                                                                                                        : 'hover:bg-gray-100 border border-gray-200'
                                                                                                    }
                                                                                            `}
                                                                                            >

                                                                                                <input
                                                                                                    type="radio"
                                                                                                    name={`q${index}_${qIndex}`}
                                                                                                    id={`q${index}_${qIndex}o${oIndex}`}
                                                                                                    className="w-4 h-4 text-blue-600 mr-2"
                                                                                                    defaultChecked={option.is_correct === 1}
                                                                                                    readOnly
                                                                                                    onClick={(e) => e.preventDefault()}
                                                                                                />
                                                                                                <label
                                                                                                    htmlFor={`q${index}_${qIndex}o${oIndex}`}
                                                                                                    className="flex-1 cursor-pointer text-sm"
                                                                                                >
                                                                                                    {option.answer || 'Không có lựa chọn'}
                                                                                                </label>
                                                                                                {option.is_correct === 1 && (
                                                                                                    <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                                                                                                )}
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            ))
                                                                        ) : (
                                                                            <div className="text-center text-gray-500 py-4">
                                                                                Không có câu hỏi
                                                                            </div>
                                                                        )}
                                                                    </CardContent>
                                                                </Card>
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
                                        {/* Tính điểm */}
                                        <Button
                                            className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                                            onClick={async () => {
                                                await handleCalculateScore("activeCourseId");
                                            }}
                                            disabled={isProcessing}
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Đang xử lý...
                                                </>
                                            ) : (
                                                <>
                                                    <Calculator className="mr-2 h-4 w-4" />
                                                    Tính điểm
                                                </>
                                            )}
                                        </Button>
                                        <AlertDialog open={isAutoApproveResultOpen} onOpenChange={setIsAutoApproveResultOpen}>
                                            <AlertDialogContent className="max-w-5xl bg-white rounded-xl shadow-xl">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="text-xl font-bold text-purple-700 flex items-center gap-2 mb-4">
                                                        Kết quả tính điểm
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription className="flex gap-6">
                                                        {/* Cột bên trái - Hiển thị điểm */}
                                                        <div className="w-1/3 space-y-3">
                                                            <div className="bg-purple-50 p-3 rounded-lg">
                                                                <p className="flex justify-between items-center">
                                                                    <span className="text-gray-700">Điểm tiêu đề:</span>
                                                                    <span className="font-semibold text-purple-700">{scores.titleScore}/20</span>
                                                                </p>
                                                            </div>

                                                            <div className="bg-purple-50 p-3 rounded-lg">
                                                                <p className="flex justify-between items-center">
                                                                    <span className="text-gray-700">Điểm mô tả:</span>
                                                                    <span className="font-semibold text-purple-700">{scores.descriptionScore}/20</span>
                                                                </p>
                                                            </div>

                                                            <div className="bg-purple-50 p-3 rounded-lg">
                                                                <p className="flex justify-between items-center">
                                                                    <span className="text-gray-700">Điểm giá:</span>
                                                                    <span className="font-semibold text-purple-700">{scores.priceScore}/10</span>
                                                                </p>
                                                            </div>

                                                            <div className="bg-purple-50 p-3 rounded-lg">
                                                                <p className="flex justify-between items-center">
                                                                    <span className="text-gray-700">Tổng điểm:</span>
                                                                    <span className="font-semibold text-purple-700">{scores.finalScore}/50</span>
                                                                </p>
                                                            </div>

                                                            <div className={`p-3 rounded-lg ${scores.finalScore >= 35 ? 'bg-green-50' : 'bg-red-50'}`}>
                                                                <p className="flex items-center justify-center">
                                                                    <span className={`font-medium ${scores.finalScore >= 35 ? 'text-green-600' : 'text-red-600'}`}>
                                                                        {scores.finalScore >= 35 ? '✅ Đạt yêu cầu' : '❌ Không đạt yêu cầu'}
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Cột bên phải - Chi tiết đánh giá */}
                                                        <div className="w-2/3 bg-gray-50 p-4 rounded-lg">
                                                            <h4 className="font-medium text-gray-700 mb-4">Chi tiết đánh giá:</h4>

                                                            {/* Phần Tiêu đề */}
                                                            <div className="mb-4">
                                                                <p className="font-medium text-gray-600 mb-2 flex items-center">
                                                                    <span className="mr-2">🎯</span>
                                                                    Tiêu đề:
                                                                </p>
                                                                <p className="text-gray-600 ml-6 bg-white p-3 rounded-lg">
                                                                    {scores.explanation ?
                                                                        scores.explanation
                                                                            .split('Mô tả:')[0]
                                                                            .replace('Tiêu đề:', '')
                                                                            .trim()
                                                                        : 'Chưa có đánh giá'
                                                                    }
                                                                </p>
                                                            </div>

                                                            {/* Phần Mô tả */}
                                                            <div className="mb-4">
                                                                <p className="font-medium text-gray-600 mb-2 flex items-center">
                                                                    <span className="mr-2">📝</span>
                                                                    Mô tả:
                                                                </p>
                                                                <p className="text-gray-600 ml-6 bg-white p-3 rounded-lg">
                                                                    {scores.explanation ?
                                                                        scores.explanation
                                                                            .split('Mô tả:')[1]
                                                                            ?.split('Giá')[0]
                                                                            ?.trim() ?? 'Chưa có đánh giá'
                                                                        : 'Chưa có đánh giá'
                                                                    }
                                                                </p>
                                                            </div>

                                                            {/* Phần Giá */}
                                                            <div>
                                                                <p className="font-medium text-gray-600 mb-2 flex items-center">
                                                                    <span className="mr-2">💰</span>
                                                                    Giá:
                                                                </p>
                                                                <p className="text-gray-600 ml-6 bg-white p-3 rounded-lg">
                                                                    {scores.explanation ?
                                                                        scores.explanation.includes('Giá hợp lệ') ? 'Hợp lệ' : 'Không hợp lệ'
                                                                        : 'Chưa có đánh giá'
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogAction
                                                        onClick={() => setIsAutoApproveResultOpen(false)}
                                                        className="bg-purple-600 text-white hover:bg-purple-700"
                                                    >
                                                        Đóng
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>

                                        {/* Phê duyệt */}
                                        <AlertDialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
                                            <AlertDialogTrigger>
                                                <Button
                                                    className="bg-green-500 hover:bg-green-600 text-white"
                                                    onClick={() => openApproveModal(activeCourse?.course_id)} // Chỉ mở modal và lưu course_id của khóa học đang được chọn
                                                >
                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                    Phê duyệt
                                                </Button>



                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="bg-white rounded-2xl shadow-2xl max-w-md">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="text-2xl font-bold text-gray-800 text-center">
                                                        Xác nhận phê duyệt
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription className="text-center mt-4 text-gray-600">
                                                        Bạn có chắc chắn muốn phê duyệt bài học này không?
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter className="mt-6 space-x-3">
                                                    <AlertDialogCancel className="px-6 py-2 rounded-xl hover:bg-gray-100 transition-colors">
                                                        Hủy
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction className="px-6 py-2 rounded-xl bg-green-600 hover:bg-emerald-600 text-white transition-all hover:shadow-lg hover:-translate-y-0.5">
                                                        Xác nhận
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>


                                        </AlertDialog>

                                        {/* Yêu cầu chỉnh sửa */}
                                        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                                            <DialogTrigger>
                                                <Button
                                                    variant="outline"
                                                    className="bg-yellow-500 hover:bg-yellow-600 text-white border-none"
                                                    onClick={() => openEditModal(activeCourse?.course_id)} // Chỉ gọi hàm cho khóa học đang được chọn
                                                >
                                                    <Clock className="mr-2 h-4 w-4" />
                                                    Yêu cầu chỉnh sửa
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="bg-white rounded-2xl shadow-lg max-w-md border border-gray-100/50">
                                                <DialogHeader>
                                                    <DialogTitle className="text-2xl font-bold text-gray-800 text-center">
                                                        Yêu cầu chỉnh sửa
                                                    </DialogTitle>
                                                    <DialogDescription className="text-center mt-2 text-gray-600">
                                                        Vui lòng nhập ghi chú cho yêu cầu chỉnh sửa
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <textarea
                                                    value={editNote}
                                                    onChange={(e) => setEditNote(e.target.value)}
                                                    placeholder="Nhập ghi chú của bạn..."
                                                    className="w-full h-32 p-4 mt-4 bg-gray-50 rounded-xl resize-none outline-none border border-gray-100
                                                    focus:ring-1 focus:ring-amber-200 focus:border-amber-300 transition-all"
                                                />
                                                <DialogFooter className="mt-6 space-x-3">
                                                    <Button variant="outline" onClick={() => setIsEditModalOpen(false)}
                                                        className="px-6 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                                                        Hủy
                                                    </Button>
                                                    <Button
                                                        className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white
                                                        transition-all hover:shadow-md hover:-translate-y-0.5"
                                                    >
                                                        Gửi yêu cầu
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>

                                        {/* Từ chối */}
                                        <AlertDialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
                                            <AlertDialogTrigger>
                                                <Button
                                                    variant="destructive"
                                                    onClick={() => openRejectModal(activeCourse?.course_id)} // Gọi hàm khi click và lưu course_id
                                                >
                                                    <XCircle className="mr-2 h-4 w-4" />
                                                    Từ chối
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="bg-white rounded-2xl shadow-2xl max-w-md border-2 border-rose-100">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="text-2xl font-bold text-gray-800 text-center">
                                                        Xác nhận từ chối
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription className="text-center mt-2 text-gray-600">
                                                        Vui lòng nhập lý do từ chối bài học này
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <textarea
                                                    placeholder="Nhập lý do từ chối"
                                                    value={reason}
                                                    onChange={(e) => setReason(e.target.value)}
                                                    className="w-full h-32 p-4 mt-4 bg-rose-50 border-2 border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all"
                                                />
                                                <AlertDialogFooter className="mt-6 space-x-3">
                                                    <AlertDialogCancel className="px-6 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 text-gray-700 font-medium transition-colors">
                                                        Hủy
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction className="px-6 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium transition-all hover:shadow-lg hover:-translate-y-0.5">
                                                        Xác nhận
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider >
    );
}
