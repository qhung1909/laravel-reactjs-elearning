import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@radix-ui/react-dropdown-menu"
import { Link } from "react-router-dom"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import TaskList from "../notifications/notification";
import './userprofile.css'
export const UserFavorite = () => {
    return (
        <>
            <section className="usernoti my-10 mx-auto  px-4 lg:px-10 xl:px-20">
                <div className="border border-gray-200 rounded-xl px-10 py-5 shadow-lg">
                    <div className="py-5 border-b">
                        <span className="font-semibold text-xl">Cài đặt</span>
                        <p className="text-gray-500 text-sm">Quản lý cài đặt tài khoản của bạn</p>
                    </div>
                    <div className="lg:grid grid-cols-4 gap-5 ">
                        <div className="col-span-1 my-3 lg:my-5 ">
                            <ul className="gap-3 text-sm font-medium max-lg:items-center flex lg:flex-col">
                                <li className=" py-1 lg:py-2 px-3 rounded-md">
                                    <Link className="hover:underline" to="/user/profile">
                                        <p>Hồ sơ cá nhân</p>
                                    </Link>
                                </li>
                                <li className="py-3 lg:py-2 px-3 rounded-md">
                                    <Link className="hover:underline" to="/user/orderhistory">
                                        <p>Lịch sử mua hàng</p>
                                    </Link>
                                </li>

                                <li className="py-3 lg:py-2 px-3 rounded-md">
                                    <Link className="hover:underline" to="/user/noti">
                                        <p>Thông báo</p>
                                    </Link>
                                </li>
                                <li className=" bg-gray-100 py-3 lg:py-2 px-3 rounded-md">
                                    <Link to="/user/noti">
                                        <p>Yêu thích</p>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="col-span-3 my-3 lg:my-5">
                            <div className="border-b pb-5">
                                <span className="font-medium">Khóa học yêu thích của bạn</span>
                                <p className="text-sm text-gray-500 ">Những khóa học bạn thích nhưng vẫn chưa có dịp mua, chúng tôi sẽ giúp bạn lưu lại.</p>
                            </div>
                            <div className="mt-5">
                                <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-5">
                                    <div className="space-y-3 py-3 px-5 rounded-lg hover:shadow-lg duration-300 parent">
                                        <div className="flex justify-center">
                                            <img
                                                src="/src/assets/images/doremon.jpg"
                                                className="w-60 h-60 object-cover"
                                                alt=""
                                            />
                                        </div>
                                        <div className="lg:text-lg text-base font-semibold text-start line-clamp-2">
                                            <span>Tên sản phẩm của sản phẩm này có thể dài 2 dòng, dài quá sẽ bị 3 chấm</span>
                                        </div>
                                        <div className="child">
                                            <div className="flex justify-center">
                                                <Button className="bg-yellow-600">Xem chi tiết</Button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3 py-3 px-5 rounded-lg hover:shadow-lg duration-300 parent">
                                        <div className="flex justify-center">
                                            <img
                                                src="/src/assets/images/doremon.jpg"
                                                className="w-60 h-60 object-cover"
                                                alt=""
                                            />
                                        </div>
                                        <div className="text-lg font-semibold text-start line-clamp-2">
                                            <span>Tên sản phẩm của sản phẩm này có thể dài 2 dòng, dài quá sẽ bị 3 chấm</span>
                                        </div>
                                        <div className="child">
                                            <div className="flex justify-center">
                                                <Button className="bg-yellow-600">Xem chi tiết</Button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3 py-3 px-5 rounded-lg hover:shadow-lg duration-300 parent">
                                        <div className="flex justify-center">
                                            <img
                                                src="/src/assets/images/doremon.jpg"
                                                className="w-60 h-60 object-cover"
                                                alt=""
                                            />
                                        </div>
                                        <div className="text-lg font-semibold text-start line-clamp-2">
                                            <span>Tên sản phẩm của sản phẩm này có thể dài 2 dòng, dài quá sẽ bị 3 chấm</span>
                                        </div>
                                        <div className="child">
                                            <div className="flex justify-center">
                                                <Button className="bg-yellow-600">Xem chi tiết</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </section>

        </>
    )
}
