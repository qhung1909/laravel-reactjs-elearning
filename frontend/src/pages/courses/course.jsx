import { Link } from 'react-router-dom';
// import './src/assets/js/courses.js'
import './courses.css'
import { useState, useEffect } from 'react';
// import React from 'react';
import axios from 'axios';
const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;
console.log(API_KEY);

export const Courses = () => {
    const [courses, setCourses] = useState([]);

    const fetchCourses = async () => {
        try {
            const response = await axios.get(`${API_URL}/courses`, {
                headers: {
                    'x-api-secret': `${API_KEY}`
                }
            });
            setCourses(response.data);
        } catch (error) {
            console.error("Error fetching API:", error);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const render = courses.map((item,index)=> (
        <div key={index} >
            <Link to={`/detail/${item.slug}`} className="relative bg-white p-4 rounded-lg shadow flex group my-5">
                <img alt="React Ultimate" className="w-30 h-20 md:w-50 md:h-40 object-cover mr-4" src={`${item.img}`}/>
                <div className="flex-1">
                    <h3 className="text-md md:text-lg font-semibold text-gray-800">
                        <a className=" hover:underline" href="#">
                            {item.title}
                        </a>
                    </h3>
                    <p className="text-sm text-black">
                        {item.description}
                    </p>
                    <p className="text-xs text-gray-500">
                        Le Dan Dat
                    </p>
                    <p className="text-yellow-500 text-sm">
                        <strong className="text-black"> 4,7 </strong>{" "}★★★★☆ (297)
                    </p>
                    <p className="text-xs text-gray-500">
                        Tổng số giờ 10,5 giờ 92 bài giảng Sơ cấp
                    </p>
                    <p className="text-xs text-gray-500">
                        Lượt xem: {item.views}
                    </p>
                </div>
                <div className="ml-auto">
                    <p className="text-md md:text-lg font-bold text-black">
                        ₫ {item.price}
                    </p>
                    <p className="text-md md:text-lg text-gray-500 line-through">
                        ₫ {item.price_discount}
                    </p>
                </div>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-96 bg-white border border-gray-300 shadow-lg invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300 px-6 py-4">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-gray-900">
                            Những kiến thức bạn sẽ học
                        </h3>
                        <p>
                            <i className="bx bx-check"/> Biết cách lập trình cơ bản
                        </p>
                        <p>
                            <i className="bx bx-check"/> Có khái niệm về lập trình C++
                        </p>
                        <p>
                            <i className="bx bx-check" /> Biết cách sử dụng thư viện C++ để chuẩn bị cho khoá học hướng đối tượng
                        </p>
                        <button className="bg-purple-600 text-white text-center font-bold px-20 py-3 rounded">
                            Thêm vào giỏ hàng
                        </button>
                    </div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white"></div>
                </div>
            </Link>
        </div>
    ))


    return (

        <div>
            {/* Điều hướng */}
            <div className="fixed z-0 left-0 top-0 w-70 h-full bg-gray-800 text-white shadow-lg transform -translate-x-full transition-transform duration-300 ease-in-out lg:hidden"
                id="mySidebar">
                <button
                    className="w-full text-right p-4 text-2xl"
                    /* onclick="w3_close()" */>
                    <i className="bx bx-x" />
                </button>
                <ul className="p-4 space-y-2">
                    <li>
                        <a
                            className="block no-underline hover:text-yellow-400"
                            href="#">
                            Phát triển
                        </a>
                    </li>
                    <li>
                        <a
                            className="block no-underline hover:text-yellow-400"
                            href="#">
                            Phát triển web
                        </a>
                    </li>
                    <li>
                        <a
                            className="block no-underline hover:text-yellow-400"
                            href="#">
                            Khoa học dữ liệu
                        </a>
                    </li>
                    <li>
                        <a
                            className="block no-underline hover:text-yellow-400"
                            href="#">
                            Phát triển ứng dụng di động
                        </a>
                    </li>
                    <li>
                        <a
                            className="block no-underline hover:text-yellow-400"
                            href="#">
                            Ngôn ngữ lập trình
                        </a>
                    </li>
                    <li>
                        <a
                            className="block no-underline hover:text-yellow-400"
                            href="#">
                            Phát triển trò chơi
                        </a>
                    </li>
                    <li>
                        <a
                            className="block no-underline hover:text-yellow-400"
                            href="#">
                            Thiết kế & Phát triển cơ sở dữ liệu
                        </a>
                    </li>
                    <li>
                        <a
                            className="block no-underline hover:text-yellow-400"
                            href="#">
                            Kiểm tra phần mềm
                        </a>
                    </li>
                    <li>
                        <a
                            className="block no-underline hover:text-yellow-400"
                            href="#">
                            Kỹ thuật phần mềm
                        </a>
                    </li>
                </ul>
            </div>
            <div className="transition-margin duration-300" id="main">
                <div className="lg:hidden p-4 cursor-pointer" id="icon-sidebar">
                    <i
                        className="bx bx-menu text-3xl"
                        id="toggle-top-menu-icon"
                        // onclick="w3_open()"
                    />
                </div>
                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className="hidden lg:flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                    <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                        <li className="inline-flex items-center">
                            <a
                                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                                href="#">
                                <svg
                                    aria-hidden="true"
                                    className="w-3 h-3 me-2.5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                                </svg>
                                Phát triển
                            </a>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <i className="bx bx-chevron-right" />
                                <a
                                    className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                                    href="#">
                                    Phát triển ứng dụng di động
                                </a>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg
                                    aria-hidden="true"
                                    className="rtl:rotate-180  w-3 h-3 mx-1 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 6 10"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="m1 9 4-4-4-4"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"/>
                                </svg>
                                <a
                                    className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                                    href="#">
                                    Khoa học dữ liệu
                                </a>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg
                                    aria-hidden="true"
                                    className="rtl:rotate-180  w-3 h-3 mx-1 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 6 10"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="m1 9 4-4-4-4"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"/>
                                </svg>
                                <a
                                    className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                                    href="#">
                                    Ngôn ngữ lập trình
                                </a>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg
                                    aria-hidden="true"
                                    className="rtl:rotate-180  w-3 h-3 mx-1 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 6 10"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="m1 9 4-4-4-4"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"/>
                                </svg>
                                <a
                                    className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                                    href="#">
                                    Phát triển trò chơi
                                </a>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg
                                    aria-hidden="true"
                                    className="rtl:rotate-180  w-3 h-3 mx-1 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 6 10"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="m1 9 4-4-4-4"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"/>
                                </svg>
                                <a
                                    className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                                    href="#">
                                    Thiết kế & Phát triển cơ sở dữ liệu
                                </a>
                            </div>
                        </li>
                        <li aria-current="page">
                            <div className="flex items-center">
                                <svg
                                    aria-hidden="true"
                                    className="rtl:rotate-180  w-3 h-3 mx-1 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 6 10"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="m1 9 4-4-4-4"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"/>
                                </svg>
                                <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                                    Kiểm tra phần mềm
                                </span>
                            </div>
                        </li>
                    </ol>
                </nav>
            </div>
            <div className="max-w-custom mx-auto px-4 pt-5">
                <h1 className="text-2xl font-semibold mb-2">
                    Khóa học nổi bật
                </h1>
                <p className="text-gray-600 mb-4">
                    Nhiều học viên thích khóa học được đánh giá cao này vì nội
                    dung hấp dẫn của nó.
                </p>
                <div className="bg-white p-6 border mb-8">
                    <div className="flex flex-col lg:flex-row items-start">
                        <img
                            alt="Khóa học NextJS 14"
                            className="w-full lg:w-1/3 h-auto mb-4 lg:mb-0 lg:mr-6 object-cover"
                            src="../images/5712300_b951_5.jpg"/>
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                Khóa học NextJS 14-ReactJS-Typescript thực chiến
                                2024 PRO
                            </h3>
                            <p className="text-gray-700 mb-2">
                                Khóa học Nextjs 14, ReactJS, Typescript từ cơ
                                bản đến thực chiến cho người mới bắt đầu 2024
                                PRO - Lập trình thật dễ
                            </p>
                            <p className="text-gray-500 text-xs mb-1">
                                Bởi Shin Nguyen
                            </p>
                            <p className="font-thin text-xs text-green-600 mb-4">
                                Đã cập nhật{" "}
                                <span className="text-green-800 font-bold">
                                    tháng 8 năm 2024
                                </span>
                                <span className="text-gray-500 text-xs font-normal">
                                    Tổng số 126 giờ | 342 bài giảng | Tất cả
                                    trình độ
                                </span>
                            </p>
                            <p className="text-lg text-gray-800 font-semibold mb-2">
                                4,8
                                <span className="text-yellow-500">
                                    <i className="bx bxs-star" />
                                    <i className="bx bxs-star" />
                                    <i className="bx bxs-star" />
                                    <i className="bx bxs-star" />
                                    <i className="bx bxs-star-half" />
                                </span>
                                <span className="text-xs text-gray-600">
                                    (43)
                                </span>
                                <span className="bg-yellow-200 text-gray-700 text-sm px-2 py-1">
                                    Bán chạy nhất
                                </span>
                            </p>
                            <p className="pt-10 text-lg font-bold text-black">
                                ₫ 2.199.000
                            </p>
                        </div>
                    </div>
                </div>
                {/* Chủ đề phổ biến */}
                <h1 className="text-2xl font-semibold">Chủ đề phổ biến</h1>
                <section
                    aria-label="Carousel"
                    className="relative overflow-hidden max-w-full mx-auto py-8">
                    <div
                        className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5  gap-2 transition-transform duration-300 ease-in-out"
                        id="carousel">
                        <div className="font-bold p-auto border">
                            <a
                                className="text-gray-800 block text-center flex-wrap p-6"
                                href="">
                                Python
                            </a>
                        </div>
                        <div className="font-bold p-auto border">
                            <a
                                className="text-gray-800 block text-center flex-wrap p-6"
                                href="">
                                Khoa học dữ liệu
                            </a>
                        </div>
                        <div className="font-bold p-auto border">
                            <a
                                className="text-gray-800 block text-center flex-wrap p-6"
                                href="">
                                React JS
                            </a>
                        </div>
                        <div className="font-bold p-auto border">
                            <a
                                className="text-gray-800 block text-center flex-wrap p-6"
                                href="">
                                Java
                            </a>
                        </div>
                        <div className="font-bold p-auto border">
                            <a
                                className="text-gray-800 block text-center flex-wrap p-6"
                                href="">
                                C# (ngôn ngữ lập trình)
                            </a>
                        </div>
                        <div className="font-bold p-auto border">
                            <a
                                className="text-gray-800 block text-center flex-wrap p-6"
                                href="">
                                Phát triển web
                            </a>
                        </div>
                        <div className="font-bold p-auto border">
                            <a
                                className="text-gray-800 block text-center flex-wrap p-6"
                                href="">
                                JavaScript
                            </a>
                        </div>
                        <div className="font-bold p-auto border">
                            <a
                                className="text-gray-800 block text-center flex-wrap p-6"
                                href="">
                                Unreal Engine
                            </a>
                        </div>
                        <div className="font-bold p-auto border">
                            <a
                                className="text-gray-800 block text-center flex-wrap p-6"
                                href="">
                                Học máy
                            </a>
                        </div>
                        <div className="font-bold p-auto border">
                            <a
                                className="text-gray-800 block text-center flex-wrap p-6"
                                href="">
                                Unity
                            </a>
                        </div>
                        <div className="font-bold p-auto border">
                            <a
                                className="text-gray-800 block text-center flex-wrap p-6"
                                href="">
                                C# (ngôn ngữ lập trình)
                            </a>
                        </div>
                        <div className="font-bold p-auto border">
                            <a
                                className="text-gray-800 block text-center px-5 py-3 "
                                href="">
                                C++ (programming language)
                            </a>
                        </div>
                        <div className="font-bold p-auto border">
                            <a
                                className="text-gray-800 block text-center flex-wrap p-6"
                                href="">
                                Google Flutter
                            </a>
                        </div>
                        <div className="font-bold p-auto border">
                            <a
                                className="text-gray-800 block text-center flex-wrap p-6"
                                href="">
                                Trí tuệ nhân tạo (AI)
                            </a>
                        </div>
                        <div className="font-bold p-auto border">
                            <a
                                className="text-gray-800 block text-center flex-wrap p-6"
                                href="">
                                Học sâu
                            </a>
                        </div>
                        <div className="font-bold p-auto border">
                            <a
                                className="text-gray-800 block text-center flex-wrap p-6"
                                href="">
                                Unity
                            </a>
                        </div>
                        <div className="font-bold p-auto border">
                            <a
                                className="text-gray-800 block text-center flex-wrap p-6"
                                href="">
                                SQL
                            </a>
                        </div>
                        <div className="font-bold p-auto border">
                            <a
                                className="text-gray-800 block text-center flex-wrap p-6"
                                href="">
                                Angular
                            </a>
                        </div>
                        <div className="font-bold p-auto border">
                            <a
                                className="text-gray-800 block text-center flex-wrap p-6"
                                href="">
                                Docker
                            </a>
                        </div>
                        <div className="font-bold p-auto border">
                            <a
                                className="text-gray-800 block text-center flex-wrap p-6"
                                href="">
                                CSS
                            </a>
                        </div>
                        <div className="font-bold p-auto border">
                            <a
                                className="text-gray-800 block text-center flex-wrap p-6"
                                href="">
                                Docker
                            </a>
                        </div>
                        <div className="font-bold p-auto border">
                            <a
                                className="text-gray-800 block text-center flex-wrap p-6"
                                href="">
                                CSS
                            </a>
                        </div>
                    </div>
                    <button
                        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600"
                        id="prevButton">
                        <i className="bx bx-chevron-left" />
                    </button>
                    <button
                        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600"
                        id="nextButton">
                        <i className="bx bx-chevron-right" />
                    </button>
                </section>
                {/* Giảng viên */}
                <h1 className="text-2xl font-semibold ">
                    Giảng viên nổi tiếng
                </h1>
                <p className="text-gray-500">
                    Các chuyên gia trong ngành này được đánh giá cao bởi những
                    học viên như bạn.
                </p>
                <section
                    aria-label="Carousel"
                    className="relative overflow-hidden max-w-full mx-auto py-8">
                    <div
                        className="flex transition-transform duration-300 ease-in-out"
                        id="carouselWrapper">
                        <div
                            className="grid grid-cols-1 gap-4 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 carousel-slide flex gap-4 overflow-x-auto"
                            id="carouselSlide1">
                            <div className="bg-white border border-gray-400 p-5 pl-8 pr-2 flex items-start w-full">
                                <img
                                    alt="Example"
                                    className="w-16 h-16 object-cover rounded-full mr-4"
                                    src="../images/5712300_b951_5.jpg"/>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        Brandon ACBD
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Unreal Engine Blueprints
                                    </p>
                                    <p className="text-yellow-500 text-sm">
                                        <strong>4,8</strong> ★★★★☆ (297)
                                    </p>
                                    <p className="text-gray-700 text-sm">
                                        <strong>982</strong> học viên
                                    </p>
                                    <p className="text-gray-700 text-sm">
                                        <strong>6</strong> khóa học
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white border border-gray-400 p-5 pl-8 pr-2 flex items-start w-full">
                                <img
                                    alt="Example"
                                    className="w-16 h-16 object-cover rounded-full mr-4"
                                    src="../images/5712300_b951_5.jpg"/>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        Brandon ACBD
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Unreal Engine Blueprints
                                    </p>
                                    <p className="text-yellow-500 text-sm">
                                        <strong>4,8</strong> ★★★★☆ (297)
                                    </p>
                                    <p className="text-gray-700 text-sm">
                                        <strong>982</strong> học viên
                                    </p>
                                    <p className="text-gray-700 text-sm">
                                        <strong>6</strong> khóa học
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white border border-gray-400 p-5 pl-8 pr-2 flex items-start w-full">
                                <img
                                    alt="Example"
                                    className="w-16 h-16 object-cover rounded-full mr-4"
                                    src="../images/5712300_b951_5.jpg"/>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        Brandon ACBD
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Unreal Engine Blueprints
                                    </p>
                                    <p className="text-yellow-500 text-sm">
                                        <strong>4,8</strong> ★★★★☆ (297)
                                    </p>
                                    <p className="text-gray-700 text-sm">
                                        <strong>982</strong> học viên
                                    </p>
                                    <p className="text-gray-700 text-sm">
                                        <strong>6</strong> khóa học
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white border border-gray-400 p-5 pl-8 pr-2 flex items-start w-full">
                                <img
                                    alt="Example"
                                    className="w-16 h-16 object-cover rounded-full mr-4"
                                    src="../images/5712300_b951_5.jpg"/>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        Brandon ACBD
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Unreal Engine Blueprints
                                    </p>
                                    <p className="text-yellow-500 text-sm">
                                        <strong>4,8</strong> ★★★★☆ (297)
                                    </p>
                                    <p className="text-gray-700 text-sm">
                                        <strong>982</strong> học viên
                                    </p>
                                    <p className="text-gray-700 text-sm">
                                        <strong>6</strong> khóa học
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div
                            className="grid grid-cols-1 gap-4 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 carousel-slide flex gap-4 overflow-x-auto hidden"
                            id="carouselSlide2">
                            <div className="bg-white border border-gray-400 p-5 pl-8 pr-2 flex items-start w-full">
                                <img
                                    alt="Example"
                                    className="w-16 h-16 object-cover rounded-full mr-4"
                                    src="../images/5712300_b951_5.jpg"/>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        Brandon BJSS
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Unreal Engine Blueprints
                                    </p>
                                    <p className="text-yellow-500 text-sm">
                                        <strong>4,8</strong> ★★★★☆ (297)
                                    </p>
                                    <p className="text-gray-700 text-sm">
                                        <strong>982</strong> học viên
                                    </p>
                                    <p className="text-gray-700 text-sm">
                                        <strong>6</strong> khóa học
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white border border-gray-400 p-5 pl-8 pr-2 flex items-start w-full">
                                <img
                                    alt="Example"
                                    className="w-16 h-16 object-cover rounded-full mr-4"
                                    src="../images/5712300_b951_5.jpg"/>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        Brandon BJSS
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Unreal Engine Blueprints
                                    </p>
                                    <p className="text-yellow-500 text-sm">
                                        <strong>4,8</strong> ★★★★☆ (297)
                                    </p>
                                    <p className="text-gray-700 text-sm">
                                        <strong>982</strong> học viên
                                    </p>
                                    <p className="text-gray-700 text-sm">
                                        <strong>6</strong> khóa học
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white border border-gray-400 p-5 pl-8 pr-2 flex items-start w-full">
                                <img
                                    alt="Example"
                                    className="w-16 h-16 object-cover rounded-full mr-4"
                                    src="../images/5712300_b951_5.jpg"/>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        Brandon BJSS
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Unreal Engine Blueprints
                                    </p>
                                    <p className="text-yellow-500 text-sm">
                                        <strong>4,8</strong> ★★★★☆ (297)
                                    </p>
                                    <p className="text-gray-700 text-sm">
                                        <strong>982</strong> học viên
                                    </p>
                                    <p className="text-gray-700 text-sm">
                                        <strong>6</strong> khóa học
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white border border-gray-400 p-5 pl-8 pr-2 flex items-start w-full">
                                <img
                                    alt="Example"
                                    className="w-16 h-16 object-cover rounded-full mr-4"
                                    src="../images/5712300_b951_5.jpg"/>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        Brandon BJSS
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Unreal Engine Blueprints
                                    </p>
                                    <p className="text-yellow-500 text-sm">
                                        <strong>4,8</strong> ★★★★☆ (297)
                                    </p>
                                    <p className="text-gray-700 text-sm">
                                        <strong>982</strong> học viên
                                    </p>
                                    <p className="text-gray-700 text-sm">
                                        <strong>6</strong> khóa học
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600"
                        id="prevSlideButton">
                        <i className="bx bx-chevron-left" />
                    </button>
                    <button
                        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600"
                        id="nextSlideButton">
                        <i className="bx bx-chevron-right" />
                    </button>
                </section>
                {/* Tất cả các khóa học Phát triển web */}
                <div className="">
                    <div className="mb-4">
                        <h1 className="text-2xl font-bold">
                            Tất cả các khóa học Phát triển web
                        </h1>
                        <p className="text-gray-500 mt-2">
                            <i className="bx bx-error-alt" /> Bạn không biết
                            chắc? Tất cả các khóa học đều được đảm bảo hoàn tiền
                            trong 30 ngày
                        </p>
                    </div>
                    <div className="flex">
                        <button
                            className="flex items-center bg-white text-gray-800 border-2 px-4 py-2 rounded mr-3"
                            id="openButton">
                            <i className="bx bx-slider" /> Bộ lọc
                        </button>
                        <div className="relative inline-block text-left mr-3">
                            <select className="block w-full bg-white border border-gray-300 rounded-lg py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option defaultValue={0}>Sắp xếp theo</option>
                                <option value="1">Phổ biến nhất</option>
                                <option value="2">Thứ hạn cao nhất</option>
                                <option value="3">Mới nhất</option>
                            </select>
                        </div>
                        <div className="ml-auto">
                            <p className=" text-gray-500  font-bold">
                                10.000 kết quả
                            </p>
                        </div>
                    </div>
                    <hr />
                    <div className="grid grid-cols-12 gap-10 pt-3 ">
                        {/* Bộ lọc */}
                        <div className="col-span-3 transition-all ease-in-out duration-500 "  id="filterContent">
                            <div className="flex items-center my-3">
                                <h2 className="font-bold text-xl flex-1">
                                    Xếp hạng
                                </h2>
                                <span className="text-gray-500 hover:underline focus:outline-none cursor-pointer" id="toggle-btn">
                                    <i className="bx bx-chevron-up" />
                                </span>
                            </div>
                            <div className="lesson-content collapsed">
                                <div className="flex items-center mb-2 ">
                                    <input className="mr-2" name="rating" type="radio"/>
                                    <span className="text-yellow-500 ">
                                        <i className="bx bxs-star " />
                                        <i className="bx bxs-star" />
                                        <i className="bx bxs-star" />
                                        <i className="bx bxs-star" />
                                        <i className="bx bxs-star-half" />
                                    </span>
                                    <span className="text-sm text-gray-800">
                                        {" "}
                                        Từ 4.5 trở lên
                                        <span className="text-gray-600">
                                            (10.000)
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center mb-2">
                                    <input
                                        className="mr-2"
                                        name="rating"
                                        type="radio"/>
                                    <span className="text-yellow-500 ">
                                        <i className="bx bxs-star " />
                                        <i className="bx bxs-star" />
                                        <i className="bx bxs-star" />
                                        <i className="bx bxs-star" />
                                        <i className="bx bx-star" />
                                    </span>
                                    <span className="text-sm text-gray-800">
                                        {" "}
                                        Từ 4.0 trở lên
                                        <span className="text-gray-600">
                                            (10.000)
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center mb-2">
                                    <input
                                        className="mr-2"
                                        name="rating"
                                        type="radio"/>
                                    <span className="text-yellow-500">
                                        <i className="bx bxs-star " />
                                        <i className="bx bxs-star" />
                                        <i className="bx bxs-star" />
                                        <i className="bx bxs-star-half" />
                                        <i className="bx bx-star" />
                                    </span>
                                    <span className="text-sm text-gray-800">
                                        {" "}
                                        Từ 3.5 trở lên
                                        <span className="text-gray-600">
                                            (10.000)
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center mb-2">
                                    <input
                                        className="mr-2"
                                        name="rating"
                                        type="radio"/>
                                    <span className="text-yellow-500">
                                        <i className="bx bxs-star " />
                                        <i className="bx bxs-star" />
                                        <i className="bx bxs-star" />
                                        <i className="bx bx-star" />
                                        <i className="bx bx-star" />
                                    </span>
                                    <span className="text-sm text-gray-800">
                                        {" "}
                                        Từ 3.0 trở lên
                                        <span className="text-gray-600">
                                            (10.000)
                                        </span>
                                    </span>
                                </div>
                            </div>
                            <hr />
                            <div className="flex items-center my-3">
                                <h2 className="font-bold text-xl flex-1">
                                    Thời lượng video
                                </h2>
                                <span
                                    className="text-gray-500 hover:underline focus:outline-none cursor-pointer"
                                    id="toggle-btn-tlv">
                                    <i className="bx bx-chevron-up" />
                                </span>
                            </div>
                            <div className="lesson-content-tlv collapsed">
                                <div className="flex items-center mb-2">
                                    <input
                                        className="mr-2 text-black"
                                        name="duration"
                                        type="checkbox"/>
                                    <span className="text-sm text-black">
                                        0-1 giờ{" "}
                                        <span className="text-gray-600">
                                            (3.217)
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center mb-2">
                                    <input
                                        className="mr-2 text-black"
                                        name="duration"
                                        type="checkbox"/>
                                    <span className="text-sm text-black">
                                        1-3 giờ{" "}
                                        <span className="text-gray-600">
                                            (10.000)
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center mb-2">
                                    <input
                                        className="mr-2 text-black"
                                        name="duration"
                                        type="checkbox"/>
                                    <span className="text-sm text-black">
                                        3-6 giờ{" "}
                                        <span className="text-gray-600">
                                            (8.691)
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center mb-2">
                                    <input
                                        className="mr-2 text-black"
                                        name="duration"
                                        type="checkbox"/>
                                    <span className="text-sm text-black">
                                        6-17 giờ{" "}
                                        <span className="text-gray-600">
                                            (10.000)
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center mb-2">
                                    <input
                                        className="mr-2 text-black"
                                        name="duration"
                                        type="checkbox"/>
                                    <span className="text-sm text-black">
                                        Hơn 17 giờ{" "}
                                        <span className="text-gray-600">
                                            (4.518)
                                        </span>
                                    </span>
                                </div>
                            </div>
                            <hr />
                            <div className="flex items-center my-3">
                                <h2 className="font-bold text-xl flex-1">
                                    Chủ đề
                                </h2>
                                <span
                                    className="text-gray-500 hover:underline focus:outline-none cursor-pointer"
                                    id="toggle-btn-cd" >
                                    <i className="bx bx-chevron-up" />
                                </span>
                            </div>
                            <div className="lesson-content-cd collapsed">
                                <div className="flex items-center mb-2">
                                    <input
                                        className="mr-2"
                                        name="duration"
                                        type="checkbox"/>
                                    <span className="text-sm text-black">
                                        Python{" "}
                                        <span className="text-gray-600">
                                            (2.433)
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center mb-2">
                                    <input
                                        className="mr-2"
                                        name="duration"
                                        type="checkbox"/>
                                    <span className="text-sm text-black">
                                        JavaScript{" "}
                                        <span className="text-gray-600">
                                            (1.105)
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center mb-2">
                                    <input
                                        className="mr-2"
                                        name="duration"
                                        type="checkbox"/>
                                    <span className="text-sm text-black">
                                        Java{" "}
                                        <span className="text-gray-600">
                                            (1.088)
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center mb-2">
                                    <input
                                        className="mr-2"
                                        name="duration"
                                        type="checkbox"/>
                                    <span className="text-sm text-black">
                                        Unity{" "}
                                        <span className="text-gray-600">
                                            (960)
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center mb-2">
                                    <input
                                        className="mr-2"
                                        name="duration"
                                        type="checkbox"/>
                                    <span className="text-sm text-black">
                                        Phát triển web{" "}
                                        <span className="text-gray-600">
                                            (933)
                                        </span>
                                    </span>
                                </div>
                            </div>
                            <hr />
                            <div className="flex items-center my-3">
                                <h2 className="font-bold text-xl flex-1">
                                    Thể loại con
                                </h2>
                                <span
                                    className="text-gray-500 hover:underline focus:outline-none cursor-pointer"
                                    id="toggle-btn-tlc"            >
                                    <i className="bx bx-chevron-up" />
                                </span>
                            </div>
                            <div className="lesson-content-tlc collapsed">
                                <div className="flex items-center mb-2">
                                    <input
                                        className="mr-2"
                                        name="duration"
                                        type="checkbox"/>
                                    <span className="text-sm text-black">
                                        Phát triển web{" "}
                                        <span className="text-gray-600">
                                            (2.433)
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center mb-2">
                                    <input
                                        className="mr-2"
                                        name="duration"
                                        type="checkbox"/>
                                    <span className="text-sm text-black">
                                        Ngôn ngữ lập trình{" "}
                                        <span className="text-gray-600">
                                            (1.105)
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center mb-2">
                                    <input
                                        className="mr-2"
                                        name="duration"
                                        type="checkbox"/>
                                    <span className="text-sm text-black">
                                        Khoa học dữ liệu{" "}
                                        <span className="text-gray-600">
                                            (1.088)
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center mb-2">
                                    <input
                                        className="mr-2"
                                        name="duration"
                                        type="checkbox"/>
                                    <span className="text-sm text-black">
                                        Phát triển ứng dụng di động{" "}
                                        <span className="text-gray-600">
                                            (960)
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center mb-2">
                                    <input
                                        className="mr-2"
                                        name="duration"
                                        type="checkbox"/>
                                    <span className="text-sm text-black">
                                        Thiết kế cơ sở dữ liệu{" "}
                                        <span className="text-gray-600">
                                            (960)
                                        </span>
                                    </span>
                                </div>
                            </div>
                            <hr />
                            <div className="flex items-center my-3">
                                <h2 className="font-bold text-xl flex-1">
                                    Cấp độ
                                </h2>
                                <span
                                    className="text-gray-500 hover:underline focus:outline-none cursor-pointer"
                                    id="toggle-btn-capdo"       >
                                    <i className="bx bx-chevron-up" />
                                </span>
                            </div>
                            <div className="lesson-content-capdo collapsed">
                                <div className="flex items-center mb-2">
                                    <input
                                        className="mr-2"
                                        name="duration"
                                        type="checkbox"/>
                                    <span className="text-sm text-black">
                                        Tất cả trình độ{" "}
                                        <span className="text-gray-600">
                                            (10.000)
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center mb-2">
                                    <input
                                        className="mr-2"
                                        name="duration"
                                        type="checkbox"/>
                                    <span className="text-sm text-black">
                                        Sơ cấp{" "}
                                        <span className="text-gray-600">
                                            (10.000)
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center mb-2">
                                    <input
                                        className="mr-2"
                                        name="duration"
                                        type="checkbox"/>
                                    <span className="text-sm text-black">
                                        Trung cấp{" "}
                                        <span className="text-gray-600">
                                            (5.665)
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center mb-2">
                                    <input
                                        className="mr-2"
                                        name="duration"
                                        type="checkbox"/>
                                    <span className="text-sm text-black">
                                        Chuyên gia{" "}
                                        <span className="text-gray-600">
                                            (621)
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center mb-2">
                                    <input
                                        className="mr-2"
                                        name="duration"
                                        type="checkbox"/>
                                    <span className="text-sm text-black">
                                        Phát triển web{" "}
                                        <span className="text-gray-600">
                                            (933)
                                        </span>
                                    </span>
                                </div>
                            </div>
                            <hr />
                            <div className="flex items-center my-3">
                                <h2 className="font-bold text-xl flex-1">
                                    Ngôn ngữ
                                </h2>
                                <span
                                    className="text-gray-500 hover:underline focus:outline-none cursor-pointer"
                                    id="toggle-btn-nn"       >
                                    <i className="bx bx-chevron-up" />
                                </span>
                            </div>
                            <div className="lesson-content-nn collapsed">
                                <div className="flex items-center mb-2">
                                    <input
                                        className="mr-2"
                                        name="duration"
                                        type="checkbox"/>
                                    <span className="text-sm text-black">
                                        English{" "}
                                        <span className="text-gray-600">
                                            (1)
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center mb-2">
                                    <input
                                        className="mr-2"
                                        name="duration"
                                        type="checkbox"/>
                                    <span className="text-sm text-black">
                                        中国人{" "}
                                        <span className="text-gray-600">
                                            (1)
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center mb-2">
                                    <input
                                        className="mr-2"
                                        name="duration"
                                        type="checkbox"/>
                                    <span className="text-sm text-black">
                                        日本語
                                        <span className="text-gray-600">
                                            (1)
                                        </span>
                                    </span>
                                </div>
                            </div>
                            <hr />
                            <div className="flex items-center my-3">
                                <h2 className="font-bold text-xl flex-1">
                                    Giá
                                </h2>
                                <span
                                    className="text-gray-500 hover:underline focus:outline-none cursor-pointer"
                                    id="toggle-btn-gia"       >
                                    <i className="bx bx-chevron-up" />
                                </span>
                            </div>
                            <div className="lesson-content-gia collapsed">
                                <div className="flex items-center mb-2">
                                    <input
                                        className="mr-2"
                                        name="duration"
                                        type="checkbox"/>
                                    <span className="text-sm text-black">
                                        Có trả phí{" "}
                                        <span className="text-gray-600">
                                            (68)
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center mb-2">
                                    <input
                                        className="mr-2"
                                        name="duration"
                                        type="checkbox"/>
                                    <span className="text-sm text-black">
                                        Miễn phí{" "}
                                        <span className="text-gray-600">
                                            (23)
                                        </span>
                                    </span>
                                </div>
                            </div>
                            <hr />
                            <div className="flex items-center my-3">
                                <h2 className="font-bold text-xl flex-1">
                                    Đặc điểm
                                </h2>
                                <span
                                    className="text-gray-500 hover:underline focus:outline-none cursor-pointer"
                                    id="toggle-btn-dacdiem"       >
                                    <i className="bx bx-chevron-up" />
                                </span>
                            </div>
                            <div className="lesson-content-dacdiem collapsed">
                                <div className="flex items-center mb-2">
                                    <input
                                        className="mr-2"
                                        name="duration"
                                        type="checkbox"/>
                                    <span className="text-sm text-black">
                                        Phụ đề{" "}
                                        <span className="text-gray-600">
                                            (1)
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center mb-2">
                                    <input
                                        className="mr-2"
                                        name="duration"
                                        type="checkbox"/>
                                    <span className="text-sm text-black">
                                        Trắc nghiệm{" "}
                                        <span className="text-gray-600">
                                            (16)
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center mb-2">
                                    <input
                                        className="mr-2"
                                        name="duration"
                                        type="checkbox"/>
                                    <span className="text-sm text-black">
                                        Bài tập Coding{" "}
                                        <span className="text-gray-600">
                                            (8)
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center mb-2">
                                    <input
                                        className="mr-2"
                                        name="duration"
                                        type="checkbox"/>
                                    <span className="text-sm text-black">
                                        Bài kiểm tra thực hành{" "}
                                        <span className="text-gray-600">
                                            (4)
                                        </span>
                                    </span>
                                </div>
                            </div>
                            <hr />
                            <div className="flex items-center my-3">
                                <h2 className="font-bold text-xl flex-1">
                                    Phụ đề
                                </h2>
                                <span
                                    className="text-gray-500 hover:underline focus:outline-none cursor-pointer"
                                    id="toggle-btn-phude"       >
                                    <i className="bx bx-chevron-up" />
                                </span>
                            </div>
                            <div className="lesson-content-phude collapsed">
                                <div className="flex items-center mb-2">
                                    <input
                                        className="mr-2"
                                        name="duration"
                                        type="checkbox"/>
                                    <span className="text-sm text-black">
                                        Tiếng Việt{" "}
                                        <span className="text-gray-600">
                                            (1)
                                        </span>
                                    </span>
                                </div>
                            </div>
                            <hr />
                        </div>
                        {/*Danh sách khóa học */}
                        <div className=" col-span-9 transition-all ease-in-out duration-500"
                            id="courseCol">
                                {render}
                            {/* <div className="relative bg-white p-4 rounded-lg shadow flex group my-5">
                                <img
                                    alt="React Ultimate"
                                    className="w-30 h-20 md:w-50 md:h-40 object-cover mr-4"
                                    src="../images/5712300_b951_5.jpg"/>
                                <div className="flex-1">
                                    <h3 className="text-md md:text-lg font-semibold text-gray-800">
                                        <a
                                            className=" hover:underline"
                                            href="#">
                                            C++ Cơ bản dành cho người mới học
                                            lập trình
                                        </a>
                                    </h3>
                                    <p className="text-sm text-black">
                                        Bắt đầu học lập trình bằng ngôn ngữ C++
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Le Dan Dat
                                    </p>
                                    <p className="text-yellow-500 text-sm">
                                        <strong className="text-black">
                                            4,7
                                        </strong>{" "}★★★★☆ (297)
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Tổng số giờ 10,5 giờ 92 bài giảng Sơ cấp
                                    </p>
                                </div>
                                <div className="ml-auto">
                                    <p className="text-md md:text-lg font-bold text-black">
                                        ₫ 199.000
                                    </p>
                                    <p className="text-md md:text-lg text-gray-500 line-through">
                                        ₫ 1.099.000
                                    </p>
                                </div>
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-96 bg-white border border-gray-300 shadow-lg invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300 px-6 py-4">
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-gray-900">
                                            Những kiến thức bạn sẽ học
                                        </h3>
                                        <p>
                                            <i className="bx bx-check" /> Biết
                                            cách lập trình cơ bản
                                        </p>
                                        <p>
                                            <i className="bx bx-check" /> Có
                                            khái niệm về lập trình C++
                                        </p>
                                        <p>
                                            <i className="bx bx-check" /> Biết
                                            cách sử dụng thư viện C++ để chuẩn
                                            bị cho khoá học hướng đối tượng
                                        </p>
                                        <button className="bg-purple-600 text-white text-center font-bold px-20 py-3 rounded">
                                            Thêm vào giỏ hàng
                                        </button>
                                    </div>
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white"></div>
                                </div>
                            </div>
                            <div className="relative bg-white p-4 rounded-lg shadow flex group my-5">
                                <img
                                    alt="React Ultimate"
                                    className="w-30 h-20 md:w-50 md:h-40 object-cover mr-4"
                                    src="../images/5712300_b951_5.jpg"/>
                                <div className="flex-1">
                                    <h3 className="text-md md:text-lg font-semibold text-gray-800">
                                        <a
                                            className=" hover:underline"
                                            href="#">
                                            C++ Cơ bản dành cho người mới học
                                            lập trình
                                        </a>
                                    </h3>
                                    <p className="text-sm text-black">
                                        Bắt đầu học lập trình bằng ngôn ngữ C++
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Le Dan Dat
                                    </p>
                                    <p className="text-yellow-500 text-sm">
                                        <strong className="text-black">
                                            4,7
                                        </strong>{" "}
                                        ★★★★☆ (297)
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Tổng số giờ 10,5 giờ 92 bài giảng Sơ cấp
                                    </p>
                                </div>
                                <div className="ml-auto">
                                    <p className="text-md md:text-lg font-bold text-black">
                                        ₫ 199.000
                                    </p>
                                    <p className="text-md md:text-lg text-gray-500 line-through">
                                        ₫ 1.099.000
                                    </p>
                                </div>
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-96 bg-white border border-gray-300 shadow-lg invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300 px-6 py-4">
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-gray-900">
                                            Những kiến thức bạn sẽ học
                                        </h3>
                                        <p>
                                            <i className="bx bx-check" /> Biết
                                            cách lập trình cơ bản
                                        </p>
                                        <p>
                                            <i className="bx bx-check" /> Có
                                            khái niệm về lập trình C++
                                        </p>
                                        <p>
                                            <i className="bx bx-check" /> Biết
                                            cách sử dụng thư viện C++ để chuẩn
                                            bị cho khoá học hướng đối tượng
                                        </p>
                                        <button className="bg-purple-600 text-white text-center font-bold px-20 py-3 rounded">
                                            Thêm vào giỏ hàng
                                        </button>
                                    </div>
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white"></div>
                                </div>
                            </div>
                            <div className="relative bg-white p-4 rounded-lg shadow flex group my-5">
                                <img
                                    alt="React Ultimate"
                                    className="w-30 h-20 md:w-50 md:h-40 object-cover mr-4"
                                    src="../images/5712300_b951_5.jpg"/>
                                <div className="flex-1">
                                    <h3 className="text-md md:text-lg font-semibold text-gray-800">
                                        <a
                                            className=" hover:underline"
                                            href="#">
                                            C++ Cơ bản dành cho người mới học
                                            lập trình
                                        </a>
                                    </h3>
                                    <p className="text-sm text-black">
                                        Bắt đầu học lập trình bằng ngôn ngữ C++
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Le Dan Dat
                                    </p>
                                    <p className="text-yellow-500 text-sm">
                                        <strong className="text-black">
                                            4,7
                                        </strong>{" "}
                                        ★★★★☆ (297)
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Tổng số giờ 10,5 giờ 92 bài giảng Sơ cấp
                                    </p>
                                </div>
                                <div className="ml-auto">
                                    <p className="text-md md:text-lg font-bold text-black">
                                        ₫ 199.000
                                    </p>
                                    <p className="text-md md:text-lg text-gray-500 line-through">
                                        ₫ 1.099.000
                                    </p>
                                </div>
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-96 bg-white border border-gray-300 shadow-lg invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300 px-6 py-4">
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-gray-900">
                                            Những kiến thức bạn sẽ học
                                        </h3>
                                        <p>
                                            <i className="bx bx-check" /> Biết
                                            cách lập trình cơ bản
                                        </p>
                                        <p>
                                            <i className="bx bx-check" /> Có
                                            khái niệm về lập trình C++
                                        </p>
                                        <p>
                                            <i className="bx bx-check" /> Biết
                                            cách sử dụng thư viện C++ để chuẩn
                                            bị cho khoá học hướng đối tượng
                                        </p>
                                        <button className="bg-purple-600 text-white text-center font-bold px-20 py-3 rounded">
                                            Thêm vào giỏ hàng
                                        </button>
                                    </div>
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white"></div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

