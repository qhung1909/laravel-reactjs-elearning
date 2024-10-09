import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, {Toaster} from 'react-hot-toast';
const notify = (message, type) =>{
    if (type === 'success'){
        toast.success(message);
    }
}
export const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] =useState(false);

    const API_URL = import.meta.env.VITE_API_URL;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.name || !formData.email || !formData.password || !formData.password_confirmation) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        if (formData.password !== formData.password_confirmation) {
            setError('Mật khẩu không khớp');
            return;
        }

        if (formData.password.length <6 || formData.password_confirmation.length < 6){
            setError('Mật khẩu phải từ 6 kí tự trở lên');
            return
        }

        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    password_confirmation: formData.password_confirmation
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                const emailError = errorData.errors.email[0]
                setError(emailError || errorData.message || 'Đăng ký thất bại');
                return;
            }

            const data = await res.json();
            localStorage.setItem('access_token', data.access_token);
            notify('Đăng ký thành công', 'success');
            // setSuccess('Đăng ký thành công!');

            setFormData({
                name: '',
                email: '',
                password: '',
                password_confirmation: '',
            });

            setTimeout(()=>{
                navigate('/login');
            }, 2000)

        } catch (error) {
            console.log(error);
            setError('Đã xảy ra lỗi. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && (
                <div className='loading'>
                    <div className='loading-spin'></div>
                </div>
            )}

        <div className="max-w-7xl mx-auto py-0 md:py-2 xl:py-12">
            <div className="grid grid-cols-1 py-6 md:py-6 lg:py-12 lg:grid-cols-2">
                <div className="img-signup">
                    <img className="w-full hidden md:pl-64 lg:pl-12 lg:block" src="/src/assets/images/signup.jpg" alt="" />
                    <img className="w-full px-6 sm:px-24 md:px-48 block lg:hidden" src="/src/assets/images/signup-mb.png" alt="" />
                </div>
                <form onSubmit={submit} className="w-full px-6 sm:px-24 md:px-48 lg:px-16 xl:px-24 mx-auto">
                    <h1 className="text-center text-2xl lg:text-3xl font-semibold pb-3 md:pb-10 pt-3 lg:pt-0">
                        Đăng ký và bắt đầu học
                    </h1>

                    <div className="relative py-1">
                        <input
                            type="text"
                            name="name"
                            placeholder=""
                            className="input-form peer"
                            value={formData.name}
                            onChange={handleChange}

                        />
                        <label className="label-form">Tên</label>
                    </div>
                    <div className="relative py-1">
                        <input
                            type="email"
                            name="email"
                            placeholder=""
                            className="input-form peer"
                            value={formData.email}
                            onChange={handleChange}

                        />
                        <label className="label-form">Email</label>
                    </div>
                    <div className="relative py-1">
                        <input
                            type="password"
                            name="password"
                            placeholder=""
                            className="input-form peer"
                            value={formData.password}
                            onChange={handleChange}

                        />
                        <label className="label-form">Mật khẩu</label>
                    </div>
                    <div className="relative py-1">
                        <input
                            type="password"
                            name="password_confirmation"
                            placeholder=""
                            className="input-form peer"
                            value={formData.password_confirmation}
                            onChange={handleChange}

                        />
                        <label className="label-form">Xác nhận mật khẩu</label>
                    </div>

                    <div className="py-2">
                        <button className="h-16 w-full bg-yellow-500 font-bold">
                            Đăng ký
                        </button>
                    </div>

                    {error && <p className="text-red-500 text-center pt-2">{error}</p>}
                    {success && <p className="text-green-500 text-center pt-2">{success}</p>}

                    <div className="flex items-center justify-center my-4">
                        <div className="flex-grow border-t border-gray-400"></div>
                        <span className="mx-2">Tùy chọn khác</span>
                        <div className="flex-grow border-t border-gray-400"></div>
                    </div>

                    <div className="py-2">
                        <button type='button' className="h-16 w-full border border-black flex gap-3 m-auto justify-center place-items-center">
                            <svg className="flex-none" xmlns="http://www.w3.org/2000/svg" width="5%" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262" id="google">
                                <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                                <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
                                <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path>
                                <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
                            </svg>
                            <p className="flex-none">Đăng nhập bằng google</p>
                        </button>
                    </div>

                    <div className="pt-2">
                        <p className="text-lg lg:text-xl">Đã có tài khoản?{' '}
                            <Link className='text-black font-medium underline' to='/login'>Đăng nhập</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
        <Toaster />


        </>
    )
};
