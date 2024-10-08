
import { CreditCard, Globe } from 'lucide-react';

export const Payment = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-2xl font-bold mb-2">Thanh toán khoá học</h1>
      <p className="text-gray-600 mb-6">Chúng tôi cam kết bảo vệ thông tin thanh toán của bạn.</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Chọn phương thức thanh toán</h2>
          <div className="space-y-3">
            <div className="p-3 bg-gray-100 rounded-lg flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white">V</div>
              <span>Viet QR</span>
            </div>
            <div className="p-3 bg-white border border-gray-200 rounded-lg flex items-center space-x-3">
              <img src="/api/placeholder/32/32" alt="VNPay" className="w-8 h-8" />
              <span>VNPay</span>
              <div className="ml-auto">
                <div className="w-5 h-5 border-2 border-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg flex items-center space-x-3">
              <Globe className="w-6 h-6 text-blue-500" />
              <span>Thẻ thanh toán quốc tế</span>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg flex items-center space-x-3">
              <CreditCard className="w-6 h-6 text-blue-500" />
              <span>Thẻ thanh toán nội địa</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Thông tin</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Giá gốc</span>
              <span>đ949,000</span>
            </div>
            <div className="flex justify-between">
              <span>Giá bán</span>
              <span>đ728,000</span>
            </div>
          </div>
          <button className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg mb-4">
            Thêm mã khuyến mại
          </button>
          <div className="flex justify-between font-semibold mb-4">
            <span>Thành tiền:</span>
            <span>đ728,000</span>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Nhấn Mua ngay đồng nghĩa với việc bạn đã đọc và chấp thuận với
            <a href="#" className="text-blue-500"> Điều khoản dịch vụ</a>
          </p>
          <button className="w-full py-3 bg-yellow-400 text-gray-800 rounded-lg font-semibold">
            Mua ngay
          </button>
          <p className="text-sm text-gray-500 mt-2 text-center">Bảo hành 14 ngày</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Thông tin đơn hàng</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <img src="/api/placeholder/64/64" alt="Course 1" className="w-16 h-16 object-cover rounded" />
            <div>
              <h3 className="font-semibold">Phát âm chuẩn tiếng Anh</h3>
              <p className="text-blue-500">đ279,000 <span className="line-through text-gray-500">500,000</span></p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <img src="/api/placeholder/64/64" alt="Course 2" className="w-16 h-16 object-cover rounded" />
            <div>
              <h3 className="font-semibold">YOGA CHO BÀ BẦU - BÍ QUYẾT CHO MỘT THAI KỲ KHỎE MẠNH</h3>
              <p className="text-blue-500">đ449,000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
