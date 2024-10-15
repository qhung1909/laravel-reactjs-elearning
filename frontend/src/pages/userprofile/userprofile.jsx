import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@radix-ui/react-dropdown-menu"
import { Link } from "react-router-dom"
export const UserProfile = () => {
    return (
        <>
            <section className="userprofile my-10 mx-auto max-w-screen-xl">
                <div className="border border-gray-200 rounded-xl px-10 py-5">
                    <div className="py-5 border-b">
                        <span className="font-semibold text-xl">Cài đặt</span>
                        <p className="text-gray-500 text-sm">Quản lý cài đặt tài khoản của bạn.</p>
                    </div>
                    <div className="grid grid-cols-4 gap-5 my-5">
                        <div className="col-span-1">
                            <ul className="space-y-3 text-sm font-medium">
                                <li className="bg-gray-100 py-1 px-3 rounded-md">
                                    <Link>
                                        <p>Hồ sơ cá nhân</p>
                                    </Link>
                                </li>
                                <li className="py-1 px-3 rounded-md">
                                    <Link className="hover:underline" to="/useraccount">
                                        <p>Tài khoản</p>
                                    </Link>
                                </li>
                                <li className="py-1 px-3 rounded-md">
                                    <Link className="hover:underline" to="/userappearance">
                                        <p>Giao diện</p>
                                    </Link>
                                </li>
                                <li className="py-1 px-3 rounded-md">
                                    <Link className="hover:underline" to="/usernoti">
                                        <p>Thông báo</p>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="col-span-3">
                            <div className="border-b pb-5">
                                <span className="font-medium">Thông tin cơ bản</span>
                                <p className="text-sm text-gray-500 ">Người khác sẽ nhìn ra bạn với những thông tin dưới đây</p>
                            </div>
                            <div className="my-5">
                                <form action="">
                                    <div className="mb-5">
                                        <div className="space-y-2">
                                            <Label className="font-medium text-sm">Tên tài khoản</Label>
                                            <Input placeholder="Nhập tên tài khoản của bạn tại đây..." className="text-xs"></Input>
                                            <p className="text-xs text-gray-500">Đây là tên hiển thị công khai của bạn. Nó có thể là tên thật hoặc biệt danh của bạn. Bạn chỉ có thể thay đổi điều này 30 ngày một lần.</p>
                                        </div>
                                    </div>
                                    <div className="mb-5">
                                        <div className="space-y-2">
                                            <Label className="font-medium text-sm">Email</Label>
                                            <Input placeholder="Nhập email của bạn tại đây..." className="text-xs" type="email"></Input>
                                            <p className="text-xs text-gray-500">Bạn có thể quản lý các địa chỉ email đã được xác minh trong cài đặt email của mình.</p>
                                        </div>
                                    </div>
                                    <div className="mb-5">
                                        <div className="space-y-2">
                                            <Label className="font-medium text-sm">Tiểu sử</Label>
                                            <Textarea placeholder="Nhập tiểu sử của bạn tại đây..." className="text-xs"></Textarea>
                                            <p className="text-xs text-gray-500">Bạn có thể @tag đến những người dùng và các nhóm để liên kết với họ.</p>
                                        </div>
                                    </div>
                                    <div className="mb-10">
                                        <div className="space-y-2">
                                            <Label className="font-medium text-sm">URLs</Label>
                                            <p className="text-xs text-gray-500">Thêm liên kết đến website, mạng xã hội, truyền thông của bạn</p>
                                            <Input></Input>
                                            <Button className="bg-white border text-black text-xs px-2 hover:text-white duration-300">Add URL</Button>
                                        </div>
                                    </div>
                                    <div className="mb-5">
                                        <div className="">
                                            <Button className=" text-xs px-3 hover:text-white duration-300">Update profile</Button>
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
