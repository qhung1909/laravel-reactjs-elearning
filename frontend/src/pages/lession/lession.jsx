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
import { Play, BookOpen, Clock, Video, ArrowRight } from 'lucide-react';
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
                console.log(res.data);

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
    const [currentVideoUrl, setCurrentVideoUrl] = useState("");
    const showVideo_content = (video_content) => {
        const embedUrl = video_content;
        setCurrentVideoUrl(embedUrl);
    };
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
                                {currentVideoUrl ? (
                                    <ReactPlayer
                                        url={currentVideoUrl}
                                        className="absolute top-0 left-0 w-full h-full"
                                        controls={true}
                                        width="100%"
                                        height="100%"
                                    />
                                ) : (
                                    <img
                                        src="/src/assets/images/thumnail-lesson.jpeg"
                                        alt="Banner"
                                        className="absolute top-0 left-0 w-full h-full object-cover"
                                        style={{ borderRadius: "0.5rem" }} // Tùy chỉnh thêm nếu cần
                                    />
                                )}
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
                        <div className="w-full md:w-[350px] bg-gray-50 rounded-lg shadow-md mt-8 md:mt-0 md:ml-8">
                            <div className="flex items-center space-x-2 border-b">
                                <h3 className="text-lg font-semibold text-gray-800 p-4 ">
                                    Nội dung bài học
                                    <span className="text-gray-400 text-sm md:text-base ml-16">
                                        {lessonContents.length || 0} Phần
                                    </span>
                                </h3>

                            </div>

                            <div className="p-6 max-h-[500px] overflow-y-auto">
                                <Accordion type="multiple" className="space-y-3">
                                    {Array.isArray(lessonContents) && lessonContents.length > 0 ? (
                                        lessonContents.map((content, index) => (
                                            <AccordionItem
                                                key={index}
                                                value={`content-${index}`}
                                                className="border-none"
                                            >
                                                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow transition-shadow duration-200">
                                                    <AccordionTrigger className="w-full hover:no-underline">
                                                        <div className="flex items-center w-full p-4">
                                                            <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center text-purple-600 font-medium mr-4">
                                                                {index + 1}
                                                            </div>
                                                            <div className="flex-1 flex items-center justify-between">
                                                                <h3 className="font-medium text-gray-800 text-sm truncate">
                                                                    {content.title_content}
                                                                </h3>
                                                            </div>

                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent>
                                                        <div className="px-4 pb-4">
                                                            <div className="space-y-2 mb-4">
                                                                {Array.isArray(content.body_content) ? (
                                                                    content.body_content.map((body, i) => (
                                                                        <div
                                                                            key={i}
                                                                            className="flex items-start gap-2 p-2 hover:bg-purple-50 rounded-lg transition-colors"
                                                                        >
                                                                            <span className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xs flex-shrink-0">
                                                                                {i + 1}
                                                                            </span>
                                                                            <p className="text-sm text-gray-600">{body}</p>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <p className="text-sm text-gray-600 pl-7">{content.body_content}</p>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2 pl-7">
                                                                <button
                                                                    onClick={() => showVideo_content(content.video_content)}
                                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
                                                                >
                                                                    <Play className="w-4 h-4" />
                                                                    <span>Xem bài giảng</span>
                                                                </button>

                                                                <Link
                                                                    to="/quizzes"
                                                                    className="inline-flex items-center gap-1 px-3 py-1.5 border border-purple-200 text-purple-600 text-sm rounded-lg hover:bg-purple-50 transition-colors"
                                                                >
                                                                    <span>Bài tập</span>
                                                                    <ArrowRight className="w-3 h-3" />
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </AccordionContent>
                                                </div>
                                            </AccordionItem>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 bg-white rounded-xl">
                                            <BookOpen className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                                            <p className="text-gray-500">Đang cập nhật nội dung...</p>
                                        </div>
                                    )}
                                </Accordion>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer điều hướng cải tiến */}
                <footer className="fixed left-0 right-0 bottom-0 z-20 flex items-center justify-between px-8 py-4 bg-gradient-to-r from-gray-50 to-gray-100 shadow-lg">
                    <button className="flex items-center text-white bg-yellow-900 px-4 py-2 rounded-full shadow-md cursor-pointer transition transform hover:scale-105">
                        <box-icon
                            name="chevron-left"
                            color="white"
                            className="mr-2"
                        />
                        <span className="text-sm md:text-base font-semibold">
                            BÀI TRƯỚC
                        </span>
                    </button>

                    <button className="flex items-center text-white bg-yellow-900 px-4 py-2 rounded-full shadow-md cursor-pointer transition transform hover:scale-105">
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
