import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;
import axios from "axios";
import { formatCurrency } from "@/components/Formatcurrency/formatCurrency";
import { Link } from "react-router-dom";

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

    const totalPrice = calculateTotalPrice();

    const renderCart = () => {

        return cart.map((item, index) => (
            <div key={index} className="mb-6 bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                    {/* <p className="font-semibold text-lg">Đơn hàng #{item.order_id}</p> */}
                </div>

                {item.order_details.map((detail, detailIndex) => {
                    const course = courses.find(
                        (c) => c.course_id === detail.course_id
                    );
                    return (
                        <div
                            key={detailIndex}
                            className="flex items-center py-3 border-b last:border-b-0"
                        >
                            <span className="mr-2 font-bold text-sm">{detailIndex + 1}</span> {/* Kích thước chữ nhỏ hơn */}
                            <input
                                className="mr-2 h-4 w-4 flex-shrink-0 rounded border-gray-300 checked:bg-yellow-500"
                                defaultChecked
                                type="checkbox"
                                aria-label="Chọn khóa học"
                            />
                            <img
                                alt="Course Image"
                                className="w-24 h-16 flex-shrink-0 rounded-md object-cover" // Kích thước hình ảnh nhỏ hơn
                                src={
                                    course
                                        ? course.img
                                        : "default-image-url.jpg"
                                }
                            />
                            <div className="ml-2 flex-grow flex flex-col">
                                <div className="flex justify-between items-center">
                                    <div className="w-3/5">
                                        <p className="font-bold text-xs sm:text-sm break-words ">
                                            {course
                                                ? course.title
                                                : "Khóa học không tồn tại"}
                                        </p>
                                        <p className="text-xs text-gray-600 mt-1 break-words ">
                                            bởi AntLearn
                                        </p>
                                    </div>
                                    <p className="font-bold text-black text-base w-1/5 text-right ">
                                        {formatCurrency(detail.price)}
                                        <button onClick={() => deleteCourseFromCart(item.order_id, detail.course_id)}
                                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full ml-2"
                                            aria-label="Xóa khóa học">
                                            <box-icon name="trash-alt" color="#ff0015"></box-icon>
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
        <div className="bg-gray-100 p-10 my-10">
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-6">Giỏ hàng</h1>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-bold">
                            {cart.length || 0} đơn hàng
                        </span>
                        {cart.length > 0 && (
                            <div className="flex items-center">
                                {/* <input
                                    className="mr-2"
                                    defaultChecked
                                    id="selectAll"
                                    type="checkbox"
                                    aria-label="Chọn tất cả"
                                />
                                <label htmlFor="selectAll">Chọn tất cả</label> */}
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="container mx-auto py-8">

                            {/* Kiểm tra xem có giỏ hàng không */}

                            {cart.length > 0 ?
                                // Nếu có giỏ hàng
                                (
                                    <div className="flex flex-col lg:flex-row">
                                        {/* Cột bên trái: Danh sách sản phẩm */}
                                        <div className="flex flex-col justify-between p-2 border-b mr-20 w-full lg:w-2/3">
                                            {renderCart()}
                                        </div>

                                        {/* Cột bên phải: Chỉ hiển thị khi giỏ hàng có sản phẩm */}
                                        {cart.length > 0 && (
                                            <div className="bg-white px-6 rounded-lg shadow-lg box-shadow-lg w-full lg:w-1/4 mt-4 h-40  lg:mt-0">
                                                <div className="flex justify-between mb-2">
                                                    <span className="font-bold text-xl">
                                                        Tổng
                                                    </span>
                                                    {/* <span className="font-bold text-2xl text-red-600">
                                                {formatCurrency(totalPrice)}
                                            </span> */}
                                                </div>
                                                <div className="font-bold text-3xl mb-5 text-red-600">
                                                    {formatCurrency(totalPrice)}
                                                </div>
                                                <Link to="/payment">
                                                    <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white text-lg font-bold py-3 rounded-xl">
                                                        Thanh toán
                                                    </button>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                ) :
                                // Nếu không có giỏ hàng
                                (
                                    <div className="flex flex-col items-center justify-center h-full">
                                        <img
                                            src="https://maydongphucyte.com/default/template/img/cart-empty.png"
                                            alt="Giỏ hàng trống"
                                            className="w-32 h-32 object-cover"
                                        />
                                        <p className="mt-4 text-lg font-semibold text-gray-600">
                                            Giỏ hàng của bạn đang trống.
                                        </p>
                                    </div>
                                )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
