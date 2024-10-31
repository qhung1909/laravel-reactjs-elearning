import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Footer } from "../footer/footer";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { SideBarCreateCoure } from "./SideBarCreateCoure";
export const CourseOverview = () => {
    const [courseTitle, setCourseTitle] = useState("");
    const [courseDescriptionText, setCourseDescriptionText] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedTopic, setSelectedTopic] = useState("");
    const [mainContent, setMainContent] = useState("");
    const [courseImage, setCourseImage] = useState(null);




    const allInputsCourseFilled = () => {
        return (
            courseTitle.trim() !== "" &&
            courseDescriptionText.trim().length >= 200 &&
            courseDescriptionText.trim() !== "" &&
            selectedLanguage !== "" &&
            selectedLevel !== "" &&
            selectedCategory !== "" &&
            selectedTopic !== "" &&
            mainContent.trim() !== ""
        );
    };
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
                            <h1 className="text-xl font-medium px-10 p-4">Tổng quan khóa học</h1>
                        </div>
                        <div className="border-b-2"></div>
                    </div>
                    <div className="p-10">
                        <p className="pb-10">
                            Trang tổng quan khóa học của bạn rất quan trọng đối với thành công của bạn trên AntLearn. Nếu được thực hiện đúng, trang này cũng có thể giúp bạn hiển thị trong các công cụ tìm kiếm như Google. Khi bạn hoàn thành phần này, hãy nghĩ đến việc tạo  Trang tổng quan khóa học hấp dẫn thể hiện lý do ai đó muốn ghi danh khóa học của bạn. Tìm hiểu về cách tạo trang tổng quan khóa học của bạn và các tiêu chuẩn tiêu đề khóa học.
                        </p>

                        <div className="pb-6">
                            <h2 className="pb-1 text-lg font-medium">Tiêu đề khóa học</h2>
                            <input
                                className="w-full mb-2 border-slate-300 border-2 py-2 pl-3"
                                placeholder='Chèn tiêu đề khóa học'
                                value={courseTitle}
                                onChange={(e) => setCourseTitle(e.target.value)}
                            />
                            <p className="text-sm text-gray-400">
                                Tiêu đề của bạn không những phải thu hút sự chú ý, chứa nhiều thông tin mà còn được tối ưu hóa dễ tìm kiếm
                            </p>
                        </div>

                        <div className="pb-6">
                            <h2 className="pb-1 text-lg font-medium">Mô tả khóa học</h2>
                            <ReactQuill
                                className="pb-2"
                                value={courseDescriptionText}
                                onChange={setCourseDescriptionText}
                                modules={{
                                    toolbar: [
                                        [{ 'header': [1, 2, 3, false] }],
                                        ['bold', 'italic', 'underline'],
                                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                        ['link', 'image', 'code-block'],
                                        ['clean']
                                    ],
                                }}
                                formats={[
                                    'header', 'bold', 'italic', 'underline',
                                    'list', 'bullet', 'link', 'image', 'code-block'
                                ]}
                            />
                            <p className="text-sm text-gray-400">Mô tả phải dài ít nhất 200 từ</p>
                        </div>

                        <div className="pb-6">
                            <h2 className="pb-1 text-lg font-medium">Thông tin cơ bản</h2>
                            <div className="grid grid-cols-3 gap-4">
                                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="-- Chọn ngôn ngữ --" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Ngôn ngữ</SelectLabel>
                                            <SelectItem value="vietnamese">Tiếng Việt</SelectItem>
                                            <SelectItem value="english">Tiếng Anh</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="-- Chọn trình độ --" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Trình độ</SelectLabel>
                                            <SelectItem value="beginner">Người mới bắt đầu</SelectItem>
                                            <SelectItem value="intermediate">Trung cấp</SelectItem>
                                            <SelectItem value="advanced">Nâng cao</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="-- Chọn thể loại khóa học --" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Thể loại khóa học</SelectLabel>
                                            <SelectItem value="frontend">Frontend Development</SelectItem>
                                            <SelectItem value="backend">Backend Development</SelectItem>
                                            <SelectItem value="fullstack">Fullstack Development</SelectItem>
                                            <SelectItem value="devops">DevOps</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                <div className="col-end-4">
                                    <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="-- Chọn chủ đề khóa học --" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Chủ đề khóa học</SelectLabel>
                                                <SelectItem value="web-design">Thiết kế web</SelectItem>
                                                <SelectItem value="data-visualization">Trực quan hóa dữ liệu</SelectItem>
                                                <SelectItem value="mobile-development">Phát triển ứng dụng di động</SelectItem>
                                                <SelectItem value="machine-learning">Học máy</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="pb-6">
                            <h2 className="pb-1 text-lg font-medium">Khóa học của bạn chủ yếu giảng dạy nội dung nào?</h2>
                            <input
                                className="w-7/12 mb-2 border-slate-300 border-2 py-2 pl-3"
                                placeholder="Ví dụ ReactJS"
                                value={mainContent}
                                onChange={(e) => setMainContent(e.target.value)}
                            />
                        </div>

                        <div className="pb-6">
                            <h2 className="pb-1 text-lg font-medium">Hình ảnh khóa học</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-red-100">
                                    <img src={courseImage ? URL.createObjectURL(courseImage) : ""} alt="Hình ảnh khóa học" />
                                </div>
                                <div className="ml-12">
                                    <p className="pb-4">
                                        Tải hình ảnh lên đây. Để được chấp nhận, hình ảnh phải đáp ứng tiêu chuẩn chất lượng hình ảnh khóa học. Hướng dẫn quan trọng 750x422 pixel, jpg, jpeg, gif hoặc png và không có nhu cầu trên hình ảnh.
                                    </p>

                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                        <Label htmlFor="picture">Hình ảnh</Label>
                                        <Input onChange={(e) => setCourseImage(e.target.files[0])} id="picture" type="file" />
                                    </div>
                                    {/* <input
                            type="file"

                            className="w-7/12 mb-2 border-slate-300 border-2 py-2 pl-3"
                        /> */}
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
