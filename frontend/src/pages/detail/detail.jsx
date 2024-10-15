import "./detail.css";
import { formatCurrency } from "@/components/Formatcurrency/formatCurrency";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Star } from "lucide-react";
import { Edit, Trash } from "lucide-react"; // Biểu tượng sửa và xóa
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Toaster, toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { SkeletonLoaderBanner, SkeletonLoaderProduct } from "../skeletonEffect/skeleton";
import { Skeleton } from "@/components/ui/skeleton";
const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

export const Detail = () => {
    const [detail, setDetail] = useState([]);
    const { slug } = useParams();
    const [loading, setLoading] = useState([]);
    // JS Section 1
    const [isSection1Expanded, setIsSection1Expanded] = useState(false);
    const toggleSection1 = () => {
        setIsSection1Expanded(!isSection1Expanded);
    };
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

    // Format ngày tháng
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        // Kiểm tra nếu date không hợp lệ
        if (isNaN(date)) return "Ngày không hợp lệ";

        return format(date, "dd/MM/yyyy - HH:mm a");
    };
    // User
    const [user, setUser] = useState([]);
    // Fetch thông tin người dùng
    const fetchUser = async () => {
        setLoading(true)
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
            setLoading(false)
        }
    };
    useEffect(() => {
        fetchUser();
    }, []);

    // Rating & comment
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [comments, setComments] = useState([]);
    const [items, setItems] = useState([]);
    const [cartItems, setCartItems] = useState([]);

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
            } else {
                console.error("Dữ liệu không phải là mảng:", res.data.comments);
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
                fetchComments(res.data.course_id); // Truyền course_id vào hàm fetchComments
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
            setLoading(false); // Kết thúc tải dữ liệu
        }
    };

    useEffect(() => {
        if (slug) {
            fetchDetail();
        }
    }, [slug]);

    const addToCart = async () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            console.error("No token found");
            toast.error("Bạn chưa đăng nhập");
            return;
        }

        const isAlreadyAdded = cartItems.some(
            (item) => item.course_id === detail.course_id
        );
        if (isAlreadyAdded) {
            toast.error("Sản phẩm này đã có trong giỏ hàng.");
            return;
        }

        const newItem = {
            course_id: detail.course_id,
            price: detail.price_discount || detail.price,
        };

        console.log("Item trước khi gửi:", newItem);

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
                    errorData.message || "Có lỗi xảy ra khi cập nhật giỏ hàng"
                );
                return;
            }

            const data = await res.json();
            console.log("Order:", data.order);
            setLoading(true)
            toast.success("Thêm thành công khóa học vào giỏ hàng!");

            setCartItems((prevItems) => [...prevItems, newItem]);
        } catch (error) {
            console.log("Error:", error);
            toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };



    const renderBannerDetail = loading ? (
        <SkeletonLoaderBanner />
    ) : (
        <div
            className="bg-gray-900 p-6 text-white"
            style={{ backgroundColor: "#2d2f31" }}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-44">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Cột trái (Văn bản) */}
                    <div className="col-span-1 lg:col-span-8">
                        {/* Điều hướng Breadcrumb */}
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <Link to="/" className="text-[#C0C4FC]">
                                        Trang chủ
                                    </Link>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <Link
                                        to="/courses"
                                        className="text-[#C0C4FC]"
                                    >
                                        Khóa học
                                    </Link>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="text-[#C0C4FC]">
                                        Chi tiết
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>

                        {/* Tiêu đề */}
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                            {detail.title}
                        </h1>
                        {/* Mô tả */}
                        <p className="text-base sm:text-lg md:text-xl text-white-400 mb-4">
                            {detail.description}
                        </p>
                        {/* Đánh giá */}
                        <div className="flex items-center mb-2">
                            <span className="text-yellow-500 text-sm font-semibold">
                                4,6
                            </span>
                            <span className="ml-2 text-sm text-white-400">
                                (43 xếp hạng)
                            </span>
                            <span className="ml-4 text-sm text-white-400">
                                382 học viên
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-white-400 flex items-center">
                            <box-icon
                                name="calendar"
                                color="#9CA3AF"
                                className="mr-2"
                                size="sm"
                            />
                            Ngày cập nhật gần nhất{" "}
                            {formatDate(detail.updated_at)}
                        </p>
                        <p className="text-xs sm:text-sm text-white-400 flex items-center mt-1">
                            <box-icon
                                name="globe"
                                color="#9CA3AF"
                                className="mr-2"
                                size="sm"
                            />
                            Vietnamese
                        </p>
                    </div>
                    {/* Cột phải (Hình ảnh) */}
                    <div className="col-span-1 lg:col-span-4 flex justify-center items-center">
                        <img
                            src="/src/assets/images/inclusion2.jpg"
                            alt="Inclusion "
                            className="max-w-full"
                            style={{ maxHeight: 200 }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingRating, setEditingRating] = useState(0);
    const [editingContent, setEditingContent] = useState("");
    // Hàm kích hoạt chế độ chỉnh sửa
    const editComment = (comment) => {
        setEditingCommentId(comment.comment_id); // Lưu ID của bình luận đang chỉnh sửa
        setEditingRating(comment.rating); // Lưu giá trị rating hiện tại
        setEditingContent(comment.content); // Lưu nội dung bình luận hiện tại
    };
    // Hàm hủy chỉnh sửa
    const cancelEdit = () => {
        setEditingCommentId(null); // Thoát chế độ chỉnh sửa
        setEditingRating(0); // Reset rating
        setEditingContent(""); // Reset content
    };
    const updateComment = async (commentId) => {
        setLoading(true)
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
            toast.success("Sửa thành công bình luận!");
            fetchDetail();
        } catch (error) {
            console.error(
                "Error updating comment:",
                error.response?.data || error.message
            );
            toast.error(error.response.data.error);
        } finally {
            setLoading(false)
        }
    };

    const renderComments = loading ? (
        <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    ) : (
        <div className="space-y-3">
            {comments.length > 0 ? (
                comments.map((comment) => (
                    <div key={comment.comment_id} className="flex items-start">
                        <Avatar>
                            <AvatarFallback>Avatar</AvatarFallback>
                            <AvatarImage
                                src="https://github.com/shadcn.png"
                                alt="@shadcn"
                            />
                        </Avatar>
                        <div className="ml-3 w-full">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <span className="font-semibold">
                                        user_id: {comment.user_id}
                                    </span>
                                    <span className="text-gray-500 text-sm ml-2">
                                        {formatDate(comment.updated_at)}
                                    </span>
                                </div>

                                {user && user.user_id === comment.user_id && (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => editComment(comment)}
                                            className="text-blue-500"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                deleteComment(
                                                    comment.comment_id
                                                )
                                            }
                                            className="text-red-500"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Hiển thị form chỉnh sửa nếu đang trong chế độ chỉnh sửa */}
                            {editingCommentId === comment.comment_id ? (
                                <div>
                                    <div className="flex items-center space-x-1 mt-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-6 h-6 cursor-pointer ${i < editingRating
                                                    ? "text-yellow-500"
                                                    : "text-gray-300"
                                                    }`}
                                                fill="currentColor"
                                                onClick={() =>
                                                    setEditingRating(i + 1)
                                                }
                                            />
                                        ))}
                                    </div>

                                    <textarea
                                        value={editingContent}
                                        onChange={(e) =>
                                            setEditingContent(e.target.value)
                                        }
                                        className="w-full border rounded p-2 mt-1"
                                    />
                                    <div className="mt-2">
                                        <button
                                            onClick={() =>
                                                updateComment(
                                                    comment.comment_id
                                                )
                                            }
                                            className="bg-blue-500 text-white px-3 py-1 rounded"
                                        >
                                            Lưu
                                        </button>
                                        <button
                                            onClick={cancelEdit}
                                            className="bg-gray-500 text-white px-3 py-1 rounded ml-2"
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="text-yellow-500 flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                fill="currentColor"
                                                className={`w-3 h-3 ${i <
                                                    parseFloat(comment.rating)
                                                    ? "text-yellow-500"
                                                    : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="mt-1 text-sm">
                                        {comment.content}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                !loading && comments.length === 0 && <p>Chưa có bình luận nào.</p>
            )}
            <Toaster />
        </div>
    );

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
        setLoading(true);
        try {
            const commentData = {
                rating,
                content: comment,
            };

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
            // Reset comment và rating
            setComment("");
            setRating(0);
            setErrorMessage("");
            fetchDetail(); // Fetch lại chi tiết sau khi thêm comment
            toast.success("Đăng thành công bình luận!");
        } catch (error) {
            // Kiểm tra nếu phản hồi lỗi từ backend chứa thông báo
            if (
                error.response &&
                error.response.data &&
                error.response.data.error
            ) {
                toast.error(error.response.data.error); // Hiển thị thông báo từ backend
            } else {
                setErrorMessage("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
            }
        } finally {
            setLoading(false)
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
                        <h2 className="text-2xl font-bold mb-4">
                            Khám phá các chủ đề liên quan
                        </h2>
                        <div className="flex flex-wrap space-x-2 mb-6">
                            <span className="custom-tag">
                                <a href="#">Python</a>
                            </span>
                            <span className="custom-tag">
                                <a href="#">Ngôn ngữ lập trình</a>
                            </span>
                            <span className="custom-tag">
                                <a href="#">Phát triển</a>
                            </span>
                        </div>
                        {/* Section 1 */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-4">
                                Nội dung bài học
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ul className="space-y-2">
                                    {/* Danh sách trái */}
                                    <li className="flex items-start">
                                        <span>- </span>
                                        <span className="ml-2">
                                            Hiểu rõ đặc điểm của ngôn ngữ lập
                                            trình Python và các ứng dụng có thể
                                            phát triển bằng ngôn ngữ này
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <span>- </span>
                                        <span className="ml-2">
                                            Nắm rõ cú pháp cơ bản của Python,
                                            cách khai báo biến
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <span>- </span>
                                        <span className="ml-2">
                                            Nắm được các phép toán số học và
                                            phép toán logic trong Python
                                        </span>
                                    </li>
                                    {isSection1Expanded && (
                                        <>
                                            <li className="flex items-start">
                                                <span>- </span>
                                                <span className="ml-2">
                                                    Nắm được kiểu dữ liệu List,
                                                    Tuple và Dictionary trong
                                                    Python và ứng dụng
                                                </span>
                                            </li>
                                            <li className="flex items-start">
                                                <span>- </span>
                                                <span className="ml-2">
                                                    Biết cách lập trình hướng
                                                    đối tượng với lớp (class),
                                                    kế thừa, đa hình
                                                </span>
                                            </li>
                                            <li className="flex items-start">
                                                <span>- </span>
                                                <span className="ml-2">
                                                    Hiểu và ứng dụng các thư
                                                    viện Python (web, khoa học
                                                    dữ liệu, trí tuệ nhân tạo,
                                                    v.v.)
                                                </span>
                                            </li>
                                        </>
                                    )}
                                </ul>
                                <ul className="space-y-2">
                                    {/* Danh sách phải */}
                                    <li className="flex items-start">
                                        <span>- </span>
                                        <span className="ml-2">
                                            Biết cách cài đặt môi trường phát
                                            triển PyCharm để lập trình bằng
                                            Python
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <span>- </span>
                                        <span className="ml-2">
                                            Biết cách xử lý chuỗi (string),
                                            phương thức về chuỗi
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <span>- </span>
                                        <span className="ml-2">
                                            Nắm được cấu trúc điều khiển và vòng
                                            lặp
                                        </span>
                                    </li>
                                    {isSection1Expanded && (
                                        <>
                                            <li className="flex items-start">
                                                <span>- </span>
                                                <span className="ml-2">
                                                    Biết cách sử dụng hàm
                                                    (Function) và Module trong
                                                    Python
                                                </span>
                                            </li>
                                            <li className="flex items-start">
                                                <span>- </span>
                                                <span className="ml-2">
                                                    Cách xử lý lỗi và làm việc
                                                    với File
                                                </span>
                                            </li>
                                            <li className="flex items-start">
                                                <span>- </span>
                                                <span className="ml-2">
                                                    Sử dụng ChatGPT hỗ trợ lập
                                                    trình
                                                </span>
                                            </li>
                                        </>
                                    )}
                                </ul>
                            </div>
                            <button
                                onClick={toggleSection1}
                                className="mt-4 text-blue-600 hover:underline focus:outline-none"
                            >
                                {isSection1Expanded
                                    ? "Ẩn bớt ^"
                                    : "Hiện thêm ^"}
                            </button>
                        </div>
                        {/* Kết thúc Section 1 */}

                        {/* Section 2 */}
                        <div className="bg-white p-6 rounded-lg shadow-md mt-8">
                            {/* Phần công ty cung cấp khóa học */}
                            <div className="text-gray-700 text-lg font-bold mb-4">
                                Các công ty hàng đầu cung cấp khóa học này cho
                                nhân viên
                            </div>
                            <p className="text-gray-600 mb-4">
                                Chúng tôi lựa chọn khóa học này cho tuyển tập
                                khóa học đầu bảng được các doanh nghiệp toàn cầu
                                tin dùng.
                                <a
                                    href="#"
                                    className="text-blue-600 hover:underline"
                                >
                                    Tìm hiểu thêm
                                </a>
                            </p>
                            {/* <div className="flex flex-wrap justify-center gap-4 mb-6">
                                <img
                                    src="https://dummyimage.com/100x40/000/fff&text=Nasdaq"
                                    alt="Nasdaq"
                                    className="h-10"
                                />
                                <img
                                    src="https://dummyimage.com/100x40/000/fff&text=Volkswagen"
                                    alt="Volkswagen"
                                    className="h-10"
                                />
                                <img
                                    src="https://dummyimage.com/100x40/000/fff&text=Box"
                                    alt="Box"
                                    className="h-10"
                                />
                                <img
                                    src="https://dummyimage.com/100x40/000/fff&text=NetApp"
                                    alt="NetApp"
                                    className="h-10"
                                />
                                <img
                                    src="https://dummyimage.com/100x40/000/fff&text=Eventbrite"
                                    alt="Eventbrite"
                                    className="h-10"
                                />
                            </div> */}
                            {/* Phần bài tập coding */}
                            <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-center">
                                <div className="w-full lg:w-1/2">
                                    <h3 className="text-2xl font-bold mb-2">
                                        Bài tập coding
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Khóa học này bao gồm các bài tập coding
                                        được cập nhật của chúng tôi để bạn có
                                        thể thực hành các kỹ năng của bạn khi
                                        học.
                                    </p>
                                    <a
                                        href="#"
                                        className="text-blue-600 hover:underline"
                                    >
                                        Xem bản demo
                                    </a>
                                </div>
                                <div className="w-full lg:w-1/2">
                                    <img
                                        src="./src/assets/images/inclusion.jpg"
                                        alt="Coding Exercise"
                                        className="rounded-lg shadow-md"
                                        style={{
                                            height: 200,
                                            width: 350,
                                            margin: "0 auto",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Kết thúc Section 2 */}
                        {/* Section 3 */}
                        <div className="container mx-auto px-4 py-8">
                            <h2 className="text-2xl font-bold mb-4">
                                Nội dung khóa học
                            </h2>
                            <p className="text-gray-600 mb-6">
                                19 phần - 121 bài giảng - 8 giờ 42 phút tổng
                                thời lượng
                            </p>
                            <div className="bg-white rounded-lg overflow-hidden">
                                <div className="border-b">
                                    <Accordion
                                        type="multiple"
                                        className="w-full"
                                        defaultValue="item-1"
                                    >
                                        {/* Accordion items */}
                                        <AccordionItem value="item-1">
                                            <AccordionTrigger>
                                                Tìm hiểu về python
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                Yes. It adheres to the WAI-ARIA
                                                design pattern.
                                            </AccordionContent>
                                            <AccordionContent>
                                                <Link to="/"> Hoàng bede</Link>
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="item-2">
                                            <AccordionTrigger>
                                                Is it styled?
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                Yes. It comes with default
                                                styles that matches the other
                                                components&apos; aesthetic.
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="item-3">
                                            <AccordionTrigger>
                                                Is it animated?
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                Yes. Its animated by default,
                                                but you can disable it if you
                                                prefer.
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </div>
                            </div>
                            {/* Yêu cầu */}
                            <h2 className="text-2xl font-bold mt-8 mb-4">
                                Yêu cầu
                            </h2>
                            <ul className="list-disc pl-8">
                                <li>
                                    Có kiến thức cơ bản về kiến trúc máy tính
                                </li>
                                <li>
                                    Có máy tính nối mạng Internet để thực hành
                                    các bài tập
                                </li>
                            </ul>
                            {/* Mô tả */}
                            <div
                                className={`section-3-content ${isSection3Expanded ? "" : "collapsed"
                                    } mt-4`}
                            >
                                <h2 className="text-2xl font-bold mb-4">
                                    Mô tả
                                </h2>
                                <p
                                    className="text-black-600 mb-6"
                                    style={{ marginBottom: 10 }}
                                >
                                    Hello bạn,
                                </p>
                                <p className="text-black-600 mb-6">
                                    Khóa học{" "}
                                    <strong>
                                        Lập trình Python từ cơ bản đến nâng cao
                                        thông qua các dự án
                                    </strong>{" "}
                                    được thiết kế để giúp bạn từ bước đầu làm
                                    quen đến thành thạo trong việc sử dụng
                                    Python - một trong những ngôn ngữ lập trình
                                    phổ biến và mạnh mẽ nhất hiện nay. Khóa học
                                    này cung cấp một lộ trình học tập rõ ràng và
                                    thực tế, hướng dẫn bạn qua từng bước cụ thể
                                    từ việc cài đặt môi trường phát triển, khai
                                    báo biến, làm việc với chuỗi ký tự, đến việc
                                    xây dựng các dự án phức tạp hơn.
                                </p>
                                <p className="text-black-600 mb-6">
                                    <strong>Mục tiêu của khóa học:</strong>
                                </p>
                                <ul className="list-disc pl-8 mb-6">
                                    <li>
                                        <strong>
                                            Hiểu biết căn bản về Python:
                                        </strong>{" "}
                                        Bạn sẽ bắt đầu bằng việc tìm hiểu về
                                        ngôn ngữ lập trình Python, cách cài đặt
                                        và tùy chỉnh môi trường phát triển
                                        PyCharm, và viết các chương trình Python
                                        đầu tiên của mình.
                                    </li>
                                    <li>
                                        <strong>
                                            Thành thạo các khái niệm lập trình
                                            cơ bản:
                                        </strong>{" "}
                                        Khóa học sẽ hướng dẫn bạn về khai báo
                                        biến, các kiểu dữ liệu, và cách chuyển
                                        đổi chúng, cũng như cách sử dụng các
                                        phép toán và cấu trúc điều khiển trong
                                        Python.
                                    </li>
                                    <li>
                                        <strong>
                                            Làm việc với các cấu trúc dữ liệu:
                                        </strong>{" "}
                                        Bạn sẽ học cách làm việc với các cấu
                                        trúc dữ liệu quan trọng như chuỗi ký tự,
                                        danh sách (List), bộ (Tuple), từ điển
                                        (Dictionary), và tập hợp (Set).
                                    </li>
                                </ul>
                                <p className="text-black-600 mb-6">
                                    <strong>Lợi ích của khóa học:</strong>
                                </p>
                                <ul className="list-disc pl-8 mb-6">
                                    <li>
                                        Kiến thức toàn diện: Từ những khái niệm
                                        cơ bản đến các ứng dụng nâng cao, khóa
                                        học bao quát mọi khía cạnh cần thiết để
                                        bạn trở thành một lập trình viên Python
                                        tự tin.
                                    </li>
                                    <li>
                                        Thực hành liên tục: Các bài tập thực
                                        hành và dự án cụ thể sẽ giúp bạn áp dụng
                                        ngay những gì đã học vào thực tế.
                                    </li>
                                    <li>
                                        Dễ dàng theo dõi: Với sự phân chia rõ
                                        ràng giữa lý thuyết và thực hành, bạn sẽ
                                        dễ dàng nắm bắt và theo dõi tiến trình
                                        học tập của mình.
                                    </li>
                                    <li>
                                        Cộng đồng hỗ trợ: Bạn sẽ được tham gia
                                        vào một cộng đồng học viên năng động,
                                        nơi bạn có thể trao đổi, thảo luận và
                                        chia sẻ kinh nghiệm với những người cùng
                                        học.
                                    </li>
                                </ul>
                                <p className="text-gray-600 mb-6">
                                    Dù bạn là người mới bắt đầu hay đã có kinh
                                    nghiệm lập trình và muốn mở rộng kiến thức,
                                    khóa học này sẽ trang bị cho bạn những kỹ
                                    năng và hiểu biết cần thiết để tiến xa hơn
                                    trong sự nghiệp lập trình Python. Hãy tham
                                    gia cùng chúng tôi và khám phá tiềm năng của
                                    Python ngay hôm nay!
                                </p>
                                {/* Đối tượng khóa học */}
                                <h2 className="text-2xl font-bold mb-4">
                                    Đối tượng khóa học
                                </h2>
                                <ul className="list-disc pl-8">
                                    <li>
                                        Các bạn sinh viên muốn học lập trình
                                        Python để phát triển các dự án về Web,
                                        IoT, phân tích dữ liệu, AI
                                    </li>
                                </ul>
                            </div>

                            <button
                                onClick={toggleSection3}
                                className="mt-4 text-blue-600 hover:underline focus:outline-none"
                            >
                                {isSection3Expanded
                                    ? "Ẩn bớt ^"
                                    : "Hiện thêm ^"}
                            </button>
                        </div>
                        {/* Kết thúc Section 3 */}

                        {/* Section 4 */}
                        <div className="bg-white-50 py-8 sm:py-12">
                            <div className="container mx-auto px-4">
                                <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
                                    Học viên cũng mua
                                </h2>
                                <div className="space-y-6">
                                    {/* Khóa học 1 */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center bg-white p-4 rounded-lg shadow-md transition duration-300 ease-in-out hover:shadow-lg">
                                        <img
                                            src="/src/assets/images/inclusion2.jpg"
                                            alt="Khóa học 1"
                                            className="w-full sm:w-32 h-48 sm:h-32 object-cover rounded-lg mb-4 sm:mb-0 sm:mr-6"
                                        />
                                        <div className="flex-grow">
                                            <div className="sm:flex sm:justify-between">
                                                <div className="mb-4 sm:mb-0 sm:mr-6">
                                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                                        Machine Learning: Build
                                                        neural networks in 77
                                                        lines of code
                                                    </h3>
                                                    <p className="text-gray-600 text-sm">
                                                        Tổng số 1 giờ • Đã cập
                                                        nhật 1/2019
                                                    </p>
                                                </div>
                                                <div className="flex flex-col sm:items-end">
                                                    <div className="flex items-center mb-2">
                                                        <span className="text-yellow-500 font-bold">
                                                            4,7
                                                        </span>
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-5 w-5 text-yellow-500 ml-1"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                        <span className="text-gray-600 ml-2 flex items-center">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-5 w-5 mr-1"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                            >
                                                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                                            </svg>
                                                            1.865
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between sm:flex-col sm:items-end">
                                                        <div className="flex flex-col sm:items-end">
                                                            <p className="text-lg sm:text-xl font-bold text-black-600">
                                                                ₫ 229.000
                                                            </p>
                                                            <span className="line-through text-gray-400 text-sm">
                                                                ₫ 399.000
                                                            </span>
                                                        </div>
                                                        <button className="ml-4 sm:ml-0 sm:mt-2 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-300">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-6 w-6 text-gray-600"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Nút Hiện thêm */}
                                <div className="text-center mt-6">
                                    <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100">
                                        Hiện thêm
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Kết thúc Section 4 */}
                        {/* Section 5 */}
                        <div className="container mx-auto px-4 py-8">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                                Giảng viên
                            </h2>
                            <div className="flex items-start bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                                {/* Hình ảnh giảng viên */}
                                <Avatar>
                                    <AvatarImage
                                        src="https://github.com/shadcn.png"
                                        alt="@shadcn"
                                    />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div>
                                    {/* Thông tin giảng viên */}
                                    <h3
                                        className="text-2xl font-semibold mb-2"
                                        style={{ color: "#5022c3" }}
                                    >
                                        Toan Bill
                                    </h3>
                                    <p className="text-gray-600 mb-4 text-lg">
                                        Cisco Instructor
                                    </p>
                                    <div className="flex items-center mb-4">
                                        <span className="text-yellow-500 text-2xl font-bold">
                                            4.5
                                        </span>
                                        <box-icon
                                            name="star"
                                            type="solid"
                                            color="#ECC94B"
                                            className="ml-1 text-2xl"
                                        />
                                        <span className="text-gray-600 ml-2 text-lg font-medium">
                                            Xếp hạng giảng viên
                                        </span>
                                    </div>
                                    <ul className="text-gray-600 mb-6 space-y-2">
                                        <li className="flex items-center">
                                            <box-icon
                                                name="star"
                                                type="solid"
                                                color="#718096"
                                                className="w-5 h-5 mr-2"
                                            />
                                            345 đánh giá
                                        </li>
                                        <li className="flex items-center">
                                            <box-icon
                                                name="user"
                                                color="#718096"
                                                className="w-5 h-5 mr-2"
                                            />
                                            1,895 học viên
                                        </li>
                                        <li className="flex items-center">
                                            <box-icon
                                                name="book"
                                                color="#718096"
                                                className="w-5 h-5 mr-2"
                                            />
                                            26 khóa học
                                        </li>
                                    </ul>
                                    {/* Mô tả giảng viên */}
                                    <Accordion
                                        type="single"
                                        collapsible
                                        className="w-full"
                                    >
                                        <AccordionItem value="instructor-description">
                                            <AccordionTrigger
                                                style={{
                                                    textDecoration: "none",
                                                }}
                                            >
                                                Xem thêm
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <p className="text-gray-700 leading-relaxed">
                                                    Hello there! I am Bill Toan.
                                                    I have a masters degree in
                                                    computer system information.
                                                    I have been a Cisco
                                                    instructor since 2010. I
                                                    hold CCNA, CCNP Security,
                                                    and Security+ certification.
                                                    My favorite teaching courses
                                                    are CCNA and CCNP Security.
                                                    I come from a background of
                                                    network security
                                                    engineering, and now I am
                                                    focusing on IoT and OT
                                                    security and applied machine
                                                    learning techniques on
                                                    network security. I have
                                                    worked for over 14+ years on
                                                    building enterprise security
                                                    solutions using Cisco
                                                    products. I have been a
                                                    super-moderator of a network
                                                    security forum named
                                                    Whitehat for more than 10
                                                    years. I love sharing my
                                                    experience with students and
                                                    inspiring them to the
                                                    cybersecurity world.
                                                    <strong>
                                                        {" "}
                                                        Happy Learning!
                                                    </strong>
                                                </p>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </div>
                            </div>
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
                                    ):(<>

                                    {comments.length || 0} Bình luận
                                    </>

                                    )}
                                </h3>
                                <div className="space-y-3 mb-3">
                                    {/*phần chọn sao */}
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
                                        onChange={(e) =>
                                            setComment(e.target.value)
                                        }
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
                                </div>
                                {/* Hiển thị bình luận */}
                                {renderComments}
                            </div>
                        </div>
                        {/* Kết thúc Section 6 */}
                        {/* Section 7 */}
                        <div className="container mx-auto px-4 py-8">
                            <h2 className="text-2xl font-bold mb-6">
                                Các khóa học khác của{" "}
                                <span style={{ color: "#5022c3" }}>
                                    Toan Bill
                                </span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Course 1 */}
                                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <img
                                        src="../img/inclusion.jpg"
                                        alt="Cisco Network Security"
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        {/* Tên khóa học */}
                                        <h3 className="font-bold text-md mb-2">
                                            Cisco Network Security Packet Tracer
                                            Activities...
                                        </h3>
                                        {/* Tên giảng viên */}
                                        <p className="text-xs text-gray-600">
                                            Toan Bill
                                        </p>
                                        {/* Đánh giá */}
                                        <div className="flex items-center mb-2">
                                            <span className="text-yellow-500 font-bold mr-1 text-sm">
                                                4,7
                                            </span>
                                            <span className="text-yellow-500 text-sm">
                                                ★★★★☆
                                            </span>
                                            <span className="text-gray-600 text-xs ml-1">
                                                (31)
                                            </span>
                                        </div>
                                        {/* Thông tin khóa học */}
                                        <p className="text-xs text-gray-600 mb-2">
                                            Tổng số 7 giờ • 69 bài giảng • Trung
                                            cấp
                                        </p>
                                        {/* Giá */}
                                        <p className="font-bold text-lg">
                                            229.000 ₫
                                        </p>
                                        <p className="text-sm line-through text-gray-500">
                                            399.000 ₫
                                        </p>
                                    </div>
                                </div>
                                {/* Course 2 */}
                                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <img
                                        src="../img/inclusion.jpg"
                                        alt="Cisco Network Security"
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        {/* Tên khóa học */}
                                        <h3 className="font-bold text-md mb-2">
                                            Cisco Network Security Packet Tracer
                                            Activities...
                                        </h3>
                                        {/* Tên giảng viên */}
                                        <p className="text-xs text-gray-600">
                                            Toan Bill
                                        </p>
                                        {/* Đánh giá */}
                                        <div className="flex items-center mb-2">
                                            <span className="text-yellow-500 font-bold mr-1 text-sm">
                                                4,7
                                            </span>
                                            <span className="text-yellow-500 text-sm">
                                                ★★★★☆
                                            </span>
                                            <span className="text-gray-600 text-xs ml-1">
                                                (31)
                                            </span>
                                        </div>
                                        {/* Thông tin khóa học */}
                                        <p className="text-xs text-gray-600 mb-2">
                                            Tổng số 7 giờ • 69 bài giảng • Trung
                                            cấp
                                        </p>
                                        {/* Giá */}
                                        <p className="font-bold text-lg">
                                            229.000 ₫
                                        </p>
                                        <p className="text-sm line-through text-gray-500">
                                            399.000 ₫
                                        </p>
                                    </div>
                                </div>
                                {/* Course 3 */}
                                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <img
                                        src="../img/inclusion.jpg"
                                        alt="Cisco Network Security"
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        {/* Tên khóa học */}
                                        <h3 className="font-bold text-md mb-2">
                                            Cisco Network Security Packet Tracer
                                            Activities...
                                        </h3>
                                        {/* Tên giảng viên */}
                                        <p className="text-xs text-gray-600">
                                            Toan Bill
                                        </p>
                                        {/* Đánh giá */}
                                        <div className="flex items-center mb-2">
                                            <span className="text-yellow-500 font-bold mr-1 text-sm">
                                                4,7
                                            </span>
                                            <span className="text-yellow-500 text-sm">
                                                ★★★★☆
                                            </span>
                                            <span className="text-gray-600 text-xs ml-1">
                                                (31)
                                            </span>
                                        </div>
                                        {/* Thông tin khóa học */}
                                        <p className="text-xs text-gray-600 mb-2">
                                            Tổng số 7 giờ • 69 bài giảng • Trung
                                            cấp
                                        </p>
                                        {/* Giá */}
                                        <p className="font-bold text-lg">
                                            229.000 ₫
                                        </p>
                                        <p className="text-sm line-through text-gray-500">
                                            399.000 ₫
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8">
                                <button className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
                                    Báo cáo lạm dụng
                                </button>
                            </div>
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
                                <p className="text-red-500 mb-1">
                                    Giảm {percentDiscount}%
                                </p>
                                <p className="text-sm text-gray-600 mb-2">
                                    6 ngày còn lại với mức giá này!
                                </p>
                                <button
                                    onClick={() => addToCart(items)}
                                    className="w-full bg-yellow-400 text-white py-2 rounded-lg mb-2 hover:bg-yellow-500 transition duration-300"
                                >
                                    Thêm vào giỏ hàng
                                </button>

                                <button className="w-full bg-white text-black border border-black py-2 rounded-lg mb-2 hover:bg-gray-100 transition duration-300">
                                    Mua ngay
                                </button>
                                <p className="text-sm text-center text-gray-600">
                                    Đảm bảo hoàn tiền trong 30 ngày
                                </p>
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
                                    {/* <div className="mt-2">
                                    <h4 className="font-semibold mb-2">
                                        Áp dụng coupon:
                                    </h4>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            placeholder="Nhập mã coupon"
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                                        />
                                        <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-300">
                                            Áp dụng
                                        </button>
                                    </div>
                                </div> */}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Kết thúc cột phải */}
                </div>
            </div>
            {/* Kết thúc nội dung chính */}
        </>
    );
};
