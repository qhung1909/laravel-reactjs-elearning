import { useState, useEffect } from "react";
const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;
import axios from "axios";
import { formatCurrency } from "@/components/Formatcurrency/formatCurrency";
import { Toaster, toast } from "react-hot-toast";
export const Payment = () => {
    const [coupon, setCoupon] = useState("");
    const [cart, setCart] = useState([]);
    const [courses, setCourses] = useState([]);
    const [discount, setDiscount] = useState(0);
    const [orderId, setOrderId] = useState(null);
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
                setCart(cartResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchAllData();
    }, []);
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

    const totalPrice = calculateTotalPrice(); // Tổng tiền khi cộng các sp trong cart
    const finalPrice = totalPrice - discount; // Thành tiền sau khi trừ giảm giá

    const handleApplyCoupon = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.post(
                `${API_URL}/check-discount`,
                { name_coupon: coupon },
                {
                    headers: {
                        "x-api-secret": `${API_KEY}`,
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.data && response.data.name_coupon) {
                let appliedDiscount = 0;
                // Kiểm tra xem là giảm theo discount_price hay percent_discount
                if (response.data.discount_price) {
                    // Giảm giá theo giá tiền
                    appliedDiscount = response.data.discount_price;
                } else if (response.data.percent_discount) {
                    // Giảm giá theo phần trăm
                    const discountAmount =
                        (totalPrice * response.data.percent_discount) / 100;
                    // Kiểm tra max_discount nếu có
                    appliedDiscount = response.data.max_discount
                        ? Math.min(discountAmount, response.data.max_discount)
                        : discountAmount;
                }

                // Cập nhật giá trị discount
                setDiscount(appliedDiscount);
                // Thông báo thành công
                toast.success("Áp dụng mã giảm giá thành công!");
            } else {
                // Thông báo lỗi nếu mã không hợp lệ
                toast.error("Có lỗi xảy ra khi áp dụng mã giảm giá.");
            }
        } catch (error) {
            console.error("Có lỗi xảy ra:", error);
            if (error.response) {
                toast.error("Mã giảm giá không hợp lệ.");
            } else {
                toast.error(
                    "Không thể kết nối đến server. Vui lòng thử lại sau."
                );
            }
        }
    };

    const handlePayment = async () => {
        const token = localStorage.getItem("access_token");

        if (!token) {
            toast.error("Bạn cần đăng nhập để thực hiện thanh toán.");
            return;
        }

        const orderInfo = cart
            .flatMap((item) =>
                item.order_details.map(
                    (detail) =>
                        `${
                            courses.find(
                                (c) => c.course_id === detail.course_id
                            )?.title || "Khóa học"
                        } x 1`
                )
            )
            .join(", ");

        const orderType = "purchase";
        const orderAmount = finalPrice;
        // Log orderId để kiểm tra
        console.log("Order ID:", orderId);
        // Sử dụng orderId từ state
        if (!orderId) {
            toast.error("Không tìm thấy mã đơn hàng.");
            return;
        }
        try {
            const response = await axios.post(
                `${API_URL}/vnpay-payment`,
                {
                    vnp_OrderInfo: orderInfo,
                    vnp_OrderType: orderType,
                    vnp_Amount: orderAmount,
                    vnp_Txnref: orderId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.code === "00") {
                window.location.href = response.data.data;
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error("Có lỗi xảy ra:", error);
        }
    };

    const renderInfoOrder = () => {
        return (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <h2 className="text-xl font-semibold bg-yellow-100 p-4 border-b border-yellow-200 text-black-800">
                    Thông tin đơn hàng
                </h2>
                <div className="divide-y divide-gray-200">
                    {cart.flatMap((item, index) =>
                        item.order_details.map(
                            (orderDetail, orderDetailIndex) => {
                                const course = courses.find(
                                    (c) => c.course_id === orderDetail.course_id
                                );

                                // Lưu order_id vào state (có thể chỉ lưu một lần nếu cần)
                                if (!orderId) {
                                    setOrderId(orderDetail.order_id);
                                }

                                return (
                                    <div
                                        key={`${index}-${orderDetailIndex}`}
                                        className="flex items-center space-x-4 p-4 hover:bg-gray-50 transition duration-150 ease-in-out"
                                    >
                                        <img
                                            src={
                                                course?.img ||
                                                "/src/assets/images/default.jpg"
                                            }
                                            alt={
                                                course?.title || "Course Image"
                                            }
                                            className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                                        />
                                        <div className="flex-grow">
                                            <h3 className="text-base font-medium text-gray-900 line-clamp-2">
                                                {course?.title ||
                                                    "Tên khóa học"}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {course.slug}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-semibold text-black-600">
                                                {formatCurrency(
                                                    orderDetail.price
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                );
                            }
                        )
                    )}
                </div>
                <Toaster />
            </div>
        );
    };

    return (
        <div className="max-w-5xl mx-auto p-6 mb-10">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">
                Thanh toán khoá học
            </h1>
            <p className="text-base text-gray-600 mb-6">
                Chúng tôi cam kết bảo vệ thông tin thanh toán của bạn.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
                <div>{renderInfoOrder()}</div>
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <h2 className="text-xl font-semibold bg-yellow-100 p-4 border-b border-yellow-200 text-black-800">
                        Thông tin thanh toán
                    </h2>
                    <div className="p-6">
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between items-center text-base">
                                <span className="text-gray-600">Tổng tiền</span>
                                <span className="font-semibold text-black-600">
                                    {formatCurrency(totalPrice)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-base">
                                <span className="text-gray-600">
                                    Giảm giá coupon
                                </span>
                                <span className="font-semibold text-black-600">
                                    - {formatCurrency(discount)}
                                </span>
                            </div>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    placeholder="Nhập mã giảm giá"
                                    value={coupon}
                                    onChange={(e) => setCoupon(e.target.value)}
                                    className="flex-grow py-2 px-4 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                />
                                <button
                                    onClick={handleApplyCoupon}
                                    className="px-4 py-2 bg-yellow-400 text-gray-800 rounded-lg font-semibold hover:bg-yellow-500 transition-colors duration-200"
                                >
                                    Áp dụng
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center font-semibold text-lg mb-6 pt-4 border-t border-gray-200">
                            <span>Thành tiền:</span>
                            <span className="text-black-600">
                                {formatCurrency(finalPrice)}
                            </span>
                        </div>

                        {/* Phần lựa chọn phương thức thanh toán */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Phương thức thanh toán
                            </h3>
                            <div className="flex space-x-4">
                                {" "}
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="VNPay"
                                        className="mr-2 hidden"
                                    />
                                    <img
                                        src="/src/assets/images/vnpay-icon-site.png"
                                        alt="VNPay"
                                        className="w-20 h-20"
                                    />
                                </label>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 text-center mb-2">
                            Nhấn Thanh toán đồng nghĩa với việc bạn đã đọc và
                            chấp thuận với
                            <a
                                href="#"
                                className="text-black-600 hover:underline"
                            >
                                {" "}
                                Điều khoản dịch vụ
                            </a>
                            .
                        </p>
                        <button
                            onClick={handlePayment}
                            className="w-full py-3 bg-yellow-400 text-lg text-gray-800 rounded-lg font-semibold hover:bg-yellow-500 transition-colors duration-200 "
                        >
                            Thanh toán
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
