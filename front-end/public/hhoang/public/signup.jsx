import { Link } from 'react-router-dom'
import './style.css'
export const Signup = () => {
    return (
    <div class="max-w-7xl mx-auto py-0 md:py-2 xl:py-12">
        <div class="grid grid-cols-1 py-6 md:py-6 lg:py-12 lg:grid-cols-2">
            <div class="img-signup">
                <img class="w-full hidden md:pl-64 lg:pl-12 lg:block" src="./images/signup.jpg" alt=""/>
                <img class="w-full px-6 sm:px-24 md:px-48 block lg:hidden" src="./images/signup-mb.png" alt=""/>
            </div>
            <form class="w-full px-6 sm:px-24 md:px-48 lg:px-16 xl:px-24 mx-auto">
                <h1 class="text-center text-2xl lg:text-3xl font-semibold pb-3 md:pb-10 pt-3 lg:pt-0">
                    Đăng ký và bắt đầu học
                </h1>

                <div class="relative py-1">
                    <input type="text" placeholder="" class="input-form peer"/>
                    <label class="label-form">
                        Tên đầy đủ
                    </label>
                </div>
                <div class="relative py-1">
                    <input type="email" placeholder="" class="input-form peer" />
                    <label class="label-form">
                        Email
                    </label>
                </div>
                <div class="relative py-1">
                    <input type="password" placeholder="" class="input-form peer" />
                    <label class="label-form">
                        Mật khẩu
                    </label>
                </div>

                <div class="py-2">
                    <button class="h-16 w-full bg-yellow-500 font-bold">
                        Đăng ký
                    </button>
                </div>

                <div class="flex items-center justify-center my-4">
                    <div class="flex-grow border-t border-gray-400"></div>
                    <span class="mx-2">Tùy chọn khác</span>
                    <div class="flex-grow border-t border-gray-400"></div>
                </div>

                <div class="py-2">
                    <button class="h-16 w-full border border-black flex gap-3 m-auto justify-center place-items-center">
                        <svg class="flex-none" xmlns="http://www.w3.org/2000/svg" width="5%"preserveAspectRatio="xMidYMid" viewBox="0 0 256 262" id="google"><path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path><path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path><path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path><path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path></svg>
                        <p class="flex-none">Đăng nhập bằng google</p>
                    </button>
                </div>

                <div class="pt-2">
                    <p class="text-lg lg:text-xl">Đã có tài khoản?{' '}
                        <Link className='text-black font-medium underline' to='/login'>Đăng nhập</Link>
                    </p>
                </div>


            </form>


        </div>
    </div>
    )
}