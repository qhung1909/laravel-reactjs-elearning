export const Footer = () => {
    return (
        <>
            {/* <footer className="bg-gray-100 h-auto lg:rounded-tl-[100px] lg:rounded-tr-[100px] md:rounded-tl-[50px] md:rounded-tr-[50px] rounded-tl-[50px] rounded-tr-[50px] md:py-5 lg:px-8 xl:px-0 mx-auto">
                <section className="xl:max-w-screen-2xl lg:max-w-screen-lg mx-auto pt-[50px] lg:px-10 md:px-10">
                    <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 ">

                        <div className="footer-start ">
                            <img
                                src="./src/assets/images/antlearn.png"
                                alt=""
                                className="w-52  md:w-60 md:ml-[-50px] md:mt-[-30px]"
                            />
                        </div>

                        <div className="footer-mid-left">
                            <span className="font-semibold text-[#344054] xl:text-[18px] lg:text-[14px] md:text-[14px] sm:text-[12px] text-[10px]">
                                Sản phẩm
                            </span>
                            <ul className="">

                                <li className=" xl:leading-10 lg:leading-8 xl:text-[18px] lg:text-[17px] md:text-[15px] sm:text-[13px] text-[9px] md:leading-7 sm:leading-5 leading-loose ">Khóa học</li>
                                <li className=" xl:leading-10 lg:leading-8 xl:text-[18px] lg:text-[17px] md:text-[15px] sm:text-[13px] text-[9px] md:leading-7 sm:leading-5 leading-loose">Bài viết</li>
                                <li className=" xl:leading-10 lg:leading-8 xl:text-[18px] lg:text-[17px] md:text-[15px] sm:text-[13px] text-[9px] md:leading-7 sm:leading-5 leading-loose">Liên hệ</li>
                            </ul>
                        </div>

                        <div className="footer-mid-right ">
                            <span className="font-semibold text-[#344054] xl:text-[18px] lg:text-[14px] md:text-[14px] sm:text-[15px] text-[10px] ">
                                Chính sách chung & Hỗ trợ
                            </span>
                            <ul className="">
                                <li className=" xl:leading-10 lg:leading-8 xl:text-[18px] lg:text-[17px] md:text-[15px] sm:text-[13px] text-[9px] md:leading-7 sm:leading-5 leading-loose">Điều khoản dịch vụ</li>
                                <li className=" xl:leading-10 lg:leading-8 xl:text-[18px] lg:text-[17px] md:text-[15px] sm:text-[13px] text-[9px] md:leading-7 sm:leading-5 leading-loose">Bài viết</li>
                                <li className=" xl:leading-10 lg:leading-8 xl:text-[18px] lg:text-[17px] md:text-[15px] sm:text-[13px] text-[9px] md:leading-7 sm:leading-5 leading-loose">Chính sách bảo mật thông tin</li>
                            </ul>
                        </div>

                        <div className="footer-end  ps-[10px] md:ps-[20px] xl:ps-[0px] mt-2 sm:mt-1 md:mt-0">
                            <div className="footer-end-head">
                                <p className="text-[#344054] font-semibold lg:mb-3 xl:text-[18px] lg:text-[14px] md:text-[14px] sm:text-[15px] text-[10px]">
                                    Nhận cập nhật mới nhất
                                </p>
                            </div>
                            <div className="footer-end-mid flex gap-2 md:gap-0 mb-2 md:mb-0 md:mt-3 sm:mt-2 lg:mt-0 mt-1">
                                <input
                                    type="text"
                                    placeholder="Email"
                                    className="px-2 xl:py-4 lg:py-3 sm:py-2 py-2 xl:w-[350px] lg:w-[230px] md:w-[180px] sm:w-[150px] w-[130px]  rounded-xl lg:text-[14px] md:text-[8px] text-[7px]"
                                />
                                <button className="bg-yellow-400  lg:px-3 rounded-xl py-1 md:py-2 px-2 md:ms-3 font-semibold lg:text-[14px] xl:text-[20px] md:text-[8px] md:px-[8px] text-[7px] ">
                                    Đăng ký
                                </button>
                            </div>
                            <div className="hotline md:mt-3 mt-1  xl:text-[18px] lg:text-[15px] md:text-[15px] sm:text-[13px] text-[9px]">
                                <p>Đường dây nóng: 0123 456 789</p>
                            </div>
                        </div>

                    </div>
                </section>
            </footer> */}
            <footer className="bg-gray-100 h-auto rounded-tl-[70px] rounded-tr-[70px]">
                <section className="max-w-screen-xl mx-auto py-10 px-5">
                    <div className="lg:grid grid-cols-3">

                        {/* grid - left */}
                        <div className="col-span-1">
                            {/* <div className="footer-start ">

                            </div> */}
                            <img
                                src="./src/assets/images/antlearn.png"
                                alt=""
                                className="w-20 md:w-32 "
                            />
                        </div>

                        {/* grid - right */}
                        <div className="md:flex col-span-2 lg:justify-between gap-5 md:ps-0 mt-5 lg:mt-0">
                            <div className="flex items-start gap-5 lg:w-2/3 md:w-2/5">
                                {/* thẻ 1 */}
                                <div className="footer-mid-left md:w-1/3 sm:w-1/5">
                                    <span className="font-semibold text-[#344054] text-[14px]">
                                        Sản phẩm
                                    </span>
                                    <ul className="mt-2">
                                        <li className="md:text-[16px] font-semibold text-[16px] md:leading-9 sm:leading-7 leading-loose ">Khóa học</li>
                                        <li className="md:text-[16px] font-semibold text-[16px] md:leading-9 sm:leading-7 leading-loose">Bài viết</li>
                                        <li className="md:text-[16px] font-semibold text-[16px] md:leading-9 sm:leading-7 leading-loose">Liên hệ</li>
                                    </ul>
                                </div>

                                {/* thẻ 2 */}
                                <div className="footer-mid-right">
                                    <span className="font-semibold text-[#344074] text-[14px]">
                                        Chính sách chung & Hỗ trợ
                                    </span>
                                    <ul className="mt-2">
                                        <li className="md:text-[16px] font-semibold text-[16px] md:leading-9sm:leading-7 leading-loose">Điều khoản dịch vụ</li>
                                        <li className="md:text-[16px] font-semibold text-[16px] md:leading-9sm:leading-7 leading-loose">Bài viết</li>
                                        <li className="md:text-[16px] font-semibold text-[16px] md:leading-9sm:leading-7 leading-loose">Chính sách bảo mật thông tin</li>
                                    </ul>
                                </div>
                            </div>

                            {/* thẻ 3 */}
                            <div className="footer-end  mt-5 md:mt-0">
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
                                    <button className=" font-semibold bg-yellow-400 lg:px-4 rounded-xl py-1 sm:py-2 px-2 sm:w-[300px] md:w-auto lg:ms-3 ms-0 lg:my-0 md:my-2 my-0 font-semiboldtext-[14px] md:px-[8px]">
                                        Đăng ký
                                    </button>
                                </div>
                                <div className="hotline md:mt-3 mt-3 md:text-[16px] font-semibold text-[16px]">
                                    <p>Đường dây nóng: 0123 456 789</p>
                                </div>
                            </div>

                        </div>

                    </div>
                </section>
            </footer>
        </>
    )
}

