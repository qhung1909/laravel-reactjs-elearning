import { Link } from "react-router-dom"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react";
import axios from "axios";
import { useSettingsContext } from "../context/settingcontext";

export const Footer = () => {
    const { settings, loading, handleSave } = useSettingsContext()

    const [text, setText] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const translateText = async () => {
        const response = await axios.post("https://libretranslate.com/translate", {
            q: text,
            source: "en",
            target: "es",
        });
        setTranslatedText(response.data.translatedText);
    };

    return (
        <>
            <footer className="bg-gray-100 h-auto rounded-tl-[70px] rounded-tr-[70px]">
                <section className="max-w-screen-lg mx-auto py-10 px-5">
                    <div className="lg:grid grid-cols-3">

                        {/* grid - left */}
                        <div className="col-span-1">

                            <img
                                src={settings.logoUrl}
                                alt=""
                                className="w-20 md:w-32 mb-5"
                            />
                            <Link to="https://www.facebook.com/profile.php?id=100079303916866">
                                <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/faecbooklogo.svg" className="w-7" alt="" />
                            </Link>
                        </div>

                        {/* grid - right */}
                        <div className="md:flex col-span-2 lg:justify-between gap-5 md:ps-0 mt-5 lg:mt-0">
                            <div className="flex items-start gap-5 xl:w-2/3 md:w-2/5">
                                {/* thẻ 1 */}
                                <div className="footer-mid-left md:w-1/3 sm:w-1/4 w-1/3">
                                    <span className="font-medium text-black text-base">
                                        Link
                                    </span>
                                    <ul className="mt-1 space-y-1">
                                        <li className="text-sm text-gray-500 md:leading-9 sm:leading-7 leading-loose"><Link to='/courses'>Khóa học</Link></li>
                                        <li className="text-sm text-gray-500 md:leading-9 sm:leading-7 leading-loose"><Link to='/blog'>Bài viết</Link></li>
                                        <li className="text-sm text-gray-500 md:leading-9 sm:leading-7 leading-loose"><Link to='/contact'>Liên hệ</Link></li>
                                    </ul>
                                </div>

                                {/* thẻ 2 */}
                                <div className="footer-mid-right">
                                    <span className="font-medium text-black text-base">
                                        Chính sách chung & Hỗ trợ
                                    </span>
                                    <ul className="mt-1 space-y-1">
                                        {/* term */}
                                        <Link to="/terms">
                                            <li className="text-sm text-gray-500 md:leading-9 sm:leading-7 leading-loose">Điều khoản dịch vụ</li>
                                        </Link>
                                        {/* about us */}
                                        <Link to="/aboutus">
                                            <li className="text-sm text-gray-500 md:leading-9 sm:leading-7 leading-loose">Về chúng tôi</li>
                                        </Link>
                                    </ul>
                                </div>
                            </div>

                            {/* thẻ 3 */}
                            <div className="footer-end mt-5 md:mt-0">
                                <div className="space-y-2">
                                    <div className="footer-mid-right">
                                        <span className="font-medium text-black text-base">
                                            Công tác
                                        </span>
                                        <ul className="mt-1 space-y-1">
                                            {/* term */}
                                            <li className="flex items-center gap-2">
                                                <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/phone.svg" className="w-5" alt="" />
                                                <p className="text-sm text-gray-500 md:leading-9 sm:leading-7 leading-loose">{settings.phone}</p>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/address.svg" className="w-5" alt="" />
                                                <p className="text-sm text-gray-500 md:leading-9 sm:leading-7 leading-loose">{settings.address}</p>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/email.svg" className="w-5" alt="" />
                                                <p className="text-sm text-gray-500 md:leading-9 sm:leading-7 leading-loose">{settings.email}</p>
                                            </li>

                                        </ul>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>
                </section>
                <div className="bg-gray-100 text-center py-4 border-t-2">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Nhóm 4 - Dự án tốt nghiệp website Antlearn.
                    </p>
                </div>
            </footer>
        </>
    )
}

