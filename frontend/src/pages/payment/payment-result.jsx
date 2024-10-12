import { useEffect, useState } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const PaymentResult = () => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const secureHash = params.get("vnp_SecureHash");
        const transactionNo = params.get("vnp_TransactionNo");
        const bankCode = params.get("vnp_BankCode");
        const amount = params.get("vnp_Amount");
        const transactionRef = params.get("vnp_TxnRef");
        const responseCode = params.get("vnp_ResponseCode");
        const bankTranNo = params.get("vnp_BankTranNo");
        const cardType = params.get("vnp_CardType");
        const orderInfo = params.get("vnp_OrderInfo");
        const payDate = params.get("vnp_PayDate");
        const transactionStatus = params.get("vnp_TransactionStatus");
        const tmnCode = params.get("vnp_TmnCode");

        const verifyPayment = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8000/api/vnpay-callback?vnp_Amount=${amount}&vnp_BankCode=${bankCode}&vnp_BankTranNo=${bankTranNo}&vnp_CardType=${cardType}&vnp_OrderInfo=${encodeURIComponent(
                        orderInfo
                    )}&vnp_PayDate=${payDate}&vnp_ResponseCode=${responseCode}&vnp_TmnCode=${tmnCode}&vnp_TransactionNo=${transactionNo}&vnp_TransactionStatus=${transactionStatus}&vnp_TxnRef=${transactionRef}&vnp_SecureHash=${secureHash}`
                );
                const data = await response.json();
                setResult(data);
            } catch (error) {
                console.error("Error verifying payment:", error);
                setResult({
                    RspCode: "99",
                    Message: "Xác thực giao dịch thất bại",
                });
            } finally {
                setLoading(false);
            }
        };

        verifyPayment();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
                <Loader2 className="h-16 w-16 text-indigo-600 animate-spin" />
                <p className="mt-4 text-xl font-semibold text-indigo-600">
                    Đang xác thực giao dịch...
                </p>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[50vh] bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-black-600">
                        Kết quả giao dịch
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {result ? (
                        result.RspCode === "00" ? (
                            <Alert
                                variant="default"
                                className="bg-green-50 border-green-200"
                            >
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <AlertTitle className="text-green-800">
                                    Giao dịch thành công!
                                </AlertTitle>
                                <AlertDescription className="text-green-700">
                                    Mã phản hồi: {result.RspCode}
                                    <br />
                                    Thông điệp: {result.Message}
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <Alert variant="destructive">
                                <XCircle className="h-5 w-5" />
                                <AlertTitle>Giao dịch thất bại!</AlertTitle>
                                <AlertDescription>
                                    Mã phản hồi: {result.RspCode}
                                    <br />
                                    Thông điệp: {result.Message}
                                </AlertDescription>
                            </Alert>
                        )
                    ) : (
                        <p className="text-center text-gray-600">
                            Không có dữ liệu phản hồi.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
