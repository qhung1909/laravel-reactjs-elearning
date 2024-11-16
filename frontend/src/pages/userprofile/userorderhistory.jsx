import { Link } from "react-router-dom"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useState, useEffect } from "react"
import { formatCurrency } from "@/components/Formatcurrency/formatCurrency";
import { formatDate } from "@/components/FormatDay/Formatday"
import axios from "axios"
export const UserOrderHistory = () => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;
    const [orderHistory, setOrderHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [user, setUser] = useState({});
    // Fetch thông tin user đang đăng nhập
    const fetchUser = async () => {
        setLoading(true);
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
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchUser();
    }, []);
    const fetchOrderHistory = async () => {
        const token = localStorage.getItem("access_token");
        const userId = user.user_id;

        if (!userId) {
            console.log("User ID not found");
            return;
        }

        try {
            const response = await axios.get(`${API_URL}/orders/user/${userId}`, {
                headers: {
                    'x-api-secret': `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                }
            });
            const filteredOrders = response.data.data.filter(order => order.status === 'success');
            setOrderHistory(filteredOrders);

        } catch (error) {
            console.log('Error fetching order history', error);
        }
    }
    useEffect(() => {
        if (user.user_id) {
            fetchOrderHistory();
        }
    }, [user.user_id]);

    const searchOrderHistory = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("access_token");
        setLoading(true);

        try {
            const response = await axios.get(`${API_URL}/auth/orders/searchHistory`, {
                headers: {
                    'x-api-secret': `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                },
                params: { keyword: searchQuery }
            });
            setOrderHistory(response.data);
        } catch (error) {
            console.log('Error searching order history', error);
        }
        setLoading(false);
    };


    const renderOrderHistory = () => {
        if (loading) {
            return (
                <div className="flex flex-wrap justify-center items-center">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div className="bg-gray-100 h-10 w-20 rounded-lg animate-pulse mx-2" key={index}></div>
                    ))}
                </div>
            );
        }
        if (orderHistory.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                        <div className="flex flex-col items-center">
                            <svg width="100%" height="177" viewBox="0 0 139 142" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* SVG content */}
                            </svg>
                            <p className="text-gray-500">
                                <p className="font-semibold sm:text-base text-sm text-black-900">{searchQuery ? "Không có kết quả tìm kiếm" : "Bạn chưa đăng ký khóa học nào"}</p>
                            </p>
                        </div>
                    </TableCell>
                </TableRow>
            );
        }

        return orderHistory.map((item, index) => (
            <TableRow key={index} className="sm:p-4 p-0">
                <TableCell className="sm:p-4 py-2 px-0 lg:text-base sm:text-sm text-xs">
                    {index + 1}
                </TableCell>
                <TableCell className="sm:p-4 py-2 px-0 xl:w-[400px] lg:w-[250px] md:w-[200px] w-fit font-medium lg:text-base sm:text-sm text-xs">
                    <p className="line-clamp-2">
                        {/* Lặp qua tất cả các sản phẩm và nối tên khóa học */}
                        {item.order_details && item.order_details.length > 0 ?
                            item.order_details.map(detail => detail.course.title).join(", ") :
                            "Đang tải tên khóa học"}
                    </p>
                </TableCell>
                <TableCell className="sm:p-4 py-2 px-0 lg:text-base sm:text-sm text-xs">
                    <span className={`${item.status === "success" ? "bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full" : ""}`}>
                        {item.status === "success" ? "Thành công" : item.status}
                    </span>
                </TableCell>

                <TableCell className="sm:p-4 py-2 px-0 lg:text-base sm:text-sm text-xs">
                    <img src="/src/assets/images/logo-vnpay.jpg" alt="VNPay" className="w-32 h-14 object-contain pr-4" />
                </TableCell>

                <TableCell className="sm:p-4 py-2 px-0 lg:text-base sm:text-sm text-xs">
                    {formatDate(item.created_at)}
                </TableCell>
                <TableCell className="sm:p-4 py-2 px-0 lg:text-base sm:text-sm text-xs">
                    {formatCurrency(item.total_price)}
                </TableCell>
            </TableRow>
        ));
    };





    return (
        <>
            <section className="useraccount my-10 mx-auto  px-4 lg:px-10 xl:px-20">
                <div className="border border-gray-200 rounded-xl px-10 py-5 shadow-lg">
                    <div className="py-5 border-b">
                        <span className="font-semibold text-xl">Cài đặt</span>
                        <p className="text-gray-500 text-sm">Quản lý cài đặt tài khoản của bạn</p>
                    </div>
                    <div className="lg:grid grid-cols-4 gap-5 ">
                        {/* ul list */}
                        <div className="col-span-1 my-3 lg:my-5 ">
                            <ul className="gap-3 text-sm font-medium max-lg:items-center flex lg:flex-col">
                                <li className=" py-1 lg:py-2 px-3 rounded-md">
                                    <Link to="/user/profile" className="hover:underline">
                                        <p>Hồ sơ cá nhân</p>
                                    </Link>
                                </li>
                                <li className="bg-gray-100  py-3 lg:py-2 px-3 rounded-md">
                                    <Link to="/user/orderhistory">
                                        <p>Lịch sử mua hàng</p>
                                    </Link>
                                </li>
                                <li className="py-3 lg:py-2 px-3 rounded-md">
                                    <Link className="hover:underline" to="/user/noti">
                                        <p>Thông báo</p>
                                    </Link>
                                </li>
                                <li className="py-3 lg:py-2 px-3 rounded-md">
                                    <Link className="hover:underline" to="/user/favorite">
                                        <p>Yêu thích</p>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="col-span-3 my-3 lg:my-5">
                            <div className="border-b pb-5">
                                <span className="font-medium">Lịch sử mua hàng của bạn</span>
                                <p className="text-sm text-gray-500 ">Xem lại những giao dịch bạn đã hoàn thành.</p>
                            </div>
                            <div className="my-5">
                                <form > {/*onSubmit={searchOrderHistory}*/}
                                    {/* <div className="mb-4 flex items-center gap-2">
                                        <Input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Nhập để tìm kiếm khóa học của bạn..."
                                            className="border p-5 rounded-lg w-1/2"
                                        />
                                        <Button type="submit" className="bg-blue-500 text-white p-5 rounded">
                                            Tìm kiếm
                                        </Button>
                                    </div> */}
                                    <div className="mb-5">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="text-center">
                                                    <TableHead className="p-4 lg:text-base text-sm text-gray-700 font-medium min-w-[50px]">STT</TableHead>
                                                    <TableHead className="p-4 lg:text-base text-sm text-gray-700 font-medium min-w-[200px]">Tên khóa học</TableHead>
                                                    <TableHead className="p-4 lg:text-base text-sm text-gray-700 font-medium min-w-[150px]">Trạng thái</TableHead>
                                                    <TableHead className="p-4 lg:text-base text-sm text-gray-700 font-medium min-w-[150px]">Phương thức</TableHead>
                                                    <TableHead className="p-4 lg:text-base text-sm text-gray-700 font-medium min-w-[150px]">Ngày mua</TableHead>
                                                    <TableHead className="p-4 lg:text-base text-sm text-gray-700 font-medium min-w-[100px]">Giá</TableHead>
                                                </TableRow>

                                            </TableHeader>
                                            <TableBody>
                                                {renderOrderHistory()}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

            </section>

        </>
    )
}
