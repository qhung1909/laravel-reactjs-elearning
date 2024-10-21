import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useState, useEffect } from "react";
import { Clock, CheckCircle, Lock } from "lucide-react";
import ReactPlayer from "react-player";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;
import { format } from "date-fns";

export const Lesson = () => {
    // Hàm format ngày tháng
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) return "Ngày không hợp lệ";
        return format(date, "dd/MM/yyyy - HH:mm a");
    };

    const [lesson, setLesson] = useState([]);
    const { slug } = useParams();

    const fetchLesson = async () => {
        try {
            const res = await axios.get(`${API_URL}/lessons/${slug}`, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                },
            });
            if (res.data && res.data.lesson_id) {
                setLesson(res.data);
            } else {
                console.error("Dữ liệu không hợp lệ:", res.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu bài học:", error);
            if (error.response) {
                console.error("Chi tiết lỗi:", error.response.data);
            }
        }
    };

    useEffect(() => {
        if (slug) {
            fetchLesson();
        }
    }, [slug]);

    return (
        <>
            <body className="bg-gray-100">
                <div className="bg-gray-800 flex items-center justify-between py-1 px-6 fixed z-20 right-0 left-0">
                    <Link to={`/detail/${slug}`}>
                        <button className="text-white">
                            <box-icon color="white" name="chevron-left" />
                        </button>
                    </Link>

                    <div className="text-white font-bold flex items-center">
                        <Link to="/">
                            <div className="w-12 h-12 flex items-center justify-center text-white mr-4">
                                <img
                                    alt="Logo"
                                    className="w-full h-full object-contain"
                                    src="/src/assets/images/antlearn.png"
                                />
                            </div>
                        </Link>
                        <h1 className="text-xl">{lesson.name}</h1>
                    </div>
                    <div className="ml-auto flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                            <span className="border-2 border-gray-700 text-gray-300 text-sm md:text-base w-10 h-10 flex items-center justify-center rounded-full">
                                <span className="text-gray-300">0%</span>
                            </span>
                            <span className="text-gray-400 text-sm md:text-base">
                                0/12 bài học
                            </span>
                        </div>
                        <button className="p-2 rounded text-white">
                            <box-icon color="white" name="chat" />
                        </button>
                        <button className="p-2 rounded text-white">
                            <box-icon
                                color="white"
                                name="message-square-dots"
                            />
                        </button>
                    </div>
                </div>

                <div className="content-main py-16">
                    <div className="flex flex-col md:flex-row">
                        {/* Phần video */}
                        <div className="flex-1 bg-white rounded-lg shadow-md p-4">
                            <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden">
                                <ReactPlayer
                                    url={lesson.video_link}
                                    controls
                                    width="100%"
                                    height="100%"
                                />
                            </div>

                            <div className="p-6 text-gray-800">
                                <h2 className="text-2xl font-bold mb-2">
                                    {lesson.name}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Cập nhật ngày{" "}
                                    {formatDate(lesson.updated_at)}
                                </p>
                                <p className="mt-4">{lesson.description}</p>
                                <ul className="mt-4 space-y-2">
                                    <li>
                                        <a
                                            href="https://www.facebook.com/profile.php?id=100079303916866"
                                            className="flex items-center text-orange-500 hover:underline"
                                        >
                                            <box-icon
                                                name="facebook-square"
                                                type="logo"
                                            ></box-icon>
                                            AntLearn - Elearning
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Phần nội dung khóa học */}
                        <div className="w-full md:w-[350px] bg-gray-50 rounded-lg shadow-md mt-8 md:mt-0 md:ml-8 overflow-y-auto">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold mb-4">
                                    Nội dung bài học
                                </h3>
                                <Accordion type="multiple" className="w-full">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger className="font-medium text-gray-700">
                                            Giới thiệu về Python
                                        </AccordionTrigger>
                                        <AccordionContent className="text-gray-600">
                                            Python là một ngôn ngữ lập trình
                                            mạnh mẽ và dễ học, thường được sử
                                            dụng cho phát triển web, khoa học dữ
                                            liệu, và AI. Đây là bài học giúp bạn
                                            nắm bắt các khái niệm cơ bản về
                                            Python, cú pháp và ứng dụng thực tế.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2">
                                        <AccordionTrigger className="font-medium text-gray-700">
                                            JavaScript cơ bản
                                        </AccordionTrigger>
                                        <AccordionContent className="text-gray-600">
                                            JavaScript là ngôn ngữ lập trình
                                            phía front-end phổ biến nhất hiện
                                            nay. Bài học này sẽ hướng dẫn bạn từ
                                            những kiến thức cơ bản đến nâng cao
                                            về JavaScript và cách sử dụng nó để
                                            tương tác với trang web.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-3">
                                        <AccordionTrigger className="font-medium text-gray-700">
                                            Làm việc với React.js
                                        </AccordionTrigger>
                                        <AccordionContent className="text-gray-600">
                                            React.js là một thư viện JavaScript
                                            mạnh mẽ giúp phát triển giao diện
                                            người dùng một cách hiệu quả. Trong
                                            bài học này, bạn sẽ tìm hiểu về
                                            component, state, props và cách xây
                                            dựng ứng dụng web hiện đại với
                                            React.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-4">
                                        <AccordionTrigger className="font-medium text-gray-700">
                                            Thiết kế giao diện với Tailwind CSS
                                        </AccordionTrigger>
                                        <AccordionContent className="text-gray-600">
                                            Tailwind CSS là một công cụ tiện ích
                                            mạnh mẽ để tạo ra các giao diện đẹp
                                            mắt mà không cần viết CSS từ đầu.
                                            Bài học này sẽ giúp bạn hiểu cách sử
                                            dụng các lớp tiện ích của Tailwind
                                            để tạo nên giao diện responsive và
                                            tùy biến.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer điều hướng cải tiến */}
                <footer className="fixed left-0 right-0 bottom-0 z-20 flex items-center justify-between px-8 py-4 bg-gradient-to-r from-gray-50 to-gray-100 shadow-lg">
                    <button className="flex items-center text-white bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-2 rounded-full shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-300">
                        <box-icon
                            name="chevron-left"
                            color="white"
                            className="mr-2"
                        />
                        <span className="text-sm md:text-base font-semibold">
                            BÀI TRƯỚC
                        </span>
                    </button>

                    <button className="flex items-center text-white bg-gradient-to-r from-teal-400 to-teal-500 px-4 py-2 rounded-full shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-300">
                        <span className="text-sm md:text-base font-semibold mr-2">
                            BÀI TIẾP THEO
                        </span>
                        <box-icon name="chevron-right" color="white" />
                    </button>
                </footer>
            </body>
        </>
    );
};
