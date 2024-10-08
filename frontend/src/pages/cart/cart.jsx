export const Cart = () => {
    return (
        <div className="bg-gray-100">
  <div className="container mx-auto py-8">
    <h1 className="text-3xl font-bold mb-6">
      Giỏ hàng
    </h1>
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="font-bold">
          1 Khóa học trong giỏ hàng
        </span>
        <div className="flex items-center">
          <input
            className="mr-2"
            defaultChecked
            id="selectAll"
            type="checkbox"
          />
          <label htmlFor="selectAll">
            Chọn tất cả
          </label>
        </div>
      </div>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <input
            className="mr-4 checked:bg-yellow-500"
            defaultChecked
            type="checkbox"
          />
          <img
            alt="Course Image"
            className="w-24 h-16 rounded-md"
            src="https://via.placeholder.com/100"
          />
          <div className="ml-4">
            <p className="font-bold">
              Phát âm chuẩn tiếng Anh
            </p>
            <p className="text-sm text-gray-500">
              bởi Edumall Learning
            </p>
            <p className="text-sm text-gray-500">
              0 Bài học · 0 giờ 0 phút
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-blue-500 font-bold">
            đ279,000{' '}
            <span className="line-through text-gray-400">
              500,000
            </span>
          </p>
          <button className="text-red-500 hover:text-red-700 mt-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 18L18 6M6 6l12 12"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <div className="bg-white p-6 rounded-lg shadow-md w-80">
          <div className="flex justify-between mb-4">
            <span className="font-bold text-lg">
              Tổng
            </span>
            <span className="font-bold text-lg">
              đ279,000
            </span>
          </div>
          <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 rounded">
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  </div>
  </div>


    )
}
