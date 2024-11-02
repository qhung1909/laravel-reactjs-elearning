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
import { Link } from "react-router-dom";
import { Footer } from "../footer/footer";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from "axios";

import toast, { Toaster } from 'react-hot-toast';

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

import CryptoJS from 'crypto-js';

const secretKey = 'your-secret-key';
const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

const decryptData = (cipherText) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

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
        const storedData = localStorage.getItem('courseOverview');
        if (storedData) {
            const decryptedData = decryptData(storedData);
            setCourseTitle(decryptedData.courseTitle);
            setCourseDescriptionText(decryptedData.courseDescriptionText);
            setCurrency(decryptedData.currency);
            setPrice(decryptedData.price);
            setSelectedLanguage(decryptedData.selectedLanguage);
            setSelectedCategory(decryptedData.selectedCategory);
            setCourseImage(decryptedData.courseImage);
        }
    }, []);

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
            localStorage.setItem('courseOverview', encryptData(dataToStore));
        } else {
            localStorage.removeItem('courseOverview');
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


    const handleSubmit = async () => {
        const courseData = {
            course_category_id: selectedCategory,
            price: price,
            price_discount: price,
            description: courseDescriptionText,
            title: courseTitle,
            // img: courseImage, // Base64 image string
        };



        try {
            const response = await axios.post(`${API_URL}/course`, courseData, {
                headers: {
                    'x-api-secret': API_KEY,
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.success) {
                console.log('Success:', response.data);
                alert(response.data.message);
            } else {
                console.error('Error:', response.data.message);
                alert('Failed to add course');
            }
        } catch (error) {
            // console.error('Error submitting course:', error);
            alert('Error submitting course');
            console.log(error);

        }
    };



    return (
        <>
            <div className="bg-yellow-500 h-12">
                <Link className='absolute top-3 left-6 lg:left-0 xl:top-3 xl:left-8' to='/'>
                    <div className="flex items-center gap-3">
                        <box-icon name='arrow-back' color='black'></box-icon>
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
                        <button
                            onClick={handleSubmit}
                            className="bg-blue-500 text-white py-2 px-4 rounded"
                        >
                            Thêm Khóa Học
                        </button>
                    </div>
                </div>
            </div>
            <Toaster />

            <Footer />
        </>
    );
};
