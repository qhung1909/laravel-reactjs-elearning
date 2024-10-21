import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Button } from '@/components/ui/button';

const API_URL = import.meta.env.VITE_API_URL;
// const notify = (message) => toast.error(message);


const notify = (message, type) => {
    if (type === 'success') {
        toast.success(message, {
            style: {
                padding: '16px'
            }
        });
    } else {
        toast.error(message, {
            style: {
                padding: '16px'
            }
        })
    }
}



export const ResetPassword = () => {

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [_success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();



    const debouncedLogin = async () => {
        setLoading(false);
        if (!email) {
            setError('Email là bắt buộc');
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const res = await fetch(`${API_URL}/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });

            if (res.status === 404) {
                setError('Email không tồn tại!');
                return;
            }


            if (!res.ok) {
                const errorData = await res.json();
                console.log(errorData);
                notify('Vui lòng xác thực email!');
                return;
            }

            await res.json();
            notify('Đăng nhập thành công', 'success');
            navigate('/verify-email');
            window.location.reload();
        } catch (error) {
            setError('Đã xảy ra lỗi: ' + error.message);
        } finally {
            setLoading(false);
        }
    };



    const submit = (e) => {
        e.preventDefault();
        debouncedLogin();
    };


    return (
        <>
            {loading && (
                <div className='loading'>
                    <div className='loading-spin'></div>
                </div>
            )}
            <div className="relative m-auto h-screen overflow-hidden items-center shadow-inner lg:grid  lg:grid-cols-2 pt-32 lg:pt-0">
                <Link className='absolute top-1 left-0 xl:top-8 xl:left-8' to='/'>
                    <div className="flex items-center gap-3">
                        <box-icon name='arrow-back' color='gray' ></box-icon>
                        <p className="text-gray-600">Trang chủ</p>
                    </div>
                </Link>

                <div className=" flex items-center justify-center">

                    <form
                        onSubmit={submit}
                        className="relative mx-auto grid w-[350px] gap-6">
                        <div className="text-center">
                            <box-icon name='key' size='lg'></box-icon>
                        </div>
                        <div className="grid gap-2">
                            <h1 className="text-3xl font-bold text-center">Quên mật khẩu</h1>
                            <p className="text-center text-gray-500">
                                Không sao cả, chúng tôi sẽ gửi cho bạn hướng dẫn đặt lại mật khẩu.
                            </p>
                        </div>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600">
                                Gửi mã
                            </Button>
                            {error && <p className="text-red-500 text-sm pt-2">{error}</p>}

                        </div>
                        <Link to="/login" className=" font-medium hover:text-yellow-500 duration-700">
                            <div className="flex justify-center items-center gap-3">
                                <box-icon name='arrow-back' color='gray' ></box-icon>
                                <p className="text-gray-600">Trở về Đăng nhập</p>
                            </div>
                        </Link>
                    </form>
                </div>
                <div className="hidden bg-muted lg:block">
                    <img
                        src="/src/assets/images/login-bg.jpg"
                        alt="Image"
                        className=" object-cover dark:brightness-[0.2] dark:grayscale"
                        width='100%'
                    />
                </div>
                <Toaster />
            </div>
        </>
    )

}
