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
import LessonCreator from "./createLesson";
export const FrameTeacher = () => {


    const handleSubmit = () => {
        const courseData = {
            courseTitle,
            courseDescriptionText,
            selectedLanguage,
            selectedLevel,
            selectedCategory,
            selectedTopic,
            mainContent,
            courseImage,
            currency,
            price,
            welcomeText,
            congratulationsText,
        };

        console.log(JSON.stringify(courseData, null, 2));
    };

    // active function
    const [activeSection, setActiveSection] = useState("courseOverview");

    // start-alert reload
    const handleBeforeUnload = (event) => {
        const message = "Bạn có chắc chắn muốn rời khỏi trang? Tất cả nội dung đã nhập sẽ bị mất!";
        event.returnValue = message;
        return message;
    };

    useEffect(() => {
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);





    //Tổng quan khóa học--course overview
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


    //Chương trình giảng dạy--curriculum




    //Định giá--valuation
    const [currency, setCurrency] = useState("");
    const [price, setPrice] = useState("");

    const allInputsValuationFilled = () => {
        return currency !== "" && price.trim() !== "";
    };

    const [isChecked, setIsChecked] = useState(false);





    //Tin nhắn khóa học--courseMessage
    const [welcomeText, setWelcomeText] = useState('');
    const [congratulationsText, setCongratulationsText] = useState('');

    const allInputsCourseMessageFilled = () => {
        const isWelcomeTextEmpty = welcomeText.trim() === "<p><br></p>" || welcomeText.trim() === "";
        const isCongratulationsTextEmpty = congratulationsText.trim() === "<p><br></p>" || congratulationsText.trim() === "";

        return !isWelcomeTextEmpty && !isCongratulationsTextEmpty; // Trả về true chỉ khi cả hai không trống
    };



    // ================================================================================
    // ================================================================================
    // ================================================================================
    // ================================================================================
    // ================================================================================




    // Tổng quan khóa học || courseOverview

    const courseOverview = () => {
        return (
            <>
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
            </>
        )
    }


    // Chương trình giảng dạy || curriculum

    const curriculum = () => {
        return (
            <>
                <div>
                    <div className="m-2">
                        <h1 className="text-xl font-medium px-10 p-4">Chương trình giảng dạy</h1>
                    </div>
                    <div className="border-b-2"></div>
                </div>

                <LessonCreator />

            </>
        )
    }


    // Định giá || valuation

    const valuation = () => {
        return (
            <>
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

            </>
        )
    }

    // Khuyến mại || promotion

    const promotion = () => {
        return (
            <>
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
            </>
        )
    }

    // Tin nhắn khóa học || courseMessage

    const courseMessage = () => {
        return (
            <>
                <div>
                    <div className="m-2">
                        <h1 className="text-xl font-medium px-10 p-4">Tin nhắn khóa học</h1>
                    </div>
                    <div className="border-b-2"></div>
                </div>
                <div>
                    <div>

                    </div>
                    <div className="p-10 lg:pr-32">

                        <div className="pb-6">
                            <p>Bạn có thể viết tin nhắn cho học viên (tùy chọn) để khuyến khích học viên tương tác với nội dung khóa học. Tin nhắn này sẽ được tự động gửi đi khi họ tham gia hoặc hoàn thành khóa học. Nếu bạn không muốn gửi tin nhắn chào mừng hoặc chúc mừng. Hãy để trống ô văn bản này</p>
                        </div>

                        <p className="pb-3 font-medium">Tin nhắn chào mừng</p>
                        <ReactQuill
                            className="pb-6"
                            value={welcomeText}
                            onChange={setWelcomeText}
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

                        <p className="pb-3 font-medium">Tin nhắn chúc mừng</p>
                        <ReactQuill
                            className="pb-6"
                            value={congratulationsText}
                            onChange={setCongratulationsText}
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
                    </div>
                </div>

            </>
        )
    }



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
                <div className="w-3/12 mr-4 hidden lg:block">
                    <div className="mx-3 my-5">
                        <div className="px-5">
                            <h2 className="font-medium">Tạo nội dung của bạn</h2>
                            <div className="flex items-center space-x-2 my-4 ">
                                <Checkbox
                                    checked={allInputsCourseFilled()} // Đảm bảo gọi đúng hàm
                                    readOnly
                                />
                                <label
                                    className='cursor-pointer'
                                    onClick={() => {
                                        setActiveSection("courseOverview");
                                    }}
                                >
                                    Trang tổng quan khóa học
                                </label>
                            </div>
                            <div className="flex items-center space-x-2 mt-4 mb-8 ">
                                <Checkbox
                                    // checked={allInputsFilled()}
                                    readOnly
                                />
                                <label
                                    className='ursor-pointer'
                                    onClick={() => setActiveSection("curriculum")}
                                >
                                    Chương trình giảng dạy
                                </label>
                            </div>


                            <h2 className="font-medium">Xuất bản khóa học của bạn</h2>
                            <div className="flex items-center space-x-2 my-4">
                                <Checkbox
                                    checked={allInputsValuationFilled()}
                                    readOnly
                                />
                                <label
                                    onClick={() => setActiveSection("valuation")}
                                    className="cursor-pointer"
                                >
                                    Định giá
                                </label>
                            </div>
                            <div className="flex items-center space-x-2 my-4">
                                <Checkbox
                                    id="terms"
                                    checked={isChecked}
                                    readOnly
                                />
                                <label
                                    onClick={() => {
                                        setIsChecked(true); // Tự động tick vào checkbox
                                        setActiveSection("promotion"); // Chuyển đến phần khuyến mại
                                    }}
                                    className="cursor-pointer"
                                >
                                    Khuyến mại
                                </label>
                            </div>
                            <div className="flex items-center space-x-2 mt-2 mb-8">
                                <Checkbox
                                    checked={allInputsCourseMessageFilled()}
                                    readOnly
                                />
                                <label
                                    onClick={() => setActiveSection("courseMessage")}
                                    className="cursor-pointer"
                                >
                                    Tin nhắn khóa học
                                </label>
                            </div>
                        </div>
                        <button
                            className="bg-yellow-400 w-full px-3 py-3"
                            onClick={handleSubmit}
                        >
                            <h2 className="text-white font-bold">
                                Gửi đi để xem xét
                            </h2>
                        </button>

                    </div>
                </div>
                <div className="w-full lg:w-10/12 shadow-lg">
                    {activeSection === "courseOverview" && courseOverview()}
                    {activeSection === "curriculum" && curriculum()}
                    {activeSection === "valuation" && valuation()}
                    {activeSection === "promotion" && promotion()}
                    {activeSection === "courseMessage" && courseMessage()}
                </div>
            </div>
            <Footer />

        </>
    )
}
