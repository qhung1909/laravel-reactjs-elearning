import './courses.css'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
} from "@/components/ui/pagination"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { formatCurrency } from "@/components/Formatcurrency/formatCurrency";
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { CoursesContext } from "../context/coursescontext";
import axios from 'axios';
import { Skeleton } from "@/components/ui/skeleton";
import { CategoriesContext } from '../context/categoriescontext';


export const Courses = () => {
    const {
        fetchSearchResults
    } = useContext(CoursesContext);
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search');
    const { courses, setCourses } = useContext(CoursesContext);
    const [coursesPerPage] = useState(4);
    const [loading,setLoading] = useState(false)
    const location = useLocation();
    const navigate = useNavigate();
    const { categories } = useContext(CategoriesContext);
    const [ hotInstructor, setHotInstructor ] = useState([]);
    const API_URL = import.meta.env.VITE_API_URL;
    const API_KEY = import.meta.env.VITE_API_KEY;



    // phân trang
    const queryParams = new URLSearchParams(location.search);
    const currentPage = parseInt(queryParams.get("page")) || 1;
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

    // giảng viên hot
    const fetchHotInstructor = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/instructors/top`, {
                headers: {
                    'x-api-secret': `${API_KEY}`,
                },
            });
            const hotInstructor = response.data
            setHotInstructor(hotInstructor.slice(0,4));
        } catch (error) {
            console.log('Error fetching hot instructor', error)
        }finally {
            setLoading(false);
        }
    }

    const renderHotInstructor = loading ? (
        <>
            {Array.from({ length: 4 }).map((_, index) => (
                <div className="flex flex-col space-y-3" key={index}>
                    <Skeleton className="h-[125px] w-11/12 rounded-xl" />
                    <div className="flex flex-col space-y-2 items-center md:items-start">
                        <Skeleton className="h-4 w-8/12 md:w-11/12" />
                        <Skeleton className="h-4 w-5/12 md:w-9/12 " />
                    </div>
                </div>

            ))}
        </>
    ) :
        Array.isArray(hotInstructor) && hotInstructor.length > 0 ? (
            hotInstructor.map((item, index) => (
                <div key={index} className="bg-white border my-3 sm:my-0 border-gray-200 rounded-md p-5 pl-8 pr-2 flex items-center justify-start w-full">
                    <img
                        alt="Example"
                        className="w-16 h-16 object-cover rounded-full mr-4"
                        src={`${item.avatar}`} />
                    <div>
                        <h3 className="xl:text-lg md:text-base sm:text-sm text-lg font-semibold text-gray-800">
                            {item.name}
                        </h3>
                        <p className="text-yellow-500 text-sm">
                            <strong>4,8</strong> ★★★★☆ (297)
                        </p>
                        <p className="text-gray-700 text-sm">
                            <strong>Tổng khóa học đã bán:</strong> {item.max_is_buy}
                        </p>
                    </div>
                </div>
            ))
        ) : (
            <p>Không có giảng viên nào phù hợp ngay lúc này, thử lại</p>
        )


    const paginate = (pageNumber) => {
        navigate(`?page=${pageNumber}`);
    };

    const totalPages = Math.ceil(courses.length / coursesPerPage);

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 3;

        if (totalPages <= maxVisiblePages + 2) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(
                    <PaginationItem key={i} className={i === currentPage ? 'active' : ''}>
                        <PaginationLink onClick={() => paginate(i)} href="#">
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        } else {
            if (currentPage > 1) {
                pageNumbers.push(
                    <PaginationItem key={1} className={currentPage === 1 ? 'active' : ''}>
                        <PaginationLink onClick={() => paginate(1)} href="#">
                            1
                        </PaginationLink>
                    </PaginationItem>
                );
                if (currentPage > 3) {
                    pageNumbers.push(<PaginationItem key="left-dots"><PaginationEllipsis /></PaginationItem>);
                }
            }

            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(currentPage + 1, totalPages - 1);

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(
                    <PaginationItem key={i} className={i === currentPage ? 'active' : ''}>
                        <PaginationLink onClick={() => paginate(i)} href="#">
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }

            if (currentPage < totalPages - 2) {
                pageNumbers.push(<PaginationItem key="right-dots"><PaginationEllipsis /></PaginationItem>);
            }

            pageNumbers.push(
                <PaginationItem key={totalPages} className={currentPage === totalPages ? 'active' : ''}>
                    <PaginationLink onClick={() => paginate(totalPages)} href="#">
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return pageNumbers;
    };

    // danh mục / chủ đề phổ biến
    const renderCategories = (categoryGroup) => {
        return loading ? (
            <div className="flex flex-wrap justify-center items-center">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div className="bg-gray-100 h-10 w-20 rounded-lg animate-pulse mx-2" key={index}></div>
                ))}
            </div>
        ) : Array.isArray(categoryGroup) && categoryGroup.length > 0 ? (
            categoryGroup.map((item) => (
                <div className="lg:px-12 md:px-10 sm:px-5 px-3 cursor-pointer font-bold border rounded-md py-5 hover:bg-yellow-300 duration-300 hover:text-black " key={item}>
                    <a className="block text-center md:text-base sm:text-sm text-xs" href="">{item.name}</a>
                </div>
            ))
        ) : (
            <p>Không có danh mục phù hợp ngay lúc này, thử lại sau</p>
        );
    };

    // Khóa học nổi bật
    const render_course_hot = loading ? (
        // Skeleton cho khóa học nổi bật
        Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="my-5">
                <Link className="relative bg-white p-4 rounded-lg shadow-md flex flex-col lg:flex-row group">
                    <Skeleton className="w-full custom-img-height md:h-82 lg:h-60 lg:w-96 object-cover mb-4 lg:mb-0 lg:mr-4 border" />
                    <div className="bg-white p-6 flex flex-col justify-between w-full">
                        <div className="flex-1">
                            <Skeleton className="h-8 w-full mb-2" /> {/* Title */}
                            <Skeleton className="h-6 w-full mb-2" /> {/* Description */}
                            <Skeleton className="h-4 w-1/4 mb-1" /> {/* Author */}
                            <Skeleton className="h-4 w-2/3 mb-4" /> {/* Updated info */}
                            <Skeleton className="h-6 w-1/3 mb-2" /> {/* Rating */}
                        </div>
                        <Skeleton className="h-8 w-1/3 mb-2" /> {/* Price */}
                    </div>
                </Link>
            </div>
        ))
    ) : (

        courses
            .filter(item => item.is_buy)
            .sort((a, b) => b.is_buy - a.is_buy) // Lọc chỉ những sản phẩm nổi bật
            .map((item, index) => (
                <div key={index}>
                    <Link to={`/detail/${item.slug}`} className="relative bg-white p-4 rounded-lg flex flex-col lg:flex-row group lg:my-5 md:my-3 my-0">
                        <img alt="Best-selling course" className="w-full custom-img-height md:h-82 lg:h-60 lg:w-96 object-cover mb-4 lg:mb-0 lg:mr-4 border" src={`${item.img}`} />
                        <div className="bg-white p-6 flex flex-col justify-between">
                            <div className="flex-1">
                                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-gray-700 mb-2">
                                    {item.description}
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
                                        Tổng số 126 giờ | 342 bài giảng | Tất cả trình độ
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
                                    <span className="bg-yellow-200 text-gray-700 text-sm px-2 py-1 ml-2">
                                        Bán chạy nhất
                                    </span>
                                </p>
                            </div>
                            <p className="pt-4 text-lg font-bold text-black">
                                {formatCurrency(item.price_discount)}
                            </p>
                        </div>
                    </Link>
                </div>

            ))
    );

    // Danh sách khóa học
    const render = loading ? (
        Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="my-5">
                <Link className="relative bg-white p-4 rounded-lg shadow flex group">
                    <Skeleton className="w-30 h-20 md:w-50 md:h-40 object-cover mr-4" />
                    <div className="flex-1">
                        <Skeleton className="h-6 w-full mb-2" /> {/* Title */}
                        <Skeleton className="h-4 w-3/4 mb-2" /> {/* Description */}
                        <Skeleton className="h-4 w-1/4 mb-1" /> {/* Author */}
                        <Skeleton className="h-4 w-1/3 mb-2" /> {/* Rating */}
                        <Skeleton className="h-4 w-2/3 mb-1" /> {/* Course duration */}
                        <Skeleton className="h-4 w-1/2" /> {/* Views */}
                    </div>
                    <div className="ml-auto">
                        <Skeleton className="h-6 w-20 mb-2" /> {/* Discounted price */}
                        <Skeleton className="h-6 w-20 line-through" /> {/* Original price */}
                    </div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-96 bg-white border border-gray-300 shadow-lg invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300 px-6 py-4">
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-full mb-2" /> {/* Header for learned skills */}
                            <Skeleton className="h-4 w-full mb-2" /> {/* Skill 1 */}
                            <Skeleton className="h-4 w-full mb-2" /> {/* Skill 2 */}
                            <Skeleton className="h-4 w-full mb-2" /> {/* Skill 3 */}
                            <Skeleton className="h-12 w-full" /> {/* Add to cart button */}
                        </div>
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white"></div>
                    </div>
                </Link>
            </div>
        ))
    ) : (
        currentCourses.map((item, index) => (
            <div key={index} >
                <Link to={`/detail/${item.slug}`} className="relative bg-white p-4 rounded-lg shadow flex group my-5">
                    <img alt="React Ultimate" className="w-30 h-20 md:w-50 md:h-40 object-cover mr-4" src={`${item.img}`} />
                    <div className="flex-1">
                        <h3 className="text-md md:text-lg font-semibold text-gray-800">
                            <a className=" hover:underline" href="#">
                                {item.title}
                            </a>
                        </h3>
                        <p className="text-sm text-black pr-5">
                            {item.description}
                        </p>
                        <p className="text-xs text-gray-500 ">
                            {item.user_id}
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
                            {formatCurrency(item.price_discount)}
                        </p>
                        <p className="text-md md:text-lg text-gray-500 line-through">
                            {formatCurrency(item.price)}
                        </p>
                    </div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-96 bg-white border border-gray-300 shadow-lg invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300 px-6 py-4">
                        <div className="space-y-2">
                            <h3 className="font-semibold text-gray-900">
                                Những kiến thức bạn sẽ học
                            </h3>
                            <p>
                                <i className="bx bx-check" /> Biết cách lập trình cơ bản
                            </p>
                            <p>
                                <i className="bx bx-check" /> Có khái niệm về lập trình C++
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
    )

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                if (searchQuery) {
                    const results = await fetchSearchResults(searchQuery);
                    setCourses(results.length > 0 ? results : []);
                } else {
                    const response = await axios.get(`${API_URL}/courses`);
                    if (response.status === 200 && Array.isArray(response.data)) {
                        setCourses(response.data);
                    }
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
                setCourses([]);
            }
        };
        const timeoutId = setTimeout(() => {
            if (searchQuery) {
                fetchCourses();
            }
        }, 300);
        fetchHotInstructor();
        return () => clearTimeout(timeoutId);
    }, [searchQuery, API_URL, setCourses]);

    return (

        <section className='courses'>
            <div className="max-w-custom mx-auto px-4 pt-5 ">
                {/* Khóa học nổi bật */}
                <div className="hot-courses shadow-md  p-3">
                    <h1 className="text-2xl font-medium mb-2 text-center lg:text-start">
                        Khóa học nổi bật
                    </h1>
                    <p className="text-gray-600 lg:mb-4 text-center lg:text-start">
                        Nhiều học viên thích khóa học được đánh giá cao này vì nội
                        dung hấp dẫn của nó.
                    </p>
                    <Carousel>
                        <CarouselContent>
                            <CarouselItem>
                                {render_course_hot[0]} {/* Hiển thị item đầu tiên */}
                            </CarouselItem>
                            <CarouselItem>
                                {render_course_hot[1]} {/* Hiển thị item thứ hai */}
                            </CarouselItem>
                            <CarouselItem>
                                {render_course_hot[2]} {/* Hiển thị item thứ ba */}
                            </CarouselItem>
                        </CarouselContent>
                        {/* Đặt nút điều hướng bên ngoài CarouselContent */}
                        <div className="flex justify-between items-center absolute w-full top-1/2 transform -translate-y-1/2">
                            <CarouselPrevious className="z-10" />
                            <CarouselNext className="z-10" />
                        </div>
                    </Carousel>
                </div>



                {/* Chủ đề phổ biến */}
                <div className="hot categoriesp-3 my-5">
                    <h1 className="text-2xl font-semibold py-5 text-center lg:text-start">Chủ đề phổ biến</h1>
                    {/* Hàng 1 */}
                    <div className="flex w-full gap-3 justify-center my-3">
                        {renderCategories(categories.slice(0, 5))}
                    </div>
                    {/* Hàng 2 */}
                    <div className="flex w-full gap-3 justify-center my-3">
                        {renderCategories(categories.slice(5, 9))}
                    </div>

                </div>

                {/* Giảng viên */}
                <div className="">
                    <h1 className="text-2xl font-semibold pt-10 text-center lg:text-start">
                        Giảng viên nổi tiếng
                    </h1>
                    <p className="text-gray-500 py-2 text-center lg:text-start">
                        Các chuyên gia trong ngành này được đánh giá cao bởi những
                        học viên như bạn.
                    </p>

                    <div className="sm:grid gap-4 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2">
                        {renderHotInstructor}
                    </div>

                </div>


                {/* Tất cả các khóa học Phát triển web */}
                <div className="">
                    <div className="mb-4 pt-8">
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
                            className="flex items-center bg-white text-gray-800 border-2 px-4 py-4 rounded mr-3"
                            id="openButton">
                            <i className="bx bx-slider" /> Bộ lọc
                        </button>
                        <div className="relative inline-block text-left mr-3">
                            <select className="block w-full bg-white border border-gray-300 rounded-lg py-4 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
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
                        <div className="col-span-3 transition-all ease-in-out duration-500 " id="filterContent">
                            <Accordion type="single" collapsible defaultValue="item-1">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="text-xl font-bold">Xếp hạng</AccordionTrigger>
                                    <AccordionContent>
                                        <input className="mr-2" name="rating" type="radio" />
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
                                        <br />
                                        <input
                                            className="mr-2"
                                            name="rating"
                                            type="radio" />
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
                                        <br />
                                        <input
                                            className="mr-2"
                                            name="rating"
                                            type="radio" />
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
                                        <br />
                                        <input
                                            className="mr-2"
                                            name="rating"
                                            type="radio" />
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
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            <hr />
                            <Accordion type="single" collapsible defaultValue="item-1">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="text-xl font-bold">Thời lượng video</AccordionTrigger>
                                    <AccordionContent>
                                        <input
                                            className="mr-2 text-black"
                                            name="duration"
                                            type="checkbox" />
                                        <span className="text-sm text-black">
                                            0-1 giờ{" "}
                                            <span className="text-gray-600">
                                                (3.217)
                                            </span>
                                        </span>
                                        <br />
                                        <input
                                            className="mr-2 text-black"
                                            name="duration"
                                            type="checkbox" />
                                        <span className="text-sm text-black">
                                            1-3 giờ{" "}
                                            <span className="text-gray-600">
                                                (10.000)
                                            </span>
                                        </span>
                                        <br />
                                        <input
                                            className="mr-2 text-black"
                                            name="duration"
                                            type="checkbox" />
                                        <span className="text-sm text-black">
                                            3-6 giờ{" "}
                                            <span className="text-gray-600">
                                                (8.691)
                                            </span>
                                        </span>
                                        <br />
                                        <input
                                            className="mr-2 text-black"
                                            name="duration"
                                            type="checkbox" />
                                        <span className="text-sm text-black">
                                            6-17 giờ{" "}
                                            <span className="text-gray-600">
                                                (10.000)
                                            </span>
                                        </span>
                                        <br />
                                        <input
                                            className="mr-2 text-black"
                                            name="duration"
                                            type="checkbox" />
                                        <span className="text-sm text-black">
                                            Hơn 17 giờ{" "}
                                            <span className="text-gray-600">
                                                (4.518)
                                            </span>
                                        </span>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            <hr />
                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="text-xl font-bold">Chủ đề</AccordionTrigger>
                                    <AccordionContent>
                                        <input
                                            className="mr-2"
                                            name="duration"
                                            type="checkbox" />
                                        <span className="text-sm text-black">
                                            Python{" "}
                                            <span className="text-gray-600">
                                                (2.433)
                                            </span>
                                        </span>
                                        <br />
                                        <input
                                            className="mr-2"
                                            name="duration"
                                            type="checkbox" />
                                        <span className="text-sm text-black">
                                            JavaScript{" "}
                                            <span className="text-gray-600">
                                                (1.105)
                                            </span>
                                        </span>
                                        <br />
                                        <input
                                            className="mr-2"
                                            name="duration"
                                            type="checkbox" />
                                        <span className="text-sm text-black">
                                            Java{" "}
                                            <span className="text-gray-600">
                                                (1.088)
                                            </span>
                                        </span>
                                        <br />
                                        <input
                                            className="mr-2"
                                            name="duration"
                                            type="checkbox" />
                                        <span className="text-sm text-black">
                                            Unity{" "}
                                            <span className="text-gray-600">
                                                (960)
                                            </span>
                                        </span>
                                        <br />
                                        <input
                                            className="mr-2"
                                            name="duration"
                                            type="checkbox" />
                                        <span className="text-sm text-black">
                                            Phát triển web{" "}
                                            <span className="text-gray-600">
                                                (933)
                                            </span>
                                        </span>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            <hr />
                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="text-xl font-bold">Thể loại con</AccordionTrigger>
                                    <AccordionContent>
                                        <input
                                            className="mr-2"
                                            name="duration"
                                            type="checkbox" />
                                        <span className="text-sm text-black">
                                            Phát triển web{" "}
                                            <span className="text-gray-600">
                                                (2.433)
                                            </span>
                                        </span>
                                        <br />
                                        <input
                                            className="mr-2"
                                            name="duration"
                                            type="checkbox" />
                                        <span className="text-sm text-black">
                                            Ngôn ngữ lập trình{" "}
                                            <span className="text-gray-600">
                                                (1.105)
                                            </span>
                                        </span>
                                        <br />
                                        <input
                                            className="mr-2"
                                            name="duration"
                                            type="checkbox" />
                                        <span className="text-sm text-black">
                                            Khoa học dữ liệu{" "}
                                            <span className="text-gray-600">
                                                (1.088)
                                            </span>
                                        </span>
                                        <br />
                                        <input
                                            className="mr-2"
                                            name="duration"
                                            type="checkbox" />
                                        <span className="text-sm text-black">
                                            Phát triển ứng dụng di động{" "}
                                            <span className="text-gray-600">
                                                (960)
                                            </span>
                                        </span>
                                        <br />
                                        <input
                                            className="mr-2"
                                            name="duration"
                                            type="checkbox" />
                                        <span className="text-sm text-black">
                                            Thiết kế cơ sở dữ liệu{" "}
                                            <span className="text-gray-600">
                                                (960)
                                            </span>
                                        </span>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            <hr />
                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="text-xl font-bold">Cấp độ</AccordionTrigger>
                                    <AccordionContent>
                                        <input
                                            className="mr-2"
                                            name="duration"
                                            type="checkbox" />
                                        <span className="text-sm text-black">
                                            Tất cả trình độ{" "}
                                            <span className="text-gray-600">
                                                (10.000)
                                            </span>
                                        </span>
                                        <br />
                                        <input
                                            className="mr-2"
                                            name="duration"
                                            type="checkbox" />
                                        <span className="text-sm text-black">
                                            Sơ cấp{" "}
                                            <span className="text-gray-600">
                                                (10.000)
                                            </span>
                                        </span>
                                        <br />
                                        <input
                                            className="mr-2"
                                            name="duration"
                                            type="checkbox" />
                                        <span className="text-sm text-black">
                                            Trung cấp{" "}
                                            <span className="text-gray-600">
                                                (5.665)
                                            </span>
                                        </span>
                                        <br />
                                        <input
                                            className="mr-2"
                                            name="duration"
                                            type="checkbox" />
                                        <span className="text-sm text-black">
                                            Chuyên gia{" "}
                                            <span className="text-gray-600">
                                                (621)
                                            </span>
                                        </span>
                                        <br />
                                        <input
                                            className="mr-2"
                                            name="duration"
                                            type="checkbox" />
                                        <span className="text-sm text-black">
                                            Phát triển web{" "}
                                            <span className="text-gray-600">
                                                (933)
                                            </span>
                                        </span>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            <hr />
                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="text-xl font-bold">Ngôn ngữ</AccordionTrigger>
                                    <AccordionContent>
                                        <input
                                            className="mr-2"
                                            name="duration"
                                            type="checkbox" />
                                        <span className="text-sm text-black">
                                            English{" "}
                                            <span className="text-gray-600">
                                                (1)
                                            </span>
                                        </span>
                                        <br />
                                        <input
                                            className="mr-2"
                                            name="duration"
                                            type="checkbox" />
                                        <span className="text-sm text-black">
                                            中国人{" "}
                                            <span className="text-gray-600">
                                                (1)
                                            </span>
                                        </span>
                                        <br />
                                        <input
                                            className="mr-2"
                                            name="duration"
                                            type="checkbox" />
                                        <span className="text-sm text-black">
                                            日本語
                                            <span className="text-gray-600">
                                                (1)
                                            </span>
                                        </span>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            <hr />
                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="text-xl font-bold">Giá</AccordionTrigger>
                                    <AccordionContent>
                                        <input
                                            className="mr-2"
                                            name="duration"
                                            type="checkbox" />
                                        <span className="text-sm text-black">
                                            Có trả phí{" "}
                                            <span className="text-gray-600">
                                                (68)
                                            </span>
                                        </span>
                                        <br />
                                        <input
                                            className="mr-2"
                                            name="duration"
                                            type="checkbox" />
                                        <span className="text-sm text-black">
                                            Miễn phí{" "}
                                            <span className="text-gray-600">
                                                (23)
                                            </span>
                                        </span>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            <hr />
                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="text-xl font-bold">Đặc điểm</AccordionTrigger>
                                    <AccordionContent>
                                        <input
                                            className="mr-2"
                                            name="duration"
                                            type="checkbox" />
                                        <span className="text-sm text-black">
                                            Phụ đề{" "}
                                            <span className="text-gray-600">
                                                (1)
                                            </span>
                                        </span>
                                        <br />
                                        <input
                                            className="mr-2"
                                            name="duration"
                                            type="checkbox" />
                                        <span className="text-sm text-black">
                                            Trắc nghiệm{" "}
                                            <span className="text-gray-600">
                                                (16)
                                            </span>
                                        </span>
                                        <br />
                                        <input
                                            className="mr-2"
                                            name="duration"
                                            type="checkbox" />
                                        <span className="text-sm text-black">
                                            Bài tập Coding{" "}
                                            <span className="text-gray-600">
                                                (8)
                                            </span>
                                        </span>
                                        <br />
                                        <input
                                            className="mr-2"
                                            name="duration"
                                            type="checkbox" />
                                        <span className="text-sm text-black">
                                            Bài kiểm tra thực hành{" "}
                                            <span className="text-gray-600">
                                                (4)
                                            </span>
                                        </span>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            <hr />
                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="text-xl font-bold">Phụ đề</AccordionTrigger>
                                    <AccordionContent>
                                        <input
                                            className="mr-2"
                                            name="duration"
                                            type="checkbox" />
                                        <span className="text-sm text-black">
                                            Tiếng Việt{" "}
                                            <span className="text-gray-600">
                                                (1)
                                            </span>
                                        </span>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            <hr />
                        </div>

                        {/*Danh sách khóa học nơi hiển thị sản phẩm đã được search */}
                        <div className="col-span-9 transition-all ease-in-out duration-500" id="courseCol">
                            {loading ? (
                                <div className="text-center py-8">
                                    <p>Đang tải...</p>
                                </div>
                            ) : courses.length > 0 ? (
                                <div className="courses-list">
                                    {render} {/* Your existing render logic */}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-600">
                                        {searchQuery
                                            ? `Không tìm thấy khóa học nào cho "${searchQuery}"`
                                            : "Không có khóa học nào"}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Chuyển trang */}
            <Pagination>
                <PaginationContent>
                    {renderPageNumbers()}
                </PaginationContent>
            </Pagination>
        </section>
    );
};

