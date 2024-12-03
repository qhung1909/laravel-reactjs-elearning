export const Terms = () => {
    return (
        <>
            {/* banner */}
            <section
                className="blog-banner flex items-center justify-center xl:h-[340px] lg:h-[295px] md:h-[250px] sm:h-[170px] h-[150px] w-full"
                style={{
                    backgroundImage: "url(./src/assets/images/bannerblog.png)",
                    objectFit: "cover"
                }}
            >
                <div className="blog-banner-title">
                    <h1 className="lg:text-6xl md:text-4xl text-3xl font-title">
                        Quy chế<span className="italic font-title text-yellow-500"> Hoạt động</span>
                    </h1>
                </div>
            </section>

            {/* main section */}
            <section className="terms">
                <div className="container mx-auto px-4 py-8">

                    {/* terms */}
                    {/* điều khoản dịch vụ */}
                    <h1 className="text-2xl font-bold mb-6">1.Điều Khoản Dịch Vụ</h1>
                    <p className="text-lg mb-4">Điều khoản sử dụng này (<span className="font-bold">Điều khoản)</span>  được cập nhật lần cuối vào ngày 11 tháng 11, 2024</p>

                    {/* I */}
                    <h2 className="text-xl font-bold mt-4 mb-2">I. Nguyên tắc chung</h2>
                    <p className="mb-4">
                        Sàn giao dịch điện tử <span className="text-yellow-500 font-medium">https://lmsantlearn.tech/</span> (sau đây gọi là Antlearn) hoạt động dưới sự quản lý của Công ty TNHH Công Nghệ Giáo Dục
                        AntLearn Việt Nam (Công ty) và các thành viên trên sàn là thương nhân, tổ chức, cá nhân hợp pháp chính thức nhận và được phép
                        sử dụng dịch vụ do Sàn giao dịch điện tử lmsantlearn.tech cung cấp.
                    </p>

                    {/* II */}
                    <h3 className="text-lg font-bold mt-4 mb-2">II. Quy định chung</h3>
                    <p className="font-bold">Định nghĩa</p>
                    <p className="mb-4">
                        Website thương mại điện tử: Sàn giao dịch TMĐT lmsantlearn.tech do Công ty TNHH Công Nghệ Giáo Dục Antlearn Việt Nam phát triển và
                        vận hành.
                    </p>

                    <ul className="list-disc pl-5 mb-4 font-normal">
                        <li><strong>Tên giao dịch:</strong> Công ty TNHH Công Nghệ Giáo Dục Antlearn Việt Nam</li>
                        <li><strong>Khóa đào tạo trực tuyến:</strong> Tập hợp các bài giảng phát triển tiền theo mô hình trực tuyến.</li>
                        <li><strong>Giá bán (Phí dịch vụ):</strong> Chi phí khi khách hàng trả phí khóa đào tạo trực tuyến có thể được Antlearn cung cấp.</li>
                        <li><strong>Giám viên/ Đối tác:</strong> Các cá nhân, tổ chức tổ chức các khóa đào tạo trực tuyến hoặc quản lý khóa học.</li>
                    </ul>

                    <p className="font-bold">Quyền và nghĩa vụ</p>
                    <ul className="list-disc pl-5 mb-4">
                        <li><strong>Đối tác sản xuất nội dung:</strong> Các bên, nhà cung cấp khóa học trực tuyến phải tuân thủ các điều khoản.</li>
                        <li><strong>Người học/Khách hàng:</strong> Người học có quyền tham gia khóa học và/hoặc đăng ký trực tuyến qua website của Antlearn.</li>
                        <li><strong>Quyền truy cập khóa đào tạo trực tuyến:</strong> Người học có quyền đăng nhập vào hệ thống.</li>
                    </ul>


                    {/* quy định chung */}
                    <h2 className="text-xl font-semibold mt-4 mb-2">2. Nguyên tắc chung</h2>
                    <p className="mb-4">
                        Sàn thương mại điện tử lmsantlearn.tech thuộc sở hữu và quản lý của Công ty TNHH Công Nghệ Giáo Dục Antlearn Việt Nam.
                    </p>
                    <p className="mb-4">
                        Hoạt động của sàn giao dịch thương mại điện tử lmsantlearn.tech tuân thủ các quy định của pháp luật Việt Nam và các quy định liên quan.
                    </p>

                    <h3 className="font-bold text-lg mt-4">III. Quy trình giao dịch</h3>
                    <h4 className="font-bold mt-2">1. Quy trình dành cho Người học/Người mua hàng</h4>
                    <div className="list-disc pl-5 mb-4 space-y-5 text-lg">
                        <strong>Bước 1:</strong> Truy cập vào Website lmsantlearn.tech và lựa chọn các khóa học
                        <img src="/src/assets/images/termimage.png" className="w-full" alt="" />
                        <strong>Bước 2:</strong> Đăng nhập với tài khoản email và mật khẩu đã tạo trên Antlearn
                        <img src="/src/assets/images/termimage3.png" alt="" />
                        <strong>Bước 3:</strong> Lựa chọn Khóa học theo nhu cầu. Màn hình hiển thị thông tin về Khóa học. Nhấn vào nút Thêm vào giỏ hàng trên màn hình.
                        <img src="/src/assets/images/termimage2.png" className="w-full" alt="" />
                        <strong>Bước 4:</strong> Xem lại những bài học bạn muốn mua trong giỏ hàng và nhấn Thanh toán khi hoàn thành
                        <img src="/src/assets/images/termimage4.png" alt="" />
                        <strong>Bước 5:</strong> Chọn ngân hàng muốn thanh toán, hoàn tất thủ tục thanh toán.
                        <img src="/src/assets/images/termimage5.png" alt="" />
                        <strong>Bước 6:</strong> Hoàn thành mua hàng khi có thông báo thanh toán thành công

                    </div>


                </div>
            </section>
        </>
    )
}
