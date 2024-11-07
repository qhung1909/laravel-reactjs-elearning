export const SkeletonLoaderBanner = () => {
    return (
        <div className="bg-gray-900 p-6" style={{ backgroundColor: "#2d2f31" }}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-44">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Cột trái (Văn bản) */}
                    <div className="col-span-1 lg:col-span-8">
                        {/* Điều hướng Breadcrumb */}
                        <div className="h-4 bg-gray-300 rounded mb-2 w-1/2 animate-pulse"></div>
                        <div className="h-8 bg-gray-300 rounded mb-2 animate-pulse"></div>
                        <div className="h-4 bg-gray-300 rounded mb-2 w-3/4 animate-pulse"></div>
                        <div className="h-4 bg-gray-300 rounded mb-2 w-1/3 animate-pulse"></div>
                        <div className="h-4 bg-gray-300 rounded mb-2 w-1/4 animate-pulse"></div>
                        <div className="h-4 bg-gray-300 rounded mb-2 w-2/3 animate-pulse"></div>
                    </div>
                    {/* Cột phải (Hình ảnh) */}
                    <div className="col-span-1 lg:col-span-4 flex justify-center items-center">
                        <div className="bg-gray-300 rounded animate-pulse" style={{ width: '100%', height: '200px' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const SkeletonLoaderProduct = () => {
    return (
        <div className="w-full lg:w-1/3 px-4 mt-8 lg:mt-0 sticky-container">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <div className="bg-gray-300 rounded animate-pulse" style={{ height: 150 }}></div>
                </div>
                <div className="flex items-center justify-between mb-1">
                    <div className="h-8 bg-gray-300 rounded w-1/3 animate-pulse"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/4 animate-pulse"></div>
                </div>
                <p className="h-4 bg-gray-300 rounded mb-1 w-1/2 animate-pulse"></p>
                <p className="h-4 bg-gray-300 rounded mb-2 w-3/4 animate-pulse"></p>
                <button className="w-full bg-gray-300 rounded-lg mb-2 py-2 animate-pulse"></button>
                <button className="w-full bg-gray-300 rounded-lg mb-2 py-2 animate-pulse"></button>
                <p className="h-4 bg-gray-300 rounded mb-2 w-1/2 animate-pulse"></p>
                <div className="mt-2">
                    <h4 className="font-semibold mb-2 h-4 bg-gray-300 rounded w-1/2 animate-pulse"></h4>
                    <ul className="text-sm space-y-2">
                        {[...Array(6)].map((_, index) => (
                            <li key={index} className="flex items-center">
                                <div className="bg-gray-300 rounded w-4 h-4 mr-2 animate-pulse"></div>
                                <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};


export const CartSkeleton = () => {
    return (
        <div className="p-10 md:my-5 my-2 max-w-screen-xl mx-auto">
            <div className="container mx-auto">
                <h1 className="lg:text-5xl md:text-4xl text-3xl text-center md:text-left font-bold md:mb-6 mb-3 bg-gray-200 h-8 rounded w-1/2 md:w-1/4 mx-auto md:mx-0 animate-pulse"></h1>
                <div className="bg-white">
                    <div className="mb-4 text-center md:text-left">
                        <span className="font-semibold text-gray-500 lg:text-lg md:text-base text-base bg-gray-200 h-6 rounded w-1/3 md:w-1/5 mx-auto md:mx-0 block animate-pulse"></span>
                    </div>
                    <div>
                        <div className="container mx-auto">
                            <div className="flex flex-col lg:flex-row justify-between lg:gap-10">
                                {/* Cột bên trái: Danh sách sản phẩm */}
                                <div className="flex flex-col justify-between lg:w-2/3 w-full">
                                    <div className="bg-gray-200 h-32 mb-4 rounded animate-pulse"></div>
                                </div>

                                {/* Cột bên phải: Tổng tiền */}
                                <div className="bg-gray-200 rounded-3xl box-shadow-lg md:h-48 p-6 lg:w-1/3 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_-10px_15px_-3px_rgba(0,0,0,0.1)]">
                                    <div className="mb-2 text-left">
                                        <span className="font-bold md:text-xl text-lg text-gray-200 bg-gray-200 h-6 rounded w-1/2 mx-auto md:mx-0 block animate-pulse"></span>
                                    </div>
                                    <div className="font-bold md:text-3xl text-2xl mb-5 text-black text-center lg:text-left bg-gray-200 h-8 rounded w-2/3 mx-auto md:mx-0 block animate-pulse"></div>
                                    <button className="w-full bg-yellow-200 h-10 rounded-3xl animate-pulse"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ProductSkeletonHome = () => (
    <div className="product md:mb-10 xl:mb-0 text-center md:text-left animate-pulse">
        <div className="product-box">
            <div className="product-box-img xl:h-[200px] lg:h-[150px] md:h-[135px] sm:h-[180px] h-[150px] flex justify-center items-center">
                <div className="bg-gray-300 rounded-xl h-full w-80" />
            </div>
            <div className="product-box-title xl:text-xl lg:text-xl md:text-base sm:text-lg text-lg font-semibold my-2 line-clamp-2 xl:h-[55px] lg:h-[54px] md:h-[45px]">
                <div className="bg-gray-300 h-full rounded" />
            </div>
            <div className="product-box-author font-mediummy-1 md:text-base text-sm md:block hidden">
                <div className="bg-gray-300 h-4 rounded w-1/2" />
            </div>
            <div className="product-box-time-lesson md:text-sm sm:text-[15px] text-[14px] flex justify-center md:justify-start gap-4 my-1">
                <div className="product-box-time">
                    <div className="bg-gray-300 h-4 rounded w-20" />
                </div>
                <div className="product-box-lesson hidden sm:block">
                    <div className="bg-gray-300 h-4 rounded w-24" />
                </div>
            </div>
            <div className="product-box-price font-bold xl:text-xl md:text-lg sm:text-lg text-lg">
                <div className="bg-gray-300 h-4 rounded w-16" />
            </div>
        </div>
    </div>
);




export const QuizCreatorSkeleton = () => {
    return (
        <div className="max-w-5xl mx-auto p-6 space-y-12">
            {/* Phần tiêu đề cố định */}
            <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50 p-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="h-8 w-64 bg-gray-200 rounded-md animate-pulse"></div>
                    <div className="flex space-x-4">
                        <div className="h-10 w-40 bg-gray-200 rounded-md animate-pulse"></div>
                        <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* Phần nội dung chính với khoảng cách lớn hơn */}
            <div className="pt-24 space-y-10">
                {[1, 2, 3].map((_, index) => (
                    <div key={index} className="p-6 bg-white rounded-lg shadow-sm space-y-6">
                        <div className="flex justify-between items-center">
                            <div className="h-6 w-48 bg-gray-200 rounded-md animate-pulse"></div>
                            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                        </div>

                        <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse"></div>

                        <div className="space-y-4">
                            <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse"></div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map((_, optionIndex) => (
                                    <div key={optionIndex} className="flex items-center gap-3 p-3 bg-gray-100 border rounded-md animate-pulse">
                                        <div className="h-5 w-5 bg-gray-200 rounded-full flex-shrink-0"></div>
                                        <div className="h-8 flex-grow bg-gray-200 rounded-md"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Nút Skeleton lớn */}
            <div className="h-12 w-full bg-gray-200 rounded-md animate-pulse"></div>
        </div>
    );
}




export const SkeletonLoaderCurriculum = () => {
    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          {/* Skeleton cho tiêu đề chính */}
          <div className="h-6 w-64 bg-gray-200 rounded-md animate-pulse mb-2"></div>
          <div className="h-1 bg-gray-200 rounded animate-pulse mb-4"></div>

          {/* Skeleton cho nội dung khóa học */}
          <div className="space-y-4">
            {/* Skeleton cho tiêu đề nội dung khóa học */}
            <div className="h-6 w-48 bg-gray-200 rounded-md animate-pulse"></div>

            {/* Skeleton cho từng phần Accordion */}
            {[1, 2, 3].map((_, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-lg p-4 bg-white space-y-4 animate-pulse"
              >
                {/* Skeleton cho tiêu đề AccordionItem */}
                <div className="flex items-center gap-4">
                  <div className="h-5 w-20 bg-gray-200 rounded-md"></div>
                  <div className="flex-1 h-8 bg-gray-200 rounded-md"></div>
                  <div className="h-8 w-24 bg-gray-200 rounded-md"></div>
                </div>

                {/* Skeleton cho nội dung bài học bên trong Accordion */}
              </div>
            ))}

            {/* Skeleton cho nút thêm bài học mới */}
            <div className="border border-gray-300 rounded-lg p-4 bg-white space-y-4 animate-pulse"></div>
          </div>
        </div>
      );
  };





