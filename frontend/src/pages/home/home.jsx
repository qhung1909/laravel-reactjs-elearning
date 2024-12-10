import { useState, useContext, useEffect } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { formatCurrency } from "@/components/Formatcurrency/formatCurrency";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoriesContext } from "../context/categoriescontext";
import { CoursesContext } from "../context/coursescontext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { UserContext } from "../context/usercontext";
import { Button } from "@/components/ui/button";
Button
export const Home = () => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;
    const { courses, hotProducts, fetchTopPurchasedProduct, fetchCoursesByCategory, setCourses, loading, setLoading, loadingCoursesCategory, setLoadingCoursesCategory } = useContext(CoursesContext)
    const { categories } = useContext(CategoriesContext);
    const { user } = useContext(UserContext);
    const [topViewedProduct, setTopViewedProduct] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [open, setOpen] = useState(false);
    const { categoryLoading } = useContext(CategoriesContext);
    const handleCategoryClick = (slug) => {
        if (selectedCategory === slug) {
            setSelectedCategory(null);
            setCourses([]);
        } else {
            setSelectedCategory(slug);
            fetchCoursesByCategory(slug);
        }
    };

    const fetchTopViewedProduct = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/top-viewed-courses`, {
                headers: {
                    'x-api-secret': `${API_KEY}`,
                },
            });

            setTopViewedProduct(response.data);
        } catch (error) {
            console.log('Error fetching API', error);
        } finally {
            setLoading(false);
        }
    }

    const purchasedProduct = loading ? (
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
        Array.isArray(hotProducts) && hotProducts.length > 0 ? (
            hotProducts.map((item, index) => (
                <div className="product md:mb-10 xl:mb-0 text-center md:text-left group hover:shadow-xl p-2" key={index}>
                    <div className="product-box">
                        <Link to={`/detail/${item.slug}`}>
                            <div className="product-box-img xl:h-[200px] lg:h-[150px] md:h-[135px] sm:h-[180px] h-[150px] flex justify-center items-center">
                                <img
                                    src={`${item.img}`}
                                    alt=""
                                    className="rounded-xl h-full sm:w-full md:h-full w-80"
                                />
                            </div>
                            <div className="product-box-title xl:text-xl lg:text-xl md:text-base sm:text-lg text-base font-semibold my-2  line-clamp-2 xl:h-[55px] lg:h-[54px] md:h-[45px]">
                                <span className="lg:pe-5 pe-3">
                                    {`${item.title}`}
                                </span>
                            </div>
                        </Link>

                        <div className="product-box-author font-mediummy-1 md:text-base text-sm md:block hidden">
                            <p>Bởi: {`${item.user?.name}`}</p>
                        </div>
                        <div className="product-box-time-lesson md:text-sm sm:text-[15px] text-[14px] flex justify-center md:justify-start gap-4 my-1 ">
                            <div className="product-box-time">
                                <p className="text-base">Số lượt mua: <span className="font-semibold text-lg text-yellow-600">{`${item.is_buy}`}</span> </p>
                            </div>
                        </div>
                        <div className="product-box-price font-bold xl:text-xl md:text-lg sm:text-lg text-lg">
                            {formatCurrency(item.price_discount)}
                        </div>
                    </div>
                    <div className="h-10 overflow-hidden mt-1">
                        <div className="transform -translate-y-10 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                            <Link to={`/detail/${item.slug}`}>
                                <Button className="w-full bg-primary hover:bg-primary/90">
                                    Xem ngay
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            ))
        ) : (
            <p>Không có sản phẩm phù hợp ngay lúc này, thử lại sau</p>
        );

    const viewedProduct = loading ? (
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
        Array.isArray(topViewedProduct) && topViewedProduct.length > 0 ? (
            topViewedProduct.map((item, index) => (
                <div className="product md:mb-10 xl:mb-0 text-center md:text-left group hover:shadow-xl p-2" key={index}>
                    <div className="product-box">
                        <Link to={`/detail/${item.slug}`}>
                            <div className="product-box-img xl:h-[200px] lg:h-[150px] md:h-[135px] sm:h-[180px] h-[150px] flex justify-center items-center">
                                <img
                                    src={`${item.img}`}
                                    alt=""
                                    className="rounded-xl h-full sm:w-full md:h-full w-80"
                                />
                            </div>
                            <div className="product-box-title xl:text-xl lg:text-xl md:text-base sm:text-lg text-lg font-semibold my-2  line-clamp-2 xl:h-[55px] lg:h-[54px] md:h-[45px]">
                                <span className="lg:pe-5 pe-3">
                                    {`${item.title}`}
                                </span>
                            </div>
                        </Link>

                        <div className="product-box-author font-mediummy-1 md:text-base text-sm md:block hidden">
                            <p>Bởi: {`${item.user?.name}`}</p>
                        </div>
                        <div className="product-box-time-lesson md:text-sm sm:text-[15px] text-[14px] flex justify-center md:justify-start gap-4 my-1 ">
                            <div className="product-box-time">
                                <p className="text-base">Số lượt xem: <span className="font-semibold text-lg text-yellow-600">{`${item.views}`}</span> </p>
                            </div>
                        </div>
                        <div className="product-box-price font-bold xl:text-xl md:text-lg sm:text-lg text-lg">
                            {formatCurrency(item.price_discount)}
                        </div>
                    </div>
                    <div className="h-10 overflow-hidden mt-1">
                        <div className="transform -translate-y-10 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                            <Link to={`/detail/${item.slug}`}>
                                <Button className="w-full bg-primary hover:bg-primary/90">
                                    Xem ngay
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            ))
        ) : (
            <p>Không có sản phẩm phù hợp ngay lúc này, thử lại sau</p>
        )

    const renderCategories = (categoryGroup) => {
        if (categoryLoading) {
            return (
                <div className="flex flex-wrap justify-center items-center">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div className="bg-gray-100 h-10 w-20 rounded-lg animate-pulse mx-2" key={index}></div>
                    ))}
                </div>
            )

        }

        if (!Array.isArray(categoryGroup) && categoryGroup.length === 0) {
            return (
                <p>Không có danh mục phù hợp ngay lúc này, thử lại sau</p>
            )
        }

        return categoryGroup.map((item) => (
            <button
                onClick={() => handleCategoryClick(item.slug)}
                className={`p-3 rounded-lg duration-300 me-2 ${selectedCategory === item.slug
                    ? 'bg-yellow-400 text-white'
                    : 'bg-gray-100 hover:bg-white hover:border-yellow-400 border'
                    }`}
                key={item.slug}
            >
                <p className="lg:text-base md:text-sm sm:text-xs text-[13px]">{item.name}</p>
            </button>
        ))
    };

    useEffect(() => {
        fetchTopPurchasedProduct();
        fetchTopViewedProduct();
    }, []);

    useEffect(() => {
        const shouldShowDialog = localStorage.getItem('showWelcomeDialog');
        if (shouldShowDialog === 'true' && user) {
            setOpen(true);
            localStorage.removeItem('showWelcomeDialog');
        }
    }, [user]);

    // Hàm xử lý khi đóng dialog
    const handleCloseDialog = () => {
        setOpen(false);
    };
    return (
        <>

            {/* banner */}
            <div className="banner">
                <div className="banner-box">
                    <div className="" style={{ backgroundImage: "url(https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/uploads/background-banner.jpg)" }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-2xl mx-auto">
                            <div className="grid-left">
                                <div className="banner-left text-center md:text-left sm:h-auto h-96 sm:py-20 lg:py-20 lg:ps-10 md:px-5">
                                    <div className="banner-left-heading  max-lg:flex items-center justify-center md:justify-start">
                                        <p className="flex mt-10 sm:mt-0 font-semibold items-center border rounded-full border-yellow-400 xl:w-44 lg:w-40 px-2 py-1 xl:text-base lg:text-sm md:text-xs sm:text-sm text-xs">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="me-2 xl:w-5 xl:h-5 md:w-4 md:h-4 w-3 h-3"

                                                viewBox="0 0 24 24"
                                                style={{ fill: "rgba(0, 0, 0, 1)" }}
                                            >
                                                <path d="M21.947 9.179a1.001 1.001 0 0 0-.868-.676l-5.701-.453-2.467-5.461a.998.998 0 0 0-1.822-.001L8.622 8.05l-5.701.453a1 1 0 0 0-.619 1.713l4.213 4.107-1.49 6.452a1 1 0 0 0 1.53 1.057L12 18.202l5.445 3.63a1.001 1.001 0 0 0 1.517-1.106l-1.829-6.4 4.536-4.082c.297-.268.406-.686.278-1.065z" />
                                            </svg>
                                            Làm chủ kỹ năng
                                        </p>
                                    </div>
                                    <div className="font-title banner-left-title text-4xl xl:text-[70px] lg:text-[50px] md:text-[40px] sm:text-[45px] text-[35px] xl:my-10 my-5 sm:px-10 px-12 md:px-0">
                                        <p className="leading-tight">
                                            Cách nhanh hơn để
                                            <span className="text-yellow-400 italic"> phát triển</span> và{" "}
                                            <span className="text-yellow-400 italic"> nâng cao </span>
                                            kỹ năng của bạn
                                        </p>
                                    </div>
                                    <div className="banner-left-content lg:px-0 xl:text-lg md:text-base sm:text-base text-sm sm:my-5 sm:px-32 px-24 md:px-0">
                                        <p>
                                            Cùng tìm hiểu các chiến lược tiên tiến để tối ưu quá trình học,
                                            nâng cao kỹ năng, đạt được thành công nhanh chóng trong sự
                                            nghiệp của bạn
                                        </p>
                                    </div>
                                    <div className="banner-left-button">
                                        <Link to="/courses">
                                            <button className="bg-yellow-500 xl:mt-10 xl:px-5 xl:py-3 md:font-bold rounded-full xl:text-xl lg:text-base md:text-sm sm:text-base text-[14px] font-semibold mt-4 p-2 px-4">
                                                Khám phá khóa học
                                            </button>
                                        </Link>
                                    </div>
                                </div>

                            </div>
                            <div className="md:flex items-center justify-center hidden md:block">
                                <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/uploads/banner-right.png" alt="" className="" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>


            {/* Thân trang - sản phẩm được mua nhiều */}
            <div className="home-page bestseller sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl mx-auto xl:px-3 lg:px-5 px-3 xl:text-left h-[530px]">
                <div className="bestseller-box lg:mt-20 md:mt-14 sm:mt-10 mt-6">
                    {/* bestseller - title */}
                    <div className="bestseller-box-title xl:mb-10 sm:mb-5 mb-3 lg:text-[46px] md:text-[40px] sm:text-[30px] text-[28px] md:text-left text-center font-title ">
                        <h4>
                            Các khóa học{" "}
                            <span className="italic font-semibold text-yellow-400">
                                được mua nhiều nhất
                            </span>
                        </h4>
                    </div>
                    <div className="best-seller-box-content ">
                        {/* box sản phẩm */}
                        <div className="grid md:grid-cols-4 grid-cols-2 gap-3 sm:px-3 md:px-0" >
                            {purchasedProduct}
                        </div>
                    </div>
                </div>
            </div>
            {/* Thân trang - sản phẩm chất lượng cao */}
            <div className="home-page bestquality sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl mx-auto xl:px-3 lg:px-5 px-3 xl:text-left my-5 h-[530px]">
                <div className="bestquality-box xl:mt-20 lg:mt-10 sm:mt-2 mt-6">
                    {/* bestseller - title */}
                    <div className="bestquality-box-title xl:mb-10 sm:mb-5 mb-3 lg:text-[46px] md:text-[40px] sm:text-[30px] text-[28px] md:text-left text-center  font-title">
                        <h4>
                            Các khóa học{" "}
                            <span className="italic font-semibold text-yellow-400">
                                xem nhiều nhất
                            </span>
                        </h4>
                    </div>
                    <div className="best-bestquality-box-content ">
                        {/* box sản phẩm */}
                        <div className="grid md:grid-cols-4 grid-cols-2 gap-3" >
                            {viewedProduct}
                        </div>
                    </div>
                </div>
            </div>

            <p></p>
            {/* Thân trang - một liều cảm hứng catelog */}
            <div className="home-page homecatelog sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl mx-auto xl:px-3 lg:px-5 px-3 xl:text-left">
                <div className="homecatelog-box lg:mt-20 md:mt-14 sm:mt-10 mt-6">
                    <div className="homecatelog-box-title lg:text-[46px] md:text-[40px] sm:text-[30px] text-[28px] font-title text-center">
                        <h2>
                            Một liều{" "}
                            <span className="text-yellow-400 italic font-semibold">cảm hứng</span>
                            ,
                        </h2>
                        <h2>bất cứ khi nào bạn cần.</h2>
                    </div>
                    <div className="homecatelog-box-content mt-5 text-center">
                        <div className="homecatelog-box-content-row">
                            <div className="homecatelog-box-content-row-main">
                                {renderCategories(categories.slice(0, 5))}
                            </div>
                        </div>
                        <div className="homecatelog-box-content-row my-3">
                            <div className="homecatelog-box-content-row-main">
                                {renderCategories(categories.slice(5, 9))}
                            </div>
                        </div>
                    </div>
                    <div className="homecatelog homecatelog-products mt-10">
                        <div>
                            {loadingCoursesCategory ? (
                                <div className="grid md:grid-cols-4 grid-cols-2 gap-3 sm:px-3 md:px-0">
                                    {Array.from({ length: 4 }).map((_, index) => (
                                        <div className="flex flex-col space-y-3" key={index}>
                                            <Skeleton className="h-[125px] w-11/12 rounded-xl" />
                                            <div className="flex flex-col space-y-2 items-center md:items-start">
                                                <Skeleton className="h-4 w-8/12 md:w-11/12" />
                                                <Skeleton className="h-4 w-5/12 md:w-9/12 " />
                                            </div>
                                        </div>

                                    ))}
                                </div>
                            ) :
                                selectedCategory === null ? (
                                    <div className="py-5 text-center">
                                        <svg width="100%" height="177" viewBox="0 0 139 142" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M71.5016 125.45C104.302 125.45 130.902 99.0496 130.902 66.4496C130.902 33.8496 104.302 7.44958 71.5016 7.44958C38.7016 7.44958 12.1016 33.8496 12.1016 66.4496C12.1016 99.0496 38.7016 125.45 71.5016 125.45Z" fill="#EAEEF9">
                                            </path>
                                            <path d="M117.002 58.7495V94.8495C117.002 102.35 110.902 108.45 103.302 108.45H39.9017C32.4017 108.45 26.3017 102.45 26.2017 94.9495C26.2017 94.8495 26.2017 94.8495 26.2017 94.7495V58.7495C26.2017 58.6495 26.2017 58.6495 26.2017 58.5495C26.2017 58.3495 26.2017 58.1495 26.3017 57.9495C26.4017 57.6495 26.5017 57.4495 26.6017 57.1495L43.6017 24.6495C44.2017 23.3495 45.5017 22.6495 46.9017 22.6495H96.2017C97.6017 22.6495 98.8017 23.3495 99.5017 24.6495L116.502 57.1495C116.602 57.3495 116.702 57.6495 116.802 57.9495C117.002 58.1495 117.002 58.4495 117.002 58.7495Z" fill="#D5DDEA"></path><g filter="url(#filter0_d_0_17276)"><path d="M117.002 58.7496V98.5496C117.002 104.05 112.602 108.45 107.002 108.45H36.2017C30.7017 108.45 26.2017 104.05 26.2017 98.5496V58.5496C26.2017 58.3496 26.2017 58.1496 26.3017 57.9496H49.1017C52.5017 57.9496 55.3017 60.6496 55.3017 64.1496C55.3017 65.8496 56.0017 67.4496 57.1017 68.5496C58.3017 69.7496 59.7017 70.3496 61.5017 70.3496H81.8017C85.2017 70.3496 88.0017 67.6496 88.0017 64.1496C88.0017 62.4496 88.7017 60.8496 89.8017 59.7496C91.0017 58.5496 92.4017 57.9496 94.1017 57.9496H116.802C117.002 58.1496 117.002 58.4496 117.002 58.7496Z" fill="url(#paint0_linear_0_17276)"></path></g><path d="M129.384 38.2496C131.648 38.2496 133.484 36.4139 133.484 34.1496C133.484 31.8852 131.648 30.0496 129.384 30.0496C127.119 30.0496 125.284 31.8852 125.284 34.1496C125.284 36.4139 127.119 38.2496 129.384 38.2496Z" fill="#EAEEF9"></path><path d="M125.284 24.9496C126.83 24.9496 128.084 23.696 128.084 22.1496C128.084 20.6032 126.83 19.3496 125.284 19.3496C123.737 19.3496 122.484 20.6032 122.484 22.1496C122.484 23.696 123.737 24.9496 125.284 24.9496Z" fill="#EAEEF9"></path><path d="M11.8837 34.1496C13.4301 34.1496 14.6837 32.896 14.6837 31.3496C14.6837 29.8032 13.4301 28.5496 11.8837 28.5496C10.3373 28.5496 9.08374 29.8032 9.08374 31.3496C9.08374 32.896 10.3373 34.1496 11.8837 34.1496Z" fill="#EAEEF9"></path><path d="M5.58379 95.7496C8.45567 95.7496 10.7838 93.4215 10.7838 90.5496C10.7838 87.6777 8.45567 85.3496 5.58379 85.3496C2.71191 85.3496 0.383789 87.6777 0.383789 90.5496C0.383789 93.4215 2.71191 95.7496 5.58379 95.7496Z" fill="#EAEEF9"></path><path d="M96.6216 10.6187C97.9267 24.8658 98.5792 28.1285 95.6244 41.0313C94.6635 43.8998 93.7026 47.0416 91.6435 49.2271C88.7607 52.642 83.5443 54.1446 79.2889 53.0518C74.8961 51.9591 71.327 48.1343 70.5033 43.49C69.817 40.6215 70.7779 37.2065 73.2488 35.4308C75.857 33.7916 79.5634 34.2014 81.7598 36.2504C84.2307 38.2993 85.1916 41.4411 85.0543 44.4462C84.9171 47.4513 83.8189 50.4565 82.3089 53.0518C78.8954 59.4335 77.4901 59.41 70.5034 69.8911" stroke="#ABB5CC" strokeWidth="2" strokeMiterlimit="10" strokeDasharray="4 4"></path><path d="M104.275 5.31244C103.753 7.21624 101.666 7.90853 99.579 6.69702C97.3179 5.65858 95.7525 4.79322 96.1004 3.06249C96.6222 1.33177 98.7093 1.15869 101.144 0.985622C104.101 0.639477 104.623 3.40864 104.275 5.31244Z" fill="#DAE2EB"></path><path d="M87.4039 7.04302C88.2736 8.60068 90.7086 9.63911 92.4479 8.08146C94.3611 6.35073 95.9264 5.13922 95.0568 3.4085C94.1872 1.85084 92.7957 2.37006 89.8389 2.71621C87.4039 3.23542 86.3604 5.3123 87.4039 7.04302Z" fill="#DAE2EB"></path><path d="M95.0569 0.639542C96.2744 0.466469 97.4919 1.15876 97.8397 2.1972C98.0137 2.54334 98.1876 3.06256 98.1876 3.4087C98.5355 5.83172 97.6658 7.90859 96.2744 8.08167C94.709 8.42781 93.1437 6.69708 92.9697 4.44714C92.9697 3.75485 92.9697 3.4087 92.9697 2.88949C93.1437 1.67798 93.8394 0.812615 95.0569 0.639542C95.2308 0.639542 95.0569 0.639542 95.0569 0.639542Z" fill="#989FB0"></path><path d="M60.192 84.7092C61.4591 84.7092 62.4863 83.682 62.4863 82.4149C62.4863 81.1478 61.4591 80.1206 60.192 80.1206C58.9249 80.1206 57.8977 81.1478 57.8977 82.4149C57.8977 83.682 58.9249 84.7092 60.192 84.7092Z" fill="#989FB0"></path><path d="M83.0108 84.7092C84.278 84.7092 85.3051 83.682 85.3051 82.4149C85.3051 81.1478 84.278 80.1206 83.0108 80.1206C81.7437 80.1206 80.7166 81.1478 80.7166 82.4149C80.7166 83.682 81.7437 84.7092 83.0108 84.7092Z" fill="#989FB0"></path><path d="M75.322 99.7772H68.129C67.0129 99.7772 66.0828 98.8471 66.0828 97.731C66.0828 96.6148 67.0129 95.6847 68.129 95.6847H75.2599C76.3761 95.6847 77.3062 96.6148 77.3062 97.731C77.3682 98.8471 76.4381 99.7772 75.322 99.7772Z" fill="#989FB0"></path><defs><filter id="filter0_d_0_17276" x="4.20166" y="46.9496" width="134.8" height="94.5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dy="11"></feOffset><feGaussianBlur stdDeviation="11"></feGaussianBlur><feColorMatrix type="matrix" values="0 0 0 0 0.397708 0 0 0 0 0.47749 0 0 0 0 0.575 0 0 0 0.27 0"></feColorMatrix><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_17276"></feBlend><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_17276" result="shape"></feBlend></filter><linearGradient id="paint0_linear_0_17276" x1="71.5721" y1="56.7815" x2="71.5721" y2="108.994" gradientUnits="userSpaceOnUse"><stop stopColor="#FDFEFF"></stop><stop offset="0.9964" stopColor="#ECF0F5"></stop></linearGradient></defs>
                                        </svg>
                                        <p className="text-gray-600 font-semibold text-lg mt-4">
                                            Hãy chọn một khóa học ngay lúc này.
                                        </p>
                                    </div>
                                ) :
                                    Array.isArray(courses) && courses.length > 0 ? (
                                        <div className="grid md:grid-cols-4 grid-cols-2 gap-3 sm:px-3 md:px-0">
                                            {courses.map((item, index) => (
                                                <div className="product md:mb-10 xl:mb-0 text-center md:text-left" key={index}>
                                                    <div className="product-box">
                                                        <Link to={`/detail/${item.slug}`}>
                                                            <div className="product-box-img xl:h-[200px] lg:h-[150px] md:h-[135px] sm:h-[180px] h-[150px] flex justify-center items-center">
                                                                <img
                                                                    src={`${item.img}`}
                                                                    alt=""
                                                                    className="rounded-xl h-full sm:w-full md:h-full w-80"
                                                                />
                                                            </div>
                                                            <div className="product-box-title xl:text-xl lg:text-xl md:text-base sm:text-lg text-lg font-semibold my-2 line-clamp-2 xl:h-[55px] lg:h-[54px] md:h-[45px]">
                                                                <span className="lg:pe-5 pe-3">
                                                                    {`${item.title}`}
                                                                </span>
                                                            </div>
                                                        </Link>
                                                        <div className="product-box-author font-mediummy-1 md:text-base text-sm md:block hidden">
                                                            <p>Đăng bởi: {item.user?.name || "Không thấy tên giảng viên"}</p>
                                                        </div>
                                                        <div className="product-box-time-lesson md:text-sm sm:text-[15px] text-[14px] flex justify-center md:justify-start gap-4 my-1 ">
                                                            <div className="product-box-time">
                                                                <p>35 bài học</p>
                                                            </div>
                                                            <div className="product-box-lesson hidden sm:block">
                                                                <p>7 giờ kém 10</p>
                                                            </div>
                                                        </div>
                                                        <div className="product-box-price font-bold xl:text-xl md:text-lg sm:text-lg text-lg">
                                                            {formatCurrency(item.price_discount)}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                    ) :
                                        (
                                            <div className="py-5 text-center">
                                                <svg width="100%" height="177" viewBox="0 0 139 142" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M71.5016 125.45C104.302 125.45 130.902 99.0496 130.902 66.4496C130.902 33.8496 104.302 7.44958 71.5016 7.44958C38.7016 7.44958 12.1016 33.8496 12.1016 66.4496C12.1016 99.0496 38.7016 125.45 71.5016 125.45Z" fill="#EAEEF9">
                                                    </path>
                                                    <path d="M117.002 58.7495V94.8495C117.002 102.35 110.902 108.45 103.302 108.45H39.9017C32.4017 108.45 26.3017 102.45 26.2017 94.9495C26.2017 94.8495 26.2017 94.8495 26.2017 94.7495V58.7495C26.2017 58.6495 26.2017 58.6495 26.2017 58.5495C26.2017 58.3495 26.2017 58.1495 26.3017 57.9495C26.4017 57.6495 26.5017 57.4495 26.6017 57.1495L43.6017 24.6495C44.2017 23.3495 45.5017 22.6495 46.9017 22.6495H96.2017C97.6017 22.6495 98.8017 23.3495 99.5017 24.6495L116.502 57.1495C116.602 57.3495 116.702 57.6495 116.802 57.9495C117.002 58.1495 117.002 58.4495 117.002 58.7495Z" fill="#D5DDEA"></path><g filter="url(#filter0_d_0_17276)"><path d="M117.002 58.7496V98.5496C117.002 104.05 112.602 108.45 107.002 108.45H36.2017C30.7017 108.45 26.2017 104.05 26.2017 98.5496V58.5496C26.2017 58.3496 26.2017 58.1496 26.3017 57.9496H49.1017C52.5017 57.9496 55.3017 60.6496 55.3017 64.1496C55.3017 65.8496 56.0017 67.4496 57.1017 68.5496C58.3017 69.7496 59.7017 70.3496 61.5017 70.3496H81.8017C85.2017 70.3496 88.0017 67.6496 88.0017 64.1496C88.0017 62.4496 88.7017 60.8496 89.8017 59.7496C91.0017 58.5496 92.4017 57.9496 94.1017 57.9496H116.802C117.002 58.1496 117.002 58.4496 117.002 58.7496Z" fill="url(#paint0_linear_0_17276)"></path></g><path d="M129.384 38.2496C131.648 38.2496 133.484 36.4139 133.484 34.1496C133.484 31.8852 131.648 30.0496 129.384 30.0496C127.119 30.0496 125.284 31.8852 125.284 34.1496C125.284 36.4139 127.119 38.2496 129.384 38.2496Z" fill="#EAEEF9"></path><path d="M125.284 24.9496C126.83 24.9496 128.084 23.696 128.084 22.1496C128.084 20.6032 126.83 19.3496 125.284 19.3496C123.737 19.3496 122.484 20.6032 122.484 22.1496C122.484 23.696 123.737 24.9496 125.284 24.9496Z" fill="#EAEEF9"></path><path d="M11.8837 34.1496C13.4301 34.1496 14.6837 32.896 14.6837 31.3496C14.6837 29.8032 13.4301 28.5496 11.8837 28.5496C10.3373 28.5496 9.08374 29.8032 9.08374 31.3496C9.08374 32.896 10.3373 34.1496 11.8837 34.1496Z" fill="#EAEEF9"></path><path d="M5.58379 95.7496C8.45567 95.7496 10.7838 93.4215 10.7838 90.5496C10.7838 87.6777 8.45567 85.3496 5.58379 85.3496C2.71191 85.3496 0.383789 87.6777 0.383789 90.5496C0.383789 93.4215 2.71191 95.7496 5.58379 95.7496Z" fill="#EAEEF9"></path><path d="M96.6216 10.6187C97.9267 24.8658 98.5792 28.1285 95.6244 41.0313C94.6635 43.8998 93.7026 47.0416 91.6435 49.2271C88.7607 52.642 83.5443 54.1446 79.2889 53.0518C74.8961 51.9591 71.327 48.1343 70.5033 43.49C69.817 40.6215 70.7779 37.2065 73.2488 35.4308C75.857 33.7916 79.5634 34.2014 81.7598 36.2504C84.2307 38.2993 85.1916 41.4411 85.0543 44.4462C84.9171 47.4513 83.8189 50.4565 82.3089 53.0518C78.8954 59.4335 77.4901 59.41 70.5034 69.8911" stroke="#ABB5CC" strokeWidth="2" strokeMiterlimit="10" strokeDasharray="4 4"></path><path d="M104.275 5.31244C103.753 7.21624 101.666 7.90853 99.579 6.69702C97.3179 5.65858 95.7525 4.79322 96.1004 3.06249C96.6222 1.33177 98.7093 1.15869 101.144 0.985622C104.101 0.639477 104.623 3.40864 104.275 5.31244Z" fill="#DAE2EB"></path><path d="M87.4039 7.04302C88.2736 8.60068 90.7086 9.63911 92.4479 8.08146C94.3611 6.35073 95.9264 5.13922 95.0568 3.4085C94.1872 1.85084 92.7957 2.37006 89.8389 2.71621C87.4039 3.23542 86.3604 5.3123 87.4039 7.04302Z" fill="#DAE2EB"></path><path d="M95.0569 0.639542C96.2744 0.466469 97.4919 1.15876 97.8397 2.1972C98.0137 2.54334 98.1876 3.06256 98.1876 3.4087C98.5355 5.83172 97.6658 7.90859 96.2744 8.08167C94.709 8.42781 93.1437 6.69708 92.9697 4.44714C92.9697 3.75485 92.9697 3.4087 92.9697 2.88949C93.1437 1.67798 93.8394 0.812615 95.0569 0.639542C95.2308 0.639542 95.0569 0.639542 95.0569 0.639542Z" fill="#989FB0"></path><path d="M60.192 84.7092C61.4591 84.7092 62.4863 83.682 62.4863 82.4149C62.4863 81.1478 61.4591 80.1206 60.192 80.1206C58.9249 80.1206 57.8977 81.1478 57.8977 82.4149C57.8977 83.682 58.9249 84.7092 60.192 84.7092Z" fill="#989FB0"></path><path d="M83.0108 84.7092C84.278 84.7092 85.3051 83.682 85.3051 82.4149C85.3051 81.1478 84.278 80.1206 83.0108 80.1206C81.7437 80.1206 80.7166 81.1478 80.7166 82.4149C80.7166 83.682 81.7437 84.7092 83.0108 84.7092Z" fill="#989FB0"></path><path d="M75.322 99.7772H68.129C67.0129 99.7772 66.0828 98.8471 66.0828 97.731C66.0828 96.6148 67.0129 95.6847 68.129 95.6847H75.2599C76.3761 95.6847 77.3062 96.6148 77.3062 97.731C77.3682 98.8471 76.4381 99.7772 75.322 99.7772Z" fill="#989FB0"></path><defs><filter id="filter0_d_0_17276" x="4.20166" y="46.9496" width="134.8" height="94.5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dy="11"></feOffset><feGaussianBlur stdDeviation="11"></feGaussianBlur><feColorMatrix type="matrix" values="0 0 0 0 0.397708 0 0 0 0 0.47749 0 0 0 0 0.575 0 0 0 0.27 0"></feColorMatrix><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_17276"></feBlend><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_17276" result="shape"></feBlend></filter><linearGradient id="paint0_linear_0_17276" x1="71.5721" y1="56.7815" x2="71.5721" y2="108.994" gradientUnits="userSpaceOnUse"><stop stopColor="#FDFEFF"></stop><stop offset="0.9964" stopColor="#ECF0F5"></stop></linearGradient></defs>
                                                </svg>
                                                <p className="text-gray-600 font-semibold text-lg mt-4">
                                                    Không có khóa học nào phù hợp ngay lúc này.
                                                </p>
                                            </div>
                                        )
                            }
                        </div>
                        <div className="homecatelog homecatelog-button text-center">
                            <Link to="/courses">
                                <button className="hover:bg-black hover:text-white duration-300 bg-yellow-500 lg:py-3 lg:px-8 md:px-8 sm:px-7 py-2 px-7 rounded-full font-semibold xl:mt-10 mt-3 lg:text-base md:text-sm sm:text-sm text-[13px]">
                                    Xem thêm
                                </button>
                            </Link>

                        </div>
                    </div>
                </div>
            </div>
            {/* Thân trang - blog */}
            <div className="home-page homeblog xl:max-w-screen-xl lg:max-w-screen-lg mx-auto py-5 ">
                <div className="homeblog-box grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <div className="homeblog-box-img">
                        <div className="homeblog-box-img-main relative md:flex md:justify-center">
                            <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/uploads/homepage-blog.png" alt="" />
                        </div>
                        <div className="homeblog-box-img-content relative bg-white pb-3 xl:w-[240px] lg:w-[210px] md:w-[190px] w-[160px] xl:top-[-30%] xl:left-[15%] lg:top-[-32%] lg:left-[15%] md:left-[20%] md:top-[-35%] sm:top[-10%] top-[-35%] left-[20%]">
                            <div className="homeblog-box-img-content-header font-medium p-3 xl:text-[16px] lg:text-[14px] md:text-[12px] text-[10px]">
                                <span>Khóa học đã hoàn thành 🎉</span>
                            </div>
                            <div className="homeblog-box-img-content-bottom xl:text-[12px] lg:text-[10px] md:text-[8px] text-[6px] px-3">
                                <div className="homeblog-box-img-content-bottom-flex flex items-center gap-3 xl:mb-2 mb-0">
                                    <box-icon name="check-circle" type="solid" color="#facc15" />
                                    <p>Chào mừng bạn học</p>
                                </div>
                                <div className="homeblog-box-img-content-bottom-flex flex items-center gap-3 xl:mb-2 mb-0">
                                    <box-icon name="check-circle" type="solid" color="#facc15" />
                                    <p>Bài học 1: Học những điều cơ bản</p>
                                </div>
                                <div className="homeblog-box-img-content-bottom-flex flex items-center gap-3 xl:mb-2 mb-0">
                                    <box-icon name="check-circle" type="solid" color="#facc15" />
                                    <p>Bài học 2: Tự tin hơn</p>
                                </div>
                                <div className="homeblog-box-img-content-bottom-flex flex items-center gap-3 xl:mb-2 mb-0">
                                    <box-icon name="check-circle" type="solid" color="#facc15" />
                                    <p>Bài học 3: Bắt đầu lần đầu tiên</p>
                                </div>
                                <div className="homeblog-box-img-content-bottom-flex flex items-center gap-3">
                                    <box-icon name="check-circle" type="solid" color="#facc15" />
                                    <p>Bài học 4: Tổng kết lại</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="homeblog-box-content">
                        <div className="homeblog-box-content-title xl:px-20 lg:px-10 md:mt-[-150px] md:px-14 px-4 mb-5 md:mb-0 lg:mt-0 xl:text-[46px] lg:text-[36px] md:text-[34px] sm:text-[32px] text-[24px] mt-[-150px] sm:text-center lg:text-start">
                            <h2>
                                Thúc đẩy{" "}
                                <span className="font-semibold text-yellow-400 italic">
                                    sự nghiệp của bạn &amp; mở rộng kiến thức
                                </span>{" "}
                                ở bất kỳ cấp độ nào.
                            </h2>
                        </div>
                        <div className="homeblog-box-content-blogs xl:ps-40 lg:px-12 lg:ps-32 md:px-20 md:py-5 px-4 mb-5 md:mb-0 lg:mt-10 sm:text-center lg:text-start xl:text-[16px] lg:text-[12px] md:text-[14px] text-[12px]">
                            <p className="mb-5">
                                Mở khóa tiềm năng của bạn với nền tảng e-learning tiên tiến của
                                chúng tôi, được thiết kế để thúc đẩy sự nghiệp của bạn và mở rộng
                                kiến thức ở bất kỳ cấp độ nào. Sản phẩm của chúng tôi cung cấp thư
                                viện khóa học phong phú trên nhiều lĩnh vực, cho phép bạn học theo
                                tốc độ và sự tiện lợi của riêng mình. Hưởng lợi từ các hội thảo
                                tương tác, hội thảo do chuyên gia dẫn dắt và các chứng chỉ được công
                                nhận trong ngành.
                            </p>
                            <p>
                                Kết nối với các cố vấn và đồng nghiệp thông qua các tính năng kết
                                nối mạng của chúng tôi, và đặt ra các mục tiêu nghề nghiệp rõ ràng
                                với các lộ trình học tập cá nhân hóa. Luôn đi đầu bằng cách nắm bắt
                                công nghệ mới và trau dồi các kỹ năng thiết yếu như giao tiếp và
                                giải quyết vấn đề. Với sản phẩm e-learning của chúng tôi, bạn có thể
                                đảm bảo sự phát triển và thành công liên tục trong một thị trường
                                việc làm luôn thay đổi.
                            </p>
                        </div>
                        <div className="homeblog-box-content-button xl:ps-40 lg:ps-32 sm:flex sm:justify-center lg:justify-start lg:py-5 px-4 md:text-[10px] lg:text-[12px] xl:text-[16px] text-[12px]">
                            <Link to="/blog">
                                <button className="bg-yellow-400 font-semibold lg:py-3 lg:px-5 md:py-2 md:px-4 px-5 py-2 rounded-full hover:bg-yellow-300 duration-300 ">
                                    Khám phá thêm
                                </button>
                            </Link>

                        </div>
                    </div>
                </div>
            </div>

            <div className="">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger />
                    <DialogContent className="fixed flex justify-center items-center z-50">
                        <div className="bg-white rounded-xl max-w-md w-full p-2 shadow-2xl transform transition-all">
                            <DialogHeader className="space-y-4">
                                {/* Icon chào mừng */}
                                <div className="flex justify-center">
                                    <div className="bg-yellow-100 p-1 rounded-full">
                                        <img src={user?.avatar} className="w-20 rounded-full" alt="" />
                                    </div>
                                </div>

                                <DialogTitle className="text-2xl font-bold text-center space-y-2">
                                    <div className="text-yellow-500">Chào mừng</div>
                                    <div className="text-gray-800 break-words">
                                        {user?.name}
                                    </div>
                                </DialogTitle>

                                <DialogDescription className="text-gray-600 text-center text-lg leading-relaxed">
                                    Chúc mừng bạn đã trở thành một phần của đội ngũ giảng viên của chúng tôi!
                                    <div className="mt-2 text-yellow-600 font-medium">
                                        Hãy bắt đầu hành trình chia sẻ kiến thức của bạn!
                                    </div>
                                </DialogDescription>
                            </DialogHeader>

                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={handleCloseDialog}
                                    className="bg-yellow-500 text-white py-3 px-8 rounded-lg hover:bg-yellow-600 transition duration-300 transform hover:scale-105 font-medium text-lg shadow-md hover:shadow-lg"
                                >
                                    Bắt đầu ngay
                                </button>
                            </div>

                            {/* Decoration elements */}
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-yellow-200 w-24 h-24 rounded-full opacity-20"></div>
                            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 bg-yellow-200 w-16 h-16 rounded-full opacity-20"></div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </>

    )
}

