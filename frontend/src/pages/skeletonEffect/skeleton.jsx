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
