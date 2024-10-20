import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@radix-ui/react-dropdown-menu"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react";
import axios from "axios";


export const UserProfile = () => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [description, setDescription] = useState('');

    const updateUserProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");

    // Lấy access token từ localStorage
    try {
        const response = await axios.put(`${API_URL}/auth/user/profile`, {
            name: userName,  // Đảm bảo các trường dữ liệu phù hợp với API
            email: email,
            phone: phone,
            description: description,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,  // Chắc chắn rằng token là chính xác
                'x-api-secret': `${API_KEY}`,  // Nếu API yêu cầu khóa bí mật
            },
        });
        console.log('Update hồ sơ thành công', response.data);
    } catch (error) {
        console.log('Error updating profile', error.response ? error.response.data : error.message);
    }
};



    return (
        <>
            <section className="userprofile my-10 mx-auto  px-4 lg:px-10 xl:px-20">
                <div className="border border-gray-200 rounded-xl px-10 py-5 shadow-lg">
                    <div className="py-5 border-b">
                        <span className="font-semibold text-xl">Cài đặt</span>
                        <p className="text-gray-500 text-sm">Quản lý cài đặt tài khoản của bạn</p>
                    </div>
                    <div className="lg:grid grid-cols-4 gap-5 ">
                        <div className="col-span-1 my-3 lg:my-5 ">
                            <ul className="gap-3 text-sm font-medium max-lg:items-center flex lg:flex-col">
                                <li className="bg-gray-100 py-1 lg:py-2 px-3 rounded-md">
                                    <Link to="/userprofile">
                                        <p>Hồ sơ cá nhân</p>
                                    </Link>
                                </li>
                                <li className="py-3 lg:py-2 px-3 rounded-md">
                                    <Link className="hover:underline" to="/useraccount">
                                        <p>Tài khoản</p>
                                    </Link>
                                </li>
                                <li className="py-3 lg:py-2 px-3 rounded-md">
                                    <Link className="hover:underline" to="/usernoti">
                                        <p>Thông báo</p>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="col-span-3 my-3 lg:my-5">
                            <div className="border-b pb-5">
                                <span className="font-medium">Thông tin cơ bản</span>
                                <p className="text-sm text-gray-500 ">Người khác sẽ nhìn ra bạn với những thông tin dưới đây</p>
                            </div>
                            <div className="my-5">
                                <form onSubmit={updateUserProfile}>


                                    {/* img */}
                                    <div className="image mb-5">
                                        <p className="font-bold text-sm my-3">Ảnh hồ sơ</p>
                                        <div className="flex items-center gap-20">
                                            <div className="rounded-xl px-10 py-14 border-gray-300 border ">
                                                <p className="font-bold">Ảnh</p>
                                            </div>
                                            <div className="">
                                                <p className="font-bold text-gray-600 lg:text-lg sm:text-sm sm:block hidden">PNG hoặc JPG có chiều rộng và chiều cao không lớn hơn 800px</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* name */}
                                    <div className="mb-5">
                                        <div className="space-y-2">
                                            <Label className="font-medium text-sm">Tên tài khoản</Label>
                                            <Input
                                                placeholder="Nhập tên tài khoản của bạn tại đây..."
                                                className="text-sm py-7"
                                                value={userName}
                                                onChange={(e) => setUserName(e.target.value)}
                                            />
                                            <p className="text-xs text-gray-500">Đây là tên hiển thị công khai của bạn. Nó có thể là tên thật hoặc biệt danh của bạn.</p>
                                        </div>
                                    </div>

                                    {/* email */}
                                    <div className="mb-5">
                                        <div className="space-y-2">
                                            <Label className="font-medium text-sm">Email</Label>
                                            <Input
                                                placeholder="Nhập email của bạn tại đây..."
                                                className="text-sm py-7"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                            <p className="text-xs text-gray-500">Bạn có thể quản lý các địa chỉ email đã được xác minh trong cài đặt email của mình.</p>
                                        </div>
                                    </div>

                                    {/* phone */}
                                    <div className="mb-5">
                                        <div className="space-y-2">
                                            <Label className="font-medium text-sm">Số điện thoại</Label>
                                            <Input
                                                placeholder="Nhập số điện thoại của bạn tại đây..."
                                                className="text-sm py-7"
                                                type="text"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                            />
                                            <p className="text-xs text-gray-500">Bạn có thể quản lý số điện thoại đã xác minh trong cài đặt.</p>
                                        </div>
                                    </div>

                                    {/* description */}
                                    <div className="mb-5">
                                        <div className="space-y-2">
                                            <Label className="font-medium text-sm">Mô tả</Label>
                                            <Textarea
                                                placeholder="Nhập mô tả của bạn tại đây..."
                                                className="text-sm"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                            />
                                            <p className="text-xs text-gray-500">Bạn có thể @tag đến những người dùng và các nhóm để liên kết với họ.</p>
                                        </div>
                                    </div>

                                    <div className="mb-5">
                                        <div className="">
                                            <Button type="submit" className=" text-xs px-3 hover:text-white duration-300">Update hồ sơ</Button>
                                        </div>
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
