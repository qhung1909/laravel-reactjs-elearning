import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import ReactPlayer from "react-player";
import axios from "axios";
import { format } from "date-fns";
import { Play, BookOpen, Clock, Video, ArrowRight } from 'lucide-react';
import Quizzes from "../quizzes/quizzes";
import { UserContext } from "../context/usercontext";
const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

export const Lesson = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [lesson, setLesson] = useState(null);
    const { slug } = useParams();
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

                        if (res.data.lesson_id) {
                            fetchContentLesson(res.data.lesson_id);
                        }
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
                console.log("Fetched quizzes data:", res.data); // Thêm log này
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


    const [contentLesson, setContentLesson] = useState([]);
    const [titleContent, setTitleContent] = useState([]);
    const fetchContentLesson = async (lessonId) => {
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
                }, params: {
                    lesson_id: lessonId
                }
            });
            if (res.data && res.data.success && Array.isArray(res.data.data)) {
                setContentLesson(res.data.data.filter(content => content.lesson_id === lessonId));
                console.log("Dữ liệu nội dung bài học:", res.data.data);
            } else {
                console.error("Dữ liệu không phải là mảng:", res.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy nội dung bài học:", error);
        }
    };

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

    const [currentVideoUrls, setCurrentVideoUrls] = useState([]);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

    const showVideo_content = (contentId) => {
        // Lấy danh sách các video link hợp lệ cho contentId hiện tại
        const videoLinks = titleContent[contentId]
            ?.map(item => item.video_link)
            .filter(link => link !== null);

        // Cập nhật currentVideoUrls và đặt lại chỉ số video
        if (videoLinks && videoLinks.length > 0) {
            setCurrentVideoUrls(videoLinks);
            setCurrentVideoIndex(0); // Bắt đầu từ video đầu tiên
        } else {
            setCurrentVideoUrls([]);
        }
    };



    const [showQuiz, setShowQuiz] = useState(false);
    const [currentQuizId, setCurrentQuizId] = useState(null);

    const handleShowQuiz = (content_id) => {
        const quiz = quizzes.find(quiz => quiz.content_id === content_id);
        if (quiz) {
            setCurrentQuizId(quiz.quiz_id);
            setShowQuiz(true);
        } else {
            console.error("Quiz not found for content_id:", content_id);
            toast.error("Không tìm thấy quiz cho nội dung này.");
        }
    };


    return (
        <>
            <body className="bg-gray-100">
                <div className="bg-gray-800 flex items-center justify-between py-1 px-6 fixed z-20 right-0 left-0">
                    <Link to={`/detail/${slug}`}>
                        <button className="text-white">
                            <box-icon color="white" name="chevron-left" />
                        </button>
                    </Link>
                    <div className="text-white font-bold flex items-center">
                        <Link to="/">
                            <div className="w-12 h-12 flex items-center justify-center text-white mr-4">
                                <img
                                    alt="Logo"
                                    className="w-full h-full object-contain"
                                    src="/src/assets/images/antlearn.png"
                                />
                            </div>
                        </Link>
                        <h1 className="text-xl">
                            {lesson ? lesson.name : "Loading..."}
                        </h1>
                    </div>
                    <div className="ml-auto flex items-center space-x-6">

                        <button className="p-2 rounded text-white">
                            <box-icon color="white" name="chat" />
                        </button>
                        <button className="p-2 rounded text-white">
                            <box-icon
                                color="white"
                                name="message-square-dots"
                            />
                        </button>
                    </div>
                </div>

                <div className="content-main py-16">
                    <div className="flex flex-col md:flex-row lg:gap-5 md:gap-2">


                        {/* left site - content chính */}
                        <div className="flex-1 bg-white rounded-lg shadow-md p-4">
                            {/* Phần video */}
                            <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden">
                                {currentVideoUrls.length > 0 ? (
                                    <ReactPlayer
                                        url={currentVideoUrls[currentVideoIndex]}
                                        className="absolute top-0 left-0 w-full h-full"
                                        controls={true}
                                        width="100%"
                                        height="100%"
                                    />
                                ) : (
                                    <img
                                        src="/src/assets/images/thumnail-lesson.jpeg"
                                        alt="Banner"
                                        className="absolute top-0 left-0 w-full h-full object-cover"
                                        style={{ borderRadius: "0.5rem" }}
                                    />
                                )}
                                {currentVideoUrls.length > 1 && (
                                    <div className="absolute bottom-4 left-4 flex gap-2">
                                        <button
                                            onClick={() =>
                                                setCurrentVideoIndex((prevIndex) =>
                                                    prevIndex === 0 ? currentVideoUrls.length - 1 : prevIndex - 1
                                                )
                                            }
                                            className="px-3 py-1 bg-purple-600 text-white rounded"
                                        >
                                            Video sau
                                        </button>
                                        <button
                                            onClick={() =>
                                                setCurrentVideoIndex((prevIndex) =>
                                                    prevIndex === currentVideoUrls.length - 1 ? 0 : prevIndex + 1
                                                )
                                            }
                                            className="px-3 py-1 bg-purple-600 text-white rounded"
                                        >
                                            Video trước
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Bên dưới video: Tên - ngày - mô tả - */}
                            <div className="p-6 text-gray-800">

                                {/* tên */}
                                <h2 className="text-2xl font-bold mb-2 text-center md:text-start">
                                    <span className="font-semibold">Tên khóa học:  </span>{lesson ? lesson.name : "Loading..."}
                                </h2>

                                {/* ngày cập nhật */}
                                <p className="text-sm text-gray-500 text-center md:text-start">
                                    <span className="font-semibold">Cập nhật ngày: </span>{" "}
                                    {lesson
                                        ? formatDate(lesson.updated_at)
                                        : "Loading..."}
                                </p>

                                {/* mô tả */}
                                <p className="mt-4 text-center md:text-start">
                                    <span className="font-semibold">Mô tả: </span>{lesson ? lesson.description : "Loading..."}
                                </p>

                                {/* link facebook */}
                                <ul className="mt-4 space-y-2 ">
                                    <li>
                                        <a href="https://www.facebook.com/profile.php?id=100079303916866" className="flex items-center justify-center md:justify-start gap-2 text-yellow-400 text-lg hover:underline">
                                            <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/facebook.svg" className="w-7" alt="" />
                                            <p className="font-semibold">AntLearn - Elearning</p>
                                        </a>
                                    </li>
                                </ul>
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
                            {/* header */}
                            <div className="flex items-center space-x-2 border-b">
                                <h3 className="text-lg font-semibold text-gray-800 p-4 ">
                                    Nội dung bài học
                                    <span className="text-gray-400 text-sm md:text-base ml-16">
                                        {contentLesson.length || 0} Phần
                                    </span>
                                </h3>
                            </div>

                            {/* content */}
                            <div className="p-6 max-h-[650px] overflow-y-auto">
                                <Accordion type="multiple" className="space-y-3">
                                    {contentLesson.length > 0 ? (
                                        contentLesson.map((content, index) => (
                                            <AccordionItem key={content.content_id} value={`content-${content.content_id}`} className="border-none" onClick={() => !titleContent[content.content_id] && fetchTitleContent(content.content_id)}>
                                                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">

                                                    {/* trigger */}
                                                    <AccordionTrigger className="w-full hover:no-underline">
                                                        <div className="flex items-center w-full p-4">

                                                            {/* stt */}
                                                            <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center text-purple-600 font-medium mr-4">
                                                                {index + 1}
                                                            </div>

                                                            {/* name */}
                                                            <div className="flex-1 flex items-center justify-between">
                                                                <h3 className="font-medium text-gray-800 text-sm line-clamp-1">
                                                                    {content.name_content}
                                                                </h3>

                                                            </div>
                                                        </div>
                                                    </AccordionTrigger>

                                                    {/* content */}
                                                    <AccordionContent>
                                                        <div className="px-4">

                                                            {/* content */}
                                                            <div className="">
                                                                {Array.isArray(titleContent[content.content_id]) && titleContent[content.content_id].length > 0 ? (
                                                                    titleContent[content.content_id].map((item, i) => (
                                                                        <div
                                                                            key={i}
                                                                            className="flex items-start gap-2 py-2 hover:bg-purple-50 rounded-lg transition-colors"
                                                                        >
                                                                            <span className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xs flex-shrink-0">
                                                                                {i + 1}
                                                                            </span>
                                                                            <p className="text-sm text-gray-600">{item.body_content}</p>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <p className="text-sm text-gray-600 pl-7">Đang tải nội dung...</p>
                                                                )}
                                                            </div>

                                                            {/* button - video - bai tap */}
                                                            <div className="flex items-center justify-center gap-2 ">

                                                                {/* video */}
                                                                <button onClick={() => showVideo_content(content.content_id)} className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors">
                                                                    <Play className="w-4 h-4" />
                                                                    <span>Xem bài giảng</span>
                                                                </button>
                                                                <button onClick={() => handleShowQuiz(content.content_id)} className="flex items-center gap-1 px-3 py-1.5 border font-semibold border-purple-200 text-purple-600 text-sm rounded-lg hover:bg-purple-50 transition-colors">
                                                                    <span>Bài tập</span>
                                                                    <ArrowRight className="w-3 h-3 mt-1" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </AccordionContent>
                                                </div>
                                            </AccordionItem>
                                        ))
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
            </body>
        </>
    );
};
