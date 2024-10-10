import { useState } from "react";

export const Payment = () => {
    const [coupon, setCoupon] = useState("");

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
                            <span>Giá gốc</span>
                            <span>đ949,000</span>
                        </div>
                        <div className="flex justify-between text-base">
                            <span>Giá bán</span>
                            <span>đ728,000</span>
                        </div>
                    </div>

                    {/* Input mã khuyến mại */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Nhập coupon"
                            value={coupon}
                            onChange={(e) => setCoupon(e.target.value)}
                            className="w-full py-2 px-4 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="flex justify-between font-semibold text-lg mb-4">
                        <span>Thành tiền:</span>
                        <span>đ728,000</span>
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
            <div className="mb-8 max-w-2xl">
                <h2 className="text-xl font-semibold mb-4">
                    Thông tin đơn hàng
                </h2>
                <div className="space-y-5">
                    <div className="flex items-start space-x-4">
                        <img
                            src="/src/assets/images/inclusion.jpg"
                            alt="Course 1"
                            className="w-20 h-20 object-cover rounded flex-shrink-0"
                        />
                        <div className="flex-grow">
                            <h3 className="text-lg font-semibold mb-1">
                                Phát âm chuẩn tiếng Anh
                            </h3>
                            <p className="text-base text-blue-500">
                                đ279,000{" "}
                                <span className="line-through text-gray-500">
                                    500,000
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
