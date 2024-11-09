import { Link } from "react-router-dom"

export const Footer = () => {
    return (
        <>
            <footer className="bg-gray-100 h-auto rounded-tl-[70px] rounded-tr-[70px]">
                <section className="max-w-screen-xl mx-auto py-10 px-5">
                    <div className="lg:grid grid-cols-3">

                        {/* grid - left */}
                        <div className="col-span-1">
                            {/* <div className="footer-start ">

                            </div> */}
                            <img
                                src="/src/assets/images/antlearn.png"
                                alt=""
                                className="w-20 md:w-32 mb-5"
                            />
                            <a href="https://www.facebook.com/profile.php?id=100079303916866">
                                <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/faecbooklogo.svg" className="w-7" alt="" />
                            </a>
                        </div>

                        {/* grid - right */}
                        <div className="md:flex col-span-2 lg:justify-between gap-5 md:ps-0 mt-5 lg:mt-0">
                            <div className="flex items-start gap-5 xl:w-2/3 md:w-2/5">
                                {/* thẻ 1 */}
                                <div className="footer-mid-left md:w-1/3 sm:w-1/4 w-1/3">
                                    <span className="font-semibold text-[#344054] text-[14px]">
                                        Sản phẩm
                                    </span>
                                    <ul className="mt-2">
                                        <li className="md:text-[16px] font-semibold text-[16px] md:leading-9 sm:leading-7 leading-loose "><Link to='/courses'>Khóa học</Link></li>
                                        <li className="md:text-[16px] font-semibold text-[16px] md:leading-9 sm:leading-7 leading-loose"><Link to='/blog'>Bài viết</Link></li>
                                        <li className="md:text-[16px] font-semibold text-[16px] md:leading-9 sm:leading-7 leading-loose"><Link to='/contact'>Liên hệ</Link></li>
                                    </ul>
                                </div>

                                {/* thẻ 2 */}
                                <div className="footer-mid-right">
                                    <span className="font-semibold text-[#344074] text-[14px]">
                                        Chính sách chung & Hỗ trợ
                                    </span>
                                    <ul className="mt-2">
                                        {/* term */}
                                        <Link to="/terms">
                                            <li className="md:text-[16px] font-semibold text-[16px] md:leading-9sm:leading-7 leading-loose">Điều khoản dịch vụ</li>
                                        </Link>
                                        {/* blog */}
                                        {/* <Link to="/blog">
                                            <li className="md:text-[16px] font-semibold text-[16px] md:leading-9sm:leading-7 leading-loose">Bài viết</li>
                                        </Link> */}
                                        {/* about us */}
                                        <Link to="/aboutus">
                                            <li className="md:text-[16px] font-semibold text-[16px] md:leading-9sm:leading-7 leading-loose">Về chúng tôi</li>
                                        </Link>
                                    </ul>
                                </div>
                            </div>

                            {/* thẻ 3 */}
                            <div className="footer-end  mt-5 md:mt-0">
                                {/* <div className="">
                                <div className="footer-end-head">
                                    <p className="text-[#344054] font-semibold lg:mb-3 text-[14px]">
                                        Nhận cập nhật mới nhất
                                    </p>
                                </div>
                                <div className="footer-end-mid lg:flex-row sm:flex-col flex gap-2 md:gap-0 mb-2 md:mb-0 md:mt-3 sm:mt-5 lg:mt-0 mt-1">
                                    <input
                                        type="text"
                                        placeholder="Email"
                                        className="px-2 xl:py-3 border lg:py-3 sm:py-2 py-2 xl:w-[250px] lg:w-[230px] md:w-[300px] sm:w-[300px] w-[200px]  rounded-xl text-[14px]"
                                    />
                                    <button className=" bg-yellow-400 lg:px-4 rounded-xl py-1 sm:py-2 px-2 sm:w-[300px] lg:w-24 lg:ms-3 ms-0 lg:my-0 md:my-2 my-0 font-semibold text-[14px] md:px-[8px]">
                                        Đăng ký
                                    </button>
                                </div>
                                <div className="hotline md:mt-3 mt-3 md:text-[16px] font-semibold text-[16px]">
                                    <p>Đường dây nóng: 0123 456 789</p>
                                </div>
                                </div> */}
                                <div className="">
                                    <span className="font-semibold text-[#344074] text-[14px]">
                                        Ngôn ngữ
                                    </span>
                                    <div className="border border-gray-400 rounded-sm mt-3 md:w-full w-36">
                                        <div className="flex items-center gap-3 py-1 px-4 ">
                                            <div className="">
                                                <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/language.svg" className="w-6" alt="" />
                                            </div>
                                            <div className="">
                                                Tiếng Việt
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>
                </section>
                <div className="bg-gray-100 text-center py-4">
                    <p className="text-gray-600 text-sm">
                        © {new Date().getFullYear()} Nhóm 4 - Dự án tốt nghiệp website Antlearn.
                    </p>
                </div>
            </footer>
        </>
    )
}

