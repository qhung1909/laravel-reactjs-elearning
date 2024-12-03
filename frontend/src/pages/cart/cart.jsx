import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import axios from "axios";
import { formatCurrency } from "@/components/Formatcurrency/formatCurrency";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  ShoppingCart, 
  Trash2, 
  ArrowLeft
} from "lucide-react";

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

export const Cart = () => {
    const [cart, setCart] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("access_token");

    // Existing fetch logic remains the same
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                const [coursesResponse, cartResponse] = await Promise.all([
                    axios.get(`${API_URL}/courses`, {
                        headers: { "x-api-secret": `${API_KEY}` },
                    }),
                    axios.get(`${API_URL}/auth/cart`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }),
                ]);

                setCourses(coursesResponse.data);
                setCart(cartResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const deleteCourseFromCart = async (orderId, courseId) => {
        const { isConfirmed } = await Swal.fire({
            title: "Xác nhận xóa",
            text: "Bạn có chắc chắn muốn xóa khóa học này khỏi giỏ hàng?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Có, xóa!",
            cancelButtonText: "Hủy",
        });

        if (!isConfirmed) return;

        try {
            if (!token) {
                throw new Error("Không có token. Vui lòng đăng nhập lại.");
            }

            await axios.delete(`${API_URL}/auth/cart/remove-item`, {
                headers: {
                    "x-api-secret": API_KEY,
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                data: { order_id: orderId, course_id: courseId },
            });
            
            window.location.reload();
            
            setCart((prevCart) =>
                prevCart.map((order) => ({
                    ...order,
                    order_details: order.order_details.filter(
                        (detail) => detail.course_id !== courseId
                    ),
                }))
            );
        } catch (error) {
            console.error("Error deleting course from cart:", error.response?.data || error.message);
            toast.error(`Lỗi: ${error.response?.data?.message || error.message}`);
        }
    };

    const calculateTotalPrice = () => {
        return cart.reduce((total, item) => {
            const itemTotal = item.order_details.reduce((subtotal, detail) => {
                const price = parseFloat(detail.price);
                return subtotal + (isNaN(price) ? 0 : price);
            }, 0);
            return total + itemTotal;
        }, 0);
    };

    const totalPrice = calculateTotalPrice();

    const renderCart = () => {
        return cart.map((item, index) => (
            <Card key={index} className="mb-6">
                <CardContent className="p-0">
                    {item.order_details.map((cart, cartIndex) => {
                        const course = courses.find(
                            (c) => c.course_id === cart.course_id
                        );
                        return (
                            <div
                                key={cartIndex}
                                className="flex items-center p-4 hover:bg-accent/50 transition-colors"
                            >
                                <span className="mr-3 font-medium text-muted-foreground">
                                    {cartIndex + 1}
                                </span>
                                <Checkbox 
                                    className="mr-4"
                                    defaultChecked
                                />
                                <img
                                    alt={course?.title || "Course Image"}
                                    className="w-48 h-28 rounded-lg object-cover"
                                    src={course?.img || "default-image-url.jpg"}
                                />
                                <div className="ml-4 flex-grow">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1 flex-1 mr-4">
                                            <h3 className="font-semibold text-lg line-clamp-1 uppercase">
                                                {course?.title || "Khóa học không tồn tại"}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {cart.course.slug}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className="font-medium text-primary">
                                                {formatCurrency(cart.price)}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => deleteCourseFromCart(item.order_id, cart.course_id)}
                                                className="text-destructive hover:text-destructive/90"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>
        ));
    };

    if (loading) {
        return (
            <div className="p-10 max-w-screen-xl mx-auto">
                <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <Card key={i}>
                            <CardContent className="p-4">
                                <div className="flex gap-4">
                                    <div className="w-48 h-28 bg-muted rounded-lg animate-pulse" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                                        <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] p-6">
                <div className="text-center space-y-6">
                    <img
                        src="https://maydongphucyte.com/default/template/img/cart-empty.png"
                        alt="Giỏ hàng trống"
                        className="w-80 h-60 object-cover mx-auto"
                    />
                    <p className="text-2xl font-semibold text-gray-600 max-w-md">
                        Giỏ hàng của bạn đang trống. Hãy tìm mua cho mình một khóa học nhé
                    </p>
                    <Link to="/">
                        <Button 
                            variant="outline" 
                            className="gap-2 hover:bg-yellow-50"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Về lại trang chủ
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="p-10 max-w-screen-xl mx-auto">
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">Giỏ hàng</h1>
                        <p className="text-muted-foreground">
                            {cart.length} Khóa học trong giỏ hàng
                        </p>
                    </div>
                    <ShoppingCart className="h-8 w-8 text-muted-foreground hidden md:block" />
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        {renderCart()}
                    </div>

                    <div className="lg:col-span-1">
                        <Card>
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <h3 className="font-medium text-lg">Tổng thanh toán</h3>
                                    <div className="text-3xl font-bold">
                                        {formatCurrency(totalPrice)}
                                    </div>
                                </div>
                                
                                <Separator />
                                
                                <Link to="/payment">
                                    <Button className="w-full" size="lg">
                                        Thanh toán
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;