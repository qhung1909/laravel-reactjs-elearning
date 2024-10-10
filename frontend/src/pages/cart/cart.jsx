// import { useState } from "react";
// const API_URL = import.meta.env.VITE_API_URL;

export const Cart = () => {

    // const getUserInfo = async () => {
    //     const [loading, setLoading] = useState(false);

    //     const token = localStorage.getItem('access_token'); // Lấy access token từ localStorage
    //     if (!token) {
    //         console.error('No token found');
    //         return;
    //     }

    //     // setLoading(true);
    //     try {
    //         const res = await fetch(`${API_URL}/auth/cart`, {
    //             method: 'POST',
    //             headers: {
    //                 'Authorization': `Bearer ${token}`, // Thêm token vào header Authorization
    //                 'Content-Type': 'application/json'
    //             }
    //         });

    //         if (!res.ok) {
    //             console.error('Failed to fetch data');
    //             return; // Trả về nếu không thành công
    //         }

    //         const _dataUser = await res.json(); // Lấy dữ liệu người dùng
    //         // Xử lý dữ liệu người dùng ở đây
    //         console.log(_dataUser); // Bạn có thể lưu dữ liệu này vào state hoặc làm gì đó với nó

    //     } catch (error) {
    //         console.error('Error fetching data user', error); // Bắt lỗi
    //     } finally {
    //         setLoading(false); // Kết thúc trạng thái loading
    //     }
    // };


    return (
        <div className="bg-gray-100">
    <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Giỏ hàng</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <span className="font-bold">1 Khóa học trong giỏ hàng</span>
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
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <input className="mr-4 checked:bg-yellow-500" defaultChecked type="checkbox" aria-label="Chọn khóa học" />
                                    <img alt="Course Image" className="w-24 h-16 rounded-sm" src="https://img-c.udemycdn.com/course/240x135/5311956_4cc9.jpg" />
                                    <div className="ml-4">
                                        <p className="font-bold">Khóa học NextJS 14-ReactJS-Typescript</p>
                                        <p className="text-sm text-gray-500">bởi AntLearn</p>
                                        <p className="text-sm text-gray-500">0 Bài học · 0 giờ 0 phút</p>
                                    </div>
                                </div>
                                <div className="text-right ml-auto">
                                    <p className="text-blue-500 font-bold">
                                        đ279,000 <span className="line-through text-gray-400">500,000</span>
                                    </p>
                                    <button className="mt-2">
                                        <box-icon name='trash-alt' color='#ff0015' ></box-icon>
                                    </button>
                                </div>
                            </div>

                            {/* Sản phẩm 2 */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <input className="mr-4 checked:bg-yellow-500" defaultChecked type="checkbox" aria-label="Chọn khóa học" />
                                    <img alt="Course Image" className="w-24 h-16 rounded-sm" src="https://img-c.udemycdn.com/course/240x135/5311956_4cc9.jpg" />
                                    <div className="ml-4">
                                        <p className="font-bold">Khóa học NextJS 14-ReactJS-Typescript</p>
                                        <p className="text-sm text-gray-500">bởi AntLearn</p>
                                        <p className="text-sm text-gray-500">0 Bài học · 0 giờ 0 phút</p>
                                    </div>
                                </div>
                                <div className="text-right ml-auto">
                                    <p className="text-blue-500 font-bold">
                                        đ279,000 <span className="line-through text-gray-400">500,000</span>
                                    </p>
                                    <button className="mt-2">
                                        <box-icon name='trash-alt' color='#ff0015' ></box-icon>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Cột bên phải: Tổng tiền */}
                        <div className="bg-white p-6 rounded-lg shadow-md w-full lg:w-1/3 mt-4 lg:mt-0">
                            <div className="flex justify-between mb-4">
                                <span className="font-bold text-lg">Tổng</span>
                                <span className="font-bold text-lg">đ279,000</span>
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
