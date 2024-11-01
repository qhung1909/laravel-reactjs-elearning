import { Link } from "react-router-dom"
import { SideBarCreateCoure } from "./SideBarCreateCoure"
import { Footer } from "../footer/footer"

export const Promotion = () => {
    return (
        <>

            <div className="bg-yellow-500 h-12">
                <Link className='absolute top-3 left-6 lg:left-0 xl:top-3 xl:left-8' to='/'>
                    <div className="flex items-center gap-3">
                        <box-icon name='arrow-back' color='black' ></box-icon>
                        <p className="text-slate-900">Quay lại khóa học</p>
                    </div>
                </Link>
                <div className="block lg:hidden text-right pt-3 pr-6">
                    <box-icon name='menu-alt-left'></box-icon>
                </div>

            </div>
            <div className="w-96 h-100 bg-red-100"></div>
            <div className="w-full h-100 bg-red-100">
                {/* <Link className='absolute top-1 left-0 xl:top-8 xl:left-8' to='/'>
                    <div className="flex items-center gap-3">
                        <box-icon name='arrow-back' color='gray' ></box-icon>
                        <p className="text-gray-600">Trang chủ</p>
                    </div>
                </Link> */}
            </div>
            <div className="flex max-w-7xl m-auto pt-10 pb-36">
                <SideBarCreateCoure />
                <div className="w-full lg:w-10/12 shadow-lg">


                    <div>
                        <div className="m-2">
                            <h1 className="text-xl font-medium px-10 p-4">Khuyến mại</h1>
                        </div>
                        <div className="border-b-2"></div>
                    </div>
                    <div className="p-10">

                    <h2 className="font-medium text-lg pb-1">Coupon</h2>
                    <div className="border border-slate-400 px-3 py-5 mb-6">
                        <p className="font-medium">Tháng 10 coupon</p>
                        <p>Bạn không thể tạo coupon cho khóa học miễn phí</p>
                    </div>

                    <div className="flex flex-cols-2">
                        <h2 className="flex-1 font-medium pb-2">Coupon đang hoạt động/đã lên lịch phát hành</h2>
                        <Link to="">
                            <p className="flex-0 text-right underline underline-offset-2 text-blue-700">Tạo nhiều coupon</p>
                        </Link>
                    </div>


                    <div className="border border-slate-400 p-3 text-center mb-6">
                        <p>Không tìm thấy coupon</p>
                    </div>


                    <div className="pb-3 flex items-end relative">
                        <h2 className="flex-1 font-medium">Coupon đã hết hạn</h2>
                        <div className="flex-1 text-right">
                            <div className="flex justify-end">
                                <input className="border border-slate-500 h-10 px-3" placeholder="Tìm kiếm mã coupon" />
                                <button className="bg-slate-800 w-10 h-10">
                                    <box-icon name='search' color='#ffffff'></box-icon>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="border border-slate-400 p-3 text-center mb-6">
                        <p>Không tìm thấy coupon</p>
                    </div>

                </div>

                </div>
            </div>
            <Footer />
        </>
    )
}
