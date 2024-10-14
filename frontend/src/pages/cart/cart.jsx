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
    const [loading, setLoading] = useState(false)

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

    const totalPrice = calculateTotalPrice();

    const renderCart = () => {

        return cart.map((item, index) => (
            <div key={index} className="mb-6 bg-white rounded-lg  ">
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
                            className="flex items-center py-3 border-t last:border-b-0"
                        >
                            <span className="mr-2 font-bold text-sm">{detailIndex + 1}</span> {/* Kích thước chữ nhỏ hơn */}
                            <input
                                className="mr-2 h-4 w-4 flex-shrink-0 rounded border-gray-300 checked:bg-yellow-500"
                                defaultChecked
                                type=""
                                aria-label="Chọn khóa học"
                            />
                            <img
                                alt="Course Image"
                                className="sm:w-48 sm:h-28 w-52 g-24  flex-shrink-0 rounded-2xl object-cover" // Kích thước hình ảnh nhỏ hơn
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
                                        <p className="text-sm text-black mt-1 break-words font-normal ">
                                            bởi: <span>AntLearn</span>
                                        </p>
                                    </div>
                                    <p className="font-bold text-gray-400 text-base md:w-1/5 text-right flex justify-between sm:justify-normal md:flex-col gap-5 sm:my-3 md:my-0">
                                        <div className="pricing text-[#2F57EF] font-medium">
                                            {formatCurrency(detail.price)}
                                        </div>
                                        <button onClick={() => deleteCourseFromCart(item.order_id, detail.course_id)}
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
        <>
<<<<<<< HEAD
            {loading && (
                <div className='loading'>
                    <div className='loading-spin'></div>
                </div>
            )}
            <div className="p-10 md:my-5 my-2 max-w-screen-xl mx-auto">
                <div className="container mx-auto">
                    <h1 className="lg:text-5xl md:text-4xl text-3xl text-center md:text-left font-bold md:mb-6 mb-3">Giỏ hàng</h1>
                    <div className="bg-white ">
                        <div className=" mb-4 text-center md:text-left">
                            <span className="font-semibold text-gray-500 lg:text-lg md:text-base text-base ">
                                {cart.length || 0} Khóa học trong giỏ hàng
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
=======
            {cart.length > 0 ?
                // Nếu có giỏ hàng
                (<div className="p-10 md:my-5 my-2 max-w-screen-xl mx-auto">
                    <div className="container mx-auto">
                        <h1 className="lg:text-5xl md:text-4xl text-3xl text-center md:text-left font-bold md:mb-6 mb-3">Giỏ hàng</h1>
                        <div className="bg-white ">
                            <div className=" mb-4 text-center md:text-left">
                                <span className="font-semibold text-gray-500 lg:text-lg md:text-base text-base ">
                                    {cart.length || 0} Khóa học trong giỏ hàng
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
>>>>>>> b908815b1dad01cb4ce211aba59d4a12092721a8

                            <div>
                                <div className="container mx-auto">

                                    {/* Kiểm tra xem có giỏ hàng không */}

                                    <div className="flex flex-col lg:flex-row justify-between lg:gap-10">
                                        {/* Cột bên trái: Danh sách sản phẩm */}
                                        <div className="flex flex-col justify-between lg:w-2/3 w-full">
                                            {renderCart()}
                                        </div>

                                        {/* Cột bên phải: Chỉ hiển thị khi giỏ hàng có sản phẩm */}
                                        {cart.length > 0 && (
                                            <div className="bg-white rounded-3xl box-shadow-lg md:h-48  p-6 lg:w-1/3 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_-10px_15px_-3px_rgba(0,0,0,0.1)]">
                                                <div className=" mb-2 text-center lg:text-left">
                                                    <span className="font-bold md:text-xl text-lg  text-gray-600">
                                                        Tổng
                                                    </span>
                                                    {/* <span className="font-bold text-2xl text-red-600">
                                                        {formatCurrency(totalPrice)}
                                                    </span> */}
                                                </div>
                                                <div className="font-bold md:text-3xl text-2xl mb-5 text-black text-center lg:text-left">
                                                    {formatCurrency(totalPrice)}
                                                </div>
                                                <Link to="/payment">
                                                    <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black md:text-lg text-base font-medium py-2 rounded-3xl">
                                                        Thanh toán
                                                    </button>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                ) :
                // Nếu không có giỏ hàng
                (
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
                )}
        </>

    );
};
