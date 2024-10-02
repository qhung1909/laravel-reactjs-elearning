import { useState, useEffect } from "react";
import axios from 'axios';
const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;


export const Home = () => {
    const [topPurchasedProduct, setTopPurchasedProduct] = useState([]);
    const [topViewedProduct, setTopViewedProduct] = useState([]);
    const fetchTopPurchasedProduct = async () => {
        try {
            const response = await axios.get(`${API_URL}/top-purchased-courses`, {
                headers: {
                    'x-api-secret': `${API_KEY}`,
                },
            });
            setTopPurchasedProduct(response.data);
        } catch (error) {
            console.log('Error fetching API:', error);
        }
    }

    const fetchTopViewedProduct = async () => {
        try {
            const response = await axios.get(`${API_URL}/top-viewed-courses`, {
                headers: {
                    'x-api-secret': `${API_KEY}`,
                },
            });

            setTopViewedProduct(response.data);
        } catch (error) {
            console.log('Error fetching API', error);
        }
    }

    useEffect(() => {
        fetchTopPurchasedProduct();
        fetchTopViewedProduct();
    }, []);


    const purchasedProduct = Array.isArray(topPurchasedProduct) && topPurchasedProduct.length > 0 ? (
        topPurchasedProduct.map((item, index) => (
            <div className="product md:mb-10 xl:mb-0 text-center md:text-left" key={index}>
                <div className="product-box">
                    <div className="product-box-img xl:h-[200px] lg:h-[150px] md:h-[135px] sm:h-[180px] h-[150px] flex justify-center items-center">
                        <img
                            src={`/src/assets/images/${item.img}`}
                            alt=""
                            className="rounded-xl h-full sm:w-full md:h-full w-80"
                        />
                    </div>
                    <div className="product-box-title xl:text-xl lg:text-xl md:text-base sm:text-lg text-lg font-semibold my-2  line-clamp-2 xl:h-[55px] lg:h-[54px] md:h-[45px]">
                        <span className="lg:pe-5 pe-3">
                            {`${item.title}`}
                        </span>
                    </div>
                    <div className="product-box-author font-mediummy-1 md:text-base text-sm md:block hidden">
                        <p>Bởi: Huy Hoàng</p>
                    </div>
                    <div className="product-box-time-lesson md:text-sm sm:text-[15px] text-[14px] flex justify-center md:justify-start gap-4 my-1 ">
                        <div className="product-box-time">
                            <p>35 bài học</p>
                        </div>
                        <div className="product-box-lesson hidden sm:block">
                            <p>7 giờ kém 10</p>
                        </div>
                    </div>
                    <div className="product-box-price font-bold xl:text-xl md:text-lg sm:text-xl text-lg">
                        <span>đ1,990,000</span>
                    </div>
                </div>
            </div>
        ))
    ) : (
        <p>No products available</p>
    );

    const viewedProduct = Array.isArray(topViewedProduct) && topViewedProduct.length > 0 ? (
        topViewedProduct.map((item, index) => (
            <div className="product md:mb-10 xl:mb-0 text-center md:text-left" key={index}>
                <div className="product-box">
                    <div className="product-box-img xl:h-[200px] lg:h-[150px] md:h-[135px] sm:h-[180px] h-[150px] flex justify-center items-center">
                        <img
                            src={`/src/assets/images/${item.img}`}
                            alt=""
                            className="rounded-xl h-full sm:w-full md:h-full w-80"
                        />
                    </div>
                    <div className="product-box-title xl:text-xl lg:text-xl md:text-base sm:text-lg text-lg font-semibold my-2  line-clamp-2 xl:h-[55px] lg:h-[54px] md:h-[45px]">
                        <span className="lg:pe-5 pe-3">
                            {`${item.title}`}
                        </span>
                    </div>
                    <div className="product-box-author font-mediummy-1 md:text-base text-sm md:block hidden">
                        <p>Bởi: Huy Hoàng</p>
                    </div>
                    <div className="product-box-time-lesson md:text-sm sm:text-[15px] text-[14px] flex justify-center md:justify-start gap-4 my-1 ">
                        <div className="product-box-time">
                            <p>35 bài học</p>
                        </div>
                        <div className="product-box-lesson hidden sm:block">
                            <p>7 giờ kém 10</p>
                        </div>
                    </div>
                    <div className="product-box-price font-bold xl:text-xl md:text-lg sm:text-xl text-lg">
                        <span>đ1,990,000</span>
                    </div>
                </div>
            </div>
        ))
    ): (
            <p>No products available</p>

    )
return (
    <>
        <>
            {/* banner */}
            <div className="banner">
                <div className="banner-box">
                    <div className="" style={{ backgroundImage: "url(./src/assets/images/background-banner.jpg)" }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-2xl mx-auto">
                            <div className="grid-left">
                                <div className="banner-left text-center md:text-left py-24 lg:py-20 lg:ps-10 ">
                                    <div className="banner-left-heading  max-lg:flex items-center justify-center md:justify-start">
                                        <p className="flex font-semibold items-center border rounded-full border-yellow-400 xl:w-44 lg:w-40 px-2 py-1 xl:text-base lg:text-sm md:text-xs sm:text-sm text-xs">
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
                                    <div className="banner-left-content lg:px-0 xl:text-base lg:text-sm md:text-xs sm:text-sm text-[12px] my-5 sm:px-32 px-24 md:px-0">
                                        <p>
                                            Cùng tìm hiểu các chiến lược tiên tiến để tối ưu quá trình học,
                                            nâng cao kỹ năng, đạt được thành công nhanh chóng trong sự
                                            nghiệp của bạn
                                        </p>
                                    </div>
                                    <div className="banner-left-button">
                                        <a href="">
                                            <button className="bg-yellow-500 xl:mt-10 xl:px-5 xl:py-3 md:font-bold rounded-full xl:text-xl lg:text-base md:text-sm sm:text-base text-[14px] font-semibold mt-4 p-2 px-4">
                                                Khám phá khóa học
                                            </button>
                                        </a>
                                    </div>
                                </div>

                            </div>
                            <div className="md:flex items-center justify-center hidden md:block">
                                <img src="./src/assets/images/banner-right.png" alt="" className="" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            {/* Thân trang - sản phẩm được mua nhiều */}
            <div className="home-page bestseller sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl mx-auto xl:px-3 lg:px-5 px-3 xl:text-left">
                <div className="bestseller-box lg:mt-20 md:mt-14 sm:mt-10 mt-6">
                    {/* bestseller - title */}
                    <div className="bestseller-box-title xl:mb-10 sm:mb-5 mb-3 xl:text-[46px] lg:text-[36px] sm:text-[30px] text-[25px] md:text-left text-center font-title ">
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
            <div className="home-page bestquality sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl mx-auto xl:px-3 lg:px-5 px-3 xl:text-left">
                <div className="bestquality-box xl:mt-20 lg:mt-10 sm:mt-2 mt-6">
                    {/* bestseller - title */}
                    <div className="bestquality-box-title xl:mb-10 sm:mb-5 mb-3 xl:text-[46px] lg:text-[36px] sm:text-[30px] text-[25px] md:text-left text-center  font-title">
                        <h4>
                            Các khóa học{" "}
                            <span className="italic font-semibold text-yellow-400">
                                chất lượng cao
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
            {/* Thân trang - một liều cảm hứng catelog */}
            <div className="home-page homecatelog max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl mx-auto text-center">
                <div className="homecatelog-box mt-20">
                    <div className="homecatelog-box-title text-[46px]">
                        <h2>
                            Một liều{" "}
                            <span className="text-yellow-400 italic font-semibold">cảm hứng</span>
                            ,
                        </h2>
                        <h2>bất cứ khi nào bạn cần.</h2>
                    </div>
                    <div className="homecatelog-box-content mt-10">
                        <div className="homecatelog-box-content-row">
                            <div className="homecatelog-box-content-row-main">
                                <button className="bg-gray-100 p-3 rounded-lg hover:bg-white border hover:border-yellow-400 duration-300 me-2">
                                    Danh mục
                                </button>
                                <button className="bg-gray-100 p-3 rounded-lg hover:bg-white border hover:border-yellow-400 duration-300 me-2">
                                    Danh mục
                                </button>
                                <button className="bg-gray-100 p-3 rounded-lg hover:bg-white border hover:border-yellow-400 duration-300 me-2">
                                    Danh mục
                                </button>
                                <button className="bg-gray-100 p-3 rounded-lg hover:bg-white border hover:border-yellow-400 duration-300 me-2">
                                    Danh mục
                                </button>
                                <button className="bg-gray-100 p-3 rounded-lg hover:bg-white border hover:border-yellow-400 duration-300">
                                    Danh mục
                                </button>
                            </div>
                        </div>
                        <div className="homecatelog-box-content-row">
                            <div className="homecatelog-box-content-row-main">
                                <button className="bg-gray-100 p-3 rounded-lg hover:bg-white border hover:border-yellow-400 duration-300 my-2 me-2">
                                    Danh mục
                                </button>
                                <button className="bg-gray-100 p-3 rounded-lg hover:bg-white border hover:border-yellow-400 duration-300 my-2 me-2">
                                    Danh mục
                                </button>
                                <button className="bg-gray-100 p-3 rounded-lg hover:bg-white border hover:border-yellow-400 duration-300 my-2 me-2">
                                    Danh mục
                                </button>
                                <button className="bg-gray-100 p-3 rounded-lg hover:bg-white border hover:border-yellow-400 duration-300 my-2 me-2">
                                    Danh mục
                                </button>
                            </div>
                        </div>
                        <div className="homecatelog-box-content-row">
                            <div className="homecatelog-box-content-row-main">
                                <button className="bg-gray-100 p-3 rounded-lg hover:bg-white border hover:border-yellow-400 duration-300 mb-2 me-2">
                                    Danh mục
                                </button>
                                <button className="bg-gray-100 p-3 rounded-lg hover:bg-white border hover:border-yellow-400 duration-300 mb-2 me-2">
                                    Danh mục
                                </button>
                                <button className="bg-gray-100 p-3 rounded-lg hover:bg-white border hover:border-yellow-400 duration-300 mb-2 me-2">
                                    Danh mục
                                </button>
                            </div>
                        </div>
                        <div className="homecatelog-box-content-row">
                            <div className="homecatelog-box-content-row-main">
                                <button className="bg-gray-100 p-3 rounded-lg hover:bg-white border hover:border-yellow-400 duration-300 me-2">
                                    Danh mục
                                </button>
                                <button className="bg-gray-100 p-3 rounded-lg hover:bg-white border hover:border-yellow-400 duration-300 me-2">
                                    Danh mục
                                </button>
                                <button className="bg-gray-100 p-3 rounded-lg hover:bg-white border hover:border-yellow-400 duration-300 me-2">
                                    Danh mục
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="homecatelog homecatelog-products mt-10 ">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 text-center xl:text-left">
                            {/* box sản phẩm */}
                            <div className="product md:mb-10 xl:mb-0">
                                <div className="product-box">
                                    <div className="product-box-img ">
                                        <img
                                            src="./src/assets/images/productimgtest.png"
                                            alt=""
                                            className="object-cover w-[100%] rounded-xl"
                                        />
                                    </div>
                                    <div className="product-box-title text-lg xl:text-xl font-semibold my-2">
                                        <span>
                                            React Ultimate - React.JS Cơ Bản Từ Z Đến A Cho Beginners
                                        </span>
                                    </div>
                                    <div className="product-box-author text-lg font-semibold my-1 xl:text-base">
                                        <p>Bởi: Huy Hoàng</p>
                                    </div>
                                    <div className="product-box-time-lesson text-lg xl:text-sm flex justify-center xl:justify-start gap-4 my-1">
                                        <div className="product-box-time">
                                            <p>35 bài học</p>
                                        </div>
                                        <div className="product-box-lesson">
                                            <p>7 giờ kém 10</p>
                                        </div>
                                    </div>
                                    <div className="product-box-price font-semibold text-xl">
                                        <span>đ1,990,000</span>
                                    </div>
                                </div>
                            </div>
                            <div className="product md:mb-10 xl:mb-0">
                                <div className="product-box">
                                    <div className="product-box-img ">
                                        <img
                                            src="./src/assets/images/productimgtest.png"
                                            alt=""
                                            className="object-cover w-[100%] rounded-xl"
                                        />
                                    </div>
                                    <div className="product-box-title text-lg xl:text-xl font-semibold my-2">
                                        <span>
                                            React Ultimate - React.JS Cơ Bản Từ Z Đến A Cho Beginners
                                        </span>
                                    </div>
                                    <div className="product-box-author text-lg font-semibold my-1 xl:text-base">
                                        <p>Bởi: Huy Hoàng</p>
                                    </div>
                                    <div className="product-box-time-lesson text-lg xl:text-sm flex justify-center xl:justify-start gap-4 my-1">
                                        <div className="product-box-time">
                                            <p>35 bài học</p>
                                        </div>
                                        <div className="product-box-lesson">
                                            <p>7 giờ kém 10</p>
                                        </div>
                                    </div>
                                    <div className="product-box-price font-semibold text-xl">
                                        <span>đ1,990,000</span>
                                    </div>
                                </div>
                            </div>
                            <div className="product md:mb-10 xl:mb-0">
                                <div className="product-box">
                                    <div className="product-box-img ">
                                        <img
                                            src="./src/assets/images/productimgtest.png"
                                            alt=""
                                            className="object-cover w-[100%] rounded-xl"
                                        />
                                    </div>
                                    <div className="product-box-title text-lg xl:text-xl font-semibold my-2">
                                        <span>
                                            React Ultimate - React.JS Cơ Bản Từ Z Đến A Cho Beginners
                                        </span>
                                    </div>
                                    <div className="product-box-author text-lg font-semibold my-1 xl:text-base">
                                        <p>Bởi: Huy Hoàng</p>
                                    </div>
                                    <div className="product-box-time-lesson text-lg xl:text-sm flex justify-center xl:justify-start gap-4 my-1">
                                        <div className="product-box-time">
                                            <p>35 bài học</p>
                                        </div>
                                        <div className="product-box-lesson">
                                            <p>7 giờ kém 10</p>
                                        </div>
                                    </div>
                                    <div className="product-box-price font-semibold text-xl">
                                        <span>đ1,990,000</span>
                                    </div>
                                </div>
                            </div>
                            <div className="product md:mb-10 xl:mb-0">
                                <div className="product-box">
                                    <div className="product-box-img ">
                                        <img
                                            src="./src/assets/images/productimgtest.png"
                                            alt=""
                                            className="object-cover w-[100%] rounded-xl"
                                        />
                                    </div>
                                    <div className="product-box-title text-xl lg:text-lg xl:text-xl font-semibold my-2">
                                        <span>
                                            React Ultimate - React.JS Cơ Bản Từ Z Đến A Cho Beginners
                                        </span>
                                    </div>
                                    <div className="product-box-author text-lg font-semibold my-1 xl:text-base">
                                        <p>Bởi: Huy Hoàng</p>
                                    </div>
                                    <div className="product-box-time-lesson text-lg xl:text-sm flex justify-center xl:justify-start gap-4 my-1">
                                        <div className="product-box-time">
                                            <p>35 bài học</p>
                                        </div>
                                        <div className="product-box-lesson">
                                            <p>7 giờ kém 10</p>
                                        </div>
                                    </div>
                                    <div className="product-box-price font-semibold text-xl">
                                        <span>đ1,990,000</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="homecatelog homecatelog-button">
                            <button className="bg-yellow-500 py-3 px-6 rounded-full font-semibold mt-10 ">
                                Xem thêm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Thân trang - blog */}
            <div className="home-page homeblog xl:max-w-screen-xl lg:max-w-screen-lg mx-auto py-5">
                <div className="homeblog-box grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <div className="homeblog-box-img">
                        <div className="homeblog-box-img-main relative md:flex md:justify-center">
                            <img src="./src/assets/images/homepage-blog.png" alt="" />
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
                            <button className="bg-yellow-400 font-semibold lg:py-3 lg:px-5 md:py-2 md:px-4 px-5 py-2 rounded-full hover:bg-yellow-300 duration-300 ">
                                Khám phá thêm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>

    </>
)
}

