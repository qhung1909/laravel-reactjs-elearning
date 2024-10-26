import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import axios from "axios"
export const UserOrderHistory = () => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;
    const [orderHistory, setOrderHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchOrderHistory = async () => {
        const token = localStorage.getItem("access_token");
        try {
            const response = await axios.get(`${API_URL}/auth/orders/history`, {
                headers: {
                    'x-api-secret': `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                }
            });

            setOrderHistory(response.data);
        } catch (error) {
            console.log('Error fetching order history', error)
        }
    }

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
        return loading ? (
            <div className="flex flex-wrap justify-center items-center">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div className="bg-gray-100 h-10 w-20 rounded-lg animate-pulse mx-2" key={index}></div>
                ))}
            </div>
        ) : Array.isArray(orderHistory) && orderHistory.length > 0 ? (
            orderHistory.map((item, index) => (
                <TableRow key={index} className="sm:p-4 p-0">
                    <TableCell className="sm:p-4 py-2 px-0 xl:w-[400px] lg:w-[250px] md:w-[200px] w-fit font-medium lg:text-base sm:text-sm text-xs">
                        <p className="line-clamp-2">{item.courses && item.courses[0] ? item.courses[0].course_title : "Lỗi hiển thị tên khóa học"}</p>
                    </TableCell>
                    <TableCell className="sm:p-4 py-2 px-0 lg:text-base sm:text-sm text-xs">
                        {item.status}
                    </TableCell>
                    <TableCell className="sm:p-4 py-2 px-0 lg:text-base sm:text-sm text-xs">
                        {item.payment_method}
                    </TableCell>
                    <TableCell className="sm:p-4 py-2 px-0 lg:text-base sm:text-sm text-xs">
                        {item.created_at}
                    </TableCell>
                    <TableCell className="sm:p-4 py-2 px-0 text-right lg:text-base sm:text-sm text-xs">
                        {item.total_price}
                    </TableCell>
                </TableRow>
            ))
        ) : (
            <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                    Không có kết quả tìm kiếm
                </TableCell>
            </TableRow>
        );
    };




    useEffect(() => {
        fetchOrderHistory();
    }, []);
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
                            </ul>
                        </div>
                        <div className="col-span-3 my-3 lg:my-5">
                            <div className="border-b pb-5">
                                <span className="font-medium">Lịch sử mua hàng của bạn</span>
                                <p className="text-sm text-gray-500 ">Xem lại những giao dịch bạn đã hoàn thành.</p>
                            </div>
                            <div className="my-5">
                                <form onSubmit={searchOrderHistory}>
                                    <div className="mb-4 flex items-center gap-2">
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
                                    </div>
                                    <div className="mb-5">
                                        <Table>
                                            <TableHeader>
                                                <TableRow >
                                                    <TableHead className="sm:p-4 p-0 xl:w-[400px] lg:w-[250px] md:w-[200px] w-[150px] lg:text-base text-sm">Tên khóa học</TableHead>
                                                    <TableHead className="sm:p-4 p-0 lg:text-base text-sm">Trạng thái</TableHead>
                                                    <TableHead className="sm:p-4 p-0 lg:text-base text-sm">Giao dịch</TableHead>
                                                    <TableHead className="sm:p-4 p-0 lg:text-base text-sm ">Ngày mua</TableHead>
                                                    <TableHead className="sm:p-4 p-0 lg:text-base text-sm text-right">Giá</TableHead>
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
