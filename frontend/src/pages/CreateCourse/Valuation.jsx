import { Link } from "react-router-dom"
import { SideBarCreateCoure } from "./SideBarCreateCoure"
import { Footer } from "../footer/footer"
import { useState } from "react";
import {
    Select,
    SelectContent,
    // SelectGroup,
    SelectItem,
    // SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";

export const Valuation = () => {
    const [currency, setCurrency] = useState("");
    const [price, setPrice] = useState("");

    // const allInputsValuationFilled = () => {
    //     return currency !== "" && price.trim() !== "";
    // };

    // const [isChecked, setIsChecked] = useState(false);

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
                            <h1 className="text-xl font-medium px-10 p-4">Định giá</h1>
                        </div>
                        <div className="border-b-2"></div>
                    </div>
                    
                    <div className="p-10">
                        <h2 className="pb-6 font-medium text-lg">Đặt giá cho khóa học của bạn</h2>
                        <p>Vui lòng chọn đơn vị tiền tệ và mức giá cho khóa học của bạn. Nếu muốn cung cấp miễn phí khóa học của mình thì khóa học đó phải có tổng thời lượng video dưới 2 giờ. Ngoài ra, các khóa học có bài kiểm tra thực hành không thể miễn phí.</p>
                        {/* <form> */}


                        <div className="flex flex-cols-2 gap-4 pt-6 pb-3">
                            <div className="">
                                <p className="pb-1 font-medium">
                                    Tiền tệ
                                </p>
                                <Select value={currency} onValueChange={setCurrency}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Chọn" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="vnd">VND</SelectItem>
                                        <SelectItem value="usd">USD</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="">
                                <p className="pb-1 font-medium">
                                    Mức giá
                                </p>
                                <div>
                                    <Input value={price} onChange={(e) => setPrice(e.target.value)} type="number" placeholder="Giá" />
                                </div>
                            </div>

                        </div>
                        {/* <button className="w-16 h-10 bg-yellow-500 text-white font-bold">Lưu</button> */}
                        {/* </form> */}
                    </div>


                </div>
            </div>
            <Footer />

        </>
    )
}
