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

    const token = localStorage.getItem('access_token');

    const { course_id } = useParams();

    // Trạng thái dữ liệu hiện tại
    const [courseTitle, setCourseTitle] = useState("");
    const [courseDescriptionText, setCourseDescriptionText] = useState("");
    const [currency, setCurrency] = useState("");
    const [price, setPrice] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [courseImage, setCourseImage] = useState(null);

    // Trạng thái dữ liệu ban đầu
    const [initialCourseTitle, setInitialCourseTitle] = useState("");
    const [initialCourseDescriptionText, setInitialCourseDescriptionText] = useState("");
    const [initialCurrency, setInitialCurrency] = useState("");
    const [initialPrice, setInitialPrice] = useState("");
    const [initialSelectedLanguage, setInitialSelectedLanguage] = useState("");
    const [initialSelectedCategory, setInitialSelectedCategory] = useState("");
    const [initialCourseImage, setInitialCourseImage] = useState(null);

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);
    const [hasChanges, setHasChanges] = useState(false); // Theo dõi thay đổi


    const wordCount = courseDescriptionText.trim().split(/\s+/).filter(word => word).length;

    const [errors, setErrors] = useState({
        categoryError: '',
        priceError: '',
        descriptionError: '',
        titleError: '',
    });

    const [selectedExtension, setSelectedExtension] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [backupDate, setBackupDate] = useState('');

    const handleSelectedDateChange = (e) => {
        const date = e.target.value;
        setSelectedDate(date);

        if (date) {
            const selectedDateObj = new Date(date);
            const backupDateObj = new Date(selectedDateObj);
            backupDateObj.setDate(backupDateObj.getDate() + 7); // Thêm 7 ngày để làm ngày backup

            // Cập nhật ngày backup
            const backupDateStr = backupDateObj.toISOString().split('T')[0];
            setBackupDate(backupDateStr);
        }
    };





    useEffect(() => {
        // Đặt isUpdated thành true khi mới vào trang
        if (!initialCourseTitle && !initialCourseDescriptionText) {
            setIsUpdated(true);
        }
        if (!isUpdated) {
            // Khi trang load hoặc chuyển component, không hiển thị thông báo.
            toast.dismiss();
        }
    }, [initialCourseTitle, initialCourseDescriptionText, isUpdated]);

    // Đặt lại giá trị isUpdated khi có sự thay đổi giữa dữ liệu hiện tại và dữ liệu ban đầu
    useEffect(() => {
        if (
            courseTitle !== initialCourseTitle ||
            courseDescriptionText !== initialCourseDescriptionText ||
            currency !== initialCurrency ||
            price !== initialPrice ||
            selectedLanguage !== initialSelectedLanguage ||
            selectedCategory !== initialSelectedCategory ||
            courseImage !== initialCourseImage
        ) {
            setHasChanges(true);
            setIsUpdated(false);
        } else {
            setHasChanges(false);
            setIsUpdated(true);
        }
    }, [
        courseTitle,
        courseDescriptionText,
        currency,
        price,
        selectedLanguage,
        selectedCategory,
        courseImage,
        initialCourseTitle,
        initialCourseDescriptionText,
        initialCurrency,
        initialPrice,
        initialSelectedLanguage,
        initialSelectedCategory,
        initialCourseImage
    ]);


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const maxSize = 20480 * 1024;

            if (file.size > maxSize) {
                notify('Kích thước file không được vượt quá 2MB', 'error');
                e.target.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setCourseImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setCourseImage(null);
        }
    };



    useEffect(() => {
        const fetchCategories = async () => {
            toast.dismiss();
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

    // Fetch dữ liệu ban đầu từ API
    useEffect(() => {
        const fetchCourse = async () => {
            toast.dismiss();
            try {
                const response = await axios.get(`${API_URL}/teacher/courses/${course_id}`, {
                    headers: {
                        'x-api-secret': API_KEY,
                        'Authorization': `Bearer ${token}`,
                    },
                });



                if (response.data) {
                    const courseData = response.data.data;
                    setCourseTitle(courseData.title || '');
                    setInitialCourseTitle(courseData.title || '');
                    setCourseDescriptionText(courseData.description || '');
                    setInitialCourseDescriptionText(courseData.description || '');
                    setCurrency(courseData.currency || '');
                    setInitialCurrency(courseData.currency || '');
                    setPrice(courseData.price || '');
                    setInitialPrice(courseData.price || '');
                    setSelectedLanguage(courseData.language || '');
                    setInitialSelectedLanguage(courseData.language || '');
                    setSelectedCategory(courseData.course_category_id || '');
                    setInitialSelectedCategory(courseData.course_category_id || '');
                    setCourseImage(courseData.img || null);
                    setInitialCourseImage(courseData.img || null);

                    // Thêm logic xử lý cho phần mở rộng và ngày
                    if (courseData.launch_date) {
                        setSelectedExtension("online");
                        // Chuyển đổi định dạng ngày từ API sang định dạng HTML date input
                        const formattedLaunchDate = new Date(courseData.launch_date).toISOString().split('T')[0];
                        const formattedBackupDate = courseData.backup_launch_date ?
                            new Date(courseData.backup_launch_date).toISOString().split('T')[0] : '';

                        setSelectedDate(formattedLaunchDate);
                        setBackupDate(formattedBackupDate);
                    } else {
                        setSelectedExtension("0");
                        setSelectedDate('');
                        setBackupDate('');
                    }
                }
            } catch (error) {
                console.error('Error fetching course data:', error);
            }
        };
        fetchCourse();
    }, [API_KEY, API_URL, course_id, token]);



    const update = async () => {
        let valid = true;
        const newErrors = {
            categoryError: '',
            priceError: '',
            descriptionError: '',
            titleError: '',
        };



        if (!courseTitle.trim()) {
            valid = false;
            newErrors.titleError = 'Vui lòng nhập tiêu đề khóa học';
        }

        if (!courseDescriptionText.trim() || courseDescriptionText === '<p><br></p>') {
            valid = false;
            newErrors.descriptionError = 'Vui lòng nhập mô tả khóa học';
        } else if (wordCount < 20) {
            valid = false;
            newErrors.descriptionError = 'Mô tả phải từ 20 từ';
        }

        if (!selectedCategory) {
            valid = false;
            newErrors.categoryError = 'Vui lòng chọn thể loại khóa học';
        }

        if (!price.toString().trim()) {
            valid = false;
            newErrors.priceError = 'Vui lòng nhập giá khóa học';
        } else if (parseFloat(price) === 0) {
            valid = false;
            newErrors.priceError = 'Giá không được bằng 0đ';
        } else if (parseFloat(price) < 0) {
            valid = false;
            newErrors.priceError = 'Giá không được nhỏ hơn 0đ';
        } else if (price > 100000000) {
            valid = false;
            newErrors.priceError = 'Giá không được lớn hơn 100.000.000đ';
        }

        if (!courseImage) {
            valid = false;
            newErrors.imageError = 'Vui lòng chọn hình ảnh cho khóa học';
        }

        if (!valid) {
            setErrors(newErrors);
            notify('Vui lòng kiểm tra lại thông tin', 'error');
            return;
        }



        setErrors({
            categoryError: '',
            priceError: '',
            descriptionError: '',
            titleError: '',
        });

        const formData = new FormData();
        formData.append('course_category_id', selectedCategory);
        formData.append('price', parseFloat(price));
        formData.append('description', courseDescriptionText);
        formData.append('title', courseTitle.trim());
        formData.append('currency', currency);

        // Add launch dates if extension is online

        if (selectedExtension === "online") {
            formData.append('is_online_meeting', Number(1));
            if (selectedDate) {
                formData.append('launch_date', selectedDate);
            }
            if (backupDate) {
                formData.append('backup_launch_date', backupDate);
            }
        } else {
            formData.append('is_online_meeting', Number(0));
            formData.append('launch_date', '');
            formData.append('backup_launch_date', '');
        }

        // Add image if it exists and has changed
        if (courseImage && courseImage !== initialCourseImage) {
            const base64Response = await fetch(courseImage);
            const blob = await base64Response.blob();
            formData.append('img', blob, 'course-image.jpg');
        }
        const loadingToast = toast.loading('Đang xử lý...');
        try {
            setLoading(true);
            const response = await axios.post(
                `${API_URL}/teacher/courses/${course_id}`,
                formData,
                {
                    headers: {
                        'x-api-secret': API_KEY,
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data.success) {
                notify('Khóa học đã được cập nhật thành công', 'success');
                setIsUpdated(true);

                // Update initial states
                setInitialCourseTitle(courseTitle);
                setInitialCourseDescriptionText(courseDescriptionText);
                setInitialCurrency(currency);
                setInitialPrice(price);
                // setInitialSelectedLanguage(selectedLanguage);
                setInitialSelectedCategory(selectedCategory);
                setInitialCourseImage(courseImage);
            } else {
                notify('Không thể cập nhật khóa học', 'error');
            }
        } catch (error) {
            console.error('Error updating course:', error);
            notify(error.response?.data?.message || 'Lỗi cập nhật khóa học', 'error');
        } finally {
            toast.dismiss(loadingToast);
            setLoading(false);
        }
    };


    return (
        <>

            {loading && (
                <div className='loading'>
                    <div className='loading-spin'></div>
                </div>
            )}
            <header className="fixed top-0 w-full z-10 bg-yellow-500 py-3">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <Link
                            to='/instructor/lesson'
                            className="flex items-center gap-2 text-slate-900 hover:text-slate-700 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            <span className="text-sm font-medium hidden sm:inline">Quay lại khóa học</span>
                        </Link>

                        <div className="flex items-center gap-4">
                            {loading ? (
                                <>
                                    <Button
                                        readOnly
                                        className="sm:inline-flex items-center px-6 py-3 bg-white text-gray-500 font-semibold rounded-lg border-2 border-gray-500 hover:bg-white hover:text-gray-500 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                                    >
                                        <span>Cập nhật Khóa Học</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        onClick={update}
                                        className="sm:inline-flex items-center px-6 py-3 bg-white text-yellow-600 font-semibold rounded-lg border-2 border-yellow-600 hover:bg-yellow-600 hover:text-white transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                                    >
                                        <span>Cập nhật Khóa Học</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </Button>
                                </>
                            )}



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


            <div className="flex max-w-7xl m-auto pt-16 pb-36">
                <SideBarCreateCoure course_id={course_id} isUpdated={isUpdated} setIsUpdated={setIsUpdated} hasChanges={hasChanges} />
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
                                onChange={(e) => {
                                    setCourseTitle(e.target.value);
                                    // Reset lỗi khi người dùng nhập vào
                                    if (e.target.value.trim() !== '') {
                                        setErrors(prev => ({ ...prev, titleError: '' }));
                                    }
                                }}
                            />
                            {errors.titleError && <p className="text-red-500 text-sm">{errors.titleError}</p>}
                        </div>

                        <div className="pb-6">
                            <h2 className="pb-1 text-lg font-medium">Mô tả khóa học</h2>
                            <ReactQuill
                                className="pb-2"
                                value={courseDescriptionText}
                                onChange={(value) => {
                                    setCourseDescriptionText(value);
                                    // Reset lỗi khi người dùng nhập vào
                                    if (value.trim() !== '' && value !== '<p><br></p>') {
                                        setErrors(prev => ({ ...prev, descriptionError: '' }));
                                    }
                                }}
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
                            <p className="text-sm text-gray-400">Mô tả hiện tại: {wordCount} từ. (Cần ít nhất 20 từ)</p>
                            {errors.descriptionError && <p className="text-red-500 text-sm">{errors.descriptionError}</p>}
                        </div>

                        <div className="pb-6">
                            <h2 className="pb-2 font-medium text-lg">Đặt giá cho khóa học của bạn</h2>
                            {/* <div className="flex flex-cols-2 py-2 gap-4"> */}
                            <div className="w-1/4">
                                {/* <div>
                                    <Select value={currency} onValueChange={(value) => {
                                        setCurrency(value);
                                        // Reset lỗi khi người dùng chọn giá trị
                                        if (value !== '') {
                                            setErrors(prev => ({ ...prev, categoryError: '' }));
                                        }
                                    }}>
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
                                </div> */}
                                <div>
                                    <Input className='h-[36px]' value={parseFloat(price).toFixed(0)} onChange={(e) => {
                                        setPrice(e.target.value);
                                        // Reset lỗi khi người dùng nhập giá trị
                                        if (e.target.value.trim() !== '') {
                                            setErrors(prev => ({ ...prev, priceError: '' }));
                                        }
                                    }} type="number" placeholder="Giá" />
                                    {errors.priceError && <p className="text-red-500 text-sm">{errors.priceError}</p>}

                                </div>

                            </div>
                        </div>

                        <div className="pb-6">
                            <h2 className="pb-1 text-lg font-medium">Thông tin cơ bản</h2>
                            <div className="grid grid-cols-3 gap-4">
                                {/* <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
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
                                </Select> */}

                                <Select value={selectedCategory} onValueChange={(value) => {
                                    setSelectedCategory(value);
                                    // Reset lỗi khi người dùng chọn giá trị
                                    if (value !== '') {
                                        setErrors(prev => ({ ...prev, categoryError: '' }));
                                    }
                                }}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="-- Chọn thể loại khóa học --" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {loading ? (
                                                <SelectLabel>Đang load</SelectLabel>
                                            ) : (
                                                <>
                                                    <SelectLabel>Thể loại khóa học</SelectLabel>
                                                    {categories.map((category, index) => (
                                                        <SelectItem key={index} value={category.course_category_id}>
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                                </>
                                            )}
                                        </SelectGroup>

                                    </SelectContent>

                                </Select>
                                {errors.categoryError && <p className="text-red-500 text-sm">{errors.categoryError}</p>}

                            </div>
                        </div>
                        <div className="pb-6">
                            <div className="flex">
                                <div className="w-1/3">
                                    <h2 className="pb-1 text-lg font-medium">Chọn mở rộng khóa học</h2>
                                    {/* Chọn phần mở rộng */}

                                    <Select
                                        value={selectedExtension}
                                        onValueChange={(value) => setSelectedExtension(value)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="-- Chọn phần mở rộng --" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Dạng mở rộng</SelectLabel>
                                                <SelectItem value="0">Khóa học truyền thống</SelectItem>
                                                <SelectItem value="online">Khóa học trực tuyến (có lớp học online)</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Hiển thị phần lịch bên phải khi chọn "online" */}
                                {selectedExtension === "online" && (
                                    <>
                                        <div className="w-1/3 ml-4">
                                            <h3 className="text-lg font-medium">Ngày khai giảng học online</h3>
                                            <input
                                                type="date"
                                                className="w-full py-2 px-4 border border-gray-300 rounded-md"
                                                min={new Date().toISOString().split("T")[0]}  // Ngày bắt đầu không được nhỏ hơn ngày hiện tại
                                                max={new Date(new Date().setDate(new Date().getDate() + 10)).toISOString().split("T")[0]}  // Ngày cuối cùng không được quá 10 ngày kể từ hôm nay
                                                onChange={handleSelectedDateChange}  // Cập nhật ngày khai giảng
                                                value={selectedDate}  // Đảm bảo hiển thị ngày đã chọn
                                            />
                                        </div>

                                        {/* Lịch khai giảng học online backup */}
                                        <div className="w-1/3 ml-4">
                                            <h3 className="text-lg font-medium">Backup: Lịch khai giảng học online </h3>
                                            <input
                                                type="date"
                                                className="w-full py-2 px-4 border border-gray-300 rounded-md"
                                                min={backupDate}  // Chỉ cho phép chọn ngày sau ngày khai giảng online
                                                value={backupDate}  // Giá trị của lịch backup sẽ được hiển thị
                                                onChange={(e) => setBackupDate(e.target.value)} // Cho phép người dùng chọn ngày backup
                                                disabled={!selectedDate}
                                            />
                                            {!selectedDate && (
                                                <p className="text-gray-500 text-sm mt-2">
                                                    Chọn ngày khai giảng trước
                                                </p>
                                            )}
                                        </div>
                                    </>

                                )}
                            </div>
                            <p className="text-sm text-gray-400 pt-2">Khóa học của bạn có phần học online thì hãy chọn vào phần này</p>
                        </div>


                        <form method="POST" encType="multipart/form-data" onSubmit={(e) => e.preventDefault()} className="space-y-4">
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
                                            Tải hình ảnh lên đây. Để được chấp nhận, hình ảnh phải đáp ứng tiêu chuẩn chất lượng hình ảnh khóa học. Hướng dẫn quan trọng 750x422 pixel, jpg, jpeg, webp hoặc png và không có nhu cầu trên hình ảnh.
                                        </p>

                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label htmlFor="picture">Hình ảnh</Label>
                                            <Input onChange={handleFileChange} id="picture" type="file" />
                                        </div>
                                    </div>
                                </div>
                                {errors.imageError && <p className="text-red-500 text-sm">{errors.imageError}</p>}
                            </div>
                        </form>

                        {/* <Button onClick={exportToJsonLog} className="mt-4">
                            Xuất JSON Log
                        </Button> */}

                    </div>
                </div>
            </div>
            <Toaster />

            <Footer />
        </>
    );
};
