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
import { Play, BookOpen, Clock, Video, ArrowRight, Lock, PlayCircle, BookOpenCheck, Loader2, CheckCircle, XCircle, MessageCircle, MessageSquare, ChevronLeft, Bell, X, Menu } from 'lucide-react';
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
const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;
const GPT_KEY = import.meta.env.VITE_GPT_KEY;
export const Lesson = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [lesson, setLesson] = useState(null);
    const { slug } = useParams();
    //respon
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    useEffect(() => {
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

                        // Thay đổi hàm gọi để truyền course_id
                        fetchContentLesson(res.data.course_id);
                    } else {
                        console.error("Không tìm thấy course_id của bài học");
                    }
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu bài học:", error);
            }
        };
        if (user?.user_id) {
            fetchLesson();
        }
    }, [slug, navigate, user]);;

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
    const [currentBodyContent, setCurrentBodyContent] = useState(null);
    const handleVideoClick = (item, contentId, index) => {
        setCurrentVideoUrl(item.video_link);
        setActiveItem({ contentId, index });

        const bodyContent = titleContent[contentId][index];

        setCurrentBodyContent(bodyContent);
    };


    //Progress
    const updateProgress = async (contentId) => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            toast.error("Bạn chưa đăng nhập.");
            navigate('/');
            return;
        }
        try {
            const courseId = lesson.course_id;
            const isComplete = true;
            const progressPercent = calculateProgress();

            const res = await axios.post(`${API_URL}/progress/complete-content`, {
                user_id: user.user_id,
                content_id: contentId,
                course_id: courseId,
                is_complete: isComplete,
                complete_at: new Date().toISOString(),
                progress_percent: progressPercent,
            }, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                },
            });

        } catch (error) {
            console.error("Lỗi khi cập nhật tiến độ:", error);
            toast.error("Có lỗi xảy ra khi cập nhật tiến độ.");
        }
    };
    const [completedLessons, setCompletedLessons] = useState(new Set());
    const calculateProgress = () => {
        const totalLessons = contentLesson.length;
        const completedCount = completedLessons.size;
        return totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;
    };
    // Theo dõi video nào đã hoàn thành trong từng phần nội dung
    const [completedVideosInSection, setCompletedVideosInSection] = useState({});
    const [videoProgress, setVideoProgress] = useState({});
    const playerRef = useRef();
    const [videoDurations, setVideoDurations] = useState({});

    const handleVideoComplete = (contentId, index) => {
        // Kiểm tra xem video này đã được đánh dấu là hoàn thành chưa
        if (!videoProgress[`${contentId}-${index}`]) {
            setVideoProgress(prev => ({
                ...prev,
                [`${contentId}-${index}`]: true
            }));

            setCompletedVideosInSection(prev => {
                const updated = { ...prev };
                updated[contentId] = (updated[contentId] || 0) + 1;
                // Kiểm tra nếu tất cả video trong phần đã hoàn thành
                if (updated[contentId] === titleContent[contentId].length) {
                    updateProgress(contentId);
                }

                return updated;
            });
        }
    };

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

            // Đánh dấu hoàn thành khi video đạt 70% và chưa được đánh dấu trước đó
            if (playedPercentage >= 70 && !videoProgress[`${titleContentId}-${index}`]) {
                handleVideoComplete(contentId, index);  // Truyền đúng contentId
            }
        }
    };

    useEffect(() => {
        if (completedVideosInSection) {
            const completedCount = Object.keys(completedVideosInSection).filter((contentId) => {
                return Array.isArray(titleContent[contentId]) && completedVideosInSection[contentId] === titleContent[contentId].length;
            }).length;
            setCompletedLessons(new Set([...completedLessons, ...Array(completedCount).keys()]));
        }
    }, [completedVideosInSection, titleContent]);

    const [progressData, setProgressData] = useState([]);
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
                // Lọc dữ liệu theo user_id và course_id
                const userProgress = res.data.filter(
                    (progress) => progress.user_id === user.user_id && progress.course_id === lesson.course_id
                );
                setProgressData(userProgress);

                // Cập nhật trạng thái phần đã hoàn thành
                const updatedCompletedLessons = new Set();
                const updatedCompletedVideos = {};

                userProgress.forEach((progress) => {
                    if (progress.is_complete) {
                        updatedCompletedLessons.add(progress.content_id);
                        updatedCompletedVideos[progress.content_id] = true;
                    }
                });

                setCompletedLessons(updatedCompletedLessons);
                setCompletedVideosInSection(updatedCompletedVideos);
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
                                        📅
                                    </button>

                                    {/* Trigger mở Sheet chat */}
                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <button className="p-2 md:p-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
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
                            <div className="p-6 text-gray-800">
                                {currentBodyContent ? (
                                    <div className="flex flex-col items-center mb-4">
                                        <h2 className="text-xl mb-2 text-center md:text-start">
                                            {currentBodyContent.body_content}
                                        </h2>
                                        <h4 className="text-gray-600 text-base text-center md:text-start">
                                            {currentBodyContent.description ? currentBodyContent.description : ' '}
                                        </h4>
                                        <h5 className="text-gray-600 text-base text-center md:text-start">
                                            {currentBodyContent.document_link ? currentBodyContent.document_link : ' '}
                                        </h5>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center mb-4">
                                        <h2 className="text-2xl font-bold mb-2 text-center md:text-start uppercase">
                                            {lesson && lesson.name ? lesson.name : "Đang tải..."}
                                        </h2>
                                        <p className="text-gray-500 text-sm text-center md:text-start">
                                            Cập nhật ngày: {lesson ? formatDateNoTime(lesson.updated_at) : "Cập nhật: Đang tải..."}
                                        </p>
                                    </div>
                                )}


                                {/* Link Facebook */}
                                <div className="flex flex-col w-80">
                                    <a
                                        href="https://www.facebook.com/profile.php?id=100079303916866"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative overflow-hidden rounded-lg transition-all duration-300"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r  from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                        <div className="relative flex items-center gap-3 bg-gradient-to-r from-yellow-50 to-yellow-100 p-3 group-hover:bg-yellow-200 transition-all duration-300">
                                            {/* Icon Container */}
                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors duration-300">
                                                <img
                                                    src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/facebook.svg"
                                                    className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                                                    alt="Facebook"
                                                />
                                            </div>

                                            {/* Text Content */}
                                            <div className="flex-1">
                                                <h4 className="text-base font-bold text-yellow-600 group-hover:text-black transition-colors duration-300">
                                                    AntLearn - Elearning
                                                </h4>
                                                <p className="text-gray-600 group-hover:text-black transition-colors duration-300 mt-1 text-xs">
                                                    Theo dõi chúng tôi trên Facebook
                                                </p>
                                            </div>
                                            {/* Arrow Indicator */}
                                            <div className="w-5 h-5 flex items-center justify-center">
                                                <span className="text-yellow-600 group-hover:text-black transform translate-x-0 group-hover:translate-x-1 transition-all duration-300">
                                                    →
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                </div>

                            </div>
                            {/* Hiển thị quiz nếu đã bắt đầu, nằm bên trong div video */}
                            {showQuiz && currentQuizId && (
                                <Quizzes
                                    quiz_id={currentQuizId}
                                    onClose={() => setShowQuiz(false)}
                                />
                            )}
                        </div>

                        {/* Phần nội dung khóa học - right site */}
                        <div className="xl:w-96 lg:w-80 md:w-72 bg-gray-50 rounded-lg shadow-md mt-8 md:mt-0">
                            {/* content */}
                            <div className="xl:w-96 lg:w-80 md:w-72 bg-gray-50 rounded-xl shadow-lg">
                                {/* Header */}
                                <div className="p-4 border-b border-gray-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                                            <BookOpenCheck className="w-5 h-5 mr-2 text-purple-500" />
                                            Nội dung bài học
                                        </h3>
                                        <TooltipProvider>
                                            <Tooltip >
                                                <TooltipTrigger>
                                                    <Badge variant="secondary" className="text-xl">
                                                        {contentLesson.length} phần
                                                    </Badge>
                                                </TooltipTrigger>

                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                    {/* Progress */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span className="text-base">Tiến độ học tập</span>
                                            <span className="font-medium text-base">{Math.round(calculateProgress())}%</span>
                                        </div>
                                        <Progress
                                            value={calculateProgress()}
                                            className="h-2 bg-gray-100"
                                        />
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
                                            <div className="flex items-center text-purple-600 mb-1">
                                                <PlayCircle className="w-4 h-4 mr-2" />
                                                <span className="text-sm font-medium">Đã hoàn thành</span>
                                            </div>
                                            <p className="text-lg font-semibold text-gray-800">
                                                {completedLessons.size}/{contentLesson.length}
                                            </p>
                                        </div>
                                        <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                                            <div className="flex items-center text-blue-600 mb-1">
                                                <Clock className="w-4 h-4 mr-2" />
                                                <span className="text-sm font-medium">Thời lượng</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {/* Content List */}
                                <div className="p-4 max-h-[650px] overflow-y-auto custom-scrollbar">
                                    <Accordion type="multiple" className="space-y-3 ">
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
                                                                            <h3 className="font-medium text-gray-800 text-sm truncate">
                                                                                {content.name_content}
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
                                                                                    <button
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            handleShowQuiz(content.content_id);
                                                                                        }}
                                                                                        className="flex items-center gap-1 px-3 py-1 text-purple-600 font-medium text-xs rounded-md hover:bg-purple-50 transition-colors"
                                                                                    >
                                                                                        <span className="text-xs">Bài tập</span>
                                                                                        <ArrowRight className="w-3 h-3 mt-0.5" />
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        {completedVideosInSection[content.content_id] && completedVideosInSection[content.content_id] ? (
                                                                            <CheckCircle className="text-green-600 w-4 h-4 ml-4 mt-1" />
                                                                        ) : (
                                                                            <XCircle className="text-red-600 w-4 h-4 ml-4 mt-1" />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </AccordionTrigger>

                                                            <AccordionContent>
                                                                <div className="px-4 pb-4">
                                                                    {Array.isArray(titleContent[content.content_id]) && titleContent[content.content_id].length > 0 ? (
                                                                        titleContent[content.content_id].map((item, i) => (
                                                                            <div
                                                                                key={i}
                                                                                onClick={() => handleVideoClick(item, content.content_id, i)}
                                                                                className={`group flex items-start gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer border ${activeItem.contentId === content.content_id && activeItem.index === i
                                                                                    ? 'bg-purple-100 border-purple-300'
                                                                                    : 'border-transparent hover:bg-purple-50 hover:border-purple-100'
                                                                                    }`}
                                                                            >
                                                                                <span className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xs flex-shrink-0 mt-1 group-hover:bg-purple-200">
                                                                                    {i + 1}
                                                                                </span>
                                                                                <div className="flex-1 min-w-0">
                                                                                    <div className="flex items-center justify-between gap-2">
                                                                                        <p className="text-sm text-gray-600 line-clamp-2 flex-1">
                                                                                            {item.body_content}
                                                                                        </p>
                                                                                    </div>
                                                                                    <div className="flex items-center gap-2 mt-1">
                                                                                        <span className="text-xs text-gray-400 flex items-center">
                                                                                            <Clock className="w-3 h-3 mr-1" />
                                                                                            {videoDurations[item.title_content_id]
                                                                                                ? `${Math.floor(videoDurations[item.title_content_id] / 60)}:${('0' + Math.floor(videoDurations[item.title_content_id] % 60)).slice(-2)}`
                                                                                                : "0:00"}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ))
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
