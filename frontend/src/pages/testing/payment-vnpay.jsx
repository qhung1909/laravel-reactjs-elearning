import axios from 'axios';
import { useState } from 'react';

const fakeCart = [
    { id: 1, name: 'Sản phẩm A', price: 20000, quantity: 1 },
    { id: 2, name: 'Sản phẩm B', price: 30000, quantity: 2 },
];

export const PaymentComponent = () => {
    const [cart, setCart] = useState(fakeCart);

    const getTotalAmount = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const handlePayment = async () => {
        const token = localStorage.getItem('access_token');
        
        if (!token) {
            alert('Bạn cần đăng nhập để thực hiện thanh toán.'); 
            return;
        }

        const orderInfo = cart.map(item => `${item.name} x ${item.quantity}`).join(', ');
        const orderType = 'purchase';
        const orderAmount = getTotalAmount();

        try {
            const response = await axios.post('http://localhost:8000/api/vnpay-payment', {
                vnp_OrderInfo: orderInfo,
                vnp_OrderType: orderType,
                vnp_Amount: orderAmount, 
            }, {
                headers: {
                    Authorization: `Bearer ${token}`, 
                    'Content-Type': 'application/json', 
                }
            });

            if (response.data.code === '00') {
                window.location.href = response.data.data; 
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Có lỗi xảy ra:', error);
        }
    };

    return (
        <div>
            <h1>Giỏ Hàng</h1>
            <ul>
                {cart.map(item => (
                    <li key={item.id}>
                        {item.name} - {item.price}đ x {item.quantity}
                    </li>
                ))}
            </ul>
            <h2>Tổng Tiền: {getTotalAmount()}đ</h2>
            <button onClick={handlePayment}>Thanh Toán</button>
        </div>
    );
};