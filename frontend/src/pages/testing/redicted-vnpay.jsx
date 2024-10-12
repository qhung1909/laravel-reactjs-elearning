// import  { useEffect, useState } from 'react';

// export const PaymentResult = () => {
//     const [result, setResult] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const params = new URLSearchParams(window.location.search);
//         const secureHash = params.get('vnp_SecureHash');
//         const transactionNo = params.get('vnp_TransactionNo');
//         const bankCode = params.get('vnp_BankCode');
//         const amount = params.get('vnp_Amount');
//         const transactionRef = params.get('vnp_TxnRef');
//         const responseCode = params.get('vnp_ResponseCode');
//         const bankTranNo = params.get('vnp_BankTranNo');
//         const cardType = params.get('vnp_CardType');
//         const orderInfo = params.get('vnp_OrderInfo');
//         const payDate = params.get('vnp_PayDate');
//         const transactionStatus = params.get('vnp_TransactionStatus');
//         const tmnCode = params.get('vnp_TmnCode');
//         const verifyPayment = async () => {
//             try {
//                 const response = await fetch(`http://localhost:8000/api/vnpay-callback?vnp_Amount=${amount}&vnp_BankCode=${bankCode}&vnp_BankTranNo=${bankTranNo}&vnp_CardType=${cardType}&vnp_OrderInfo=${encodeURIComponent(orderInfo)}&vnp_PayDate=${payDate}&vnp_ResponseCode=${responseCode}&vnp_TmnCode=${tmnCode}&vnp_TransactionNo=${transactionNo}&vnp_TransactionStatus=${transactionStatus}&vnp_TxnRef=${transactionRef}&vnp_SecureHash=${secureHash}`);
//                 const data = await response.json();
//                 setResult(data);
//             } catch (error) {
//                 console.error("Error verifying payment:", error);
//                 setResult({ code: '99', message: 'Xác thực giao dịch thất bại' });
//             } finally {
//                 setLoading(false);
//             }
//         };

//         verifyPayment();
//     }, []);

//     if (loading) {
//         return <div>Đang xác thực giao dịch...</div>;
//     }

//     return (
//         <div>
//             <h2>Kết quả giao dịch</h2>
//             {result ? (
//                 <div>
//                     <p>Mã phản hồi: {result.RspCode}</p>
//                     <p>Thông điệp: {result.Message}</p>
//                 </div>
//             ) : (
//                 <p>Không có dữ liệu phản hồi.</p>
//             )}
//         </div>
//     );
// };
