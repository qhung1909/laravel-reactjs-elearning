import { useState, useEffect } from "react";
const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;
import axios from "axios";
import { formatCurrency } from "@/components/Formatcurrency/formatCurrency";
export const Payment = () => {
    const [coupon, setCoupon] = useState("");
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
    const renderInfoOrder = () => {
        return (
            <div className="mb-8  max-w-2xl bg-white-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">
                    Thông tin đơn hàng
                </h2>
                <div className="space-y-5">
                    {cart.map((item, index) => {
                        return item.order_details.map(
                            (orderDetail, orderDetailIndex) => {
                                const course = courses.find(
                                    (c) => c.course_id === orderDetail.course_id
                                );
                                return (
                                    <div
                                        key={orderDetailIndex}
                                        className="flex items-start space-x-4"
                                    >
                                        <img
                                            src={
                                                course?.img ||
                                                "/src/assets/images/default.jpg"
                                            }
                                            alt={
                                                course?.title || "Course Image"
                                            }
                                            className="w-20 h-20 object-cover rounded flex-shrink-0"
                                        />
                                        <div className="flex-grow">
                                            <h3 className="text-lg font-semibold mb-1">
                                                {course?.title ||
                                                    "Tên khóa học"}
                                            </h3>
                                            <p className="text-base text-blue-500">
                                                {formatCurrency(
                                                    orderDetail.price
                                                )}{" "}
                                            </p>
                                        </div>
                                    </div>
                                );
                            }
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white">
            <h1 className="text-2xl font-bold mb-2">Thanh toán khoá học</h1>
            <p className="text-base text-gray-600 mb-6">
                Chúng tôi cam kết bảo vệ thông tin thanh toán của bạn.
            </p>
            {/* Phần thanh toán */}
            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">
                        Phương thức thanh toán
                    </h2>
                    <div className="space-y-3">
                        <div className="p-3 bg-white border border-gray-200 rounded-lg flex items-center space-x-3 ">
                            <img
                                src="/src/assets/images/vnpay.jpg"
                                alt="VNPay"
                                className="w-10 h-10"
                            />
                            <span className="text-base">VNPay</span>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Thông tin</h2>
                    <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-base">
                            <span>Tổng tiền</span>
                            <span>{formatCurrency(totalPrice)}</span>
                        </div>
                    </div>

                    {/* Input mã khuyến mại */}
                    <div className="mb-4 flex space-x-2">
                        <input
                            type="text"
                            placeholder="Nhập coupon"
                            value={coupon}
                            onChange={(e) => setCoupon(e.target.value)}
                            className="flex-grow py-2 px-4 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-blue-500"
                        />
                        <button
                            // onClick={handleApplyCoupon}
                            className="w-auto px-4 py-2 bg-yellow-400 text-lg text-gray-800 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
                        >
                            Áp dụng
                        </button>
                    </div>

                    <div className="flex justify-between font-semibold text-lg mb-4">
                        <span>Thành tiền:</span>
                        <span>{formatCurrency(totalPrice)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                        Nhấn Mua ngay đồng nghĩa với việc bạn đã đọc và chấp
                        thuận với
                        <a href="#" className="text-blue-500 hover:underline">
                            {" "}
                            Điều khoản dịch vụ
                        </a>
                        .
                    </p>
                    <button className="w-full py-3 bg-yellow-400 text-lg text-gray-800 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
                        Mua ngay
                    </button>
                    <p className="text-sm text-gray-500 mt-3 text-center">
                        Bảo hành 14 ngày
                    </p>
                </div>
            </div>
            {/* Thông tin đơn hàng */}
            {renderInfoOrder()}
        </div>
    );
};
