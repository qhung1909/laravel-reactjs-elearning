import "./detail.css";
import "../../components/js/detail.js";
import { Link } from "react-router-dom";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

export const Detail = () => {
    const [detail, setDetail] = useState([]);
    const { slug } = useParams();

    // Tính % giá giảm
    const price = parseFloat(detail.price);
    const price_discount = parseFloat(detail.price_discount);
    const percentDiscount =
        price && price_discount
            ? Math.round(((price - price_discount) / price) * 100)
            : 0; // Tránh chia cho 0

    // Format ngày tháng
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        // Kiểm tra nếu date không hợp lệ
        if (isNaN(date)) return "Ngày không hợp lệ";
        return format(date, "dd/MM/yyyy"); // Thay đổi định dạng theo ý muốn
    };

    const fetchDetail = async () => {
        try {
            const res = await axios.get(`${API_URL}/course/${slug}`, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                },
            });
            setDetail(res.data);
        } catch (error) {
            console.error("Chi tiết lỗi:", error.response.data);
            console.error("Trạng thái lỗi:", error.response.status);
        }
    };

    useEffect(() => {
        if (slug) {
            fetchDetail();
        }
    }, [slug]);

    const renderBannerDetail = (
        <div
            className="bg-gray-900 p-6 text-white"
            style={{ backgroundColor: "#2d2f31" }}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-44">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Cột trái (Văn bản) */}
                    <div className="col-span-1 lg:col-span-8">
                        {/* Điều hướng Breadcrumb */}
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink>
                                        <Link
                                            href="/"
                                            className="text-[#C0C4FC]"
                                        >
                                            Trang chủ
                                        </Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink>
                                        <Link
                                            href="/courses"
                                            className="text-[#C0C4FC]"
                                        >
                                            Khóa học
                                        </Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="text-[#C0C4FC]">
                                        Chi tiết
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>

                        {/* Tiêu đề */}
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                            {detail.title}
                        </h1>
                        {/* Mô tả */}
                        <p className="text-base sm:text-lg md:text-xl text-white-400 mb-4">
                            {detail.description}
                        </p>
                        {/* Đánh giá */}
                        <div className="flex items-center mb-2">
                            <span className="text-yellow-500 text-sm font-semibold">
                                4,6
                            </span>
                            <span className="ml-2 text-sm text-white-400">
                                (43 xếp hạng)
                            </span>
                            <span className="ml-4 text-sm text-white-400">
                                382 học viên
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-white-400 flex items-center">
                            <box-icon
                                name="calendar"
                                color="#9CA3AF"
                                className="mr-2"
                                size="sm"
                            />
                            Ngày cập nhật gần nhất{" "}
                            {formatDate(detail.updated_at)}
                        </p>
                        <p className="text-xs sm:text-sm text-white-400 flex items-center mt-1">
                            <box-icon
                                name="globe"
                                color="#9CA3AF"
                                className="mr-2"
                                size="sm"
                            />
                            Vietnamese
                        </p>
                    </div>
                    {/* Cột phải (Hình ảnh) */}
                    <div className="col-span-1 lg:col-span-4 flex justify-center items-center">
                        <img
                            src="/src/assets/images/inclusion2.jpg"
                            alt="Inclusion "
                            className="max-w-full"
                            style={{ maxHeight: 200 }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Banner */}
            {renderBannerDetail}
            {/* Kết thúc Banner */}

            {/* Phần Nội dung chính */}
            <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-44 mt-8">
                <div className="flex flex-wrap -mx-4">
                    {/* Cột trái (Nội dung bài học) */}
                    <div className="w-full lg:w-2/3 px-4">
                        <h2 className="text-2xl font-bold mb-4">
                            Khám phá các chủ đề liên quan
                        </h2>
                        <div className="flex flex-wrap space-x-2 mb-6">
                            <span className="custom-tag">
                                <a href="#">Python</a>
                            </span>
                            <span className="custom-tag">
                                <a href="#">Ngôn ngữ lập trình</a>
                            </span>
                            <span className="custom-tag">
                                <a href="#">Phát triển</a>
                            </span>
                        </div>
                        {/* Section 1 */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-4">
                                Nội dung bài học
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden">
                                {/* Danh sách trái */}
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        Hiểu rõ đặc điểm của ngôn ngữ lập trình
                                        Python và các ứng dụng có thể phát triển
                                        bằng ngôn ngữ này
                                    </li>
                                    <li className="flex items-start">
                                        Nắm rõ cú pháp cơ bản của Python, cách
                                        khai báo biến
                                    </li>
                                    <li className="flex items-start">
                                        Nắm được các phép toán số học và phép
                                        toán logic trong Python
                                    </li>
                                    <li className="flex items-start lesson-content collapsed">
                                        Nắm được kiểu dữ liệu List, Tuple và
                                        Dictionary trong Python và ứng dụng
                                    </li>
                                    <li className="flex items-start lesson-content collapsed">
                                        Biết cách lập trình hướng đối tượng với
                                        lớp (class), kế thừa, đa hình
                                    </li>
                                    <li className="flex items-start lesson-content collapsed">
                                        Hiểu và ứng dụng các thư viện Python
                                        (web, khoa học dữ liệu, trí tuệ nhân
                                        tạo, v.v.)
                                    </li>
                                </ul>
                                {/* Danh sách phải */}
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        Biết cách cài đặt môi trường phát triển
                                        PyCharm để lập trình bằng Python
                                    </li>
                                    <li className="flex items-start">
                                        Biết cách xử lý chuỗi (string), phương
                                        thức về chuỗi
                                    </li>
                                    <li className="flex items-start">
                                        Nắm được cấu trúc điều khiển và vòng lặp
                                    </li>
                                    <li className="flex items-start lesson-content collapsed">
                                        Biết cách sử dụng hàm (Function) và
                                        Module trong Python
                                    </li>
                                    <li className="flex items-start lesson-content collapsed">
                                        Cách xử lý lỗi và làm việc với File
                                    </li>
                                    <li className="flex items-start lesson-content collapsed">
                                        Sử dụng ChatGPT hỗ trợ lập trình
                                    </li>
                                </ul>
                            </div>
                            <button
                                id="toggle-btn"
                                className="mt-4 text-blue-600 hover:underline focus:outline-none"
                            >
                                Hiện thêm ^
                            </button>
                        </div>
                        {/* Kết thúc Section 1 */}
                        {/* Section 2 */}
                        <div className="bg-white p-6 rounded-lg shadow-md mt-8">
                            {/* Phần công ty cung cấp khóa học */}
                            <div className="text-gray-700 text-lg font-bold mb-4">
                                Các công ty hàng đầu cung cấp khóa học này cho
                                nhân viên
                            </div>
                            <p className="text-gray-600 mb-4">
                                Chúng tôi lựa chọn khóa học này cho tuyển tập
                                khóa học đầu bảng được các doanh nghiệp toàn cầu
                                tin dùng.
                                <a
                                    href="#"
                                    className="text-blue-600 hover:underline"
                                >
                                    Tìm hiểu thêm
                                </a>
                            </p>
                            <div className="flex flex-wrap justify-center gap-4 mb-6">
                                <img
                                    src="https://dummyimage.com/100x40/000/fff&text=Nasdaq"
                                    alt="Nasdaq"
                                    className="h-10"
                                />
                                <img
                                    src="https://dummyimage.com/100x40/000/fff&text=Volkswagen"
                                    alt="Volkswagen"
                                    className="h-10"
                                />
                                <img
                                    src="https://dummyimage.com/100x40/000/fff&text=Box"
                                    alt="Box"
                                    className="h-10"
                                />
                                <img
                                    src="https://dummyimage.com/100x40/000/fff&text=NetApp"
                                    alt="NetApp"
                                    className="h-10"
                                />
                                <img
                                    src="https://dummyimage.com/100x40/000/fff&text=Eventbrite"
                                    alt="Eventbrite"
                                    className="h-10"
                                />
                            </div>
                            {/* Phần bài tập coding */}
                            <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-center">
                                <div className="w-full lg:w-1/2">
                                    <h3 className="text-2xl font-bold mb-2">
                                        Bài tập coding
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Khóa học này bao gồm các bài tập coding
                                        được cập nhật của chúng tôi để bạn có
                                        thể thực hành các kỹ năng của bạn khi
                                        học.
                                    </p>
                                    <a
                                        href="#"
                                        className="text-blue-600 hover:underline"
                                    >
                                        Xem bản demo
                                    </a>
                                </div>
                                <div className="w-full lg:w-1/2">
                                    <img
                                        src="./src/assets/images/inclusion.jpg"
                                        alt="Coding Exercise"
                                        className="rounded-lg shadow-md"
                                        style={{
                                            height: 200,
                                            width: 350,
                                            margin: "0 auto",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Kết thúc Section 2 */}
                        {/* Section 3 */}
                        <div className="container mx-auto px-4 py-8">
                            <h2 className="text-2xl font-bold mb-4">
                                Nội dung khóa học
                            </h2>
                            <p className="text-gray-600 mb-6">
                                19 phần - 121 bài giảng - 8 giờ 42 phút tổng
                                thời lượng
                                <button
                                    className="text-blue-500 font-bold mb-4 ml-28 mt-4"
                                    style={{ paddingLeft: 0 }}
                                >
                                    Mở rộng tất cả các phần
                                </button>
                            </p>
                            <div className="bg-white rounded-lg overflow-hidden">
                                <div className="border-b">
                                    <Accordion
                                        type="single"
                                        collapsible
                                        className="w-full"
                                    >
                                        <AccordionItem value="item-1">
                                            <AccordionTrigger>
                                                Tìm hiểu về python
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                Yes. It adheres to the WAI-ARIA
                                                design pattern.
                                            </AccordionContent>
                                            <AccordionContent>
                                                <Link to="/"> Hoàng bede</Link>
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="item-2">
                                            <AccordionTrigger>
                                                Is it styled?
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                Yes. It comes with default
                                                styles that matches the other
                                                components&apos; aesthetic.
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="item-3">
                                            <AccordionTrigger>
                                                Is it animated?
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                Yes. Its animated by default,
                                                but you can disable it if you
                                                prefer.
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </div>
                            </div>
                            {/* Yêu cầu */}
                            <h2 className="text-2xl font-bold mt-8 mb-4">
                                Yêu cầu
                            </h2>
                            <ul className="list-disc pl-8">
                                <li>
                                    Có kiến thức cơ bản về kiến trúc máy tính
                                </li>
                                <li>
                                    Có máy tính nối mạng Internet để thực hành
                                    các bài tập
                                </li>
                            </ul>
                            {/* Mô tả */}
                            <div className="section-3-content collapsed mt-4">
                                <h2 className="text-2xl font-bold mb-4">
                                    Mô tả
                                </h2>
                                <p
                                    className="text-black-600 mb-6"
                                    style={{ marginBottom: 10 }}
                                >
                                    Hello bạn,
                                </p>
                                <p className="text-black-600 mb-6">
                                    Khóa học{" "}
                                    <strong>
                                        Lập trình Python từ cơ bản đến nâng cao
                                        thông qua các dự án
                                    </strong>{" "}
                                    được thiết kế để giúp bạn từ bước đầu làm
                                    quen đến thành thạo trong việc sử dụng
                                    Python - một trong những ngôn ngữ lập trình
                                    phổ biến và mạnh mẽ nhất hiện nay. Khóa học
                                    này cung cấp một lộ trình học tập rõ ràng và
                                    thực tế, hướng dẫn bạn qua từng bước cụ thể
                                    từ việc cài đặt môi trường phát triển, khai
                                    báo biến, làm việc với chuỗi ký tự, đến việc
                                    xây dựng các dự án phức tạp hơn.
                                </p>
                                <p className="text-black-600 mb-6">
                                    <strong>Mục tiêu của khóa học:</strong>
                                </p>
                                <ul className="list-disc pl-8 mb-6">
                                    <li>
                                        <strong>
                                            Hiểu biết căn bản về Python:
                                        </strong>{" "}
                                        Bạn sẽ bắt đầu bằng việc tìm hiểu về
                                        ngôn ngữ lập trình Python, cách cài đặt
                                        và tùy chỉnh môi trường phát triển
                                        PyCharm, và viết các chương trình Python
                                        đầu tiên của mình.
                                    </li>
                                    <li>
                                        <strong>
                                            Thành thạo các khái niệm lập trình
                                            cơ bản:
                                        </strong>{" "}
                                        Khóa học sẽ hướng dẫn bạn về khai báo
                                        biến, các kiểu dữ liệu, và cách chuyển
                                        đổi chúng, cũng như cách sử dụng các
                                        phép toán và cấu trúc điều khiển trong
                                        Python.
                                    </li>
                                    <li>
                                        <strong>
                                            Làm việc với các cấu trúc dữ liệu:
                                        </strong>{" "}
                                        Bạn sẽ học cách làm việc với các cấu
                                        trúc dữ liệu quan trọng như chuỗi ký tự,
                                        danh sách (List), bộ (Tuple), từ điển
                                        (Dictionary), và tập hợp (Set).
                                    </li>
                                </ul>
                                <p className="text-black-600 mb-6">
                                    <strong>Lợi ích của khóa học:</strong>
                                </p>
                                <ul className="list-disc pl-8 mb-6">
                                    <li>
                                        Kiến thức toàn diện: Từ những khái niệm
                                        cơ bản đến các ứng dụng nâng cao, khóa
                                        học bao quát mọi khía cạnh cần thiết để
                                        bạn trở thành một lập trình viên Python
                                        tự tin.
                                    </li>
                                    <li>
                                        Thực hành liên tục: Các bài tập thực
                                        hành và dự án cụ thể sẽ giúp bạn áp dụng
                                        ngay những gì đã học vào thực tế.
                                    </li>
                                </ul>
                                <p className="text-gray-600 mb-6">
                                    Dù bạn là người mới bắt đầu hay đã có kinh
                                    nghiệm lập trình và muốn mở rộng kiến thức,
                                    khóa học này sẽ trang bị cho bạn những kỹ
                                    năng và hiểu biết cần thiết để tiến xa hơn
                                    trong sự nghiệp lập trình Python. Hãy tham
                                    gia cùng chúng tôi và khám phá tiềm năng của
                                    Python ngay hôm nay!
                                </p>
                                {/* Đối tượng khóa học */}
                                <h2 className="text-2xl font-bold mb-4">
                                    Đối tượng khóa học
                                </h2>
                                <ul className="list-disc pl-8">
                                    <li>
                                        Các bạn sinh viên muốn học lập trình
                                        Python để phát triển các dự án về Web,
                                        IoT, phân tích dữ liệu, AI
                                    </li>
                                </ul>
                            </div>
                            <button
                                id="toggle-btn-section-3"
                                className="mt-4 text-blue-600 hover:underline focus:outline-none"
                            >
                                Hiện thêm ^
                            </button>
                        </div>
                        {/* Kết thúc Section 3 */}
                        {/* Section 4 */}
                        <div className="bg-white-50 py-8 sm:py-12">
                            <div className="container mx-auto px-4">
                                <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
                                    Học viên cũng mua
                                </h2>
                                <div className="space-y-6">
                                    {/* Khóa học 1 */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center bg-white p-4 rounded-lg shadow-md transition duration-300 ease-in-out hover:shadow-lg">
                                        <img
                                            src="./src/assets/images/inclusion.jpg"
                                            alt="Khóa học 1"
                                            className="w-full sm:w-32 h-48 sm:h-32 object-cover rounded-lg mb-4 sm:mb-0 sm:mr-6"
                                        />
                                        <div className="flex-grow">
                                            <div className="sm:flex sm:justify-between">
                                                <div className="mb-4 sm:mb-0 sm:mr-6">
                                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                                        Machine Learning: Build
                                                        neural networks in 77
                                                        lines of code
                                                    </h3>
                                                    <p className="text-gray-600 text-sm">
                                                        Tổng số 1 giờ • Đã cập
                                                        nhật 1/2019
                                                    </p>
                                                </div>
                                                <div className="flex flex-col sm:items-end">
                                                    <div className="flex items-center mb-2">
                                                        <span className="text-yellow-500 font-bold">
                                                            4,7
                                                        </span>
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-5 w-5 text-yellow-500 ml-1"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                        <span className="text-gray-600 ml-2 flex items-center">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-5 w-5 mr-1"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                            >
                                                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                                            </svg>
                                                            1.865
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between sm:flex-col sm:items-end">
                                                        <div className="flex flex-col sm:items-end">
                                                            <p className="text-lg sm:text-xl font-bold text-black-600">
                                                                ₫ 229.000
                                                            </p>
                                                            <span className="line-through text-gray-400 text-sm">
                                                                ₫ 399.000
                                                            </span>
                                                        </div>
                                                        <button className="ml-4 sm:ml-0 sm:mt-2 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-300">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-6 w-6 text-gray-600"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Khóa học 2 (tương tự như Khóa học 1) */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center bg-white p-4 rounded-lg shadow-md transition duration-300 ease-in-out hover:shadow-lg">
                                        <img
                                            src="./src/assets/images/inclusion.jpg"
                                            alt="Khóa học 2"
                                            className="w-full sm:w-32 h-48 sm:h-32 object-cover rounded-lg mb-4 sm:mb-0 sm:mr-6"
                                        />
                                        <div className="flex-grow">
                                            <div className="sm:flex sm:justify-between">
                                                <div className="mb-4 sm:mb-0 sm:mr-6">
                                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                                        Advanced Machine
                                                        Learning: Deep Learning
                                                        Techniques
                                                    </h3>
                                                    <p className="text-gray-600 text-sm">
                                                        Tổng số 2 giờ • Đã cập
                                                        nhật 3/2024
                                                    </p>
                                                </div>
                                                <div className="flex flex-col sm:items-end">
                                                    <div className="flex items-center mb-2">
                                                        <span className="text-yellow-500 font-bold">
                                                            4,9
                                                        </span>
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-5 w-5 text-yellow-500 ml-1"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                        <span className="text-gray-600 ml-2 flex items-center">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-5 w-5 mr-1"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                            >
                                                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                                            </svg>
                                                            2.103
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between sm:flex-col sm:items-end">
                                                        <div className="flex flex-col sm:items-end">
                                                            <p className="text-lg sm:text-xl font-bold text-black-600">
                                                                ₫ 279.000
                                                            </p>
                                                            <span className="line-through text-gray-400 text-sm">
                                                                ₫ 459.000
                                                            </span>
                                                        </div>
                                                        <button className="ml-4 sm:ml-0 sm:mt-2 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-300">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-6 w-6 text-gray-600"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Thêm các khóa học khác tương tự nếu cần */}
                                </div>
                                {/* Nút Hiện thêm */}
                                <div className="text-center mt-6">
                                    <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100">
                                        Hiện thêm
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Kết thúc Section 4 */}
                        {/* Section 5 */}
                        <div className="container mx-auto px-4 py-8">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                                Giảng viên
                            </h2>
                            <div className="flex items-start bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                                {/* Hình ảnh giảng viên */}
                                <img
                                    src="./src/assets/images/inclusion.jpg"
                                    alt="Giảng viên"
                                    className="w-24 h-24 object-cover rounded-full border-4 border-blue-500 mr-6"
                                />
                                <div>
                                    {/* Thông tin giảng viên */}
                                    <h3
                                        className="text-2xl font-semibold mb-2"
                                        style={{ color: "#5022c3" }}
                                    >
                                        Toan Bill
                                    </h3>
                                    <p className="text-gray-600 mb-4 text-lg">
                                        Cisco Instructor
                                    </p>
                                    <div className="flex items-center mb-4">
                                        <span className="text-yellow-500 text-2xl font-bold">
                                            4.5
                                        </span>
                                        <box-icon
                                            name="star"
                                            type="solid"
                                            color="#ECC94B"
                                            className="ml-1 text-2xl"
                                        />
                                        <span className="text-gray-600 ml-2 text-lg font-medium">
                                            Xếp hạng giảng viên
                                        </span>
                                    </div>
                                    <ul className="text-gray-600 mb-6 space-y-2">
                                        <li className="flex items-center">
                                            <box-icon
                                                name="star"
                                                type="solid"
                                                color="#718096"
                                                className="w-5 h-5 mr-2"
                                            />
                                            345 đánh giá
                                        </li>
                                        <li className="flex items-center">
                                            <box-icon
                                                name="user"
                                                color="#718096"
                                                className="w-5 h-5 mr-2"
                                            />
                                            1,895 học viên
                                        </li>
                                        <li className="flex items-center">
                                            <box-icon
                                                name="book"
                                                color="#718096"
                                                className="w-5 h-5 mr-2"
                                            />
                                            26 khóa học
                                        </li>
                                    </ul>
                                    {/* Mô tả giảng viên */}
                                    <p className="text-gray-700 leading-relaxed instructor-content collapsed">
                                        Hello there! I am Bill Toan. I have a
                                        masters degree in computer system
                                        information. I have been a Cisco
                                        instructor since 2010. I hold CCNA, CCNP
                                        Security, and Security+ certification.
                                        My favorite teaching courses are CCNA
                                        and CCNP Security. I come from a
                                        background of network security engineer,
                                        and now I am focusing on IoT and OT
                                        security and applied machine learning
                                        techniques on network security. I have
                                        worked for over 14+ years on building
                                        enterprise security solutions using
                                        Cisco products. I have been a
                                        super-moderator of a network security
                                        forum named Whitehat for more than 10
                                        years. I love sharing my experience with
                                        students and inspiring them to the cyber
                                        security world.
                                        <strong>Happy Learning!</strong>
                                    </p>
                                    <button
                                        id="toggle-btn-section-5"
                                        className="mt-4 text-blue-600 hover:underline focus:outline-none"
                                    >
                                        Hiện thêm ^
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Kết thúc Section 5 */}
                        {/* Section 6 */}
                        <div className="container mx-auto px-4 py-8">
                            <h2 className="text-xl font-bold mb-4">
                                4.6 xếp hạng khóa học • 44 xếp hạng
                            </h2>
                            <div className="bg-white p-6 rounded-lg ">
                                {/* Đánh giá từng người dùng */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Comment 1 */}
                                    <div className="flex flex-col bg-gray-100 p-4 rounded-lg shadow-sm border-t border-gray-800">
                                        <div className="flex items-center mb-2">
                                            <div className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center mr-3">
                                                NV
                                            </div>
                                            <div>
                                                <div className="font-semibold">
                                                    Nguyen Huu V.
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="text-yellow-500">
                                                        ★★★★★
                                                    </span>
                                                    <span className="text-gray-500 ml-2">
                                                        1 tháng trước
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-auto">⋮</div>
                                        </div>
                                        <p className="mb-2">
                                            so good and easy to understand
                                        </p>
                                        <div className="flex items-center text-gray-500">
                                            <span>Bạn thấy hữu ích?</span>
                                            <box-icon
                                                name="like"
                                                type="solid"
                                                color="#718096"
                                                className="ml-2 w-5 h-5"
                                            />
                                            <box-icon
                                                name="dislike"
                                                type="solid"
                                                color="#718096"
                                                className="ml-2 w-5 h-5"
                                            />
                                        </div>
                                    </div>
                                    {/* Comment 2 */}
                                    <div className="flex flex-col bg-gray-100 p-4 rounded-lg shadow-sm border-t border-gray-800">
                                        <div className="flex items-center mb-2">
                                            <div className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center mr-3">
                                                GN
                                            </div>
                                            <div>
                                                <div className="font-semibold">
                                                    Giang N.
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="text-yellow-500">
                                                        ★★★★☆
                                                    </span>
                                                    <span className="text-gray-500 ml-2">
                                                        1 tháng trước
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-auto">⋮</div>
                                        </div>
                                        <p className="mb-2">
                                            Cách giảng dạy đơn giản và dễ hiểu
                                        </p>
                                        <div className="flex items-center text-gray-500">
                                            <span>Bạn thấy hữu ích?</span>
                                            <box-icon
                                                name="like"
                                                type="solid"
                                                color="#718096"
                                                className="ml-2 w-5 h-5"
                                            />
                                            <box-icon
                                                name="dislike"
                                                type="solid"
                                                color="#718096"
                                                className="ml-2 w-5 h-5"
                                            />
                                        </div>
                                    </div>
                                    {/* Comment 3 */}
                                    <div className="flex flex-col bg-gray-100 p-4 rounded-lg shadow-sm border-t border-gray-800">
                                        <div className="flex items-center mb-2">
                                            <div className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center mr-3">
                                                L
                                            </div>
                                            <div>
                                                <div className="font-semibold">
                                                    Linh Nguyen Manh
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="text-yellow-500">
                                                        ★★★★★
                                                    </span>
                                                    <span className="text-gray-500 ml-2">
                                                        1 tháng trước
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-auto">⋮</div>
                                        </div>
                                        <p className="mb-2">good</p>
                                        <div className="flex items-center text-gray-500">
                                            <span>Bạn thấy hữu ích?</span>
                                            <box-icon
                                                name="like"
                                                type="solid"
                                                color="#718096"
                                                className="ml-2 w-5 h-5"
                                            />
                                            <box-icon
                                                name="dislike"
                                                type="solid"
                                                color="#718096"
                                                className="ml-2 w-5 h-5"
                                            />
                                        </div>
                                    </div>
                                    {/* Comment 4 */}
                                    <div className="flex flex-col bg-gray-100 p-4 rounded-lg shadow-sm border-t border-gray-800">
                                        <div className="flex items-center mb-2">
                                            <div className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center mr-3">
                                                DD
                                            </div>
                                            <div>
                                                <div className="font-semibold">
                                                    Dien D.
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="text-yellow-500">
                                                        ★★★★★
                                                    </span>
                                                    <span className="text-gray-500 ml-2">
                                                        2 tháng trước
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-auto">⋮</div>
                                        </div>
                                        <p className="mb-2">
                                            Tốt, hay, dễ hiểu, tuyệt vời
                                        </p>
                                        <div className="flex items-center text-gray-500">
                                            <span>Bạn thấy hữu ích?</span>
                                            <box-icon
                                                name="like"
                                                type="solid"
                                                color="#718096"
                                                className="ml-2 w-5 h-5"
                                            />
                                            <box-icon
                                                name="dislike"
                                                type="solid"
                                                color="#718096"
                                                className="ml-2 w-5 h-5"
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* Nút Hiện tất cả đánh giá */}
                                <div className="text-center mt-6">
                                    <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100">
                                        Hiện tất cả đánh giá
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Kết thúc Section 6 */}
                        {/* Section 7 */}
                        <div className="container mx-auto px-4 py-8">
                            <h2 className="text-2xl font-bold mb-6">
                                Các khóa học khác của{" "}
                                <span style={{ color: "#5022c3" }}>
                                    Toan Bill
                                </span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Course 1 */}
                                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <img
                                        src="../img/inclusion.jpg"
                                        alt="Cisco Network Security"
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        {/* Tên khóa học */}
                                        <h3 className="font-bold text-md mb-2">
                                            Cisco Network Security Packet Tracer
                                            Activities...
                                        </h3>
                                        {/* Tên giảng viên */}
                                        <p className="text-xs text-gray-600">
                                            Toan Bill
                                        </p>
                                        {/* Đánh giá */}
                                        <div className="flex items-center mb-2">
                                            <span className="text-yellow-500 font-bold mr-1 text-sm">
                                                4,7
                                            </span>
                                            <span className="text-yellow-500 text-sm">
                                                ★★★★☆
                                            </span>
                                            <span className="text-gray-600 text-xs ml-1">
                                                (31)
                                            </span>
                                        </div>
                                        {/* Thông tin khóa học */}
                                        <p className="text-xs text-gray-600 mb-2">
                                            Tổng số 7 giờ • 69 bài giảng • Trung
                                            cấp
                                        </p>
                                        {/* Giá */}
                                        <p className="font-bold text-lg">
                                            229.000 ₫
                                        </p>
                                        <p className="text-sm line-through text-gray-500">
                                            399.000 ₫
                                        </p>
                                    </div>
                                </div>
                                {/* Course 2 */}
                                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <img
                                        src="../img/inclusion.jpg"
                                        alt="Cisco Network Security"
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        {/* Tên khóa học */}
                                        <h3 className="font-bold text-md mb-2">
                                            Cisco Network Security Packet Tracer
                                            Activities...
                                        </h3>
                                        {/* Tên giảng viên */}
                                        <p className="text-xs text-gray-600">
                                            Toan Bill
                                        </p>
                                        {/* Đánh giá */}
                                        <div className="flex items-center mb-2">
                                            <span className="text-yellow-500 font-bold mr-1 text-sm">
                                                4,7
                                            </span>
                                            <span className="text-yellow-500 text-sm">
                                                ★★★★☆
                                            </span>
                                            <span className="text-gray-600 text-xs ml-1">
                                                (31)
                                            </span>
                                        </div>
                                        {/* Thông tin khóa học */}
                                        <p className="text-xs text-gray-600 mb-2">
                                            Tổng số 7 giờ • 69 bài giảng • Trung
                                            cấp
                                        </p>
                                        {/* Giá */}
                                        <p className="font-bold text-lg">
                                            229.000 ₫
                                        </p>
                                        <p className="text-sm line-through text-gray-500">
                                            399.000 ₫
                                        </p>
                                    </div>
                                </div>
                                {/* Course 3 */}
                                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <img
                                        src="../img/inclusion.jpg"
                                        alt="Cisco Network Security"
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        {/* Tên khóa học */}
                                        <h3 className="font-bold text-md mb-2">
                                            Cisco Network Security Packet Tracer
                                            Activities...
                                        </h3>
                                        {/* Tên giảng viên */}
                                        <p className="text-xs text-gray-600">
                                            Toan Bill
                                        </p>
                                        {/* Đánh giá */}
                                        <div className="flex items-center mb-2">
                                            <span className="text-yellow-500 font-bold mr-1 text-sm">
                                                4,7
                                            </span>
                                            <span className="text-yellow-500 text-sm">
                                                ★★★★☆
                                            </span>
                                            <span className="text-gray-600 text-xs ml-1">
                                                (31)
                                            </span>
                                        </div>
                                        {/* Thông tin khóa học */}
                                        <p className="text-xs text-gray-600 mb-2">
                                            Tổng số 7 giờ • 69 bài giảng • Trung
                                            cấp
                                        </p>
                                        {/* Giá */}
                                        <p className="font-bold text-lg">
                                            229.000 ₫
                                        </p>
                                        <p className="text-sm line-through text-gray-500">
                                            399.000 ₫
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8">
                                <button className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
                                    Báo cáo lạm dụng
                                </button>
                            </div>
                        </div>
                        {/* Kết thúc Section 7 */}
                    </div>
                    {/* Cột phải (thông tin mua hàng) */}
                    <div className="w-full lg:w-1/3 px-4 mt-8 lg:mt-0 sticky-container">
                        <div className="bg-white p-6 rounded-lg shadow-md sticky-element">
                            <div className="mb-4">
                                <img
                                    src={detail.img}
                                    alt="Preview khóa học"
                                    className="w-full rounded-lg"
                                    style={{ maxHeight: 150 }}
                                />
                            </div>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-3xl font-bold">
                                    đ{detail.price_discount}
                                </span>
                                <span className="text-lg text-gray-500 line-through">
                                    đ{detail.price}
                                </span>
                            </div>
                            <p className="text-red-500 mb-1">
                                Giảm {percentDiscount}%
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                                6 ngày còn lại với mức giá này!
                            </p>
                            <button className="w-full bg-yellow-400 text-white py-2 rounded-lg mb-2 hover:bg-yellow-500 transition duration-300">
                                Thêm vào giỏ hàng
                            </button>

                            <button className="w-full bg-white text-black border border-black py-2 rounded-lg mb-2 hover:bg-gray-100 transition duration-300">
                                Mua ngay
                            </button>
                            <p className="text-sm text-center text-gray-600">
                                Đảm bảo hoàn tiền trong 30 ngày
                            </p>
                            <div className="mt-2">
                                <h4 className="font-semibold mb-2">
                                    Khóa học này bao gồm:
                                </h4>
                                <ul className="text-sm space-y-2">
                                    <li className="flex items-center">
                                        <box-icon
                                            name="video"
                                            color="#10B981"
                                            class="w-4 h-4 mr-2"
                                            size="sm"
                                        ></box-icon>
                                        8,5 giờ video theo yêu cầu
                                    </li>
                                    <li className="flex items-center">
                                        <box-icon
                                            name="code"
                                            color="#10B981"
                                            class="w-4 h-4 mr-2"
                                            size="sm"
                                        ></box-icon>
                                        1 bài tập coding
                                    </li>
                                    <li className="flex items-center">
                                        <box-icon
                                            name="file"
                                            color="#10B981"
                                            class="w-4 h-4 mr-2"
                                            size="sm"
                                        ></box-icon>
                                        35 bài viết
                                    </li>
                                    <li className="flex items-center">
                                        <box-icon
                                            name="download"
                                            color="#10B981"
                                            class="w-4 h-4 mr-2"
                                            size="sm"
                                        ></box-icon>
                                        7 tài nguyên có thể tải xuống
                                    </li>
                                    <li className="flex items-center">
                                        <box-icon
                                            name="mobile"
                                            color="#10B981"
                                            class="w-4 h-4 mr-2"
                                            size="sm"
                                        ></box-icon>
                                        Truy cập trên thiết bị di động và TV
                                    </li>
                                    <li className="flex items-center">
                                        <box-icon
                                            name="accessibility"
                                            color="#10B981"
                                            class="w-4 h-4 mr-2"
                                            size="sm"
                                        ></box-icon>
                                        Quyền truy cập trọn đời
                                    </li>
                                    <li className="flex items-center">
                                        <box-icon
                                            name="medal"
                                            color="#10B981"
                                            class="w-4 h-4 mr-2"
                                            size="sm"
                                        ></box-icon>
                                        Chứng chỉ hoàn thành
                                    </li>
                                </ul>
                                <div className="mt-2">
                                    <h4 className="font-semibold mb-2">
                                        Áp dụng coupon:
                                    </h4>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            placeholder="Nhập mã coupon"
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                                        />
                                        <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-300">
                                            Áp dụng
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Kết thúc cột phải */}
                </div>
            </div>
            {/* Kết thúc nội dung chính */}
        </>
    );
};
