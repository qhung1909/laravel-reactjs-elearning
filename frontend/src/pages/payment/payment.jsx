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
    const [isVoucherApplied, setIsVoucherApplied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [validatedCoupon, setValidatedCoupon] = useState(null);
 
    const fetchCartData = async () => {
        const token = localStorage.getItem("access_token");
        const cartResponse = await axios.get(`${API_URL}/auth/cart`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        setCart(cartResponse.data);
    };
 
    // Reset cart nếu thanh toán thất bại
    const resetCart = async () => {
        const token = localStorage.getItem("access_token");
        try {
            await axios.post(
                `${API_URL}/reset-price`,
                { order_id: orderId },
                {
                    headers: {
                        "x-api-secret": `${API_KEY}`,
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
 
            await fetchCartData();
            setDiscount(0);
            setIsVoucherApplied(false);
            setValidatedCoupon(null);
            setCoupon("");
 
        } catch (error) {
            console.error("Error resetting cart:", error);
            toast.error("Có lỗi xảy ra khi khôi phục giỏ hàng");
        }
    };
 
    // Check payment status từ VNPay redirect
    useEffect(() => {
        const checkPaymentStatus = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const vnp_ResponseCode = urlParams.get('vnp_ResponseCode');
            
            if (vnp_ResponseCode) {
                if (vnp_ResponseCode === '00') {
                    toast.success("Thanh toán thành công!");
                } else {
                    await resetCart();
                    toast.error("Thanh toán thất bại. Giỏ hàng đã được khôi phục.");
                }
                // Xóa params để tránh check lại khi refresh
                window.history.replaceState({}, '', window.location.pathname);
            }
        };
 
        if (orderId) {
            checkPaymentStatus();
        }
    }, [orderId]);
 
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("access_token");
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
            } finally {
                setLoading(false);
            }
        };
 
        fetchAllData();
    }, []);
 
    const calculateTotalPrice = () => {
        return cart.reduce((total, item) => {
            const itemTotal = item.order_details.reduce((subtotal, detail) => {
                const price = parseFloat(detail.price);
                return subtotal + (isNaN(price) ? 0 : price);
            }, 0);
            return total + itemTotal;
        }, 0);
    };
 
    const totalPrice = calculateTotalPrice();
    const finalPrice = isVoucherApplied ? totalPrice - discount : totalPrice;
 
    const handleValidateCoupon = async () => {
        if (isVoucherApplied) {
            toast.error("Chỉ được áp dụng một voucher.");
            return;
        }
    
        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.post(
                `${API_URL}/validate-coupon`,
                { 
                    name_coupon: coupon, 
                    order_id: orderId,
                    total_price: totalPrice
                },
                {
                    headers: {
                        "x-api-secret": `${API_KEY}`,
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            if (response.data && response.data.message === 'Coupon is valid') {
                const discountAmount = response.data.discount_price;
                
                if (discountAmount >= totalPrice) {
                    toast.error("Giá trị giảm giá vượt quá tổng đơn hàng");
                    return;
                }
    
                setDiscount(discountAmount);
                setIsVoucherApplied(true);
                setValidatedCoupon({
                    coupon_id: response.data.coupon_id,
                    name_coupon: coupon,
                    discount_price: discountAmount
                });
                toast.success("Áp dụng mã giảm giá thành công!");
            }
        } catch (error) {
            if (error.response?.data?.message) {
                switch (error.response.data.message) {
                    case "Coupon not found":
                        toast.error("Mã giảm giá không hợp lệ.");
                        break;
                    case "Coupon has expired":
                        toast.error("Mã giảm giá đã hết hạn.");
                        break;
                    case "Coupon is not valid yet":
                        toast.error("Mã giảm giá chưa có hiệu lực.");
                        break;
                    case "Discount exceeds total price":
                        toast.error("Giá trị giảm giá vượt quá tổng đơn hàng.");
                        break;
                    default:
                        toast.error("Có lỗi xảy ra, vui lòng thử lại.");
                }
            } else {
                toast.error("Không thể kết nối đến server.");
            }
        }
    };
 
    const removeCoupon = () => {
        setDiscount(0);
        setIsVoucherApplied(false);
        setCoupon("");
        setValidatedCoupon(null);
        toast.success("Đã xóa mã giảm giá");
    };
 
    const handlePayment = async () => {
        const token = localStorage.getItem("access_token");
 
        if (!token) {
            toast.error("Bạn cần đăng nhập để thực hiện thanh toán.");
            return;
        }
 
        if (!orderId) {
            toast.error("Không tìm thấy mã đơn hàng.");
            return;
        }
 
        try {
            if (validatedCoupon) {
                await axios.post(
                    `${API_URL}/check-discount`,
                    {
                        name_coupon: validatedCoupon.name_coupon,
                        order_id: orderId
                    },
                    {
                        headers: {
                            "x-api-secret": `${API_KEY}`,
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            }
 
            const orderInfo = cart
                .flatMap((item) =>
                    item.order_details.map(
                        (detail) =>
                            `${courses.find(
                                (c) => c.course_id === detail.course_id
                            )?.title || "Khóa học"} x 1`
                    )
                )
                .join(", ");
 
            const response = await axios.post(
                `${API_URL}/vnpay-payment`,
                {
                    vnp_OrderInfo: orderInfo,
                    vnp_OrderType: 'purchase',
                    vnp_Amount: finalPrice,
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
                toast.error(response.data.message || "Có lỗi xảy ra khi thanh toán");
            }
        } catch (error) {
            console.error("Có lỗi xảy ra:", error);
            toast.error("Có lỗi xảy ra trong quá trình thanh toán");
        }
    };
    // Rest of the code remains the same...
    const renderInfoOrder = () => {
        return (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <h2 className="text-xl font-semibold bg-yellow-100 p-4 border-b border-yellow-200 text-black-800">
                    Thông tin đơn hàng
                </h2>
                <div className="divide-y divide-gray-200">
                    {loading ? (
                        <div className="flex flex-col space-y-4 p-4">
                            <div className="flex items-center space-x-4 p-4">
                                <div className="bg-gray-200 w-16 h-16 rounded-md animate-pulse"></div>
                                <div className="flex-grow">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        cart.flatMap((item, index) =>
                            item.order_details.map((orderDetail, orderDetailIndex) => {
                                const course = courses.find(
                                    (c) => c.course_id === orderDetail.course_id
                                );

                                if (!orderId) {
                                    setOrderId(orderDetail.order_id);
                                }

                                return (
                                    <div
                                        key={`${index}-${orderDetailIndex}`}
                                        className="flex items-center space-x-4 p-4 hover:bg-gray-50 transition duration-150 ease-in-out"
                                    >
                                        <img
                                            src={course?.img || "/src/assets/images/default.jpg"}
                                            alt={course?.title || "Course Image"}
                                            className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                                        />
                                        <div className="flex-grow">
                                            <h3 className="text-base font-medium text-gray-900 line-clamp-2">
                                                {course?.title || "Tên khóa học"}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {course.slug}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-semibold text-black-600">
                                                {formatCurrency(orderDetail.price)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )
                    )}
                </div>
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
                                {loading ? (
                                    <div className="bg-gray-200 h-6 rounded w-1/4 animate-pulse"></div>
                                ) : (
                                    <span className="font-semibold text-black-600">
                                        {formatCurrency(totalPrice)}
                                    </span>
                                )}
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
                                {isVoucherApplied ? (
                                    <button
                                        onClick={removeCoupon}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
                                    >
                                        Xóa mã
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleValidateCoupon}
                                        className="px-4 py-2 bg-yellow-400 text-gray-800 rounded-lg font-semibold hover:bg-yellow-500 transition-colors duration-200"
                                    >
                                        Áp dụng
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-between items-center font-semibold text-lg mb-6 pt-4 border-t border-gray-200">
                            <span>Thành tiền:</span>
                            {loading ? (
                                <div className="bg-gray-200 h-6 rounded w-1/3 animate-pulse"></div>
                            ) : (
                                <span className="text-black-600">
                                    {formatCurrency(finalPrice)}
                                </span>
                            )}
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Phương thức thanh toán
                            </h3>
                            <div className="flex space-x-4">
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
                            Nhấn Thanh toán đồng nghĩa với việc bạn đã đọc và chấp thuận với
                            <a href="#" className="text-black-600 hover:underline">
                                {" "}Điều khoản dịch vụ
                            </a>.
                        </p>
                        <button
                            onClick={handlePayment}
                            className="w-full py-3 bg-yellow-400 text-lg text-gray-800 rounded-lg font-semibold hover:bg-yellow-500 transition-colors duration-200"
                        >
                            Thanh toán
                        </button>
                    </div>
                </div>
            </div>
            <Toaster />
        </div>
    );
};