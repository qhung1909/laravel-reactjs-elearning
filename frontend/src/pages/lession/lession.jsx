import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import ReactPlayer from "react-player";
import axios from "axios";
import { format } from "date-fns";
import { Play, BookOpen, Clock, Video, ArrowRight, Lock, PlayCircle, BookOpenCheck, Loader2, CheckCircle, XCircle, MessageCircle, MessageSquare, ChevronLeft, Bell, X, Menu, FileCheck, GraduationCap, Trophy, Gamepad2, Gift, CircleCheck, ChartBar, BarChart, School, Book, CalendarDays } from 'lucide-react';
import Quizzes from "../quizzes/quizzes";
import { UserContext } from "../context/usercontext";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { formatDateNoTime } from "@/components/FormatDay/Formatday";
import { Calendar } from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;
const GPT_KEY = import.meta.env.VITE_GPT_KEY;
export const Lesson = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [lesson, setLesson] = useState(null);
    const { slug } = useParams();
    const [timeoutId, setTimeoutId] = useState(null);


    const [videoCompleted, setVideoCompleted] = useState({});
    const [documentCompleted, setDocumentCompleted] = useState({});
    const [completedVideosInContent, setCompletedVideosInContent] = useState({});

    //respon
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showMiniGame, setShowMiniGame] = useState(false);
    //fetchLesson
    const fetchLesson = async () => {
        if (!slug) return;

        try {
            const token = localStorage.getItem("access_token");
            if (!token) {
                toast.error("Bạn chưa đăng nhập.");
                navigate('/');
                return;
            }
            const res = await axios.get(`${API_URL}/lessons/${slug}`, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                },
            });

            if (res.data) {
                setLesson(res.data);
                if (!user?.user_id) {
                    toast.error("Không tìm thấy thông tin người dùng.");
                    navigate('/');
                    return;
                }
                // Đảm bảo có course_id trước khi kiểm tra payment
                if (res.data.course_id) {
                    await checkPaymentCourse(user.user_id, res.data.course_id);

                    //hàm gọi để truyền course_id
                    fetchContentLesson(res.data.course_id);
                    const CourseMiniGame = courses.find(course => course.course_id === res.data.course_id);
                    if (CourseMiniGame && parseFloat(CourseMiniGame.price_discount) >= 1500000) {
                        setShowMiniGame(true);
                    }
                } else {
                    console.error("Không tìm thấy course_id của bài học");
                }
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu bài học:", error);
        }
    };
    useEffect(() => {
        if (user?.user_id) {
            fetchLesson();
        }
    }, [slug, navigate, user]);

    const [isPaymentCourse, setPaymentCourse] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const checkPaymentCourse = async (user_id, courseId) => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            toast.error("Bạn chưa đăng nhập.");
            navigate('/');
            return;
        }
        try {
            const res = await axios.get(`${API_URL}/userCourses/${user_id}`, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                },
            });

            if (Array.isArray(res.data)) {
                const isPaymented = res.data.some(
                    (course) => course.course_id === courseId
                );
                setPaymentCourse(isPaymented);

                if (!isPaymented) {
                    toast.error("Bạn chưa mua khóa học này!");
                    navigate('/');
                }
            } else {
                console.error("Dữ liệu không phải là mảng:", res.data);
                navigate('/');
            }
        } catch (error) {
            console.error("Lỗi khi kiểm tra thanh toán:", error);
            if (error.response) {
                console.error("Chi tiết lỗi:", error.response.data);
            }
            navigate('/');
        } finally {
            setIsLoading(false);
        }
    };


    // Hàm format ngày tháng
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) return "Ngày không hợp lệ";
        return format(date, "dd/MM/yyyy - HH:mm a");
    };

    const [quizzes, setQuizzes] = useState();
    const fetchQuizzes = async () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            console.error("Người dùng chưa đăng nhập.");
            return;
        }
        try {
            const res = await axios.get(`${API_URL}/quizzes`, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                }
            });
            if (res.data) {
                setQuizzes(res.data);
            } else {
                console.error(res.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy quizzes:", error);
        }
    }
    useEffect(() => {
        fetchQuizzes();
    }, [])

    const [courses, setCourses] = useState([]);
    const fetchCourses = async () => {
        try {
            const response = await axios.get(`${API_URL}/courses`, {
                headers: {
                    'x-api-secret': `${API_KEY}`,
                },
            });

            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                setCourses(response.data);
            }
        } catch (error) {
            console.log('Error fetching categories', error);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);


    const [contentLesson, setContentLesson] = useState([]);
    const fetchContentLesson = async (courseId) => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            toast.error("Bạn chưa đăng nhập.");
            navigate('/');
            return;
        }
        try {
            const res = await axios.get(`${API_URL}/contents`, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    course_id: courseId
                }
            });
            if (res.data && res.data.success && Array.isArray(res.data.data)) {
                setContentLesson(res.data.data.filter(content => content.course_id === courseId));
            } else {
                console.error("Dữ liệu không phải là mảng:", res.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy nội dung bài học:", error);
        }
    };


    const [titleContent, setTitleContent] = useState([]);
    const fetchTitleContent = async (contentId) => {
        const token = localStorage.getItem("access_token");
        try {
            const res = await axios.get(`${API_URL}/title-contents/${contentId}`, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.data && res.data.success) {
                setTitleContent(prev => ({ ...prev, [contentId]: res.data.data }));
            } else {
                console.error("Dữ liệu không hợp lệ:", res.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết title_content:", error);
        }
    };

    useEffect(() => {
        fetchContentLesson();
    }, []);


    // Sắp xếp content theo content_id
    const sortedContent = contentLesson.sort(
        (a, b) => a.content_id - b.content_id
    );

    const [currentVideoUrl, setCurrentVideoUrl] = useState(null);
    const [activeItem, setActiveItem] = useState({ contentId: null, index: null });

    const [showQuiz, setShowQuiz] = useState(false);
    const [currentQuizId, setCurrentQuizId] = useState(null);

    const handleShowQuiz = (content_id) => {
        const quiz = quizzes.find(quiz => quiz.content_id === content_id);
        if (quiz) {
            setCurrentQuizId(quiz.quiz_id);
            setShowQuiz(true);
        } else {
            console.error("Quiz not found for content_id:", content_id);
            toast.error("Chưa có bài tập cho nội dung này.");
        }
    };



    //Progress
    const [completedLessons, setCompletedLessons] = useState(new Set());
    const [completedVideosInSection, setCompletedVideosInSection] = useState({});
    const [completedDocumentsInContent, setCompletedDocumentsInContent] = useState({});
    const [videoProgress, setVideoProgress] = useState({});
    const [videoDurations, setVideoDurations] = useState({});
    const [progressData, setProgressData] = useState([]);
    const [quizStatus, setQuizStatus] = useState({});
    const playerRef = useRef();
    const [currentBodyContent, setCurrentBodyContent] = useState(null);
    // Xử lí khi click video
    const handleVideoClick = (item, contentId, index) => {
        // Lưu state cũ trước khi chuyển video
        const currentProgress = videoProgress[item.title_content_id];

        setCurrentVideoUrl(item.video_link);
        setActiveItem({ contentId, index });

        // Chỉ gọi fetchTitleContent nếu chưa có data
        if (!titleContent[contentId]) {
            fetchTitleContent(contentId);
        }

        // Cập nhật body content
        const bodyContent = titleContent[contentId][index];
        setCurrentBodyContent(bodyContent);

        // Đảm bảo giữ lại trạng thái watched của video hiện tại
        if (currentProgress) {
            setVideoProgress(prev => ({
                ...prev,
                [item.title_content_id]: currentProgress
            }));

            setCompletedVideosInContent(prev => ({
                ...prev,
                [contentId]: {
                    ...(prev[contentId] || {}),
                    [item.title_content_id]: currentProgress
                }
            }));
        }
    };
    // Tính toán progress
    const calculateProgress = () => {
        const totalLessons = contentLesson.length;
        const completedCount = completedLessons.size;
        return totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;
    };

    // Xử lí check quiz
    const checkQuizCompletion = async (contentId) => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.get(`${API_URL}/quiz/check-completion`, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                },
                params: { content_id: contentId }
            });

            // Cập nhật quizStatus
            setQuizStatus(prev => ({
                ...prev,
                [contentId]: {
                    hasQuiz: response.data.has_quiz,
                    isCompleted: response.data.quiz_completed
                }
            }));

            return {
                hasQuiz: response.data.has_quiz,
                quizCompleted: response.data.quiz_completed
            };
        } catch (error) {
            console.error("Lỗi kiểm tra quiz:", error);
            return { hasQuiz: false, quizCompleted: false };
        }
    };
    const handleQuizComplete = async (contentId) => {
        try {
            await fetchProgress();
            await checkQuizCompletion(contentId);
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái quiz:", error);
        }
    };
    // Cập nhật progress lên server
    const updateProgress = async (contentId) => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            toast.error("Bạn chưa đăng nhập.");
            navigate('/');
            return;
        }

        try {
            const courseId = lesson.course_id;
            const progressPercent = calculateProgress();

            const response = await axios.post(`${API_URL}/progress/complete-content`, {
                user_id: user.user_id,
                content_id: contentId,
                course_id: courseId,
                is_complete: true,
                complete_at: new Date().toISOString(),
                progress_percent: progressPercent,
            }, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                },
            });
            // Xử lý các trạng thái từ server
            switch (response.data.message) {
                case 'Quiz not completed':
                    toast.error("Hãy hoàn thành bài trắc nghiệm nửa bạn nhé !");
                    throw new Error('Quiz not completed');

                case 'Course completed, certificate generated':
                    toast.success("🎉 Chúc mừng bạn đã hoàn thành khóa học! Chứng chỉ sẽ được gửi đến email của bạn trong giây lát.");
                    break;

            }

            return response.data;
        } catch (error) {
            console.error("Lỗi khi cập nhật tiến độ:", error);
            throw error;
        }
    };
    // Xử lí video
    const handleVideoComplete = async (contentId, index, titleContentId) => {
        // Chỉ xử lý nếu video này chưa được đánh dấu là đã hoàn thành
        if (!videoProgress[titleContentId]) {
            try {
                // Lấy tất cả video và document trong section hiện tại
                const allVideosInSection = titleContent[contentId]?.filter(item => item.video_link) || [];
                const allDocumentsInSection = titleContent[contentId]?.filter(item => item.document_link) || [];

                // Cập nhật trạng thái local cho video hiện tại
                setVideoProgress(prev => ({
                    ...prev,
                    [titleContentId]: true
                }));

                // Cập nhật danh sách video đã hoàn thành trong content
                setCompletedVideosInContent(prev => ({
                    ...prev,
                    [contentId]: {
                        ...(prev[contentId] || {}),
                        [titleContentId]: true
                    }
                }));

                // Kiểm tra tất cả video đã hoàn thành chưa
                const updatedCompletedVideos = {
                    ...(completedVideosInContent[contentId] || {}),
                    [titleContentId]: true
                };

                const allVideosCompleted = allVideosInSection.every(video =>
                    updatedCompletedVideos[video.title_content_id]
                );

                // Kiểm tra document completion
                const hasDocument = allDocumentsInSection.length > 0;
                let allDocumentsCompleted = false;

                if (hasDocument) {
                    allDocumentsCompleted = allDocumentsInSection.every(doc =>
                        completedDocumentsInContent[contentId]?.[doc.title_content_id]
                    );
                }

                // Nếu tất cả video đã hoàn thành VÀ (không có document HOẶC đã hoàn thành tất cả document)
                if (allVideosCompleted && (hasDocument ? allDocumentsCompleted : true)) {
                    const token = localStorage.getItem("access_token");

                    // Gọi API cập nhật video
                    await axios.post(
                        `${API_URL}/progress/complete-video`,
                        {
                            content_id: contentId,
                            course_id: lesson.course_id,
                        },
                        {
                            headers: {
                                "x-api-secret": `${API_KEY}`,
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    setVideoCompleted(prev => ({
                        ...prev,
                        [contentId]: true
                    }));

                    // Nếu có document và tất cả đã hoàn thành, gọi API cập nhật document
                    if (hasDocument && allDocumentsCompleted && !documentCompleted[contentId]) {
                        await axios.post(
                            `${API_URL}/progress/complete-document`,
                            {
                                content_id: contentId,
                                course_id: lesson.course_id,
                            },
                            {
                                headers: {
                                    "x-api-secret": `${API_KEY}`,
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                        setDocumentCompleted(prev => ({
                            ...prev,
                            [contentId]: true
                        }));
                    }

                    // Cập nhật tiến độ tổng thể
                    await updateProgress(contentId);
                    await fetchProgress();
                }

            } catch (error) {
                console.error("Lỗi khi cập nhật video progress:", error);
            }
        }
    };
    // Xử lí document
    const handleDocumentClick = async (contentId, titleContentId) => {
        try {
            // Cập nhật trạng thái local cho document hiện tại
            setCompletedDocumentsInContent(prev => ({
                ...prev,
                [contentId]: {
                    ...(prev[contentId] || {}),
                    [titleContentId]: true
                }
            }));

            // Lấy tất cả document và video trong section hiện tại
            const allDocumentsInSection = titleContent[contentId]?.filter(item => item.document_link) || [];
            const allVideosInSection = titleContent[contentId]?.filter(item => item.video_link) || [];

            // Kiểm tra tất cả document đã hoàn thành chưa
            const updatedCompletedDocuments = {
                ...(completedDocumentsInContent[contentId] || {}),
                [titleContentId]: true
            };

            const allDocumentsCompleted = allDocumentsInSection.every(doc =>
                updatedCompletedDocuments[doc.title_content_id]
            );

            // Kiểm tra video completion
            const hasVideo = allVideosInSection.length > 0;
            let allVideosCompleted = false;

            if (hasVideo) {
                allVideosCompleted = allVideosInSection.every(video =>
                    completedVideosInContent[contentId]?.[video.title_content_id]
                );
            }

            // Nếu không có video hoặc đã xem hết video VÀ đã hoàn thành tất cả document
            if ((hasVideo ? allVideosCompleted : true) && allDocumentsCompleted) {
                const token = localStorage.getItem("access_token");

                // Gọi API cập nhật document
                await axios.post(
                    `${API_URL}/progress/complete-document`,
                    {
                        content_id: contentId,
                        course_id: lesson.course_id,
                    },
                    {
                        headers: {
                            "x-api-secret": `${API_KEY}`,
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                // Cập nhật state document completed
                setDocumentCompleted(prev => ({
                    ...prev,
                    [contentId]: true
                }));

                // Nếu có video và tất cả đã hoàn thành, gọi API cập nhật video
                if (hasVideo && allVideosCompleted && !videoCompleted[contentId]) {
                    await axios.post(
                        `${API_URL}/progress/complete-video`,
                        {
                            content_id: contentId,
                            course_id: lesson.course_id,
                        },
                        {
                            headers: {
                                "x-api-secret": `${API_KEY}`,
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    setVideoCompleted(prev => ({
                        ...prev,
                        [contentId]: true
                    }));
                }

                // Cập nhật tiến độ tổng thể
                await updateProgress(contentId);
                await fetchProgress();
            }

        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái document:", error);
        }
    };
    // Xử lý progress của video
    const handleProgress = (progress, titleContentId, index, contentId) => {
        const { playedSeconds } = progress;
        const duration = videoDurations[titleContentId] || playerRef.current.getDuration();

        if (duration) {
            const playedPercentage = (playedSeconds / duration) * 100;

            // Cập nhật duration nếu chưa có
            if (!videoDurations[titleContentId]) {
                setVideoDurations(prev => ({
                    ...prev,
                    [titleContentId]: duration
                }));
            }

            // Đánh dấu hoàn thành khi video đạt 70%
            if (playedPercentage >= 70 && !videoProgress[titleContentId]) {
                handleVideoComplete(contentId, index, titleContentId);
            }
        }
    };

    useEffect(() => {
        if (progressData.length > 0) {
            const updatedCompletedLessons = new Set();
            const updatedCompletedVideos = {};
            const updatedVideoProgress = {};
            const updatedVideoCompleted = {};
            const updatedDocumentCompleted = {};
            const updatedCompletedVideosInContent = {};
            const updatedCompletedDocumentsInContent = {};

            progressData.forEach((progress) => {
                // Xử lý video đã hoàn thành
                if (progress.video_completed === 1) {
                    if (titleContent[progress.content_id]) {
                        titleContent[progress.content_id].forEach(title => {
                            updatedVideoProgress[title.title_content_id] = true;
                            if (!updatedCompletedVideosInContent[progress.content_id]) {
                                updatedCompletedVideosInContent[progress.content_id] = {};
                            }
                            updatedCompletedVideosInContent[progress.content_id][title.title_content_id] = true;
                        });
                        updatedVideoCompleted[progress.content_id] = true;
                    }
                }

                if (progress.document_completed === 1) {
                    if (titleContent[progress.content_id]) {
                        titleContent[progress.content_id]
                            .filter(item => item.document_link)
                            .forEach(doc => {
                                if (!updatedCompletedDocumentsInContent[progress.content_id]) {
                                    updatedCompletedDocumentsInContent[progress.content_id] = {};
                                }
                                updatedCompletedDocumentsInContent[progress.content_id][doc.title_content_id] = true;
                            });
                        updatedDocumentCompleted[progress.content_id] = true;
                    }
                }

                if (progress.is_complete) {
                    updatedCompletedLessons.add(progress.content_id);
                    updatedCompletedVideos[progress.content_id] = true;
                }
            });

            setCompletedLessons(updatedCompletedLessons);
            setCompletedVideosInSection(updatedCompletedVideos);
            setVideoProgress(updatedVideoProgress);
            setVideoCompleted(updatedVideoCompleted);
            setDocumentCompleted(updatedDocumentCompleted);
            setCompletedVideosInContent(updatedCompletedVideosInContent);
            setCompletedDocumentsInContent(updatedCompletedDocumentsInContent);

            // Check quiz status cho mỗi content có quiz
            contentLesson.forEach(async (content) => {
                if (content.quiz_id) {
                    await checkQuizCompletion(content.content_id);
                }
            });
        }
    }, [progressData, titleContent]);
    // Fetch progress
    const fetchProgress = async () => {
        try {
            const token = localStorage.getItem("access_token");
            if (!token) {
                console.error("Chưa có token");
                return;
            }

            const res = await axios.get(`${API_URL}/progress`, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.data) {
                const userProgress = res.data.filter(
                    (progress) => progress.user_id === user.user_id && progress.course_id === lesson.course_id
                );
                setProgressData(userProgress);
            }
        } catch (error) {
            console.error("Lỗi khi gọi API tiến độ:", error);
        }
    };

    useEffect(() => {
        if (user && lesson) {
            fetchProgress();
        }
    }, [user, lesson]);


    useEffect(() => {
        const checkAllQuizStatus = async () => {
            for (const content of contentLesson) {
                if (content.quiz_id) {
                    try {
                        await checkQuizCompletion(content.content_id);
                    } catch (error) {
                        console.error(`Lỗi kiểm tra quiz cho content ${content.content_id}:`, error);
                    }
                }
            }
        };

        if (contentLesson.length > 0) {
            checkAllQuizStatus();
        }
    }, [contentLesson]);


    //celendar
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const lastStudyDate = progressData.length > 0 ? new Date(progressData[0].updated_at) : null;
    const handleDateChange = (date) => {
        setSelectedDate(date);
        setIsCalendarOpen(false); // Đóng lịch sau khi chọn ngày
    };

    //OpenAi
    const [userMessage, setUserMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([
        { role: 'system', content: 'Tôi có thể giúp gì cho bạn.' },
    ]);
    const sendMessageToChatGPT = async (message) => {
        try {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-3.5-turbo',
                messages: [...chatHistory, { role: 'user', content: message }],
            }, {
                headers: {
                    Authorization: `Bearer ${GPT_KEY}`,
                    'Content-Type': 'application/json',
                },
            });

            const botResponse = response.data.choices[0].message.content;

            // Cập nhật lại lịch sử trò chuyện
            setChatHistory([
                ...chatHistory,
                { role: 'user', content: message },
                { role: 'assistant', content: botResponse },
            ]);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSendMessage = () => {
        if (userMessage.trim()) {
            sendMessageToChatGPT(userMessage);
            setUserMessage('');
        }
    };


    //MiniGame - Câu Đố Kiến Thức
    const [answer, setAnswer] = useState('');
    const [isCorrect, setIsCorrect] = useState(null);
    const [voucher, setVoucher] = useState([]);
    const [randomVoucher, setRandomVoucher] = useState(null);

    const correctAnswer = 'HyperText Markup Language';

    const fetchCoupons = async () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            console.error("Người dùng chưa đăng nhập.");
            return;
        }

        try {
            const res = await axios.get(`${API_URL}/coupons`, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.data) {
                const currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0);

                const oneWeekLater = new Date(currentDate);
                oneWeekLater.setDate(currentDate.getDate() + 3); // 3 days

                const validCoupons = res.data.filter(coupon => {
                    const endDate = new Date(coupon.end_discount);
                    endDate.setHours(0, 0, 0, 0);
                    return endDate >= currentDate &&
                        endDate <= oneWeekLater &&
                        coupon.discount_price <= 100000; // 100k
                });
                if (validCoupons.length > 0) {
                    setVoucher(validCoupons);
                }
            } else {
                console.error("Không có dữ liệu trả về:", res.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy coupon:", error);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleInputChange = (e) => {
        setAnswer(e.target.value);
        setIsCorrect(null);
    };

    const handleSubmitGame = () => {
        // Kiểm tra câu trả lời khi nhấn nút
        if (answer.trim().toLowerCase() === correctAnswer.toLowerCase()) {
            setIsCorrect(true);

            // Random voucher từ danh sách coupon hợp lệ
            if (voucher.length > 0) {
                const randomCoupon = voucher[Math.floor(Math.random() * voucher.length)];
                setRandomVoucher(randomCoupon.name_coupon); // Lưu voucher được chọn
            }
        } else {
            setIsCorrect(false);
        }
    };
    return (
        <>
            <body className="bg-gray-100">
                <nav className="bg-gradient-to-r from-gray-900 to-gray-800 fixed z-20 w-full">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Desktop Navigation */}
                        <div className="flex items-center justify-between h-16 md:h-20">
                            {/* Left Section */}
                            <div className="flex items-center space-x-4">
                                <Link
                                    to={`/detail/${slug}`}
                                    className="p-2 md:p-2.5 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105"
                                >
                                    <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-gray-100" />
                                </Link>
                            </div>

                            {/* Center Section */}
                            <div className="hidden md:flex items-center flex-1 justify-center space-x-6">
                                <Link to="/" className="flex items-center group">
                                    <div className="relative">
                                        <img
                                            alt="Logo"
                                            className="w-10 h-10 md:w-14 md:h-14 object-contain transform transition-all duration-300 group-hover:scale-110"
                                            src="/src/assets/images/antlearn.png"
                                        />
                                        <div className="absolute -inset-1 bg-white/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300 opacity-0 group-hover:opacity-100" />
                                    </div>
                                </Link>
                                <div className="flex flex-col items-center">
                                    <h1 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px] lg:max-w-[500px]">
                                        {lesson ? lesson.name : "Đang tải..."}
                                    </h1>
                                </div>
                            </div>

                            {/* Mobile Center */}
                            <div className="flex md:hidden items-center">
                                <Link to="/" className="flex items-center">
                                    <img
                                        alt="Logo"
                                        className="w-8 h-8 object-contain"
                                        src="/src/assets/images/antlearn.png"
                                    />
                                </Link>
                                <h1 className="ml-3 text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white truncate max-w-[150px]">
                                    {lesson ? lesson.name : "Đang tải..."}
                                </h1>
                            </div>

                            {/* Right Section - Desktop */}
                            <div className="hidden md:flex items-center space-x-6 relative">
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                                        className="p-2 md:p-3 bg-gray-600 rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                                    >
                                        <CalendarDays className="h-4 w-4 md:h-5 md:w-5 text-white" />
                                    </button>

                                    {/* Trigger mở Sheet chat */}
                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <button className="p-2 md:p-3 bg-gray-600 rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                                                <MessageCircle className="h-4 w-4 md:h-5 md:w-5 text-white" />
                                            </button>
                                        </SheetTrigger>

                                        <SheetContent
                                            side="right"
                                            className="w-full md:w-80 h-full md:h-auto p-4 bg-gray-900 text-white rounded-t-2xl md:rounded-l-2xl shadow-2xl md:fixed md:top-0 md:right-0"
                                        >
                                            <h2 className="text-lg font-semibold mb-1">Chat với AI</h2>
                                            <p className="text-sm mb-4 text-gray-400">Nhập tin nhắn để bắt đầu cuộc trò chuyện.</p>

                                            <div className="overflow-auto h-[70%] mb-4 border border-gray-700 rounded-lg p-3 bg-gray-800">
                                                <div className="p-2 space-y-2 text-sm">
                                                    {chatHistory.map((message, index) => (
                                                        <p key={index} className={message.role === 'user' ? 'text-blue-400' : 'text-green-400'}>
                                                            <strong>{message.role === 'user' ? 'Bạn' : 'Bot'}:</strong> {message.content}
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="text"
                                                    value={userMessage}
                                                    onChange={(e) => setUserMessage(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleSendMessage();
                                                        }
                                                    }}
                                                    placeholder="Nhập tin nhắn của bạn..."
                                                    className="flex-grow p-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-500"
                                                />
                                                <Button
                                                    onClick={handleSendMessage}
                                                    className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg px-4 py-2"
                                                >
                                                    Gửi
                                                </Button>
                                            </div>
                                        </SheetContent>
                                    </Sheet>
                                </div>

                                {/* Hiển thị lịch nếu isCalendarOpen là true */}
                                {isCalendarOpen && (
                                    <div className="absolute right-0 mt-[415px] bg-white p-4 rounded-lg shadow-lg border border-gray-300 z-50 overflow-x-hidden">
                                        <Calendar
                                            onChange={handleDateChange}
                                            value={selectedDate}
                                            tileClassName={({ date, view }) => {
                                                return lastStudyDate && date.toDateString() === lastStudyDate.toDateString()
                                                    ? 'bg-blue-200 text-blue-600 font-bold'
                                                    : null;
                                            }}
                                            className="rounded-lg shadow-md"
                                        />
                                        {/* Chú thích cho ngày học gần nhất */}
                                        {lastStudyDate && (
                                            <div className="mt-2 text-sm text-gray-600 text-center flex items-center justify-center">
                                                <div className="inline-block w-5 h-5 bg-blue-200 mr-2 rounded"></div>
                                                <span>Ngày học gần nhất</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Mobile Menu Button */}
                            <div className="flex md:hidden">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-all duration-300"
                                >
                                    {isMenuOpen ? (
                                        <X className="h-5 w-5 text-white" />
                                    ) : (
                                        <Menu className="h-5 w-5 text-white" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Mobile Menu */}
                        {isMenuOpen && (
                            <div className="md:hidden bg-gray-800 rounded-b-lg shadow-lg">
                                <div className="px-4 pt-2 pb-4 space-y-3">
                                    {progressData.length > 0 && (
                                        <div className="px-3 py-2 bg-gray-700/50 rounded-lg">
                                            <span className="text-xs text-gray-300">
                                                Lần học gần nhất:{' '}
                                                <span className="text-blue-300 font-medium">
                                                    {formatDate(progressData[0].updated_at)}
                                                </span>
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-center space-x-3">
                                        <Sheet>
                                            <SheetTrigger asChild>
                                                <button className="p-2 md:p-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                                                    <MessageCircle className="h-4 w-4 md:h-5 md:w-5 text-white" />
                                                </button>
                                            </SheetTrigger>

                                            <SheetContent
                                                side="right"
                                                className="w-80 md:w-80 h-full md:h-auto p-4 bg-gray-900 text-white rounded-t-2xl md:rounded-l-2xl shadow-2xl md:fixed md:top-0 md:right-0"
                                            >
                                                <h2 className="text-lg font-semibold mb-1">Chat với AI</h2>
                                                <p className="text-sm mb-4 text-gray-400">Nhập tin nhắn để bắt đầu cuộc trò chuyện.</p>

                                                <div className="overflow-auto h-[60vh] md:h-[70%] mb-4 border border-gray-700 rounded-lg p-3 bg-gray-800">
                                                    <div className="p-2 space-y-2 text-sm">
                                                        {chatHistory.map((message, index) => (
                                                            <p key={index} className={message.role === 'user' ? 'text-blue-400' : 'text-green-400'}>
                                                                <strong>{message.role === 'user' ? 'Bạn' : 'Bot'}:</strong> {message.content}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="text"
                                                        value={userMessage}
                                                        onChange={(e) => setUserMessage(e.target.value)}
                                                        placeholder="Nhập tin nhắn của bạn..."
                                                        className="flex-grow p-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-500"
                                                    />
                                                    <Button
                                                        onClick={handleSendMessage}
                                                        className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg px-4 py-2"
                                                    >
                                                        Gửi
                                                    </Button>
                                                </div>
                                            </SheetContent>
                                        </Sheet>

                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </nav>


                <div className="content-main py-16">
                    <div className="flex flex-col md:flex-row lg:gap-5 md:gap-2 mt-1">
                        {/* left site - content chính */}
                        <div className="flex-1 bg-white rounded-lg shadow-md p-4">
                            {/* Phần video */}
                            <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden">
                                {currentVideoUrl ? (
                                    <ReactPlayer
                                        ref={playerRef}
                                        url={currentVideoUrl}
                                        className="absolute top-0 left-0 w-full h-full"
                                        controls={true}
                                        width="100%"
                                        height="100%"
                                        onProgress={(progress) => {
                                            const contentId = activeItem.contentId;
                                            const titleContentId = titleContent[contentId][activeItem.index].title_content_id;
                                            handleProgress(progress, titleContentId, activeItem.index, contentId);
                                        }}
                                    />
                                ) : (
                                    <img
                                        src="/src/assets/images/thumnail-lesson.jpeg"
                                        alt="Banner"
                                        className="absolute top-0 left-0 w-full h-full object-cover"
                                        style={{ borderRadius: "0.5rem" }}
                                    />
                                )}
                            </div>

                            {/* Bên dưới video: nội dung khóa học - */}
                            <div className="max-w-3xl mx-auto p-4">
                                {currentBodyContent ? (
                                    <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                                        <div className="p-6">
                                            {/* Title with Book Icon */}
                                            <div className="relative">
                                                <div className="absolute -left-6 top-0 bottom-0 w-0.5">
                                                    <div className="w-0.5 h-full bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 rounded-full"></div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                                        <svg
                                                            className="w-5 h-5 text-blue-500"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                                            />
                                                        </svg>
                                                    </span>
                                                    <h2 className="text-lg font-medium text-gray-800 leading-relaxed">
                                                        {currentBodyContent.body_content}
                                                    </h2>
                                                </div>
                                            </div>

                                            {/* Description with Info Icon */}
                                            {currentBodyContent.description && (
                                                <div className="mt-5 relative overflow-hidden">
                                                    <div className="relative bg-gray-50 rounded-lg p-4">
                                                        {/* Decorative elements */}
                                                        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50/30 rounded-full -mr-10 -mt-10"></div>
                                                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-50/20 rounded-full -ml-8 -mb-8"></div>

                                                        <div className="flex gap-3">
                                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100/50 flex items-center justify-center mt-0.5">
                                                                <svg
                                                                    className="w-4 h-4 text-blue-500"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                    />
                                                                </svg>
                                                            </span>
                                                            <p className="text-sm text-gray-600 leading-relaxed relative z-10">
                                                                {currentBodyContent.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Document Link with Enhanced Icon */}
                                            {currentBodyContent.document_link && (
                                                <div className="mt-6">
                                                    <a
                                                        href={currentBodyContent.document_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={() => handleDocumentClick(activeItem.contentId, currentBodyContent.title_content_id)}
                                                        className="group block p-4 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100
                    border-2 border-blue-200 rounded-xl transition-all duration-300 hover:shadow-lg"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-4">
                                                                {/* Icon container with pulsing effect */}
                                                                <div className="relative">
                                                                    <div className="absolute -inset-0.5 bg-blue-500/20 rounded-lg blur-sm group-hover:blur-md transition-all duration-300"></div>
                                                                    <span className="relative flex items-center justify-center w-12 h-12 rounded-lg bg-white shadow-md group-hover:shadow-lg transition-all duration-300">
                                                                        <svg
                                                                            className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform duration-300"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            viewBox="0 0 24 24"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth={2}
                                                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                                            />
                                                                        </svg>
                                                                    </span>
                                                                </div>

                                                                <div className="flex flex-col">
                                                                    <span className="text-base font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                                                                        Tài liệu đính kèm
                                                                    </span>
                                                                    <span className="text-sm text-gray-600 group-hover:text-gray-700">
                                                                        Nhấp vào để xem và hoàn thành bài học
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Arrow with animation */}
                                                            <div className="flex items-center">
                                                                <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                                                                    <svg
                                                                        className="w-5 h-5 text-blue-600 group-hover:translate-x-0.5 transition-transform duration-300"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="M9 5l7 7-7 7"
                                                                        />
                                                                    </svg>
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Progress indicator */}
                                                        <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                                                                style={{
                                                                    width: completedDocumentsInContent[activeItem.contentId]?.[currentBodyContent.title_content_id] ? '100%' : '0%',
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </a>
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                ) : (
                                    /* Loading State with Icon */
                                    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                                        <div className="relative">
                                            <div className="absolute -left-6 top-0 bottom-0 w-0.5">
                                                <div className="w-0.5 h-full bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 rounded-full"></div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                                    <svg
                                                        className="w-5 h-5 text-blue-500"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                                        />
                                                    </svg>
                                                </span>
                                                <h2 className="text-lg font-bold text-gray-800 uppercase ">
                                                    {lesson?.name || "Đang tải..."}
                                                </h2>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-500 text-sm pl-11 mt-2">
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                                <span>
                                                    Cập nhật ngày: {lesson ? formatDateNoTime(lesson.updated_at) : "Đang tải..."}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* Hiển thị quiz nếu đã bắt đầu, nằm bên trong div video */}
                            {currentQuizId && (
                                <Dialog open={showQuiz} onOpenChange={setShowQuiz}>
                                    <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] overflow-hidden flex flex-col">
                                        <DialogHeader>
                                            <DialogTitle>Bài tập</DialogTitle>
                                            <DialogDescription>
                                                Hoàn thành tất cả câu hỏi bên dưới
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="flex-1 overflow-y-auto pr-2">
                                            <Quizzes
                                                quiz_id={currentQuizId}
                                                contentId={activeItem.contentId}
                                                onClose={() => setShowQuiz(false)}
                                                onComplete={async () => {
                                                    setShowQuiz(false);

                                                    setQuizStatus(prev => ({
                                                        ...prev,
                                                        [activeItem.contentId]: {
                                                            hasQuiz: true,
                                                            completed: true
                                                        }
                                                    }));

                                                    const content = contentLesson.find(c => c.content_id === activeItem.contentId);
                                                    if (content) {
                                                        const hasDocument = titleContent[content.content_id]?.some(item => item.document_link);
                                                        const isVideoCompleted = videoCompleted[content.content_id];
                                                        const isDocumentCompleted = !hasDocument || documentCompleted[content.content_id];

                                                        if (isVideoCompleted && isDocumentCompleted) {
                                                            setCompletedLessons(prev => new Set([...prev, content.content_id]));
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>

                        {/* Phần nội dung khóa học - right site */}
                        <div className="xl:w-96 lg:w-80 md:w-72 bg-gray-50 rounded-lg shadow-md mt-8 md:mt-0">
                            {/* content */}
                            <div className="xl:w-96 lg:w-80 md:w-72 bg-gray-50 rounded-xl shadow-lg">
                                {/* Header */}
                                <div className="p-4 border-b border-gray-100">
                                    <div className="mb-5">
                                        <div className="flex items-center justify-between p-4 bg-white  ">
                                            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                                                <Book className="w-6 h-6 mr-3 text-purple-500" />
                                                <span>Nội dung bài học</span>
                                            </h3>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Badge variant="secondary" className="text-lg px-4 py-1 hover:bg-purple-100 transition-colors"> {/* Larger badge with hover effect */}
                                                            {contentLesson.length} phần
                                                        </Badge>
                                                    </TooltipTrigger>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </div>
                                    {/* Progress */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <BarChart className="w-5 h-5" />
                                                <span className="text-base">Tiến độ học tập</span>
                                            </div>
                                            <span className="font-medium text-base">{Math.round(calculateProgress())}%</span>
                                        </div>
                                        <Progress
                                            value={calculateProgress()}
                                            className="h-2 bg-gray-100"
                                        />
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        <div className="bg-violet-50 rounded-xl p-3 border border-violet-100 group hover:bg-violet-100 transition-colors">
                                            <div className="flex items-center text-purple-600 mb-1">
                                                <CircleCheck className="w-4 h-4 mr-2" />
                                                <span className="text-sm font-medium">Đã hoàn thành</span>
                                            </div>
                                            <p className="text-lg font-semibold text-gray-800 text-center">
                                                {completedLessons.size}/{contentLesson.length}
                                            </p>
                                        </div>
                                        {/* MiniGame */}
                                        {showMiniGame && (
                                            <div className="bg-violet-50 rounded-xl p-3 border border-violet-100 group hover:bg-violet-100 transition-colors">
                                                <div className="flex items-center text-violet-600 mb-1">
                                                    <Gamepad2 className="w-4 h-4 mr-2" />
                                                    <span className="text-sm font-medium">Mini Game</span>
                                                </div>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <button className="relative group">
                                                            <div className="relative flex items-center ml-10 px-4 py-2 bg-white rounded-lg">
                                                                <Gamepad2 className="w-6 h-6 text-purple-600 group-hover:animate-bounce" />
                                                            </div>
                                                        </button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-md">
                                                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-2xl">
                                                            <DialogTitle className="relative">
                                                                <div className="flex flex-col items-center space-y-4 mb-8">
                                                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                                                                        Câu Đố Kiến Thức
                                                                    </h2>
                                                                </div>
                                                            </DialogTitle>

                                                            <div className="space-y-6">
                                                                <div className="bg-indigo-50 p-4 rounded-xl">
                                                                    <p className="text-gray-700 text-center font-medium">
                                                                        Câu hỏi: HTML là viết tắt của cụm từ gì?
                                                                    </p>
                                                                </div>

                                                                <div className="space-y-4">
                                                                    <input
                                                                        type="text"
                                                                        value={answer}
                                                                        onChange={handleInputChange}
                                                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-colors"
                                                                        placeholder="Nhập câu trả lời..."
                                                                        disabled={isCorrect === true}
                                                                    />

                                                                </div>

                                                                {isCorrect === null && (
                                                                    <button
                                                                        onClick={handleSubmitGame}
                                                                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium py-3 px-4 rounded-xl hover:opacity-90 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                                                                    >
                                                                        Xác nhận đáp án
                                                                    </button>
                                                                )}

                                                                {isCorrect === true && (
                                                                    <div className="animate-fadeIn bg-green-50 rounded-2xl p-4 space-y-2">
                                                                        <p className="text-green-600 font-bold text-center text-lg">
                                                                            🎉 Chúc mừng! Bạn đã trả lời đúng! 🎉
                                                                        </p>
                                                                        {voucher.length > 0 ? (
                                                                            <div className="bg-white rounded-lg p-3 border border-green-200">
                                                                                <p className="text-sm text-gray-600 text-center">
                                                                                    <Gift className="inline w-5 h-5 mr-2 text-green-600" />
                                                                                    Phần quà của bạn là voucher 72h:
                                                                                </p>
                                                                                <p className="text-lg font-mono font-bold text-center text-green-600 mt-1">
                                                                                    {randomVoucher}
                                                                                </p>
                                                                                <p className="text-xs text-center italic text-gray-500 mt-2">
                                                                                    Nhập voucher vào lần thanh toán khóa học sau nhé!
                                                                                </p>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="bg-red-50 rounded-xl p-4">
                                                                                <p className="text-red-500 text-center font-medium text-sm">
                                                                                    Tạm thời chưa có voucher khả dụng. Bạn có thể liên hệ giảng viên để nhận phần quà thay thế nhé! 🎁
                                                                                </p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}

                                                                {isCorrect === false && (
                                                                    <div className="animate-fadeIn bg-red-50 rounded-xl p-4">
                                                                        <p className="text-red-500 text-center font-medium">
                                                                            Rất tiếc! Hãy thử lại nhé!
                                                                        </p>
                                                                    </div>
                                                                )}

                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Content List */}
                                <div className="p-2 max-h-[650px] overflow-y-auto custom-scrollbar">
                                    <Accordion type="multiple" className="space-y-3">
                                        {contentLesson.length > 0 ? (
                                            contentLesson.map((content, index) => {
                                                // Tính tổng thời gian cho phần này
                                                const totalTime = titleContent[content.content_id]?.reduce((acc, item) => {
                                                    const duration = videoDurations[item.title_content_id] || 0;
                                                    return acc + duration;
                                                }, 0);
                                                // Chuyển tổng thời gian từ giây sang phút
                                                const minutes = Math.floor(totalTime / 60);
                                                const seconds = Math.floor(totalTime % 60);
                                                const formattedTime = totalTime > 0 ? `${minutes}:${seconds < 10 ? '0' + seconds : seconds}` : "0:00";
                                                return (
                                                    <AccordionItem
                                                        key={content.content_id}
                                                        value={`content-${content.content_id}`}
                                                        className="border-none"
                                                        onClick={() => !titleContent[content.content_id] && fetchTitleContent(content.content_id)}
                                                    >
                                                        <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01]">
                                                            <AccordionTrigger className="w-full hover:no-underline">
                                                                <div className="flex items-center w-full p-4 hover:bg-gray-50 transition-colors">
                                                                    <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center text-purple-600 font-medium mr-4 shadow-sm">
                                                                        {index + 1}
                                                                    </div>
                                                                    <div className="flex-1 flex items-start justify-between min-w-0">
                                                                        <div className="space-y-1">
                                                                            <h3 className="font-medium text-gray-800 text-sm truncate flex items-center gap-2">
                                                                                <span className="flex-1 truncate">{content.name_content}</span>
                                                                                <div className="flex-shrink-0">
                                                                                    {completedLessons.has(content.content_id) ? (
                                                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-green-600">
                                                                                            <CheckCircle className="w-3 h-3" />
                                                                                        </span>
                                                                                    ) : (
                                                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-red-500">
                                                                                            <XCircle className="w-3 h-3" />
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                            </h3>
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="text-xs text-gray-500 flex items-center">
                                                                                    <Clock className="w-3 h-3 mr-1" />
                                                                                    {formattedTime || "0:00"}
                                                                                </span>

                                                                                <span className="h-4 w-[1px] bg-gray-200"></span>

                                                                                <span className="text-xs text-purple-600 flex items-center">
                                                                                    <BookOpen className="w-3 h-3 mr-1" />
                                                                                    {Array.isArray(titleContent[content.content_id]) ? titleContent[content.content_id].length : 0} phần
                                                                                </span>

                                                                                {content.quiz_id != null && content.quiz_id !== 0 && (
                                                                                    <>
                                                                                        <span className="h-4 w-[1px] bg-gray-200"></span>
                                                                                        <button
                                                                                            onClick={(e) => {
                                                                                                e.stopPropagation();
                                                                                                handleShowQuiz(content.content_id);
                                                                                            }}
                                                                                            className="flex items-center gap-1 px-2 py-1 text-purple-600 font-medium text-xs rounded-md hover:bg-purple-50 transition-colors"
                                                                                        >
                                                                                            <span className="text-xs">Bài tập</span>
                                                                                            <ArrowRight className="w-3 h-3 mt-0.5" />
                                                                                        </button>
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </AccordionTrigger>

                                                            <AccordionContent>
                                                                <div className="px-4 pb-4">
                                                                    {Array.isArray(titleContent[content.content_id]) && titleContent[content.content_id].length > 0 ? (
                                                                        titleContent[content.content_id].map((item, i) => {
                                                                            const isWatched = videoProgress[item.title_content_id];
                                                                            return (
                                                                                <div
                                                                                    key={i}
                                                                                    onClick={() => handleVideoClick(item, content.content_id, i)}
                                                                                    className={`group flex items-start gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer border ${activeItem.contentId === content.content_id && activeItem.index === i
                                                                                        ? 'bg-purple-100 border-purple-300'
                                                                                        : 'border-transparent hover:bg-purple-50 hover:border-purple-100'
                                                                                        }`}
                                                                                >
                                                                                    <div className="relative">
                                                                                        <span className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xs flex-shrink-0 mt-1 group-hover:bg-purple-200">
                                                                                            {i + 1}
                                                                                        </span>

                                                                                    </div>
                                                                                    <div className="flex-1 min-w-0">
                                                                                        <div className="flex items-center justify-between gap-2">
                                                                                            <p className="text-sm text-gray-600 line-clamp-2 flex-1">
                                                                                                {item.body_content}
                                                                                            </p>
                                                                                        </div>
                                                                                        <div className="flex items-center gap-2 mt-1">
                                                                                            {/* Trạng thái video */}
                                                                                            {item.video_link && (
                                                                                                <>
                                                                                                    <span className="text-xs text-gray-400 flex items-center">
                                                                                                        <Clock className="w-3 h-3 mr-1" />
                                                                                                        {videoDurations[item.title_content_id]
                                                                                                            ? `${Math.floor(videoDurations[item.title_content_id] / 60)}:${('0' + Math.floor(videoDurations[item.title_content_id] % 60)).slice(-2)}`
                                                                                                            : "0:00"}
                                                                                                    </span>

                                                                                                    {/* Trạng thái video */}
                                                                                                    <span className={`text-xs flex items-center ${completedVideosInContent[content.content_id]?.[item.title_content_id] ? 'text-green-500' : 'text-gray-400'}`}>
                                                                                                        <Video className="w-3 h-3 mr-1" />
                                                                                                        {completedVideosInContent[content.content_id]?.[item.title_content_id] ? 'Đã xem' : 'Chưa xem'}
                                                                                                    </span>
                                                                                                </>
                                                                                            )}

                                                                                            {/* Chỉ hiển thị trạng thái document nếu item có document_link */}
                                                                                            {item.document_link && (
                                                                                                <>
                                                                                                    {item.video_link && <span className="h-4 w-[1px] bg-gray-200"></span>}
                                                                                                    <span className="text-xs flex items-center">
                                                                                                        <FileCheck className="w-3 h-3 mr-1" />
                                                                                                        <span className={completedDocumentsInContent[content.content_id]?.[item.title_content_id] ? "text-green-500" : "text-gray-400"}>
                                                                                                            {completedDocumentsInContent[content.content_id]?.[item.title_content_id] ? "Đã đọc" : "Chưa đọc"}
                                                                                                        </span>
                                                                                                    </span>
                                                                                                </>
                                                                                            )}

                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })
                                                                    ) : (
                                                                        <div className="flex items-center justify-center py-6 text-gray-400">
                                                                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                                                            <p className="text-sm">Đang tải nội dung...</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </AccordionContent>
                                                        </div>
                                                    </AccordionItem>
                                                );
                                            })
                                        ) : (
                                            <div className="text-center py-8 bg-white rounded-xl">
                                                <BookOpen className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                                                <p className="text-gray-500">Đang cập nhật nội dung...</p>
                                            </div>
                                        )}
                                    </Accordion>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        </>
    );
};
