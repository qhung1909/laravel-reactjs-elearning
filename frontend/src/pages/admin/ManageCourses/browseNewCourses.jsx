import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, XCircle, Clock, GraduationCap, LayoutDashboard, BookOpen, FileQuestion, FileText, PenTool, ClipboardX, FileX, HelpCircle, Badge, Book, Search, Filter, BadgeHelp, Calculator, Loader2, ChevronRight } from 'lucide-react';
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"


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
                setTimeout(()=>{
                    window.location.reload()
                }, 3000)
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
                setTimeout(()=>{
                    window.location.reload()
                }, 3000)
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
                setTimeout(()=>{
                    window.location.reload()
                }, 3000)
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
            // 1. Lấy tất cả contents
            const contentsRes = await axios.get(`${API_URL}/admin/pending-contents`, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    course_id: courseId
                }
            });

            if (contentsRes.data?.success && Array.isArray(contentsRes.data.contents)) {
                const filteredContents = contentsRes.data.contents.filter(
                    content => content.course_id === Number(courseId)
                );
                setContentLesson(filteredContents);

                // 2. Lấy titles cho tất cả contents
                const titlePromises = filteredContents.map(content =>
                    axios.get(`${API_URL}/admin/pending-title-contents`, {
                        headers: {
                            "x-api-secret": `${API_KEY}`,
                            Authorization: `Bearer ${token}`,
                        },
                        params: {
                            content_id: content.content_id
                        }
                    })
                );

                const titleResponses = await Promise.all(titlePromises);
                const allTitles = titleResponses.reduce((acc, res) => {
                    if (res.data?.success && Array.isArray(res.data.titleContents)) {
                        return [...acc, ...res.data.titleContents];
                    }
                    return acc;
                }, []);

                setTitleContents(allTitles);

                // 3. Update pending count
                const pendingCount = filteredContents.filter(
                    content => content.status === 'pending'
                ).length;
                setPendingCountContents(pendingCount);
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
                console.log("Set Title Contents:", res.data.titleContents);

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
        if (activeLessonTab === 'quiz' && activeCourse) {
            const fetchAllQuizzes = async () => {
                const quizPromises = contentLesson.map(lesson => fetchQuiz(lesson.content_id));
                await Promise.all(quizPromises);
            };
            fetchAllQuizzes();
        }
    }, [activeLessonTab, activeCourse]);

    useEffect(() => {
        fetchCourses();
    }, []);

    //tính điểm gpt
    const [isAutoApproveResultOpen, setIsAutoApproveResultOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [scores, setScores] = useState({
        // Điểm khóa học
        titleScore: 0,
        descriptionScore: 0,
        priceScore: 0,
        finalScore: 0,
        explanation: '',
        // Thêm phần điểm contents
        contentScores: {
            isPass: false,
            averageScore: 0,
            details: []
        }
    });
    // Tính điểm cho nội dung và tiêu đề nội dung
    const calculateContentAndTitleScore = async (content, titleContents, videoLink, quizContent) => {
        try {
            // Lấy tất cả title contents cho content này
            const contentTitles = titleContents.filter(
                title => title.content_id === content.content_id
            );

            // Gộp tất cả body_content và video_link
            const titleText = contentTitles.map(t => t.body_content).join(' ');
            const video_link = contentTitles.map(v => v.video_link).join(' ');

            const titlePrompt = `Đánh giá tiêu đề bài học sau:
    Tiêu đề: "${content.content}"

    TIÊU CHÍ ĐÁNH GIÁ:
    1. Tính rõ ràng (0-5 điểm)
    - Dễ hiểu, ngắn gọn
    - Không mơ hồ hoặc gây nhầm lẫn

    2. Tính phù hợp (0-5 điểm)
    - Phù hợp với nội dung bài học
    - Không chứa từ ngữ nhạy cảm/không phù hợp

    LƯU Ý:
    - Nếu phát hiện nội dung nhạy cảm/không phù hợp, cho 0 điểm
    - Thang điểm: 0-10

    YÊU CẦU PHẢN HỒI:
    Điểm: [0-10]
    Nhận xét chi tiết: [điểm mạnh và điểm yếu của tiêu đề]
    Đề xuất cải thiện: [nếu cần]`;

            const contentPrompt = `Đánh giá nội dung bài học sau:
    Nội dung: "${titleText}"
    Video link: "${video_link}"

    TIÊU CHÍ ĐÁNH GIÁ:
    1. Nội dung (0-10 điểm)
    - Đầy đủ, chi tiết
    - Cấu trúc rõ ràng, dễ hiểu

    2. Video/link (0-20 điểm)
    - Có video_link hợp lệ: +10 điểm
    - Link tài liệu phù hợp: +10 điểm

    LƯU Ý:
    - Nếu phát hiện nội dung nhạy cảm/không phù hợp, cho 0 điểm
    - Thang điểm: 0-30

    YÊU CẦU PHẢN HỒI:
    Điểm: [0-30]
    Đánh giá chi tiết:
    - Nội dung: [nhận xét về chất lượng nội dung]
    - Video/link: [nhận xét về tài nguyên đính kèm]
    Đề xuất cải thiện: [nếu cần]`;

            let quizPrompt = '';
            // Chấm điểm cho quiz
            const quizzes = quizContent.filter(quiz => quiz.content_id === content.content_id);

            if (quizzes && quizzes.length > 0) {
                const quizData = quizzes.map(quiz => ({
                    title: quiz.title,
                    questions: quiz.questions.map(q => ({
                        question: q.question,
                        options: q.options.map(opt => ({
                            answer: opt.answer,
                            is_correct: opt.is_correct
                        }))
                    }))
                }));

                quizPrompt = `Đánh giá quiz sau:
    ${JSON.stringify(quizData, null, 2)}

    TIÊU CHÍ ĐÁNH GIÁ:
    1. Số lượng câu hỏi (0-15 điểm)
    - 1-3 câu: 5 điểm
    - 4-6 câu: 10 điểm
    - 7+ câu: 15 điểm

    2. Chất lượng câu hỏi (0-5 điểm)
    - Câu hỏi rõ ràng, logic
    - Đáp án hợp lý

    3. Đa dạng hình thức (0-5 điểm)
    - Có nhiều dạng câu hỏi khác nhau

    PHÂN TÍCH LỖI:
    Liệt kê các câu hỏi có vấn đề (nếu có):
    ${quizData[0].questions.map((q, index) => `
    Câu ${index + 1}: "${q.question}"
    - Lỗi phát hiện: [liệt kê lỗi nếu có]
    - Đề xuất sửa: [gợi ý cách sửa]
    `).join('\n')}

    YÊU CẦU PHẢN HỒI:
    Điểm: [0-25]
    Đánh giá chi tiết:
    - Số lượng câu hỏi: [đánh giá]
    - Chất lượng câu hỏi: [đánh giá]
    - Tính đa dạng: [đánh giá]
    Các câu hỏi cần cải thiện: [liệt kê số thứ tự]
    Đề xuất cải thiện: [cụ thể cho từng vấn đề]`;
            }

            // Gọi API GPT cho tất cả các đánh giá
            const apiCalls = [
                axios.post('https://api.openai.com/v1/chat/completions', {
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: titlePrompt }]
                }, {
                    headers: { 'Authorization': `Bearer ${API_KEY_GPT}` }
                }),
                axios.post('https://api.openai.com/v1/chat/completions', {
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: contentPrompt }]
                }, {
                    headers: { 'Authorization': `Bearer ${API_KEY_GPT}` }
                })
            ];

            if (quizPrompt) {
                apiCalls.push(
                    axios.post('https://api.openai.com/v1/chat/completions', {
                        model: 'gpt-3.5-turbo',
                        messages: [{ role: 'user', content: quizPrompt }]
                    }, {
                        headers: { 'Authorization': `Bearer ${API_KEY_GPT}` }
                    })
                );
            }

            const responses = await Promise.all(apiCalls);

            // Xử lý kết quả với regex cải tiến
            const titleScore = parseInt(responses[0].data.choices[0].message.content.match(/Điểm:\s*(\d+)/)[1]);
            const contentScore = parseInt(responses[1].data.choices[0].message.content.match(/Điểm:\s*(\d+)/)[1]);

            let quizScore = 0;
            let quizReason = '';
            let quizAnalysis = '';
            if (responses.length > 2) {
                const quizResult = responses[2].data.choices[0].message.content;
                quizScore = parseInt(quizResult.match(/Điểm:\s*(\d+)/)[1]);

                // Lấy phần đánh giá chi tiết
                const detailMatch = quizResult.match(/Đánh giá chi tiết:([\s\S]*?)(?=Các câu hỏi cần cải thiện:|$)/);
                const improvementMatch = quizResult.match(/Các câu hỏi cần cải thiện:([\s\S]*?)(?=Đề xuất cải thiện:|$)/);
                const suggestionMatch = quizResult.match(/Đề xuất cải thiện:([\s\S]*?)$/);

                quizReason = detailMatch ? detailMatch[1].trim() : '';
                quizAnalysis = {
                    detail: quizReason,
                    needImprovement: improvementMatch ? improvementMatch[1].trim() : '',
                    suggestions: suggestionMatch ? suggestionMatch[1].trim() : ''
                };
            }

            const totalScore = titleScore + contentScore + quizScore;

            return {
                titleScore,
                contentScore,
                quizScore,
                totalScore,
                quizReason,
                quizAnalysis,
                reasons: {
                    title: responses[0].data.choices[0].message.content.match(/Nhận xét chi tiết:([\s\S]*?)(?=Đề xuất cải thiện:|$)/)[1].trim(),
                    content: responses[1].data.choices[0].message.content.match(/Đánh giá chi tiết:([\s\S]*?)(?=Đề xuất cải thiện:|$)/)[1].trim(),
                    titleSuggestion: responses[0].data.choices[0].message.content.match(/Đề xuất cải thiện:([\s\S]*?)$/)?.[1].trim() || '',
                    contentSuggestion: responses[1].data.choices[0].message.content.match(/Đề xuất cải thiện:([\s\S]*?)$/)?.[1].trim() || '',
                    quiz: quizAnalysis
                },
                isPass: totalScore >= 40
            };

        } catch (error) {
            console.error('Lỗi khi tính điểm nội dung:', error);
            return null;
        }
    };
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
    // Tính điểm cho khóa học
    const calculateCourseScore = async (courseId) => {
        setIsProcessing(true);
        try {
            // 1. Tính điểm khóa học
            const courseResponse = await axios.get(`${API_URL}/admin/pending-courses/${courseId}`, {
                headers: { 'x-api-secret': API_KEY },
            });
            const courseData = courseResponse.data[0];

            if (!courseData?.title || !courseData?.description) {
                throw new Error("Thiếu thông tin khóa học cần thiết");
            }

            // Đánh giá tiêu đề và mô tả
            const titleAnalysis = await analyzeContentWithGPT(courseData.title, "tiêu đề");
            const descriptionAnalysis = await analyzeContentWithGPT(courseData.description, "mô tả");
            const priceScore = courseData.price > 0 ? 10 : 0;
            const finalScore = titleAnalysis.score + descriptionAnalysis.score + priceScore;

            // 2. Load quiz cho tất cả content trước khi tính điểm
            const quizPromises = contentLesson.map(async (content) => {
                const res = await axios.get(`${API_URL}/admin/pending-quizzes`, {
                    headers: {
                        "x-api-secret": `${API_KEY}`,
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                    params: {
                        content_id: content.content_id
                    }
                });
                return res.data?.success && Array.isArray(res.data.quizzes) ? res.data.quizzes : [];
            });

            const allQuizzes = await Promise.all(quizPromises);
            const flattenedQuizzes = allQuizzes.flat();

            // 3. Tính điểm nội dung và quiz
            let contentScores = { isPass: false, averageScore: 0, details: [] };

            if (contentLesson && contentLesson.length > 0) {
                const contentResults = await Promise.all(
                    contentLesson.map(async (content) => {
                        const contentQuizzes = flattenedQuizzes.filter(quiz =>
                            quiz.content_id === content.content_id
                        );
                        return calculateContentAndTitleScore(
                            content,
                            titleContents,
                            null,
                            contentQuizzes // Truyền quiz tương ứng với content
                        );
                    })
                );

                const validResults = contentResults.filter(result => result !== null);
                if (validResults.length > 0) {
                    const totalScores = validResults.reduce((acc, curr) => ({
                        totalScore: acc.totalScore + curr.totalScore,
                        contentScore: acc.contentScore + curr.contentScore,
                        quizScore: acc.quizScore + curr.quizScore
                    }), { totalScore: 0, contentScore: 0, quizScore: 0 });

                    contentScores = {
                        isPass: validResults.every(result => result.isPass),
                        averageScore: totalScores.contentScore / validResults.length,
                        averageQuizScore: totalScores.quizScore / validResults.length,
                        totalAverageScore: totalScores.totalScore / validResults.length,
                        details: validResults
                    };
                }
            }

            // 4. Cập nhật state với đầy đủ thông tin
            setScores({
                titleScore: titleAnalysis.score,
                descriptionScore: descriptionAnalysis.score,
                priceScore,
                finalScore,
                explanation: `Tiêu đề: ${titleAnalysis.reason}. Mô tả: ${descriptionAnalysis.reason}. ${priceScore > 0 ? 'Giá hợp lệ.' : 'Giá không hợp lệ.'
                    }`,
                contentScores,
                isOverallPass: finalScore >= 35 && contentScores.totalAverageScore >= 40
            });

            return {
                finalScore,
                contentScores,
                isPass: finalScore >= 35 && contentScores.totalAverageScore >= 40
            };

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
                                    <BreadcrumbLink href="/admin" className="flex items-center gap-1">
                                        <LayoutDashboard size={16} />
                                        Dashboard
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        // href="/admin/draft"
                                        className="flex items-center gap-1 text-blue-600 hover:text-blue-600"
                                    >
                                        <GraduationCap size={16} />
                                        Duyệt khóa học mới từ giảng viên
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
                                                {/* <div className="flex items-center">
                                                    {pendingCountContents > 0 ? (
                                                        <div className="px-2 py-0.5 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
                                                            {pendingCountContents}
                                                        </div>
                                                    ) : (
                                                        <div className="px-2 py-0.5 text-sm font-medium rounded-full text-gray-500">
                                                            0
                                                        </div>
                                                    )}
                                                </div> */}
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
                                                            <div
                                                                className="break-words"
                                                                dangerouslySetInnerHTML={{ __html: activeCourse.description }}
                                                            />
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
                                                        <div className="flex items-center">
                                                            <label className="font-semibold mr-2">Giá giảm:</label>
                                                            <p>{formatCurrency(activeCourse.price_discount)}</p>
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
                                                <p>Hãy chọn khóa học cần duyệt.</p>
                                            )}
                                        </TabsContent>


                                        <TabsContent value="lessons">
                                            {activeCourse ? (
                                                <div className="space-y-6">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-xl font-semibold flex items-center gap-2">
                                                            <BookOpen className="h-5 w-5 text-blue-500" />
                                                            Chi tiết bài học
                                                        </h4>
                                                    </div>

                                                    <Tabs value={activeLessonTab} onValueChange={setActiveLessonTab}>
                                                        <TabsList className="grid w-full grid-cols-2 mb-6">
                                                            <TabsTrigger value="content" className="flex items-center gap-2">
                                                                <FileText className="h-4 w-4" />
                                                                Nội dung bài học
                                                            </TabsTrigger>
                                                            <TabsTrigger value="quiz" className="flex items-center gap-2">
                                                                <PenTool className="h-4 w-4" />
                                                                Câu hỏi Quiz
                                                            </TabsTrigger>
                                                        </TabsList>

                                                        <TabsContent value="content">
                                                            <ScrollArea className="h-[600px] pr-4">
                                                                {contentLesson.length > 0 ? (
                                                                    <div className="space-y-4">
                                                                        {contentLesson.map((lesson, index) => (
                                                                            <Card key={lesson.content_id} className="transition-all hover:shadow-md">
                                                                                <Dialog>
                                                                                    <DialogTrigger asChild>
                                                                                        <CardHeader
                                                                                            onClick={() => fetchPendingTitleContents(lesson.content_id)}
                                                                                            className="cursor-pointer hover:bg-slate-50"
                                                                                        >
                                                                                            <div className="flex items-center gap-4">
                                                                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
                                                                                                    {index + 1}
                                                                                                </div>
                                                                                                <div className="flex-1 text-left">
                                                                                                    <h4 className="font-semibold">{lesson.name_content}</h4>
                                                                                                </div>
                                                                                                <ChevronRight className="h-5 w-5 text-gray-400" />
                                                                                            </div>
                                                                                        </CardHeader>
                                                                                    </DialogTrigger>

                                                                                    <DialogContent className="max-w-4xl max-h-[80vh]">
                                                                                        <DialogHeader>
                                                                                            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                                                                                                <BookOpen className="h-6 w-6 text-blue-500" />
                                                                                                {lesson.name_content}
                                                                                            </DialogTitle>
                                                                                        </DialogHeader>

                                                                                        <ScrollArea className="max-h-[60vh] pr-4">
                                                                                            {titleContents.length > 0 ? (
                                                                                                <div className="space-y-6 py-4">
                                                                                                    {titleContents.map((title, index) => (
                                                                                                        <Card key={index}>
                                                                                                            <CardHeader>
                                                                                                                <div className="flex items-start gap-3">
                                                                                                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-semibold">
                                                                                                                        {index + 1}
                                                                                                                    </div>
                                                                                                                    <div className="flex-1">
                                                                                                                        <p className="text-base font-medium text-gray-700">
                                                                                                                            {title.body_content || "Nội dung không có sẵn."}
                                                                                                                        </p>
                                                                                                                    </div>
                                                                                                                    {/* Hiển thị document_link nếu có */}
                                                                                                                    {title.document_link && (
                                                                                                                        <div className="text-sm text-gray-500">
                                                                                                                            <div dangerouslySetInnerHTML={{ __html: title.document_link }} />
                                                                                                                        </div>
                                                                                                                    )}
                                                                                                                    {/* Video button */}
                                                                                                                    {title.video_link && (
                                                                                                                        <Dialog>
                                                                                                                            <DialogTrigger asChild>
                                                                                                                                <Button className="bg-[#6a4a3b] hover:bg-[#fbf9c2] hover:text-[#6a4a3b] text-white font-medium p-2 rounded-md transition-all">
                                                                                                                                    Xem video
                                                                                                                                </Button>
                                                                                                                            </DialogTrigger>
                                                                                                                            <DialogContent className="p-0 bg-white rounded-lg shadow-md w-full">
                                                                                                                                {/* ... phần content video ... */}
                                                                                                                            </DialogContent>
                                                                                                                        </Dialog>
                                                                                                                    )}
                                                                                                                </div>
                                                                                                            </CardHeader>
                                                                                                        </Card>
                                                                                                    ))}
                                                                                                </div>
                                                                                            ) : (
                                                                                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                                                                                    <FileX className="h-12 w-12 text-gray-400 mb-4" />
                                                                                                    <p className="text-gray-500">Không có tiêu đề nào để hiển thị.</p>
                                                                                                </div>
                                                                                            )}
                                                                                        </ScrollArea>
                                                                                    </DialogContent>
                                                                                </Dialog>
                                                                            </Card>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                                                        <FileX className="h-12 w-12 text-gray-400 mb-4" />
                                                                        <p className="text-lg font-medium text-gray-900">Không có nội dung</p>
                                                                        <p className="text-gray-500">Không có nội dung nào để hiển thị.</p>
                                                                    </div>
                                                                )}
                                                            </ScrollArea>
                                                        </TabsContent>

                                                        <TabsContent value="quiz">
                                                            <ScrollArea className="h-[600px] pr-4">
                                                                <div className="space-y-6">
                                                                    {quizContent.map((quiz, index) => (
                                                                        <Card key={quiz.quiz_id} className="border-l-4 border-l-blue-500">
                                                                            <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
                                                                                <CardTitle className="flex items-center gap-2">
                                                                                    <HelpCircle className="h-5 w-5 text-blue-500" />
                                                                                    <span className="text-lg font-medium">
                                                                                        Quiz {index + 1}
                                                                                    </span>
                                                                                </CardTitle>
                                                                            </CardHeader>
                                                                            <CardContent>
                                                                                {quiz.questions?.length > 0 ? (
                                                                                    <div className="space-y-8">
                                                                                        {quiz.questions.map((question, qIndex) => (
                                                                                            <div key={question.question_id} className="space-y-4">
                                                                                                <div className="flex gap-3">
                                                                                                    <Badge variant="outline" className="h-6 px-2 font-medium">
                                                                                                        Q{qIndex + 1}
                                                                                                    </Badge>
                                                                                                    <div className="flex-1">
                                                                                                        <h3 className="font-medium text-gray-700">
                                                                                                            {question.question || 'Không có câu hỏi'}
                                                                                                        </h3>
                                                                                                        <p className="text-sm text-gray-500">
                                                                                                            Loại: {question.question_type === 'single_choice' ? 'Một đáp án' :
                                                                                                                question.question_type === 'mutiple_choice' ? 'Nhiều đáp án' :
                                                                                                                    question.question_type === 'true_false' ? 'Đúng/Sai' :
                                                                                                                        'Không xác định'}
                                                                                                        </p>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="ml-9 space-y-3">
                                                                                                    {question.options?.map((option) => (
                                                                                                        <div
                                                                                                            key={option.option_id}
                                                                                                            className={`flex items-center p-3 rounded-lg border transition-all ${option.is_correct === 1
                                                                                                                ? "bg-green-50 border-green-200"
                                                                                                                : "border-gray-200"
                                                                                                                }`}
                                                                                                        >
                                                                                                            <RadioGroup defaultValue={option.is_correct === 1 ? "correct" : ""}>
                                                                                                                <div className="flex items-center space-x-3 w-full">
                                                                                                                    <RadioGroupItem value="correct" disabled />
                                                                                                                    <Label className="flex-1 cursor-pointer">
                                                                                                                        {option.answer || 'Không có lựa chọn'}
                                                                                                                    </Label>
                                                                                                                    {option.is_correct === 1 && (
                                                                                                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                                                                                                    )}
                                                                                                                </div>
                                                                                                            </RadioGroup>
                                                                                                        </div>
                                                                                                    ))}
                                                                                                </div>
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="text-center py-8">
                                                                                        <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                                                                        <p className="text-gray-500">Không có câu hỏi nào.</p>
                                                                                    </div>
                                                                                )}
                                                                            </CardContent>
                                                                        </Card>
                                                                    ))}
                                                                    {!quizContent.length && (
                                                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                                                            <ClipboardX className="h-12 w-12 text-gray-400 mb-4" />
                                                                            <p className="text-lg font-medium text-gray-900">Không có Quiz</p>
                                                                            <p className="text-gray-500">Chưa có câu hỏi quiz nào được thêm vào.</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </ScrollArea>
                                                        </TabsContent>
                                                    </Tabs>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                                    <FileQuestion className="h-12 w-12 text-gray-400 mb-4" />
                                                    <p className="text-lg font-medium text-gray-900">Chưa chọn khóa học</p>
                                                    <p className="text-gray-500">Vui lòng chọn một khóa học để xem chi tiết.</p>
                                                </div>
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
                                                            {/* Phần điểm khóa học */}
                                                            <div className="bg-purple-100 p-4 rounded-lg mb-4">
                                                                <h4 className="font-medium text-purple-700 mb-3">Điểm khóa học:</h4>
                                                                <div className="space-y-2">
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
                                                                            <span className="text-gray-700 font-bold">Tổng điểm khóa học:</span>
                                                                            <span className="font-semibold text-purple-700">{scores.finalScore}/50</span>
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Phần điểm nội dung và quiz */}
                                                            <div className="bg-blue-100 p-4 rounded-lg">
                                                                <h4 className="font-medium text-blue-700 mb-3">Điểm nội dung và Quiz:</h4>
                                                                <div className="bg-blue-50 p-3 rounded-lg space-y-2">
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-gray-700">Điểm nội dung:</span>
                                                                        <span className="font-semibold text-blue-700">
                                                                            {scores.contentScores?.averageScore?.toFixed(1) || '0'}/40
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-gray-700">Điểm quiz:</span>
                                                                        <span className="font-semibold text-blue-700">
                                                                            {scores.contentScores?.averageQuizScore?.toFixed(1) || '0'}/25
                                                                        </span>
                                                                    </div>
                                                                    <div className="border-t border-blue-200 my-2"></div>
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-gray-700 font-bold">Tổng điểm:</span>
                                                                        <span className="font-semibold text-blue-700">
                                                                            {((scores.contentScores?.averageScore || 0) + (scores.contentScores?.averageQuizScore || 0)).toFixed(1)}/65
                                                                        </span>
                                                                    </div>
                                                                    <div className={`p-2 rounded ${scores.contentScores?.isPass ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                                                        <p className="text-center font-medium">
                                                                            {scores.contentScores?.averageScore >= 30 ? (
                                                                                <span>✅ Nội dung và Quiz đạt yêu cầu</span>
                                                                            ) : (
                                                                                <span>❌ Nội dung và Quiz cần cải thiện</span>
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Trạng thái chung */}
                                                            <div className={`p-3 rounded-lg ${scores.isOverallPass ? 'bg-green-50' : 'bg-red-50'}`}>
                                                                <p className="flex items-center justify-center">
                                                                    <span className={`font-medium ${scores.isOverallPass ? 'text-green-600' : 'text-red-600'}`}>
                                                                        {scores.finalScore >= 35 && ((scores.contentScores?.averageScore || 0) + (scores.contentScores?.averageQuizScore || 0)) >= 40
                                                                            ? '✅ Khóa học đạt yêu cầu tổng thể'
                                                                            : '❌ Không đạt yêu cầu'}
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Cột bên phải - Chi tiết đánh giá */}
                                                        <div className="w-2/3 bg-gray-50 p-4 rounded-lg">
                                                            <h4 className="font-medium text-gray-700 mb-4">Chi tiết đánh giá khóa học:</h4>

                                                            {/* Phần đánh giá khóa học */}
                                                            <div className="mb-6">
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

                                                            {/* Phần đánh giá nội dung - Collapsible */}
                                                            <Collapsible>
                                                                <CollapsibleTrigger className="flex items-center gap-2 w-full p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                                                    <ChevronRight className="w-4 h-4" />
                                                                    <span className="font-medium text-gray-700">Chi tiết đánh giá nội dung</span>
                                                                    <span className="ml-auto text-sm text-gray-500">
                                                                        ({contentLesson?.length || 0} bài học)
                                                                    </span>
                                                                </CollapsibleTrigger>
                                                                <CollapsibleContent className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                                                                    {contentLesson?.map((content, index) => {
                                                                        const score = scores.contentScores?.details?.[index];
                                                                        return (
                                                                            <div key={index} className="bg-white p-3 rounded-lg">
                                                                                <div className="flex flex-col gap-2">
                                                                                    <div className="flex items-center justify-between">
                                                                                        <div className="flex items-center">
                                                                                            <span className="font-medium mr-2">{index + 1}.</span>
                                                                                            <span className="font-medium">{content.name_content}</span>
                                                                                        </div>
                                                                                        <span className={`ml-4 px-2 py-1 rounded ${score?.totalScore >= 40 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                                                                            }`}>
                                                                                            {score?.totalScore?.toFixed(1)}/65
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="grid grid-cols-3 gap-2 text-sm">
                                                                                        <span className="text-gray-600">
                                                                                            Nội dung: <span className="font-medium">{score?.contentScore}/40</span>
                                                                                        </span>
                                                                                        <span className="text-gray-600">
                                                                                            Quiz: <span className="font-medium">{score?.quizScore}/25</span>
                                                                                        </span>
                                                                                    </div>
                                                                                    {/* Reasons */}
                                                                                    <div className="text-sm text-gray-600">
                                                                                        {score?.quizReason && (
                                                                                            <p>📋 Quiz: {score.quizReason}</p>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </CollapsibleContent>
                                                            </Collapsible>
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
                                                    <AlertDialogTitle onClick={handleApprove} className="text-2xl font-bold text-gray-800 text-center">
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
                                                    <AlertDialogAction onClick={handleApprove} className="px-6 py-2 rounded-xl bg-green-600 hover:bg-emerald-600 text-white transition-all hover:shadow-lg hover:-translate-y-0.5">
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
                                                    <Button onClick={handleEditRequest}
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
                                                    <AlertDialogAction onClick={handleReject} className="px-6 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium transition-all hover:shadow-lg hover:-translate-y-0.5">
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
