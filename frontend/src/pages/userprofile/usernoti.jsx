import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@radix-ui/react-dropdown-menu"
import { Link } from "react-router-dom"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"

export const UserNoti = () => {
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
                                    <Link className="hover:underline" to="/userprofile">
                                        <p>Hồ sơ cá nhân</p>
                                    </Link>
                                </li>
                                <li className="py-3 lg:py-2 px-3 rounded-md">
                                    <Link className="hover:underline" to="/useraccount">
                                        <p>Tài khoản</p>
                                    </Link>
                                </li>
                                <li className=" bg-gray-100 py-3 lg:py-2 px-3 rounded-md">
                                    <Link to="/usernoti">
                                        <p>Thông báo</p>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="col-span-3 my-3 lg:my-5">
                            <div className="border-b pb-5">
                                <span className="font-medium">Thông báo</span>
                                <p className="text-sm text-gray-500 ">Tinh chỉnh lại cách bạn nhận thông báo</p>
                            </div>
                            <div className="my-5">
                                <form action="">
                                    <div className="">
                                        <span className="font-medium">Thông báo cho tôi về...</span>
                                        <div className="my-3">
                                            <RadioGroup defaultValue="option-one" className="text-sm">
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="option-one" id="option-one" />
                                                    <Label htmlFor="option-one">Tất cả thông báo</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="option-two" id="option-two" />
                                                    <Label htmlFor="option-two">Tin nhắn trực tiếp và các đề cập</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="option-three" id="option-three" />
                                                    <Label htmlFor="option-two">Không nhận</Label>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    </div>
                                    <div className="my-3">
                                        <span className="text-lg font-medium ">Thông Báo Về Email</span>
                                        <div className="mt-5">

                                            <div className="flex items-center justify-between border rounded-md px-5 py-3 my-4">
                                                <div className="">
                                                    <Label className="font-medium">Email liên lạc</Label>
                                                    <p className="text-sm text-gray-500">Nhận email về hoạt động tài khoản của bạn</p>
                                                </div>
                                                <div className="">
                                                    <Switch />
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between border rounded-md px-5 py-3 my-4">
                                                <div className="">
                                                    <Label className="font-medium">Email marketing</Label>
                                                    <p className="text-sm text-gray-500">Nhận email về các sản phẩm, tính năng mới và hơn thế nữa</p>
                                                </div>
                                                <div className="">
                                                    <Switch />
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between border rounded-md px-5 py-3 my-4">
                                                <div className="">
                                                    <Label className="font-medium">Email bảo mật</Label>
                                                    <p className="text-sm text-gray-500">Nhận email về hoạt động và bảo mật tài khoản của bạn.</p>
                                                </div>
                                                <div className="">
                                                    <Switch />
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="my-5">
                                        <div className="flex gap-3">
                                            <div className="">
                                                <Checkbox></Checkbox>
                                            </div>
                                            <div className="">
                                                <Label className="font-medium">Sử dụng cài đặt khác nhau cho thiết bị điện thoại</Label>
                                                <p className="text-sm text-gray-500">Bạn có thể quản lý thông báo trên thiết bị di động của mình trong trang cài đặt trên thiết bị di động</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="my-5">
                                        <div className="">
                                            <Button className="text-xs px-3 hover:text-white duration-300">Update thông báo</Button>
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
