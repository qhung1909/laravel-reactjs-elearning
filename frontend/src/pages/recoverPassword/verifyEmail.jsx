import { Button } from "@/components/ui/button"
import axios from "axios";
import { Link } from "react-router-dom"



// const response = await axios.post('http://127.0.0.1:8000/api/reset-password', { email });

export const VerifyEmail = () => {
    return (
        <>
            <div className="text-center my-16 max-w-96 m-auto">
                <div className="border border-slate-400 p-3 w-12 m-auto rounded-lg flex justify-center mb-8">
                    <box-icon name='envelope' size='sm'></box-icon>
                </div>

                <h1 className="text-3xl font-medium pb-3">Đặt lại mật khẩu</h1>
                <p className=" px-4">Chúng tôi đã gửi đường link để lấy lại mật khẩu tới email của bạn</p>
                <p className="text-red-500 font-bold mb-12 px-1">Vui lòng truy cập kiểm tra &apos;hòm thư hoặc mục thư rác&apos;</p>
                <div className="pb-3">
                    <p className="">Nếu bạn chưa nhận được mail, sau thời gian 5 phút bạn hãy quay lại trang {''} </p>
                    <Link to='/reset-password' className="font-medium hover:text-yellow-500 duration-300 ease-in-out">
                        Đổi mật khẩu
                    </Link>
                </div>

                <Link to="/login" className=" font-medium hover:text-yellow-500 duration-700">
                    <div className="flex justify-center items-center gap-3">
                        <box-icon name='arrow-back' color='gray' ></box-icon>
                        <p className="text-gray-600">Trở về Đăng nhập</p>
                    </div>
                </Link>
            </div>

        </>
    )
}
