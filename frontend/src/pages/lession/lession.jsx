import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import axios from "axios";
import { format } from "date-fns";

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

export const Lesson = () => {
    // Hàm format ngày tháng
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) return "Ngày không hợp lệ";
        return format(date, "dd/MM/yyyy - HH:mm a");
    };

    const [lesson, setLesson] = useState(null);
    const { slug } = useParams();

    const fetchLesson = async () => {
        try {
            const res = await axios.get(`${API_URL}/lessons/${slug}`, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                },
            });

            if (res.data && res.data.lesson_id) {
                if (typeof res.data.content === "string") {
                    res.data.content = JSON.parse(res.data.content);
                }

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

    const lessonContents = lesson && lesson.content ? lesson.content : [];

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
                        <h1 className="text-xl">
                            {lesson ? lesson.name : "Loading..."}
                        </h1>
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
                                    url={lesson ? lesson.video_link : ""}
                                    controls
                                    width="100%"
                                    height="100%"
                                />
                            </div>

                            <div className="p-6 text-gray-800">
                                <h2 className="text-2xl font-bold mb-2">
                                    {lesson ? lesson.name : "Loading..."}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Cập nhật ngày{" "}
                                    {lesson
                                        ? formatDate(lesson.updated_at)
                                        : "Loading..."}
                                </p>
                                <p className="mt-4">
                                    {lesson ? lesson.description : "Loading..."}
                                </p>
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
                            <h3 className="text-lg font-semibold text-gray-800 p-4 border-b">
                                Nội dung bài học
                            </h3>

                            <div className="p-6">
                                <Accordion type="multiple" className="w-full">
                                    {Array.isArray(lessonContents) &&
                                    lessonContents.length > 0 ? (
                                        lessonContents.map((content, index) => (
                                            <AccordionItem
                                                key={index}
                                                value={`content-${index}`}
                                            >
                                                <AccordionTrigger className="font-medium text-gray-700">
                                                    {`${index + 1}. ${
                                                        content.title_content
                                                    }`}
                                                </AccordionTrigger>
                                                <AccordionContent className="text-gray-600 ml-3">
                                                    {Array.isArray(
                                                        content.body_content
                                                    ) ? (
                                                        content.body_content.map(
                                                            (body, i) => (
                                                                <p
                                                                    key={i}
                                                                    className="mb-2"
                                                                >
                                                                    {i + 1}.{" "}
                                                                    {body}
                                                                </p>
                                                            )
                                                        )
                                                    ) : (
                                                        <p>
                                                            {
                                                                content.body_content
                                                            }
                                                        </p>
                                                    )}
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))
                                    ) : (
                                        <p>Không có nội dung bài học.</p>
                                    )}
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
