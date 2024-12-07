import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;
import axios from "axios";
import { formatCurrency } from "@/components/Formatcurrency/formatCurrency";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { CartSkeleton } from "../skeletonEffect/skeleton";
import { BookOpen, Calculator, ClipboardList, CreditCard, ListOrdered, Wallet } from "lucide-react";

export const Cart = () => {
    const [cart, setCart] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false)
    const token = localStorage.getItem("access_token");

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("access_token");

                // Fetch đồng thời cả courses và cart
                const [coursesResponse, cartResponse] = await Promise.all([
                    axios.get(`${API_URL}/courses`, {
                        headers: { "x-api-secret": `${API_KEY}` },
                    }),
                    axios.get(`${API_URL}/auth/cart`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }),
                ]);

                setCourses(coursesResponse.data);
                setCart(cartResponse.data); // Cập nhật state cho cart
                console.log(cartResponse.data.orders);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
            finally {
                setLoading(false)
            }
        };

        fetchAllData();
    }, []); // Chỉ chạy một lần khi component mount

    // Hàm xóa khóa học khỏi giỏ hàng
    const deleteCourseFromCart = async (orderId, courseId) => {
        const { isConfirmed } = await Swal.fire({
            title: "Xác nhận xóa",
            text: "Bạn có chắc chắn muốn xóa khóa học này khỏi giỏ hàng?",
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

            if (!token) {
                throw new Error("Không có token. Vui lòng đăng nhập lại.");
            }
            // Gửi yêu cầu DELETE với cả `order_id` và `course_id`
            await axios.delete(`${API_URL}/auth/cart/remove-item`, {
                headers: {
                    "x-api-secret": API_KEY,
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                data: { order_id: orderId, course_id: courseId }, // Gửi cả `order_id` và `course_id`
            });
            // Reload lại toàn bộ trang sau khi xóa thành công
            window.location.reload();
            // Cập nhật lại giỏ hàng sau khi xóa thành công
            setCart((prevCart) =>
                prevCart.map((order) => ({
                    ...order,
                    order_details: order.order_details.filter(
                        (detail) => detail.course_id !== courseId
                    ),
                }))
            );
        } catch (error) {
            console.error(
                "Error deleting course from cart:",
                error.response?.data || error.message
            );
            toast.error(
                `Lỗi: ${error.response?.data?.message || error.message}`
            );
        }
    };
    const calculateTotalPrice = () => {
        return cart.reduce((total, item) => {
            const itemTotal = item.order_details.reduce((subtotal, detail) => {
                // Kiểm tra nếu giá trị detail.price là hợp lệ
                const price = parseFloat(detail.price); // Chuyển đổi giá thành số
                return subtotal + (isNaN(price) ? 0 : price); // Nếu giá không hợp lệ, cộng 0
            }, 0);
            return total + itemTotal;
        }, 0);
    };
    const calculateTotalItems = () => {
        return cart.reduce((total, item) => {
            // Đếm số lượng order_details trong mỗi đơn hàng
            return total + item.order_details.length;
        }, 0);
    };
    const totalPrice = calculateTotalPrice();

    const renderCart = () => {
        return cart.map((item, index) => (
            <div key={index} className="mb-6 bg-white rounded-lg  ">
                <div className="flex items-center justify-between mb-2">
                    {/* <p className="font-semibold text-lg">Đơn hàng #{item.order_id}</p> */}
                </div>

                {item.order_details.map((cart, cartIndex) => {
                    const course = courses.find(
                        (c) => c.course_id === cart.course_id
                    );
                    return (
                        <div
                            key={cartIndex}
                            className="flex items-center py-3 border-t last:border-b-0"
                        >
                            <span className="mr-2 font-bold text-sm">{cartIndex + 1}</span> {/* Kích thước chữ nhỏ hơn */}

                            <img
                                alt="Course Image"
                                className="sm:w-48 sm:h-28 w-52 g-24 ml-2 flex-shrink-0 rounded-2xl object-cover" // Kích thước hình ảnh nhỏ hơn
                                src={
                                    course
                                        ? course.img
                                        : "default-image-url.jpg"
                                }
                            />
                            <div className="ml-2 flex-grow flex flex-col">
                                <div className="md:flex justify-between items-center">
                                    <div className="md:w-3/5 pl-5">
                                        <p className="font-bold md:text-lg text-base md:line-clamp-1 line-clamp-2 uppercase ">
                                            {course
                                                ? course.title
                                                : "Khóa học không tồn tại"}
                                        </p>
                                        <p className="text-sm text-black mt-1 break-words font-normal line-clamp-2 ">
                                            <span>{cart.course.slug}</span>
                                        </p>
                                    </div>
                                    <p className="font-bold text-gray-400 text-base md:w-1/5 text-right flex justify-between sm:justify-normal md:flex-col gap-5 sm:my-3 md:my-0">
                                        <div className="pricing text-[#2F57EF] font-medium">
                                            {formatCurrency(cart.price)}
                                        </div>
                                        <button onClick={() => deleteCourseFromCart(item.order_id, cart.course_id)}
                                            className="text-black hover:text-red-500 text-right"
                                            aria-label="Xóa khóa học">
                                            <box-icon name='trash-alt' color="currentColor"></box-icon>
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        ));




    };


    return (
        <> {loading ? (
            // Hiển thị skeleton trong khi đang tải
            <div className="p-10 md:my-5 my-2 max-w-screen-xl mx-auto">
                <CartSkeleton className="h-48" />
            </div>
        ) : (
            cart.length > 0 ? (
                <div className="p-10 md:my-5 my-2 max-w-screen-xl mx-auto min-h-[500px]">
                    <div className="container mx-auto">
                        <h1 className="lg:text-5xl md:text-4xl text-3xl text-center md:text-left font-bold md:mb-6 mb-3">Giỏ hàng</h1>
                        <div className="bg-white">
                            <div className="mb-4 text-center md:text-left">
                                <p className="text-gray-600 mt-2">Vui lòng kiểm tra lại thông tin trước khi thanh toán</p>
                            </div>

                            <div>
                                <div className="container mx-auto">
                                    <div className="flex flex-col lg:flex-row justify-between lg:gap-10">
                                        {/* Cột bên trái: Danh sách sản phẩm */}
                                        <div className="flex flex-col justify-between lg:w-2/3 w-full">
                                            {renderCart()}
                                        </div>

                                        {/* Cột bên phải: Chỉ hiển thị khi giỏ hàng có sản phẩm */}
                                        <div className="bg-white rounded-3xl box-shadow-lg p-6 lg:w-1/3 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_-10px_15px_-3px_rgba(0,0,0,0.1)]">
                                            {/* Phần header với số lượng sản phẩm */}
                                            <div className="border-b pb-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <ClipboardList className="w-5 h-5 text-gray-500" />
                                                        <span className="text-gray-500 text-base">
                                                            Số lượng
                                                        </span>
                                                    </div>
                                                    <span className="font-medium text-black">
                                                        {calculateTotalItems()} khóa học
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Phần tổng tiền */}
                                            <div className="py-4 border-b">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Wallet className="w-5 h-5 text-gray-500" />
                                                        <span className="text-gray-500 text-base">
                                                            Tổng tiền
                                                        </span>
                                                    </div>
                                                    <span className="font-bold text-2xl text-black">
                                                        {formatCurrency(totalPrice)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Phần button thanh toán */}
                                            <div className="pt-4">
                                                <Link to="/payment">
                                                    <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-3 rounded-3xl transition duration-200 ease-in-out flex items-center justify-center gap-2">
                                                        <span>Thanh toán ngay</span>
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // Nếu không có giỏ hàng
                <div className="flex flex-col items-center justify-center h-full my-32">
                    <img
                        src="https://maydongphucyte.com/default/template/img/cart-empty.png"
                        alt="Giỏ hàng trống"
                        className="w-80 h-60 object-cover"
                    />
                    <p className="mt-4 md:text-2xl text-lg px-5 font-semibold text-gray-600 text-center md:text-left">
                        Giỏ hàng của bạn đang trống. Hãy tìm mua cho mình một khóa học nhé
                    </p>
                    <Link to="/">
                        <div className="flex items-center justify-center gap-3 md:mt-10 mt-5">
                            <box-icon name='arrow-back' color="gray"></box-icon>
                            <p className="text-gray-500 font-bold md:text-xl text-base">Về lại trang chủ</p>
                        </div>
                    </Link>
                </div>
            )
        )}
        </>

    );
};
