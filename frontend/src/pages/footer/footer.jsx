function Footer() {
    return (
        <>
            <footer className="bg-gray-200 h-auto lg:rounded-tl-[100px] lg:rounded-tr-[100px] md:rounded-tl-[50px] md:rounded-tr-[50px] rounded-tl-[50px] rounded-tr-[50px] md:py-5 lg:px-8 xl:px-0 mx-auto">
                <section className="xl:max-w-screen-2xl lg:max-w-screen-lg mx-auto pt-[50px] lg:px-10 md:px-10">
                    <div className="grid grid-cols-5 ">

                        {/* start */}
                        <div className="footer-start ">
                            <img
                                src="./src/assets/images/antlearn.png"
                                alt=""
                                className="w-52  md:w-60 md:ml-[-50px] md:mt-[-30px]"
                            />
                        </div>

                        {/* mid-left */}
                        <div className="footer-mid-left">
                            <span className="font-semibold  text-[#344054] xl:text-[18px] lg:text-[12px] md:text-[12px] sm:text-[10px] text-[9px]">
                                Sản phẩm
                            </span>
                            <ul className="">

                                <li className="font-medium text-base xl:leading-10 lg:leading-8 xl:text-[18px] lg:text-[13px] md:text-[11px] sm:text-[] text-[8px] md:leading-7 leading-5">Khóa học</li>
                                <li className="font-medium text-base xl:leading-10 lg:leading-8 xl:text-[18px] lg:text-[13px] md:text-[11px] sm:text-[] text-[8px] md:leading-7 leading-5">Bài viết</li>
                                <li className="font-medium text-base xl:leading-10 lg:leading-8 xl:text-[18px] lg:text-[13px] md:text-[11px] sm:text-[] text-[8px] md:leading-7 leading-5">Liên hệ</li>
                            </ul>
                        </div>

                        {/* mid-right */}
                        <div className="footer-mid-right ">
                            <span className="font-semibold text-[#344054]   lg:text-[12px]  xl:text-[18px] md:text-[11px] sm:text-[10px] text-[9px] ">
                                Chính sách chung & Hỗ trợ
                            </span>
                            <ul className="">
                                <li className="font-medium text-base xl:leading-10 lg:leading-8 xl:text-[18px] lg:text-[12px] md:text-[10px] sm:text-[] text-[8px] md:leading-7 leading-5">Điều khoản dịch vụ</li>
                                <li className="font-medium text-base xl:leading-10 lg:leading-8 xl:text-[18px] lg:text-[12px] md:text-[10px] sm:text-[] text-[8px] md:leading-7 leading-5">Bài viết</li>
                                <li className="font-medium text-base xl:leading-10 lg:leading-8 xl:text-[18px] lg:text-[12px] md:text-[10px] sm:text-[] text-[8px] md:leading-7 leading-5">Chính sách bảo mật thông tin</li>
                            </ul>
                        </div>

                        {/* end */}
                        <div className="footer-end col-span-2 md:ps-[20px] xl:ps-[0px]">
                            <div className="footer-end-head mt-2 md:mt-1 xl:mt-0 md:mb-3 mb-2 lg:mb-0">
                                <p className="text-[#344054] font-semibold lg:mb-3 xl:text-[18px] lg:text-[12px] md:text-[12px] sm:text-[10px] text-[9px]">
                                    Nhận cập nhật mới nhất
                                </p>
                            </div>
                            <div className="footer-end-mid flex gap-2 mb-2 md:mb-0">
                                <input
                                    type="text"
                                    placeholder="Email"
                                    className="px-2 xl:py-4 lg:py-3 py-2 xl:w-[250px] lg:w-[230px] md:w-[150px] sm:w-[px] w-[120px] rounded-xl lg:text-[14px] md:text-[8px] text-[7px]"
                                />
                                <button className="bg-yellow-400  lg:px-3 rounded-xl py-1 md:py-2 px-2 md:ms-3 font-semibold lg:text-[14px] xl:text-[12px] md:text-[8px] md:px-[8px] text-[7px]  ">
                                    Đăng ký
                                </button>
                            </div>
                            <div className="hotline md:mt-5 mt-1 font-semibold xl:text-[18px] lg:text-[12px] md:text-[10px] text-[8px]">
                                <p>Đường dây nóng: 0123 456 789</p>
                            </div>
                        </div>

                    </div>
                </section>
            </footer>

        </>
    )
}

export default Footer
