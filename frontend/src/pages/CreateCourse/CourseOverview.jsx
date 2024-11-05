import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SideBarCreateCoure } from "./SideBarCreateCoure";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Footer } from "../footer/footer";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from "axios";

import toast, { Toaster } from 'react-hot-toast';
import { ArrowLeft, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const notify = (message, type) => {
    if (type === 'success') {
        toast.success(message, {
            style: {
                padding: '16px'
            }
        });
    } else {
        toast.error(message, {
            style: {
                padding: '16px'
            }
        })
    }
}



export const CourseOverview = () => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);


    const [courseTitle, setCourseTitle] = useState("");
    const [courseDescriptionText, setCourseDescriptionText] = useState("");
    const [currency, setCurrency] = useState("");
    const [price, setPrice] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const [courseImage, setCourseImage] = useState(null);

    const wordCount = courseDescriptionText.trim().split(/\s+/).filter(word => word).length;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCourseImage(reader.result); // Lưu URL base64
            };
            reader.readAsDataURL(file); // Đọc tệp dưới dạng URL
        } else {
            setCourseImage(null); // Đặt lại nếu không có tệp
        }
    };

    useEffect(() => {
        const isCourseTitleValid = courseTitle.trim() !== "";
        const isDescriptionValid = wordCount >= 200;
        const isCurrencyValid = currency !== "";
        const isPriceValid = price.trim() !== "";
        const isLanguageSelected = selectedLanguage !== "";
        const isCategorySelected = selectedCategory !== "";
        const isImageUploaded = courseImage !== null;

        if (isCourseTitleValid || isDescriptionValid || isCurrencyValid || isPriceValid || isLanguageSelected || isCategorySelected || isImageUploaded) {
            const dataToStore = {
                courseTitle,
                courseDescriptionText,
                currency,
                price,
                selectedLanguage,
                selectedCategory,
                courseImage
            };
        }

        if (isCourseTitleValid && isDescriptionValid && isCurrencyValid && isPriceValid && isLanguageSelected && isCategorySelected && isImageUploaded) {
            localStorage.setItem('FA-CO', 'done');
        } else {
            localStorage.removeItem('FA-CO');
        }
    }, [courseTitle, wordCount, courseDescriptionText, currency, price, selectedLanguage, selectedCategory, courseImage]);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_URL}/categories`, {
                    headers: { 'x-api-secret': API_KEY }
                });
                setCategories(res.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false)
            }
        };
        fetchCategories()
    }, [API_KEY, API_URL])
    const { course_id } = useParams();
    // console.log(course_id);

    useEffect(() => {
        const fetchCourse = async () => {
            const response = await axios.get(`${API_URL}/teacher/courses/${course_id}`, {
                headers: {
                    'x-api-secret': API_KEY,
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
            });

            if (response.data) {
                const courseData = response.data.data;
                console.log(courseData);
                setCourseTitle(courseData.title || '');
                setCourseDescriptionText(courseData.description || '');
                setPrice(courseData.price || '');
                setCourseImage(courseData.img || '');
                setSelectedCategory(courseData.course_category_id || '');

            } else {
                console.error('Error fetching course:', response.data.message);
                alert('Failed to fetch course');
            }
            console.log(course_id);

        };
        fetchCourse()
    }, [API_KEY, API_URL, course_id])



    const handleSubmit = async () => {
        const courseData = {
            course_category_id: selectedCategory,
            price: price,
            // price_discount: price,
            description: courseDescriptionText,
            title: courseTitle,
            // img: courseImage, // Base64 image string
        };

        try {
            const response = await axios.put(`${API_URL}/teacher/courses/${course_id}`, courseData, {
                headers: {
                    'x-api-secret': API_KEY,
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.success) {
                notify('Khóa học đã được cập nhật', 'success');

            } else {
                console.error('Error:', response.data.message);
                alert('Failed to add course', 'success');
            }
        } catch (error) {
            // console.error('Error submitting course:', error);
            alert('Error submitting course');
            console.log(error);

        }
    };



    return (
        <>
            <header className="bg-yellow-500 py-3">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <Link
                            to='/'
                            className="flex items-center gap-2 text-slate-900 hover:text-slate-700 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            <span className="text-sm font-medium hidden sm:inline">Quay lại khóa học</span>
                        </Link>

                        <div className="flex items-center gap-4">
                            <Button
                                onClick={handleSubmit}
                                className="hidden sm:inline-flex items-center px-6 py-3 bg-white text-yellow-600 font-semibold rounded-lg border-2 border-yellow-600 hover:bg-yellow-600 hover:text-white transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                            >
                                <span>Cập nhật Khóa Học</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden text-slate-900 hover:bg-yellow-400"
                                aria-label="Menu"
                            >
                                <Menu className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>


            <div className="flex max-w-7xl m-auto pt-10 pb-36">
                <SideBarCreateCoure course_id={course_id} />
                <div className="w-full lg:w-10/12 shadow-lg">
                    <div>
                        <div className="m-2">
                            <h1 className="text-xl font-medium px-10 p-4">Tổng quan khóa học</h1>
                        </div>
                        <div className="border-b-2"></div>
                    </div>
                    <div className="p-10">
                        <p className="pb-10">
                            Trang tổng quan khóa học của bạn rất quan trọng đối với thành công của bạn trên AntLearn. Nếu được thực hiện đúng, trang này cũng có thể giúp bạn hiển thị trong các công cụ tìm kiếm như Google. Khi bạn hoàn thành phần này, hãy nghĩ đến việc tạo Trang tổng quan khóa học hấp dẫn thể hiện lý do ai đó muốn ghi danh khóa học của bạn. Tìm hiểu về cách tạo trang tổng quan khóa học của bạn và các tiêu chuẩn tiêu đề khóa học.
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
                            <p className="text-sm text-gray-400">Mô tả hiện tại: {wordCount} từ. (Cần ít nhất 200 từ)</p>
                        </div>

                        <div className="pb-6">
                            <h2 className="pb-2 font-medium text-lg">Đặt giá cho khóa học của bạn</h2>
                            <div className="flex flex-cols-2 py-2 gap-4">
                                <div>
                                    <Select value={currency} onValueChange={setCurrency}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Chọn tiền tệ" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Tiền tệ</SelectLabel>
                                                <SelectItem value="vnd">VND</SelectItem>
                                                <SelectItem value="usd">USD</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Input className='h-full' value={price} onChange={(e) => setPrice(e.target.value)} type="number" placeholder="Giá" />
                                </div>
                            </div>
                            <p className="text-sm text-gray-400">Nếu muốn cung cấp miễn phí khóa học của mình thì khóa học đó phải có tổng thời lượng video dưới 2 giờ. Ngoài ra, các khóa học có bài kiểm tra thực hành không thể miễn phí.</p>
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

                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="-- Chọn thể loại khóa học --" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>

                                            {loading ? (
                                                <>
                                                    <SelectLabel>Đang load</SelectLabel>
                                                </>
                                            ) : (
                                                <>
                                                    <SelectLabel>Thể loại khóa học</SelectLabel>

                                                    {categories.map((category, index) => (
                                                        <SelectItem key={index} value={category.course_category_id}>
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                                </>
                                            )
                                            }

                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                            </div>
                        </div>

                        <div className="pb-6">
                            <h2 className="pb-1 text-lg font-medium">Hình ảnh khóa học</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-red-100">
                                    {courseImage && (
                                        <img src={courseImage} alt="Hình ảnh khóa học" />
                                    )}
                                </div>
                                <div className="ml-12">
                                    <p className="pb-4">
                                        Tải hình ảnh lên đây. Để được chấp nhận, hình ảnh phải đáp ứng tiêu chuẩn chất lượng hình ảnh khóa học. Hướng dẫn quan trọng 750x422 pixel, jpg, jpeg, gif hoặc png và không có nhu cầu trên hình ảnh.
                                    </p>

                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                        <Label htmlFor="picture">Hình ảnh</Label>
                                        <Input onChange={handleFileChange} id="picture" type="file" />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <Toaster />

            <Footer />
        </>
    );
};
