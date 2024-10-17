import { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { formatCurrency } from "@/components/Formatcurrency/formatCurrency";
import { Skeleton } from "@/components/ui/skeleton";
const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;


export const Home = () => {

    const [topPurchasedProduct, setTopPurchasedProduct] = useState([]);
    const [topViewedProduct, setTopViewedProduct] = useState([]);
    const [categories, setCategories] = useState([]);
    const [productsByCategory, setProductsByCategory] = useState([]);
    const [firstCategories, setFirstCategories] = useState([]);
    const [secondCategories, setSecondCategories] = useState([]);
    const [loading, setLoading] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(null);

    const fetchCategories = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${API_URL}/categories`, {
                headers: {
                    'x-api-secret': `${API_KEY}`,
                },
            });
            const allCategories = response.data;

            setFirstCategories(allCategories.slice(0, 5));
            setSecondCategories(allCategories.slice(5, 8))

            setCategories(allCategories)
        } catch (error) {
            console.log('Error fetching API: ', error)
        } finally {
            setLoading(false);
        }
    }

    const fetchTopPurchasedProduct = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/top-purchased-courses`, {
                headers: {
                    'x-api-secret': `${API_KEY}`,
                },
            });
            setTopPurchasedProduct(response.data);
        } catch (error) {
            console.log('Error fetching API:', error);
        } finally {
            setLoading(false);
        }
    }

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

    const fetchProductByCategory = async (slug) => {
        if (!slug) return;
        setLoading(true)
        try {
            const response = await axios.get(`${API_URL}/categories/${slug}`, {
                headers: {
                    'x-api-secret': `${API_KEY}`,
                },
            });
            setProductsByCategory(response.data);
            setSelectedCategory(slug);
        } catch (error) {
            console.log('Error fetching product by category', error);
            setProductsByCategory([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTopPurchasedProduct();
        fetchTopViewedProduct();
        fetchCategories();
    }, []);

    const renderCategories = (categoryGroup) => {
        return loading ? (
            <div className="flex flex-wrap justify-center items-center">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div className="bg-gray-100 h-10 w-20 rounded-lg animate-pulse mx-2" key={index}></div>
                ))}
            </div>
        ) :
            Array.isArray(categoryGroup) && categoryGroup.length > 0 ? (
                categoryGroup.map((item) => (
                    <button
                        onClick={() => fetchProductByCategory(item.slug)}
                        className={`p-3 rounded-lg duration-300 me-2 ${selectedCategory === item.slug
                                ? 'bg-yellow-400 text-white'
                                : 'bg-gray-100 hover:bg-white hover:border-yellow-400 border'
                            }`}
                        key={item.slug}
                    >
                        <p className="lg:text-base md:text-sm sm:text-xs text-[13px]">{item.name}</p>
                    </button>
                ))
            ) : (
                <p>Không có danh mục phù hợp ngay lúc này, thử lại sau</p>
            );
    };

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
        Array.isArray(topPurchasedProduct) && topPurchasedProduct.length > 0 ? (
            topPurchasedProduct.map((item, index) => (
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
                            <div className="product-box-title xl:text-xl lg:text-xl md:text-base sm:text-lg text-lg font-semibold my-2  line-clamp-2 xl:h-[55px] lg:h-[54px] md:h-[45px]">
                                <span className="lg:pe-5 pe-3">
                                    {`${item.title}`}
                                </span>
                            </div>
                        </Link>

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
                        <div className="product-box-price font-bold xl:text-xl md:text-lg sm:text-lg text-lg">
                            {formatCurrency(item.price_discount)}
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
                            <div className="product-box-title xl:text-xl lg:text-xl md:text-base sm:text-lg text-lg font-semibold my-2  line-clamp-2 xl:h-[55px] lg:h-[54px] md:h-[45px]">
                                <span className="lg:pe-5 pe-3">
                                    {`${item.title}`}
                                </span>
                            </div>
                        </Link>

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
                        <div className="product-box-price font-bold xl:text-xl md:text-lg sm:text-lg text-lg">
                            {formatCurrency(item.price_discount)}
                        </div>
                    </div>
                </div>
            ))
        ) : (
            <p>Không có sản phẩm phù hợp ngay lúc này, thử lại sau</p>
        )

    const renderProductsByCategory = () => {
        return loading ? (
            <div className="flex flex-wrap justify-center items-center">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div className="bg-gray-100 h-20 w-32 rounded-lg animate-pulse mx-2" key={index}></div>
                ))}
            </div>
        ) : Array.isArray(productsByCategory) && productsByCategory.length > 0 ? (
            productsByCategory.map((product, index) => (
                <div className="product-card" key={index}>
                    <Link to={`/detail/${product.slug}`}>
                        <div className="product-card-image">
                            <img src={product.img} alt={product.title} className="rounded-lg h-40 w-full" />
                        </div>
                        <div className="product-card-info">
                            <h3 className="font-semibold text-lg my-2">{product.title}</h3>
                            <p className="text-sm">Price: {formatCurrency(product.price_discount)}</p>
                        </div>
                    </Link>
                </div>
            ))
        ) : (
            // Hiển thị khi không có sản phẩm phù hợp
            <p className="">Không có sản phẩm theo danh mục phù hợp ngay lúc này, thử lại sau.</p>
        );
    };
    return (
        <>
            {/* banner */}
            <div className="banner">
                <div className="banner-box">
                    <div className="" style={{ backgroundImage: "url(./src/assets/images/background-banner.jpg)" }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-2xl mx-auto">
                            <div className="grid-left">
                                <div className="banner-left text-center md:text-left py-24 lg:py-20 lg:ps-10 md:px-5">
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
            <div className="home-page bestquality sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl mx-auto xl:px-3 lg:px-5 px-3 xl:text-left">
                <div className="bestquality-box xl:mt-20 lg:mt-10 sm:mt-2 mt-6">
                    {/* bestseller - title */}
                    <div className="bestquality-box-title xl:mb-10 sm:mb-5 mb-3 lg:text-[46px] md:text-[40px] sm:text-[30px] text-[28px] md:text-left text-center  font-title">
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
                                {renderCategories(firstCategories)}
                            </div>
                        </div>
                        <div className="homecatelog-box-content-row my-3">
                            <div className="homecatelog-box-content-row-main">
                                {renderCategories(secondCategories)}
                            </div>
                        </div>
                    </div>
                    <div className="homecatelog homecatelog-products mt-10">
                        {selectedCategory && ( // Chỉ hiển thị khi có category được chọn
                            <div className="grid md:grid-cols-4 grid-cols-2 gap-3 sm:px-3 md:px-0">
                                {renderProductsByCategory()}
                            </div>
                        )}
                        <div className="homecatelog homecatelog-button text-center">
                            <button className="hover:bg-black hover:text-white duration-300 bg-yellow-500 lg:py-3 lg:px-8 md:px-8 sm:px-7 py-2 px-7 rounded-full font-semibold xl:mt-10 mt-3 lg:text-base md:text-sm sm:text-sm text-[13px]">
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

    )
}

