import "./detail.css";
import { formatCurrency } from "@/components/Formatcurrency/formatCurrency";
import { formatDate } from "@/components/FormatDay/Formatday";
import { formatDateNoTime } from "@/components/FormatDay/Formatday";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { BadgeAlert, ChevronDown, ChevronUp, CircleUserRound, Edit, Heart, HeartOff, Trash, User, Video } from "lucide-react";
import { Calendar, Globe, BookOpen, Star, Gift } from "lucide-react";
import { Play, Users, Book, Clock, Eye, ShoppingCart, X } from "lucide-react";

import { Badge } from "@/components/ui/badge"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle, Lock } from 'lucide-react';

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Toaster, toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
    SkeletonLoaderBanner,
    SkeletonLoaderProduct,
} from "../skeletonEffect/skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import ReactPlayer from "react-player";
import { CoursesContext } from "../context/coursescontext";
import { Separator } from "@radix-ui/react-context-menu";
import { Sparkles } from 'lucide-react';

// import { CategoriesContext } from "../context/categoriescontext";
const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;
const GPT_KEY = import.meta.env.VITE_GPT_KEY;
export const Detail = () => {
    // const { categories } = useContext(CategoriesContext);
    const { courses, setCourses } = useContext(CoursesContext);
    const [detail, setDetail] = useState([]);
    const { slug } = useParams();
    const [loading, setLoading] = useState([]);
    // JS Section 3
    const [isSection3Expanded, setIsSection3Expanded] = useState(false);

    const toggleSection3 = () => {
        setIsSection3Expanded(!isSection3Expanded);
    };

    // Tính % giá giảm
    const price = parseFloat(detail.price);
    const price_discount = parseFloat(detail.price_discount);
    const percentDiscount =
        price && price_discount
            ? Math.round(((price - price_discount) / price) * 100)
            : 0; // Tránh chia cho 0



    // Rating & comment
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [comments, setComments] = useState([]);
    const [cartItems, setCartItems] = useState([]);

    const [lesson, setLesson] = useState(null);
    const fetchLesson = async () => {
        try {
            const res = await axios.get(`${API_URL}/lessons/${slug}`, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                },
            });

            if (res.data) {
                setLesson(res.data);
                if (res.data.course_id) {  // Thay đổi lesson_id thành course_id
                    fetchContentLesson(res.data.course_id);  // Truyền course_id vào fetchContentLesson
                }

            } else {
                console.error("Dữ liệu không hợp lệ:", res.data);
            }
        } catch (error) {
            if (error.response) {
                console.error("Chi tiết lỗi:", error.response.data);
            }
        }
    };

    useEffect(() => {
        if (slug) {
            fetchLesson();
        }
    }, [slug]);

    const [contentLesson, setContentLesson] = useState([]);
    const fetchContentLesson = async (courseId) => {

        try {
            const res = await axios.get(`${API_URL}/contents`, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
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
        try {
            const res = await axios.get(`${API_URL}/title-contents/${contentId}`, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
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

    // Sắp xếp content theo content_id
    const sortedContent = contentLesson.sort(
        (a, b) => a.content_id - b.content_id
    );


    const [instructor, setInstructor] = useState([]);
    const [users, setUsers] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const fetchUsers = async () => {
        const token = localStorage.getItem("access_token");
        try {
            const res = await axios.get(`${API_URL}/users`, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.data && Array.isArray(res.data.data)) {
                const usersObject = res.data.data.reduce((acc, user) => {
                    acc[user.user_id] = user;
                    return acc;
                }, {});
                setUsers(usersObject);

                const instructorData = res.data.data.filter(user => user.user_id === detail.user_id);

                // Tính toán tổng số khóa học của instructor
                const instructorsWithStats = instructorData.map(instructor => {
                    const instructorCourses = courses.filter(course => course.user_id === instructor.user_id);
                    const totalCourses = instructorCourses.length;

                    // Tính toán tổng rate stars từ mảng comments
                    const totalRating = instructorCourses.reduce((total, course) => {
                        // Cộng điểm rating của các đánh giá
                        const courseRating = course.comments.reduce((courseTotal, comment) => {
                            return courseTotal + parseFloat(comment.rating);
                        }, 0);

                        // Trả về tổng rating của tất cả các khóa học
                        return total + courseRating;
                    }, 0);

                    // Tính trung bình rating
                    const totalComments = instructorCourses.reduce((count, course) => count + course.comments.length, 0);
                    const averageRating = totalComments > 0 ? totalRating / totalComments : 0;

                    return {
                        ...instructor,
                        total_courses: totalCourses,
                        average_rating: averageRating, // Gán trung bình rating
                    };
                });

                setInstructor(instructorsWithStats);
            } else {
                console.error("Không tìm thấy danh sách người dùng trong phản hồi.");
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách người dùng:", error);
        }
    };

    useEffect(() => {
        if (detail) {
            fetchUsers();
        }
    }, [detail]);


    const [user, setUser] = useState({});
    // Fetch thông tin user đang đăng nhập
    const fetchUser = async () => {
        setLoading(true);
        const token = localStorage.getItem("access_token");
        if (!token) {
            console.error("Người dùng chưa đăng nhập.");
            return;
        }
        try {
            const res = await axios.get(`${API_URL}/auth/me`, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                },
            });
            // Kiểm tra cấu trúc dữ liệu trả về
            if (res.data && res.data) {
                setUser(res.data);
                checkPaymentCourse(res.data.user_id);
            } else {
                console.error(
                    "Không tìm thấy thông tin người dùng trong phản hồi."
                );
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin người dùng:", error);
            if (error.response) {
                console.error("Chi tiết lỗi:", error.response.data);
                console.error("Trạng thái lỗi:", error.response.status);
            } else {
                console.error("Lỗi mạng hoặc không có phản hồi từ máy chủ.");
            }
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchUser();
    }, []);

    const fetchComments = async (course_id) => {
        if (!course_id) {
            console.error("course_id không hợp lệ.");
            return;
        }
        setLoading(true);

        try {
            const res = await axios.get(`${API_URL}/comments/${course_id}`, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                },
            });
            if (Array.isArray(res.data.comments)) {
                setComments(res.data.comments);

            }
        } catch (error) {
            console.error("Lỗi khi lấy bình luận:", error);
            if (error.response) {
                console.error("Chi tiết lỗi:", error.response.data);
                console.error("Trạng thái lỗi:", error.response.status);
            } else {
                console.error("Lỗi mạng hoặc không có phản hồi từ máy chủ.");
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchDetail = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/course/${slug}`, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                },
            });
            if (res.data && res.data.course_id) {
                setDetail(res.data);
                fetchComments(res.data.course_id);
                if (user.user_id) {
                    checkPaymentCourse(user.user_id);
                }
            } else {
                Navigate("/404");
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                Navigate("/404");
            } else {
                console.error(
                    "Chi tiết lỗi:",
                    error.response?.data || error.message
                );
                console.error("Trạng thái lỗi:", error.response?.status);
            }
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (slug) {
            fetchDetail();
        }
    }, [slug]);
    //Thoi gian khai giang
    const renderLaunchDateBadge = () => {
        // Chỉ render badge khi khóa học là online meeting và có launch_date
        if (detail?.is_online_meeting === 1) {
            return (
                <Badge className="
                    group mb-4 relative overflow-hidden text-lg py-3 px-6 rounded-full
                    shadow-[0_0_15px_rgba(168,85,247,0.5)]
                    font-bold text-white
                    bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600
                    hover:shadow-[0_0_25px_rgba(168,85,247,0.7)]
                    transform transition-all duration-500 hover:scale-105
                    animate-shimmer hover:animate-pulse
                    border border-purple-400/30 backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600/40 via-fuchsia-600/40 to-pink-600/40 animate-pulse-slow"></div>
                    <div className="relative flex items-center gap-2">
                        <span className="animate-gradient">👨‍🏫 Khởi động Hành trình Học tập - Mở đăng ký từ
                            <span className="inline-block bg-yellow-400 text-purple-900 px-2 py-0.5 rounded-md mx-1 animate-bounce">
                                {formatDateNoTime(detail.launch_date)}
                            </span>
                            !
                        </span>
                        <Sparkles className="w-5 h-5 animate-bounce" />
                    </div>
                </Badge>
            );
        }
        return null;
    };
    const renderContentBadge = (content) => {
        if (content.is_online_meeting === 1) {
            return (
                <Badge className="ml-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-xs font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300">
                    <Video className="w-3.5 h-3.5" />
                    <span className="tracking-wide">Face-To-Face</span>
                </Badge>
            );
        }
        return null;
    };
    const [courseRelated, setCourseRelated] = useState([]);
    const fetchCourseRelated = async () => {
        const categoryId = detail.course_category_id;
        const slug = detail.slug;
        try {
            const res = await axios.get(`${API_URL}/courses/related/${categoryId}/${slug}`, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                },
            });

            if (res.data) {
                const limitedCourses = res.data.slice(0, 2);
                setCourseRelated(limitedCourses);
            } else {
                console.error("Dữ liệu không hợp lệ:", res.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu khóa học liên quan");
        }
    };
    useEffect(() => {
        if (detail) {
            const timeout = setTimeout(() => {
                fetchCourseRelated();
            }, 3000);

            return () => clearTimeout(timeout);
        }
    }, [detail]);

    const [courseRelatedInstructor, setCourseRelatedInstructor] = useState([]);
    const fetchCourseRelatedInstructors = async () => {
        const user_id = detail.user_id;
        const currentCourseId = detail.course_id;
        try {
            const res = await axios.get(`${API_URL}/courses/user/${user_id}`, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                },
            });
            if (res.data) {
                const filteredCourses = res.data.filter(course => course.course_id !== currentCourseId);
                const limitedCourses = filteredCourses.slice(0, 3);
                setCourseRelatedInstructor(limitedCourses);
            } else {
                console.error("Dữ liệu không hợp lệ:", res.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu khóa học liên quan giảng viên");
        }
    };
    useEffect(() => {
        if (detail) {
            const timeout = setTimeout(() => {
                fetchCourseRelatedInstructors();
            }, 3000);

            return () => clearTimeout(timeout);
        }
    }, [detail]);

    const [isPaymentCourse, setPaymentCourse] = useState(false);
    const checkPaymentCourse = async (user_id) => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            toast.error("Bạn chưa đăng nhập.");
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
                const isPaymentCourse = res.data;
                const currentCourseId = detail && detail.course_id;

                // Kiểm tra khóa học nào đã mua
                const isPaymented = isPaymentCourse.some(
                    (course) => course.course_id === currentCourseId
                );
                setPaymentCourse(isPaymented);
            } else {
                console.error("Dữ liệu không phải là mảng:", res.data);
            }
        } catch (error) {
            if (error.response) {
                console.error("Chi tiết lỗi:", error.response.data);
            }
        }
    };

    useEffect(() => {
        if (user.user_id && detail.course_id) {
            checkPaymentCourse(user.user_id);
        }
    }, [user, detail]);

    const [isEnrolled, setIsEnrolled] = useState(false);
    const handleEnroll = async () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            toast.error("Bạn chưa đăng nhập.");
            return;
        }

        try {
            const res = await axios.post(
                `${API_URL}/auth/enroll`,
                {
                    course_id: detail.course_id,
                    user_id: user.user_id,
                },
                {
                    headers: {
                        "x-api-secret": `${API_KEY}`,
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Kiểm tra nếu mã trạng thái là 200 hoặc 201
            if (res.status === 200 || res.status === 201) {
                toast.success("Đăng ký khóa học thành công!");
                checkEnrollment(user.user_id, detail.course_id);
                setIsEnrolled(true);
            } else {
                toast.error(`Đăng kí thất bại`);
            }
        } catch (error) {
            console.error("Lỗi khi đăng ký khóa học:", error);
            if (error.response) {
                // Lỗi từ phía server
                console.log("Server response:", error.response.data);
                toast.error(`Đăng kí thất bại`);
            } else if (error.request) {
                // Không có phản hồi từ server
                toast.error("Không thể kết nối đến server.");
            } else {
                // Lỗi khác
                toast.error("Lỗi trong quá trình đăng ký: " + error.message);
            }
        }
    };
    const checkEnrollment = async (user_id, course_id) => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            toast.error("Bạn chưa đăng nhập.");
            return;
        }

        try {
            const res = await axios.get(`${API_URL}/auth/enrollment/check`, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    user_id: user_id,
                    course_id: course_id,
                },
            });
            if (res.status === 200 && res.data.enrolled) {
                setIsEnrolled(true); // Người dùng đã đăng ký khóa học
            } else {
                setIsEnrolled(false); // Người dùng chưa đăng ký khóa học
            }
        } catch (error) {
            console.error("Lỗi khi kiểm tra trạng thái đăng ký:", error);
            if (error.response) {
                console.error("Lỗi từ server: " + error.response.data.message);
            } else {
                console.error("Lỗi kết nối đến server.");
            }
        }
    };
    useEffect(() => {
        if (user.user_id && detail.course_id) {
            checkEnrollment(user.user_id, detail.course_id);
        }
    }, [user, detail]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const addToCart = async () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            console.error("No token found");
            toast.error("Bạn chưa đăng nhập", {
                style: {
                    padding: "16px",
                },
            });
            return;
        }

        const isAlreadyAdded = cartItems.some(
            (item) => item.course_id === detail.course_id
        );
        if (isAlreadyAdded) {
            toast.error("Khóa học này đã có trong giỏ hàng.", {
                style: {
                    padding: "16px",
                },
            });
            return;
        }

        const newItem = {
            course_id: detail.course_id,
            price: detail.price_discount || detail.price,
        };

        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/auth/cart/addToCart`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    items: [newItem],
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error(
                    "Failed to update cart:",
                    errorData.message || "Unknown error"
                );
                toast.error(
                    errorData.message || "Có lỗi xảy ra khi cập nhật giỏ hàng",
                    {
                        style: {
                            padding: "16px",
                        },
                    }
                );
                return;
            }

            const data = await res.json();
            console.log("Order:", data.order);
            toast.success("Thêm thành công khóa học vào giỏ hàng!", {
                style: {
                    padding: "16px",
                    fontSize: "14px",
                },
            });

            setCartItems((prevItems) => [...prevItems, newItem]);
            setIsDialogOpen(false);
        } catch (error) {
            console.log("Error:", error);
            toast.error("Có lỗi xảy ra, vui lòng thử lại sau.", {
                style: {
                    padding: "16px",
                },
            });
        } finally {
            setLoading(false);
        }
    };
    const renderBannerDetail = loading ? (
        <SkeletonLoaderBanner />
    ) : (
        <div
            className="relative bg-gray-900 text-white overflow-hidden "
            style={{
                backgroundImage: `url(/src/assets/images/bg-detail5.png)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "400px",
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 xl:px-44 py-12">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <Link
                                to="/"
                                className="text-gray-300 hover:text-white"
                            >
                                Trang chủ
                            </Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <Link
                                to="/courses"
                                className="text-gray-300 hover:text-white"
                            >
                                Khóa học
                            </Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-gray-300">
                                Chi tiết
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="mt-8 max-w-3xl">
                    {renderLaunchDateBadge()}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white shadow-text">
                        {detail.title}
                    </h1>
                    <p className="text-lg sm:text-xl md:text-2xl mb-6 text-gray-200 shadow-text">
                        {detail.description}
                    </p>

                    <div className="flex items-center text-sm text-gray-300 mb-2">
                        <Clock className="mr-2" />
                        <span className="shadow-text">
                            Ngày cập nhật gần nhất{" "}
                            {formatDate(detail.updated_at)}
                        </span>
                    </div>

                </div>
            </div>
        </div>
    );

    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingRating, setEditingRating] = useState(0);
    const [editingContent, setEditingContent] = useState("");
    const [showAllComments, setShowAllComments] = useState(false);
    const displayComments = showAllComments ? comments : comments.slice(0, 3);
    const editComment = (comment) => {
        setEditingCommentId(comment.comment_id);
        setEditingRating(comment.rating);
        setEditingContent(comment.content);
    };

    const cancelEdit = () => {
        setEditingCommentId(null);
        setEditingRating(0);
        setEditingContent("");
    };
    const updateComment = async (commentId) => {
        try {
            const parsedRating = parseInt(editingRating, 10);
            if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
                console.error("Rating phải là một số nguyên từ 1 đến 5.");
                return;
            }

            const token = localStorage.getItem("access_token");

            // Gửi request cập nhật bình luận
            await axios.put(
                `${API_URL}/comments/${commentId}`,
                {
                    rating: parsedRating,
                    content: editingContent,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "x-api-secret": `${API_KEY}`,
                    },
                }
            );
            setEditingCommentId(null);
            setEditingRating(0);
            setEditingContent("");
            toast.success("Sửa bình luận thành công!", {
                style: {
                    padding: "16px",
                },
            });
            fetchDetail();
        } catch (error) {
            console.error(
                "Error updating comment:",
                error.response?.data || error.message
            );
            toast.error(error.response.data.error);
        }
    };

    const renderComment = (comment) => (
        <div
            key={comment.comment_id}
            className="flex items-start space-x-3 p-3 bg-white rounded-md shadow-sm"
        >
            <Avatar className="w-10 h-10"> {/* Kích thước vừa phải cho avatar */}
                <AvatarFallback>Avatar</AvatarFallback>
                <AvatarImage
                    src={comment.user?.avatar || "default_avatar_url"}
                />
            </Avatar>

            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <span className="font-semibold text-base">
                            {comment.user?.name || "Người dùng"}
                        </span>
                        <span className="text-gray-500 text-sm ml-2">
                            {formatDate(comment.updated_at)}
                        </span>
                    </div>

                    {user && user.user_id === comment.user?.user_id && (
                        <div className="flex space-x-2">
                            <button
                                onClick={() => editComment(comment)}
                                className="text-blue-500 hover:text-blue-600"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => deleteComment(comment.comment_id)}
                                className="text-red-500 hover:text-red-600"
                            >
                                <Trash className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {editingCommentId === comment.comment_id ? (
                    <div className="mt-2">
                        <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-5 h-5 cursor-pointer ${i < editingRating
                                        ? "text-yellow-500"
                                        : "text-gray-300"
                                        }`}
                                    fill="currentColor"
                                    onClick={() => setEditingRating(i + 1)}
                                />
                            ))}
                        </div>

                        <textarea
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                            className="w-full border rounded-md p-2 mt-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />

                        <div className="flex space-x-2 mt-2">
                            <Button
                                onClick={() => updateComment(comment.comment_id)}
                                className="bg-blue-500 hover:bg-blue-600 text-white text-sm"
                            >
                                Lưu
                            </Button>
                            <Button
                                onClick={cancelEdit}
                                variant="secondary"
                                className="text-sm"
                            >
                                Hủy
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="flex space-x-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    fill="currentColor"
                                    className={`w-4 h-4 ${i < parseFloat(comment.rating)
                                        ? "text-yellow-500"
                                        : "text-gray-300"
                                        }`}
                                />
                            ))}
                        </div>
                        <p className="mt-2 text-sm text-gray-700">
                            {comment.content}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );

    // Hàm kiểm tra bình luận với AI
    const checkComment = async (commentContent) => {
        try {
            const commentPrompt = `Vui lòng kiểm tra bình luận sau và xác định nếu có từ ngữ khiếm nhã, tục tĩu, hoặc không phù hợp: "${commentContent}".
        Nếu có, trả lời 'Có' và giải thích lý do. Nếu không có, trả lời 'Không'. Nếu có từ ngữ khiếm nhã, hãy cho biết từ ngữ đó là gì và tại sao nó không phù hợp.`;

            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: commentPrompt }],
            }, {
                headers: {
                    'Authorization': `Bearer ${GPT_KEY}`,
                    'Content-Type': 'application/json',
                },
            });
            // Lấy kết quả từ phản hồi của GPT và xử lý để trả về lý do
            const result = response.data.choices[0].message.content.trim().toLowerCase();
            if (result.includes('có')) {
                // Trích lý do chi tiết từ phản hồi GPT
                let reason = result.replace('Có', '').trim();
                if (reason === "") {
                    reason = 'Ngôn ngữ khiếm nhã không rõ ràng.';
                }
                return { isInappropriate: true, reason: `Bình luận không hợp lệ: ${reason}` };
            } else {
                return { isInappropriate: false, reason: 'Bình luận hợp lệ' };
            }

        } catch (error) {
            console.error('Lỗi khi kiểm tra bình luận khiếm nhã:', error);
            return { isInappropriate: false, reason: 'Lỗi kiểm tra' };  // Trả về false nếu có lỗi
        }
    };

    const addComment = async () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            setErrorMessage(
                "Để gửi bình luận, bạn vui lòng đăng nhập trước nhé!"
            );
            return;
        }
        if (rating === 0) {
            setErrorMessage("Hãy chọn số sao để đánh giá khóa học này.");
            return;
        }
        if (!comment.trim()) {
            setErrorMessage(
                "Bạn chưa nhập ý kiến của mình về khóa học. Hãy cho chúng tôi biết nhé!"
            );
            return;
        }

        // Kiểm tra bình luận có khiếm nhã hay không
        const { isInappropriate, reason } = await checkComment(comment);
        if (isInappropriate) {
            setErrorMessage(reason);
            return;
        }

        try {
            const commentData = {
                rating,
                content: comment,
            };

            // Gửi bình luận lên server nếu không có từ ngữ khiếm nhã
            await axios.post(
                `${API_URL}/courses/${slug}/comments`,
                commentData,
                {
                    headers: {
                        "x-api-secret": `${API_KEY}`,
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setComment("");
            setRating(0);
            setErrorMessage("");
            fetchDetail();
            toast.success("Đăng bình luận thành công!", {
                style: {
                    padding: "16px",
                },
            });
        } catch (error) {
            if (
                error.response &&
                error.response.data &&
                error.response.data.error
            ) {
                toast.error(error.response.data.error, {
                    style: {
                        padding: "16px",
                    },
                });
            } else {
                setErrorMessage("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
            }
        }
    };

    const deleteComment = async (commentId) => {
        const { isConfirmed } = await Swal.fire({
            title: "Xác nhận xóa",
            text: "Bạn có chắc chắn muốn xóa bình luận này? Hành động này không thể hoàn tác.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Có, xóa!",
            cancelButtonText: "Hủy",
        });

        if (!isConfirmed) {
            return;
        }

        try {
            const token = localStorage.getItem("access_token");
            await axios.delete(`${API_URL}/comments/${commentId}`, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchComments();
            window.location.reload();
        } catch (error) {
            console.error(
                "Error deleting comment:",
                error.response?.data || error.message
            );
        }
    };
    const [currentVideoUrl, setCurrentVideoUrl] = useState("");

    const showModal = (video_content) => {
        const embedUrl = video_content;
        setCurrentVideoUrl(embedUrl);
    };

    useEffect(() => { }, [currentVideoUrl]);


    // Yêu thích khóa học
    const [favorites, setFavorites] = useState({});
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) return;
        const fetchFavorites = async () => {
            try {
                const response = await axios.get(`${API_URL}/favorites`, {
                    headers: {
                        "x-api-secret": API_KEY,
                        "Accept": "application/json",
                        Authorization: `Bearer ${token}`,
                    }
                });

                // Kiểm tra và xử lý dữ liệu trả về
                if (response.data && Array.isArray(response.data)) {
                    const favoritesObj = {};
                    response.data.forEach(fav => {
                        favoritesObj[fav.course_id] = true;
                    });
                    setFavorites(favoritesObj);
                }
            } catch (error) {
                console.error("Lỗi khi tải danh sách yêu thích:", error);
            }
        };
        fetchFavorites();
    }, []);

    const handleLike = async (courseId) => {
        const token = localStorage.getItem("access_token");
        // Kiểm tra token
        if (!token) {
            toast.error("Đăng nhập để lưu khóa học vào danh sách yêu thích nhé! ⭐", {
                style: {
                    padding: "16px",
                },
            });
            return;
        }
        try {
            const isFavorited = favorites[courseId];
            const newFavorites = { ...favorites };
            newFavorites[courseId] = !newFavorites[courseId];
            setFavorites(newFavorites);
            if (!isFavorited) {
                // Thêm vào yêu thích
                const response = await axios.post(
                    `${API_URL}/favorites`,
                    {
                        course_id: courseId,
                        user_id: user.user_id
                    },
                    {
                        headers: {
                            "x-api-secret": API_KEY,
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            } else {
                // Xóa khỏi yêu thích
                const response = await axios.delete(
                    `${API_URL}/favorites`,
                    {
                        headers: {
                            "x-api-secret": API_KEY,
                            "Accept": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        data: {
                            course_id: courseId,
                            user_id: user.user_id
                        }
                    }
                );
            }
        } catch (error) {
            const revertFavorites = { ...favorites };
            revertFavorites[courseId] = !revertFavorites[courseId];
            setFavorites(revertFavorites);
            console.error("Lỗi khi cập nhật yêu thích:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <>
            {/* Banner */}
            {renderBannerDetail}
            {/* Kết thúc Banner */}

            {/* Phần Nội dung chính */}
            <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-44 mt-8">
                <div className="flex flex-wrap -mx-4">
                    {/* Cột trái (Nội dung bài học) */}
                    <div className="w-full lg:w-2/3 px-4">
                        {/* Section 3 */}
                        <div className="container mx-auto px-4 py-8">
                            <h2 className="text-2xl font-bold mb-4">Nội dung khóa học</h2>
                            {/* <p className="text-gray-600 mb-6">19 phần - 121 bài giảng - 8 giờ 42 phút tổng thời lượng</p> */}

                            <div className="bg-white rounded-lg overflow-hidden">
                                <div className="border-b">
                                    <Accordion type="multiple" className="w-full space-y-4 bg-white rounded-xl shadow-lg p-6">
                                        {loading ? (
                                            Array.from({ length: 2 }).map((_, index) => (
                                                <div key={index} className="group border border-gray-200 rounded-lg overflow-hidden mb-2 animate-pulse">
                                                    <div className="px-6 py-4 bg-gray-200">
                                                        <div className="flex items-center justify-between w-full">
                                                            <div className="flex items-center gap-4">
                                                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 text-gray-600 font-semibold text-sm">
                                                                    {index + 1}
                                                                </span>
                                                                <div className="h-4 bg-gray-300 rounded w-3/4" />
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-4 bg-gray-300 rounded w-8" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="border-t border-gray-100">
                                                        <div className="p-6 space-y-4">
                                                            <div className="h-3 bg-gray-300 rounded w-full" />
                                                            <div className="h-3 bg-gray-300 rounded w-full" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            contentLesson.length > 0 ? (
                                                contentLesson.map((content, index) => (
                                                    <AccordionItem
                                                        key={content.content_id}
                                                        value={`content-${content.content_id}`}
                                                        className="group border border-gray-200 rounded-lg overflow-hidden mb-2 hover:border-yellow-500 hover:shadow-md transition-all duration-300"
                                                        onClick={() => index === 0 && !titleContent[content.content_id] && fetchTitleContent(content.content_id)} // Chỉ fetch cho phần đầu tiên
                                                    >
                                                        <AccordionTrigger className="px-6 py-4 bg-gradient-to-r from-yellow-50/50 to-white hover:bg-gradient-to-r hover:from-yellow-50 hover:to-white font-medium text-gray-700 text-left hover:no-underline">
                                                            <div className="flex items-center justify-between w-full">
                                                                <div className="flex items-center gap-4">
                                                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 font-semibold text-sm group-hover:bg-yellow-200 transition-colors">
                                                                        {index + 1}
                                                                    </span>
                                                                    <span className="text-base group-hover:text-yellow-600 transition-colors">
                                                                        {content.name_content}
                                                                    </span>
                                                                </div>
                                                                <div className="mr-3 flex items-center gap-2">
                                                                    {/* Badge styling */}
                                                                    <span >
                                                                        {renderContentBadge(content)}
                                                                    </span>
                                                                    {index === 0 ? (
                                                                        <CheckCircle className="text-green-600 w-4 h-4" />
                                                                    ) : (
                                                                        <Lock className="text-gray-400 w-4 h-4" />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </AccordionTrigger>

                                                        <AccordionContent className="border-t border-gray-100">
                                                            {index === 0 && content.course_id === lesson.course_id && Array.isArray(titleContent[content.content_id]) && titleContent[content.content_id].length > 0 ? ( // Chỉ hiển thị nội dung cho phần đầu tiên
                                                                <div className="space-y-6 p-6">
                                                                    {titleContent[content.content_id].map((item, i) => (
                                                                        <div key={i} className="flex gap-3 text-gray-600 leading-relaxed hover:bg-yellow-50 rounded-lg p-3 transition-colors">
                                                                            <span className="font-medium text-yellow-600 min-w-[24px]">
                                                                                {i + 1}.
                                                                            </span>
                                                                            <div className="flex-1">
                                                                                <p>{item.body_content}</p>
                                                                                {item.video_link && (
                                                                                    <Dialog>
                                                                                        <DialogTrigger asChild>
                                                                                            <Button
                                                                                                className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg flex items-center gap-2 px-6 py-3 transition-all duration-300 hover:shadow-lg"
                                                                                                onClick={() => showModal(item.video_link)}
                                                                                            >
                                                                                                <Play size={18} />
                                                                                                Xem video bài học
                                                                                            </Button>
                                                                                        </DialogTrigger>
                                                                                        <DialogContent className="max-w-4xl mx-auto p-6 bg-gray-300">
                                                                                            <DialogTitle className="text-xl font-semibold mb-4">
                                                                                                {item.content.name_content || "Video Bài Học"}
                                                                                            </DialogTitle>
                                                                                            <DialogDescription>
                                                                                                <div className="relative w-full rounded-lg overflow-hidden shadow-lg" style={{ paddingTop: "56.25%" }}>
                                                                                                    <ReactPlayer
                                                                                                        url={currentVideoUrl}
                                                                                                        className="absolute top-0 left-0"
                                                                                                        controls={true}
                                                                                                        width="100%"
                                                                                                        height="100%"
                                                                                                    />
                                                                                                </div>
                                                                                            </DialogDescription>
                                                                                        </DialogContent>
                                                                                    </Dialog>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                index !== 0 && (
                                                                    <p className="p-6 text-gray-500 text-center italic">Vào học để xem thêm nội dung!</p>
                                                                )
                                                            )}
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                ))
                                            ) : (
                                                <div className="text-center py-8 bg-white rounded-xl">
                                                    <BookOpen className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                                                    <p className="text-gray-500">Đang cập nhật nội dung...</p>
                                                </div>
                                            )
                                        )}
                                    </Accordion>


                                </div>
                            </div>

                            <h2 className="text-2xl font-bold mt-8 mb-4">Yêu cầu</h2>
                            <ul className="list-disc pl-8">
                                <li>Có kiến thức cơ bản về kiến trúc máy tính</li>
                                <li>Có máy tính nối mạng Internet để thực hành các bài tập</li>
                            </ul>

                            {/* Mô tả */}
                            <div className={`section-3-content ${isSection3Expanded ? "" : "collapsed"} mt-4`}>
                                <h2 className="text-2xl font-bold mb-4">Mô tả</h2>
                                <p className="text-black-600 mb-6" style={{ marginBottom: 10 }}>Hello, {user.name}</p>
                                <p className="text-black-600 mb-6">Khóa học <strong>{detail.title}</strong></p>
                                <p className="text-black-600 mb-6"><strong>Mô tả của bài học:</strong></p>
                                <ul className="list-disc pl-8 mb-6">
                                    {lesson && lesson.description && (
                                        <li>{lesson.description}</li>
                                    )}
                                </ul>
                            </div>

                            <button onClick={toggleSection3} className="mt-4 text-blue-600 hover:underline focus:outline-none">
                                {isSection3Expanded ? "Ẩn bớt ^" : "Hiện thêm ^"}
                            </button>
                        </div>
                        {/* Kết thúc Section 3 */}
                        {/* Section 4 */}
                        <div className="bg-gray-50 py-8 sm:py-12">
                            <div className="container mx-auto px-4">
                                <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-800">
                                    Khóa học liên quan
                                </h2>
                                <div className="space-y-6">
                                    {loading ? (
                                        Array.from({ length: 2 }).map((_, index) => (
                                            <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center bg-white p-6 rounded-lg shadow-md animate-pulse">
                                                <div className="w-full sm:w-48 h-48 sm:h-32 bg-gray-200 rounded-lg mb-4 sm:mb-0 sm:mr-8" />
                                                <div className="flex-grow">
                                                    <div className="sm:flex sm:justify-between sm:items-center">
                                                        <div className="mb-4 sm:mb-0 sm:mr-8">
                                                            <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
                                                            <div className="h-3 bg-gray-200 rounded w-1/2" />
                                                        </div>
                                                        <div className="flex flex-col sm:items-end">
                                                            <div className="flex items-center mb-2">
                                                                <span className="h-4 bg-gray-200 rounded w-24" />
                                                            </div>
                                                            <div className="flex items-center justify-between sm:flex-col sm:items-end">
                                                                <div className="flex flex-col sm:items-end">
                                                                    <div className="h-4 bg-gray-200 rounded mb-1 w-24" />
                                                                    <span className="h-3 bg-gray-200 rounded w-20" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="space-y-4">
                                            {courseRelated && courseRelated.length > 0 ? (
                                                courseRelated.map((course) => (
                                                    <div key={course.course_id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl">
                                                        <div className="flex flex-col sm:flex-row">
                                                            <Link to={`/detail/${course.slug}`} className="relative group flex-shrink-0 sm:w-64">
                                                                <img
                                                                    src={course.img}
                                                                    alt={course.title}
                                                                    className="w-full h-48 sm:h-full object-cover "
                                                                />
                                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                                                            </Link>

                                                            <div className="flex-grow p-5">
                                                                <div className="h-full flex flex-col">
                                                                    <Link to={`/detail/${course.slug}`}>
                                                                        <h3 className="font-bold text-lg mb-3 line-clamp-2">
                                                                            {course.title}
                                                                        </h3>
                                                                    </Link>

                                                                    <div className="flex items-center space-x-4 mb-3">
                                                                        <div className="flex items-center">
                                                                            <Users className="w-4 h-4 text-gray-400 mr-1" />
                                                                            <p className="text-sm text-gray-600 font-medium">
                                                                                {users[course.user_id]?.name || "Tên giảng viên"}
                                                                            </p>
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-4">
                                                                        <div className="flex items-center">
                                                                            <Clock className="w-4 h-4 mr-1" />
                                                                            <span>Cập nhật {formatDateNoTime(course.updated_at)}</span>
                                                                        </div>
                                                                        <div className="flex items-center">
                                                                            <Eye className="w-4 h-4 mr-1" />
                                                                            <span>{course.views} lượt xem</span>
                                                                        </div>
                                                                        <button
                                                                            onClick={() => handleLike(course.course_id)}
                                                                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${favorites[course.course_id]
                                                                                ? 'bg-red-50 text-red-500'
                                                                                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                                                                }`}
                                                                        >
                                                                            <Heart
                                                                                className={`w-5 h-5 transition-all duration-300 ${favorites[course.course_id]
                                                                                    ? 'fill-current'
                                                                                    : ''
                                                                                    }`}
                                                                            />
                                                                            <span className="text-xs font-medium">
                                                                                {favorites[course.course_id] ? 'Đã yêu thích' : 'Yêu thích'}
                                                                            </span>
                                                                        </button>
                                                                    </div>

                                                                    <div className="mt-auto pt-3 border-t border-gray-100">
                                                                        <div className="flex items-center justify-between">
                                                                            <div className="flex flex-col">
                                                                                <div className="flex items-center gap-2">
                                                                                    <p className="font-bold text-xl text-black-700">
                                                                                        {formatCurrency(course.price_discount)}
                                                                                    </p>
                                                                                    <span className="inline-flex items-center justify-center bg-purple-50 px-2 py-1 rounded-full text-xs font-medium text-yellow-500 whitespace-nowrap">
                                                                                        -{Math.round((course.price - course.price_discount) / course.price * 100)}%
                                                                                    </span>
                                                                                </div>
                                                                                <p className="text-sm line-through text-gray-400">
                                                                                    {formatCurrency(course.price)}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>


                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-8 bg-white rounded-xl">
                                                    <BookOpen className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                                                    <p className="text-gray-500">Đang cập nhật nội dung...</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>


                        {/* Kết thúc Section 4 */}
                        {/* Section 5 */}
                        <div className="container mx-auto px-4 py-8">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800">Giảng viên</h2>
                            {loading ? (
                                Array.from({ length: 1 }).map((_, index) => (
                                    <div key={index} className="flex items-start bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300 animate-pulse">
                                        <div className="w-16 h-16 rounded-full bg-gray-200" />
                                        <div className="ml-6 flex-grow">
                                            <div className="h-6 bg-gray-200 rounded mb-2 w-3/4" />
                                            <div className="h-4 bg-gray-200 rounded mb-2 w-1/2" />
                                            <div className="flex items-center mb-4">
                                                <span className="h-4 bg-gray-200 rounded w-16" />
                                                <div className="ml-1 w-6 h-6 bg-gray-200 rounded" />
                                                <span className="h-4 bg-gray-200 rounded ml-2 w-24" />
                                            </div>
                                            <ul className="text-gray-600 mb-6 space-y-2">
                                                <li className="flex items-center">
                                                    <div className="w-5 h-5 bg-gray-200 rounded mr-2" />
                                                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                                                </li>
                                                <li className="flex items-center">
                                                    <div className="w-5 h-5 bg-gray-200 rounded mr-2" />
                                                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                                                </li>
                                            </ul>
                                            <Accordion type="single" collapsible className="w-full">
                                                <AccordionItem value="instructor-description">
                                                    <AccordionTrigger className="hover:no-underline">
                                                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                                                    </AccordionTrigger>
                                                    <AccordionContent>
                                                        <div className="h-4 bg-gray-200 rounded w-full" />
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                instructor.map((teacher) => (
                                    <div key={teacher.user_id} className="flex items-start bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                                        <Avatar>
                                            <AvatarImage
                                                src={teacher.avatar}
                                                alt={teacher.name}
                                                className="rounded-full border border-gray-200 w-16 h-16"
                                            />
                                        </Avatar>
                                        <div className="ml-6 flex-grow">
                                            <h3 className="text-2xl font-semibold mb-2 text-purple-700">
                                                {teacher.name}
                                            </h3>
                                            <p className="text-gray-600 mb-4 text-lg">
                                                {teacher.role === 'teacher' ? 'Giảng viên' : teacher.role}
                                            </p>
                                            <div className="flex items-center mb-4">
                                                <span className="text-gray-600 text-lg font-medium">{teacher.email}</span>
                                            </div>
                                            <ul className="text-gray-600 mb-6 space-y-2">
                                                <li className="flex items-center">
                                                    <Book className="w-5 h-5 mr-2 text-gray-500" />
                                                    {teacher.total_courses} Khóa học
                                                </li>
                                                <li className="flex items-center p-2 ">
                                                    <div className="flex items-center space-x-2">
                                                        {Array.from({ length: 5 }, (_, index) => (
                                                            <Star
                                                                key={index}
                                                                className={`w-5 h-5 transition-colors duration-200
                    ${index < Math.floor(teacher.average_rating)
                                                                        ? 'text-yellow-400 fill-yellow-400'
                                                                        : index < Math.floor(teacher.average_rating) + 1 && teacher.average_rating % 1 !== 0
                                                                            ? 'text-yellow-400 fill-yellow-200 opacity-80'
                                                                            : 'text-gray-200'
                                                                    }`}
                                                            />
                                                        ))}
                                                        <span className="ml-2 text-sm font-semibold text-gray-500">
                                                            {teacher.average_rating.toFixed(1)}
                                                        </span>
                                                    </div>
                                                </li>

                                            </ul>
                                            <Accordion type="single" collapsible className="w-full">
                                                <AccordionItem value="instructor-description">
                                                    <AccordionTrigger className="text-black-600 hover:no-underline">
                                                        Xem thêm
                                                    </AccordionTrigger>
                                                    <AccordionContent>
                                                        <p className="text-gray-700 leading-relaxed">
                                                            {teacher.description || 'Chưa có thông tin mô tả.'}
                                                        </p>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Kết thúc Section 5 */}

                        {/* Section 6 */}
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold mb-4">
                                Khách hàng nói về khóa học
                            </h2>
                            {/* Phần bình luận */}
                            <div>
                                <h3 className="text-base font-semibold mb-2">
                                    {loading ? (
                                        <Skeleton className="h-4 w-[100px]" />
                                    ) : (
                                        <>{comments.length || 0} Bình luận</>
                                    )}
                                </h3>
                                <div className="space-y-3 mb-3">
                                    {loading ? (
                                        <>
                                            <div className="flex items-center space-x-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <div key={i} className="w-6 h-6 bg-gray-200 rounded-full" />
                                                ))}
                                            </div>
                                            <div className="h-16 bg-gray-200 rounded-md" />
                                            <div className="w-32 h-10 bg-gray-200 rounded-md" />
                                        </>
                                    ) : (
                                        <>
                                            {/* Phần chọn sao */}
                                            <div className="flex items-center space-x-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-6 h-6 cursor-pointer ${i < rating
                                                            ? "text-yellow-500"
                                                            : "text-gray-300"
                                                            }`}
                                                        fill="currentColor"
                                                        onClick={() => setRating(i + 1)} // Cập nhật số sao khi click
                                                    />
                                                ))}
                                            </div>

                                            {/* Nhập nội dung bình luận */}
                                            <textarea
                                                placeholder="Nhập nội dung bình luận"
                                                className="w-full border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                rows="3"
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                            />
                                            {/* Thông báo lỗi */}
                                            {errorMessage && (
                                                <p className="text-red-500 mt-2">
                                                    {errorMessage}
                                                </p>
                                            )}
                                            <button
                                                className="bg-black text-white px-3 py-1 rounded-md hover:bg-gray-800"
                                                onClick={addComment}
                                            >
                                                Gửi bình luận
                                            </button>
                                        </>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    {comments.length > 0 ? (
                                        <>
                                            <div className="space-y-2">
                                                {displayComments.map(renderComment)}
                                            </div>

                                            {comments.length > 3 && (
                                                <Button
                                                    onClick={() => setShowAllComments(!showAllComments)}
                                                    variant="outline"
                                                    className="w-full mt-2 flex items-center justify-center space-x-1 text-xs"
                                                >
                                                    {showAllComments ? (
                                                        <>
                                                            <ChevronUp className="w-2 h-2" />
                                                            <span className="text-xs">Thu gọn</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ChevronDown className="w-2 h-2" />
                                                            <span className="text-xs">
                                                                Xem thêm {comments.length - 3} bình luận
                                                            </span>
                                                        </>
                                                    )}
                                                </Button>
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center p-2 border border-dashed border-gray-300 rounded-lg bg-gray-50"> {/* Giảm padding */}
                                            <p className="text-gray-600 text-center text-xs">
                                                Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ cảm nhận của bạn!
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Kết thúc Section 6 */}
                        {/* Section 7 */}
                        <div className="container mx-auto px-4 py-8">
                            {loading ? (
                                <>
                                    <h2 className="text-2xl font-bold mb-6">
                                        Các khóa học khác của{" "}
                                        <span className="text-purple-700">Giảng viên</span>
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {Array.from({ length: 3 }).map((_, index) => (
                                            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                                                <div className="w-full h-48 bg-gray-200" />
                                                <div className="p-4">
                                                    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
                                                    <div className="h-3 bg-gray-200 rounded mb-2 w-1/2" />
                                                    <div className="h-6 bg-gray-200 rounded mb-2 w-1/4" />
                                                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                courseRelatedInstructor.length > 0 ? (
                                    <>
                                        <h2 className="text-2xl font-bold mb-6">
                                            Các khóa học khác của{" "}
                                            <span className="text-purple-700">
                                                {users[courseRelatedInstructor[0].user_id]?.name || "Giảng viên"}
                                            </span>
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {courseRelatedInstructor.map((course, index) => (
                                                <div key={index}
                                                    className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                                                    <Link to={`/detail/${course.slug}`} className="relative group">
                                                        <img
                                                            src={course.img || "../img/inclusion.jpg"}
                                                            alt={course.title || "Course Image"}
                                                            className="w-full h-48 object-cover "
                                                        />
                                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                                                    </Link>

                                                    <div className="p-5 flex flex-col flex-grow">
                                                        <Link to={`/detail/${course.slug}`}>
                                                            <h3 className="font-bold text-lg mb-3 line-clamp-2 ">
                                                                {course.title || "Tên khóa học"}
                                                            </h3>
                                                        </Link>

                                                        <div className="flex items-center space-x-4 mb-3">
                                                            <div className="flex items-center">
                                                                <Users className="w-4 h-4 text-gray-400 mr-1" />
                                                                <p className="text-sm text-gray-600 font-medium">
                                                                    {users[course.user_id]?.name || "Tên giảng viên"}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center text-xs text-gray-500 mb-4">
                                                            <Clock className="w-4 h-4 mr-1" />
                                                            <span>Cập nhật {formatDateNoTime(course.updated_at)}</span>
                                                        </div>

                                                        <div className="mt-auto pt-3 border-t border-gray-100">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex flex-col">
                                                                    <div className="flex items-center gap-2">
                                                                        <p className="font-bold text-xl text-black-700">
                                                                            {formatCurrency(course.price_discount)}
                                                                        </p>
                                                                        <span className="inline-flex items-center justify-center bg-purple-50 px-2 py-1 rounded-full text-xs font-medium text-yellow-300 whitespace-nowrap">
                                                                            -{Math.round((course.price - course.price_discount) / course.price * 100)}%
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-sm line-through text-gray-400">
                                                                        {formatCurrency(course.price)}
                                                                    </p>
                                                                </div>
                                                                <button
                                                                    onClick={() => handleLike(course.course_id)}
                                                                    className={`flex items-center gap-2 mt-6 px-2 py-1 rounded-full transition-all duration-300 ${favorites[course.course_id]
                                                                        ? 'bg-red-50 text-red-500'
                                                                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                                                        }`}
                                                                >
                                                                    <Heart
                                                                        className={`w-5 h-5 transition-all duration-300 ${favorites[course.course_id]
                                                                            ? 'fill-current'
                                                                            : ''
                                                                            }`}
                                                                    />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-8 bg-white rounded-xl">
                                        <BookOpen className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                                        <p className="text-gray-500">Đang cập nhật nội dung...</p>
                                    </div>
                                )
                            )}
                        </div>

                        {/* Kết thúc Section 7 */}
                    </div>
                    {/* Cột phải (thông tin mua hàng) */}
                    {loading ? (
                        <SkeletonLoaderProduct />
                    ) : (
                        <div className="w-full lg:w-1/3 px-4 mt-8 lg:mt-0 sticky-container">
                            <div className="bg-white p-6 rounded-lg shadow-md sticky-element">
                                <div className="mb-4">
                                    <img
                                        src={detail.img}
                                        alt="Preview khóa học"
                                        className="w-full rounded-lg"
                                        style={{ maxHeight: 150 }}
                                    />
                                </div>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-3xl font-bold">
                                        {formatCurrency(detail.price_discount)}
                                    </span>
                                    <span className="text-lg text-gray-500 line-through">
                                        {formatCurrency(detail.price)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center"> {/* Dùng flex để căn chỉnh các phần tử theo hàng ngang */}
                                    <div>
                                        <p className="text-red-500 mb-1">
                                            Giảm {percentDiscount}%
                                        </p>
                                        <p className="text-sm text-gray-600 mb-2">
                                            Mức giá ưu đãi!
                                        </p>
                                    </div>

                                    {/* Nút Yêu thích */}
                                    <button
                                        onClick={() => handleLike(detail.course_id)}
                                        className={`flex items-center gap-2 mb-1 mt-6 px-3 py-1 rounded-full transition-all duration-300 ${favorites[detail.course_id]
                                            ? 'bg-red-50 text-red-500'
                                            : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                            }`}
                                    >
                                        <Heart
                                            className={`w-5 h-5 transition-all duration-300 ${favorites[detail.course_id]
                                                ? 'fill-current'
                                                : ''
                                                }`}
                                        />
                                        <span className="text-xs font-medium">
                                            {favorites[detail.course_id] ? 'Đã yêu thích' : 'Yêu thích'}
                                        </span>
                                    </button>
                                </div>

                                {/* Nếu người dùng đã mua khóa học và chưa enroll */}
                                {isPaymentCourse && !isEnrolled && (
                                    <button
                                        onClick={handleEnroll}
                                        className="w-full bg-blue-500 text-white py-2 rounded-lg mb-2 hover:bg-blue-600 transition duration-300"
                                    >
                                        Đăng kí khóa học
                                    </button>
                                )}

                                {isPaymentCourse && isEnrolled && (
                                    <Link to={`/lessons/${slug}`}>
                                        <button className="w-full bg-teal-400 text-white py-2 rounded-lg mb-2 hover:bg-teal-500 transition duration-300">
                                            Vào học ngay
                                        </button>
                                    </Link>
                                )}

                                {!isPaymentCourse && (
                                    <>
                                        <button
                                            onClick={async () => {
                                                const token = localStorage.getItem("access_token");
                                                if (!token) {
                                                    console.error("No token found");
                                                    toast.error("Đăng nhập để mua khóa học bạn nhé!", {
                                                        style: {
                                                            padding: "16px",
                                                        },
                                                    });
                                                    return;
                                                }
                                                if (detail.is_online_meeting === 1) {
                                                    setIsDialogOpen(true);
                                                } else {
                                                    await addToCart();
                                                }
                                            }}
                                            className="w-full bg-yellow-400 text-white py-2 rounded-lg mb-2 hover:bg-yellow-500 transition duration-300"
                                        >
                                            Thêm vào giỏ hàng
                                        </button>
                                        {detail.is_online_meeting === 1 && (
                                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                                <DialogContent className="sm:max-w-[425px]">
                                                    <DialogHeader>
                                                        <DialogHeader>
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="w-5 h-5 text-blue-500" />
                                                                <DialogTitle className="text-xl font-semibold leading-tight">
                                                                    Khóa học Online bắt đầu vào ngày
                                                                </DialogTitle>
                                                            </div>
                                                            <div className="mt-2">
                                                                <span className="text-3xl font-bold text-center block text-red-600">{formatDateNoTime(detail.launch_date)}</span>
                                                            </div>
                                                        </DialogHeader>

                                                        <div className="flex items-start gap-3 mt-4 p-4 border rounded-lg bg-gray-50 shadow-sm">
                                                            <BadgeAlert className="h-5 w-5 flex-shrink-0 mt-0.5 text-red-500" />
                                                            <DialogDescription className="text-sm text-muted-foreground">
                                                                <span className="font-semibold">Lưu ý:</span> Sau khi thanh toán thành công, bạn sẽ nhận được đường link tham gia lớp học trực tuyến qua email vào ngày bắt đầu khóa học.
                                                            </DialogDescription>
                                                        </div>
                                                    </DialogHeader>
                                                    <div className="my-1">
                                                        <p className="text-sm font-medium text-foreground">
                                                            Đối với các bài học video tự học, bạn có thể học theo lịch trình của mình bất kỳ lúc nào.
                                                        </p>
                                                    </div>
                                                    <Separator className="my-1" />
                                                    <div className="flex justify-end space-x-2">
                                                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                                            <X className="w-4 h-4 mr-2" />
                                                            Hủy
                                                        </Button>
                                                        <Button onClick={addToCart} className="bg-yellow-400 text-white hover:bg-yellow-500">
                                                            <ShoppingCart className="w-4 h-4 mr-2" />
                                                            Xác nhận
                                                        </Button>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        )}
                                    </>
                                )}

                                <div className="mt-2">
                                    <h4 className="font-semibold mb-2">
                                        Khóa học này bao gồm:
                                    </h4>
                                    <ul className="text-sm space-y-2">
                                        <li className="flex items-center">
                                            <box-icon
                                                name="video"
                                                color="#10B981"
                                                class="w-4 h-4 mr-2"
                                                size="sm"
                                            ></box-icon>
                                            8,5 giờ video theo yêu cầu
                                        </li>
                                        <li className="flex items-center">
                                            <box-icon
                                                name="code"
                                                color="#10B981"
                                                class="w-4 h-4 mr-2"
                                                size="sm"
                                            ></box-icon>
                                            1 bài tập coding
                                        </li>
                                        <li className="flex items-center">
                                            <box-icon
                                                name="file"
                                                color="#10B981"
                                                class="w-4 h-4 mr-2"
                                                size="sm"
                                            ></box-icon>
                                            35 bài viết
                                        </li>
                                        <li className="flex items-center">
                                            <box-icon
                                                name="download"
                                                color="#10B981"
                                                class="w-4 h-4 mr-2"
                                                size="sm"
                                            ></box-icon>
                                            7 tài nguyên có thể tải xuống
                                        </li>
                                        <li className="flex items-center">
                                            <box-icon
                                                name="mobile"
                                                color="#10B981"
                                                class="w-4 h-4 mr-2"
                                                size="sm"
                                            ></box-icon>
                                            Truy cập trên thiết bị di động và TV
                                        </li>
                                        <li className="flex items-center">
                                            <box-icon
                                                name="accessibility"
                                                color="#10B981"
                                                class="w-4 h-4 mr-2"
                                                size="sm"
                                            ></box-icon>
                                            Quyền truy cập trọn đời
                                        </li>
                                        <li className="flex items-center">
                                            <box-icon
                                                name="medal"
                                                color="#10B981"
                                                class="w-4 h-4 mr-2"
                                                size="sm"
                                            ></box-icon>
                                            Chứng chỉ hoàn thành
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Kết thúc cột phải */}
                </div>
            </div >
            {/* Kết thúc nội dung chính */}
        </>
    );
};
