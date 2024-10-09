export const Contact = () =>{
    return(
        <>
            <>
  {/* banner */}
  <section
    className="blog-banner  flex items-center justify-center xl:h-[340px] lg:h-[295px] md:h-[250px] sm:h-[170px] h-[150px] w-full"
    style={{
      backgroundImage: "url(./src/assets/images/bannerblog.png)",
      objectFit: "cover"
    }}
  >
    <div className="blog-banner-title">
      <h1 className=" lg:text-5xl  sm:text-4xl text-2xl font-title text-center">
        Liên hệ với
        <span className="italic font-title text-yellow-500"> chúng tôi</span>
      </h1>
      <p className="lg:w-[500px] md:w-[400px] sm:w-[350px] w-[350px] text-center xl:text-lg lg:text-base md:text-sm text-xs font-medium lg:mt-3 md:mt-4 sm:mt-3 mt-2 leading-5">
        Bạn có thắc mắc, gợi ý, hoặc tìm hiểu giải pháp thông minh? Liên hệ với
        chúng tôi!
      </p>
    </div>
  </section>
  {/* contact content */}
  <section className="contact xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-lg max-w-screen-md mx-auto my-7 px-5">
    <div className="contact-content">
      <div className="grid md:grid-cols-3 grid-cols-1 gap-5">
        <div className="contact-box bg-slate-50 p-5 rounded-2xl h-auto ">
          <div className=" bg-yellow-400 w-12 flex items-center justify-center px-3 py-2 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={34}
              height={34}
              viewBox="0 0 24 24"
              fill="none"
              style={{ color: "rgb(0, 0, 0)" }}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.17157 5.17157C2 6.34315 2 8.22876 2 12C2 15.7712 2 17.6569 3.17157 18.8284C4.34315 20 6.22876 20 10 20H14C17.7712 20 19.6569 20 20.8284 18.8284C22 17.6569 22 15.7712 22 12C22 8.22876 22 6.34315 20.8284 5.17157C19.6569 4 17.7712 4 14 4H10C6.22876 4 4.34315 4 3.17157 5.17157ZM18.5762 7.51986C18.8413 7.83807 18.7983 8.31099 18.4801 8.57617L16.2837 10.4066C15.3973 11.1452 14.6789 11.7439 14.0448 12.1517C13.3843 12.5765 12.7411 12.8449 12 12.8449C11.2589 12.8449 10.6157 12.5765 9.95518 12.1517C9.32112 11.7439 8.60271 11.1452 7.71636 10.4066L5.51986 8.57617C5.20165 8.31099 5.15866 7.83807 5.42383 7.51986C5.68901 7.20165 6.16193 7.15866 6.48014 7.42383L8.63903 9.22291C9.57199 10.0004 10.2197 10.5384 10.7666 10.8901C11.2959 11.2306 11.6549 11.3449 12 11.3449C12.3451 11.3449 12.7041 11.2306 13.2334 10.8901C13.7803 10.5384 14.428 10.0004 15.361 9.22291L17.5199 7.42383C17.8381 7.15866 18.311 7.20165 18.5762 7.51986Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className="my-3 font-light">
            <strong className="sm:text-xl">Email</strong>
          </div>
          <div className="font-semibold text-yellow-500">
            <p>trogiup@antlearn.vn</p>
          </div>
        </div>
        <div className="contact-box bg-slate-50 p-5 rounded-2xl h-auto">
          <div className=" bg-yellow-400 w-12 flex items-center justify-center px-3 py-2 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={34}
              height={34}
              viewBox="0 0 24 24"
              fill="none"
              style={{ color: "rgb(0, 0, 0)" }}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C7.58172 2 4 6.00258 4 10.5C4 14.9622 6.55332 19.8124 10.5371 21.6744C11.4657 22.1085 12.5343 22.1085 13.4629 21.6744C17.4467 19.8124 20 14.9622 20 10.5C20 6.00258 16.4183 2 12 2ZM12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className="my-3 font-light">
            <strong className="sm:text-xl">Văn phòng</strong>
          </div>
          <div className="font-semibold text-yellow-500">
            <p className="lg:text-base md:text-base">
              Tầng 6, Tòa nhà Kim Khí Thăng long, Sô 1 Lương Yên, Phường Bạch
              Đằng, Quận Hai Bà Trưng, Thành phố Hà Nội, Việt Nam
            </p>
          </div>
        </div>
        <div className="contact-box bg-slate-50 p-5 rounded-2xl h-auto">
          <div className=" bg-yellow-400 w-12 flex items-center justify-center px-3 py-2 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={34}
              height={34}
              viewBox="0 0 24 24"
              fill="none"
              style={{ color: "rgb(0, 0, 0)" }}
            >
              <path
                d="M14 2C14 2 16.2 2.2 19 5C21.8 7.8 22 10 22 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M14.207 5.53516C14.207 5.53516 15.197 5.818 16.6819 7.30292C18.1668 8.78785 18.4497 9.7778 18.4497 9.7778"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M10.0376 5.31617L10.6866 6.4791C11.2723 7.52858 11.0372 8.90532 10.1147 9.8278C10.1147 9.8278 10.1147 9.8278 10.1147 9.8278C10.1146 9.82792 8.99588 10.9468 11.0245 12.9755C13.0525 15.0035 14.1714 13.8861 14.1722 13.8853C14.1722 13.8853 14.1722 13.8853 14.1722 13.8853C15.0947 12.9628 16.4714 12.7277 17.5209 13.3134L18.6838 13.9624C20.2686 14.8468 20.4557 17.0692 19.0628 18.4622C18.2258 19.2992 17.2004 19.9505 16.0669 19.9934C14.1588 20.0658 10.9183 19.5829 7.6677 16.3323C4.41713 13.0817 3.93421 9.84122 4.00655 7.93309C4.04952 6.7996 4.7008 5.77423 5.53781 4.93723C6.93076 3.54428 9.15317 3.73144 10.0376 5.31617Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              ></path>
            </svg>
          </div>
          <div className="my-3 font-light">
            <strong className="sm:text-xl">Điện thoại</strong>
          </div>
          <div className="font-semibold text-yellow-500">
            <p>0865868256</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</>

        </>
    )
}

