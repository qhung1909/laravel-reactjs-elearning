import { useState, useEffect } from "react";
import { toast } from "react-toastify";
const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;
import axios from "axios";
const notify = (message) => {
    toast(message);
};

export const Cart = () => {
    const [cart, setCart] = useState([]);

    const fetchCart = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const res = await axios.get(`${API_URL}/auth/cart`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            setCart(res.data); // Dữ liệu trả về từ API nằm trong res.data
            console.log(res.data); // In ra dữ liệu để kiểm tra
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const renderCart = () => {
        if (cart.length === 0) {
            return <p>Giỏ hàng của bạn đang trống.</p>;
        }

        return cart.map((item, index) => (
            <div key={index} className="flex items-center justify-between mb-4 border-b pb-4">
                <div className="flex items-center">
                    <input
                        className="mr-4 checked:bg-yellow-500"
                        defaultChecked
                        type="checkbox"
                        aria-label="Chọn khóa học"
                    />
                    {/* Ảnh khóa học (nếu có) */}
                    <img
                        alt="Course Image"
                        className="w-24 h-16 rounded-sm"
                        src={item.image || 'default-image-url.jpg'} // Sử dụng URL mặc định nếu không có
                    />
                    <div className="ml-4">
                        <p className="font-bold">Khóa học ID: {item.order_id}</p>
                        <p className="text-sm text-gray-500">
                            Người dùng ID: {item.user_id}
                        </p>
                        <p className="text-sm text-gray-500">
                            Tổng giá: {item.total_price} USD
                        </p>
                        <p className="text-sm text-gray-500">
                            Trạng thái: {item.status}
                        </p>
                    </div>
                </div>
                <div className="text-right ml-auto">
                    <button className="mt-2">
                        <box-icon name="trash-alt" color="#ff0015"></box-icon>
                    </button>
                </div>
            </div>
        ));
    };


    const addToCart = async (couponId) => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            console.error("No token found");
            notify("Bạn chưa đăng nhập");
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
                notify("Thêm vào giỏ hàng không thành công");
                return; // Trả về nếu không thành công
            }

            const data = await response.json(); // Lấy dữ liệu phản hồi từ API
            // Xử lý dữ liệu trả về nếu cần, ví dụ như cập nhật giỏ hàng
            console.log("Added to cart successfully:", data);
            notify("Đã thêm vào giỏ hàng thành công");
        } catch (error) {
            console.error("Error adding to cart:", error); // Bắt lỗi
            notify("Đã xảy ra lỗi. Vui lòng thử lại sau.");
        }
    };

    return (
        <div className="bg-gray-100">
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-6">Giỏ hàng</h1>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-bold">
                            {cart.length || 0} Sản phẩm trong giỏ hàng
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
                                    {/* Sản phẩm 1 */}
                                    {renderCart()}
                                </div>

                                {/* Cột bên phải: Tổng tiền */}
                                <div className="bg-white p-6 rounded-lg shadow-md w-full lg:w-1/3 mt-4 lg:mt-0">
                                    <div className="flex justify-between mb-4">
                                        <span className="font-bold text-lg ">
                                            Tổng
                                        </span>
                                        <span className="font-bold text-lg text-red-600">
                                            {cart.total_price}
                                        </span>
                                    </div>
                                    <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 rounded">
                                        Thanh toán
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
