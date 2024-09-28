import React, { useState } from 'react';
import axios from 'axios';

export const PaymentComponent = () => {
    const [redirect, setRedirect] = useState(false);

    const handlePayment = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/vnpay-payment', {
                redirect: true, 
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
            <h1>Thanh Toán</h1>
            <button onClick={handlePayment}>Thanh Toán</button>
        </div>
    );
};


