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




