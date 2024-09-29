function Blog(){
    return(
        <>
            <>
  {/* banner */}
  <section
    className="blog-banner  flex items-center justify-center"
    style={{
      backgroundImage: "url(../public/images/bannerblog.png)",
      width: "100%",
      height: 340,
      objectFit: "cover"
    }}
  >
    <div className="blog-banner-title">
      <h1 className="text-5xl font-title">
        <span className="italic font-title text-yellow-500">Bài viết </span>của
        chúng tôi
      </h1>
    </div>
  </section>
  {/* blog content */}
  <section className="blog-content">
    {/* blog - main */}
    <div className="blog-main xl:max-w-screen-xl mx-auto my-20">
      <div className="grid grid-cols-2 gap-20">
        {/* blog - main -left */}
        <div className="blog-main-left">
          <span className="xl:text-3xl font-bold">
            Hướng dẫn cách lấy nhạc tiktok làm nhạc chuông trong 3 giây
          </span>
          <p className="xl:my-5">
            Nếu bạn chưa biết cách sử dụng nhạc tiktok làm nhạc chuông, đọc ngay
            bài viết này của Edumall để thực hiện nhé!
          </p>
          <div className="flex items-center gap-2">
            <div className="rounded-full">
              <img
                src=".src/assets/images/blog-miniimg.webp"
                className="rounded-full w-12 h-11 object-cover"
                alt=""
              />
            </div>
            <div className="">
              <strong>Antlearn</strong>
              <p>28 tháng 9 2024</p>
            </div>
          </div>
        </div>
        {/* blog - main - right */}
        <div className="blog-main-right">
          <img
            src="../public/images/blog-imgmain.png"
            className="rounded-tl-2xl rounded-tr-2xl"
            alt=""
          />
        </div>
      </div>
    </div>
    {/* blog - list */}
    <div className="blog-list xl:max-w-screen-xl mx-auto mb-32">
      <div className="grid grid-cols-3 gap-5">
        {/* blog - list - content */}
        <div className="blog-list-content mb-5">
          <div className="blog-img">
            <img
              src="../public/images/blog-1.png"
              className="rounded-xl h-[240px] object-cover w-full"
              alt=""
            />
          </div>
          <div className="blog-title">
            <p className="text-xl font-semibold pt-2">
              Hướng dẫn cài đặt lại mật khẩu trên Antlearn
            </p>
          </div>
        </div>
        <div className="blog-list-content mb-5">
          <div className="blog-img">
            <img
              src="../public/images/blog-2.png"
              className="rounded-xl h-[240px] object-cover w-full"
              alt=""
            />
          </div>
          <div className="blog-title">
            <p className="text-xl font-semibold pt-2">
              Hướng dẫn tách ngày tháng năm trong Excel nhanh chóng
            </p>
          </div>
        </div>
        <div className="blog-list-content mb-5">
          <div className="blog-img">
            <img
              src="../public/images/blog-3.jpg"
              className="rounded-xl h-[240px] object-cover w-full"
              alt=""
            />
          </div>
          <div className="blog-title">
            <p className="text-xl font-semibold pt-2">
              Các ký hiệu điện trong bản vẽ autocad bạn cần biết{" "}
            </p>
          </div>
        </div>
        <div className="blog-list-content mb-5">
          <div className="blog-img">
            <img
              src="../public/images/blog-4.png"
              className="rounded-xl h-[240px] object-cover w-full"
              alt=""
            />
          </div>
          <div className="blog-title">
            <p className="text-xl font-semibold pt-2">
              Target là gì trong chứng khoán? Sự tác động của Target đến cổ
              phiếu
            </p>
          </div>
        </div>
        <div className="blog-list-content mb-5">
          <div className="blog-img">
            <img
              src="../public/images/blog-5.png"
              className="rounded-xl h-[240px] object-cover w-full"
              alt=""
            />
          </div>
          <div className="blog-title">
            <p className="text-xl font-semibold pt-2">
              Thiết kế nội thất là gì? Học thiết kế nội thất ở đâu uy tín và
              chất lượng?
            </p>
          </div>
        </div>
        <div className="blog-list-content mb-5">
          <div className="blog-img">
            <img
              src="../public/images/blog-6.jpg"
              className="rounded-xl h-[240px] object-cover w-full"
              alt=""
            />
          </div>
          <div className="blog-title">
            <p className="text-xl font-semibold pt-2">
              Hướng dẫn cách tính chỉ số NPV nhanh nhất trong 3 giây
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</>

        </>
    )
}

export default Blog
