import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom"
import { SideBarCreateCoure } from "./SideBarCreateCoure"
import { Footer } from "../footer/footer"
import { useEffect, useState } from "react";


import CryptoJS from 'crypto-js';

const secretKey = 'your-secret-key';

const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

const decryptData = (cipherText) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};


export const Valuation = () => {
    const [currency, setCurrency] = useState("");
    const [price, setPrice] = useState("");

    useEffect(()=>{
        const storedData = localStorage.getItem('valuation');
        if(storedData){
            const decryptedData = decryptData(storedData);
            setCurrency(decryptedData.currency);
            setPrice(decryptedData.price);
        }
    }, [])


    useEffect(()=>{
        const isCurrency = currency !== "";
        const isPrice = price.trim() !== "";

        if(isCurrency || isPrice){
            const dataStore = { currency, price }
            localStorage.setItem('valuation', encryptData(dataStore));
        } else {
            localStorage.removeItem('valuation');
        }

        if(isCurrency && isPrice){
            localStorage.setItem('FA-VA', 'done');
        } else {
            localStorage.removeItem('FA-VA');
        }

    }, [currency, price])


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

                    </div>
                </div>
            </div>
            <Footer />

        </>
    )
}
