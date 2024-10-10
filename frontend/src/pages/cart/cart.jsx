import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;
import axios from "axios";
import { Link } from "react-router-dom";

const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
};

export const Cart = () => {
    const [cart, setCart] = useState([]);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchAllData = async () => {
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
            } catch (error) {
                console.error("Error fetching data:", error);
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

    const totalPrice = calculateTotalPrice();

    const renderCart = () => {
        if (cart.length === 0) {
            return <p>Giỏ hàng của bạn đang trống.</p>;
        }

        return cart.map((item, index) => (
            <div key={index} className="mb-4 border-b pb-4">
                <div className="flex items-center justify-between">
                    {/* <input
                        className="mr-4 checked:bg-yellow-500"
                        defaultChecked
                        type="checkbox"
                        aria-label="Chọn khóa học"
                    /> */}
                    {/* <div className="ml-4">
                        <p className="font-bold">
                            Đơn hàng ID: {item.order_id}
                        </p>
                    </div> */}
                    <div className="text-right ml-auto">
                        {/* <button className="mt-2">
                            <box-icon
                                name="trash-alt"
                                color="#ff0015"
                                onClick={() =>
                                    deleteCourseFromCart(item.order_id)
                                }
                            ></box-icon>
                        </button> */}
                    </div>
                </div>

                {/* Render thông tin các sản phẩm trong đơn hàng */}
                {item.order_details.map((detail, detailIndex) => {
                    const course = courses.find(
                        (c) => c.course_id === detail.course_id
                    );
                    return (
                        <div
                            key={detailIndex}
                            className="flex items-center mt-2 border-b pb-2"
                        >
                            <input
                                className="mr-4 checked:bg-yellow-500"
                                defaultChecked
                                type="checkbox"
                                aria-label="Chọn khóa học"
                            />
                            <img
                                alt="Course Image"
                                className="w-16 h-16 rounded-sm object-cover"
                                src={
                                    course
                                        ? course.img
                                        : "default-image-url.jpg"
                                }
                            />
                            <div className="ml-4 flex-grow flex justify-between items-center">
                                <p className="font-bold">
                                    {course
                                        ? course.title
                                        : "Khóa học không tồn tại"}
                                </p>
                                <p className="font-bold text-blue-600">
                                    {formatCurrency(detail.price)}
                                </p>
                            </div>
                            <button
                                onClick={() =>
                                    deleteCourseFromCart(
                                        item.order_id,
                                        detail.course_id
                                    )
                                }
                                className="ml-4 text-red-500 hover:text-red-700"
                                aria-label="Xóa khóa học"
                            >
                                <box-icon
                                    name="trash-alt"
                                    color="#ff0015"
                                ></box-icon>
                            </button>
                        </div>
                    );
                })}
            </div>
        ));
    };

    const addToCart = async (couponId) => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            console.error("No token found");
            toast.error("Bạn chưa đăng nhập");
            return;
        }

        const API_URL = import.meta.env.VITE_API_URL; // Đường dẫn API
        try {
            const response = await fetch(`${API_URL}/cart/add`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`, // Thêm token vào header
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ couponId }), // Gửi couponId trong body
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Failed to add to cart:", errorData);
                toast.success("Thêm vào giỏ hàng không thành công");
                return; // Trả về nếu không thành công
            }

            const data = await response.json(); // Lấy dữ liệu phản hồi từ API
            // Xử lý dữ liệu trả về nếu cần, ví dụ như cập nhật giỏ hàng
            console.log("Added to cart successfully:", data);
        } catch (error) {
            console.error("Error adding to cart:", error); // Bắt lỗi
            toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
        }
    };

    return (
        <div className="bg-gray-100">
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-6">Giỏ hàng</h1>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-bold">
                            {cart.length || 0} Đơn hàng
                        </span>
                        <div className="flex items-center">
                            <input
                                className="mr-2"
                                defaultChecked
                                id="selectAll"
                                type="checkbox"
                                aria-label="Chọn tất cả"
                            />
                            <label htmlFor="selectAll">Chọn tất cả</label>
                        </div>
                    </div>
                    <div>
                        <div className="container mx-auto py-8">
                            <div className="flex flex-col lg:flex-row">
                                {/* Cột bên trái: Danh sách sản phẩm */}
                                <div className="flex flex-col justify-between p-2 border-b mr-20 w-full lg:w-2/3">
                                    {/* Sản phẩm */}
                                    {renderCart()}
                                </div>

                                {/* Cột bên phải: Tổng tiền */}
                                <div className="bg-white p-6 rounded-lg shadow-md w-full lg:w-1/3 mt-4 lg:mt-0">
                                    <div className="flex justify-between mb-4">
                                        <span className="font-bold text-lg ">
                                            Tổng
                                        </span>
                                        <span className="font-bold text-lg text-red-600">
                                            {formatCurrency(totalPrice)}
                                        </span>
                                    </div>
                                    <Link to="/payment">
                                        <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 rounded">
                                            Thanh toán
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
