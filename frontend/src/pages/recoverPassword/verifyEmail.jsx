import { Link } from "react-router-dom"

export const VerifyEmail = () => {
    return (
        <>
            <div className="text-center my-24 max-w-96 m-auto">
                <div className="border border-slate-400 p-3 w-16 m-auto rounded-lg flex justify-center mb-8">
                    <box-icon name='envelope' size='md'></box-icon>
                </div>

                <h1 className="text-2xl font-medium pb-3">Đặt lại mật khẩu</h1>
                <p className="">Chúng tôi đã gửi đường link để lấy lại mật khẩu tới email của bạn</p>
                <p className="text-red-500 font-bold pb-3">Vui lòng truy cập kiểm tra &apos;hòm thư hoặc mục thư rác&apos;</p>
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
