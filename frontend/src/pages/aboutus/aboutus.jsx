import { Button } from '@/components/ui/button';
import './aboutus.css'
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Link } from 'react-router-dom';

useState
export const Aboutus = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const slides = [
        {
            image: "/src/assets/images/team1.jpg",
            title: "Những buổi họp",
            subtitle: "Chúng tôi thường chọn những địa điểm ở giữa nơi ở của nhau",
        },
        {
            image: "/src/assets/images/team2.jpg",
            title: "Thực hiện dự án",
            subtitle: "Những lần cùng nhau ngồi code từ 9h30 sáng đến 6h tối",
        },
        {
            image: "/src/assets/images/team3.jpg",
            title: "Sau buổi họp",
            subtitle: "Những khoảng khắc cùng nhau nghỉ ngơi sau 1 ngày học",
        },
        {
            image: "/src/assets/images/team4.jpg",
            title: "Kết quả đầu tiên",
            subtitle: "Chúng tôi hẹn nhau tại một quán cf để tiến hành chấm điểm đợt 1",
        },
        {
            image: "/src/assets/images/team5.jpg",
            title: "Cùng nhau hỗ trợ",
            subtitle: "Có khó khăn gì thì chúng tôi cũng sẵn sàng hỗ trợ lẫn nhau",
        },
    ];
    const team = [
        {
            name: 'Quốc Hưng',
            role: 'Leader / Backend Developer',
            image: "/src/assets/images/QH.png",
        },
        {
            name: 'Chấn Toàn',
            role: 'Frontend Developer',
            image: "/src/assets/images/CT.jpg",
        },
        {
            name: 'Bảo Hưng',
            role: 'Frontend Developer',
            image: "/src/assets/images/BH.jpg",
        },
        {
            name: 'Huy Hoàng',
            role: 'Frontend Developer',
            image: "/src/assets/images/HH.jpg",
        },
        {
            name: 'Ngọc Phương',
            role: 'Frontend Developer',
            image: "/src/assets/images/NP.png",
        },
        // More people...
    ];
    const nextSlide = () => {
        if (!isTransitioning) {
            setIsTransitioning(true);
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }
    };

    const prevSlide = () => {
        if (!isTransitioning) {
            setIsTransitioning(true);
            setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        }
    };
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsTransitioning(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [currentSlide]);
    const getSlideStyle = (index) => {
        let position = index - currentSlide;
        if (position < 0) position += slides.length;
        if (position >= slides.length) position -= slides.length;

        if (position === 0) {
            return {
                transform: 'translateX(-50%) perspective(1000px)',
                zIndex: 2,
                opacity: 1,
            };
        } else if (position === 1 || position === slides.length - 1) {
            const isNext = position === 1;
            return {
                transform: `translateX(${isNext ? '25%' : '-125%'})
                           perspective(1000px)
                           rotateY(${isNext ? '-45deg' : '45deg'})`,
                zIndex: 1,
                opacity: 0.7,
            };
        } else {
            return {
                transform: 'translateX(-50%) scale(0.8)',
                zIndex: 0,
                opacity: 0,
            };
        }
    };

    return (
        <>
            {/* banner */}
            <section
                className="blog-banner flex items-center justify-center xl:h-[340px] lg:h-[295px] md:h-[250px] sm:h-[170px] h-[150px] w-full"
                style={{
                    backgroundImage: "url(./src/assets/images/bannerblog.png)",
                    objectFit: "cover"
                }}
            >
                <div className="blog-banner-title">
                    <h1 className="lg:text-6xl md:text-4xl text-3xl font-title">
                        Về<span className="italic font-title text-yellow-500"> Chúng tôi</span>
                    </h1>
                </div>
            </section>

            {/* Aboutus */}
            <section className="aboutus">
                <div className="max-w-screen-xl mx-auto bg-white font-roboto ">

                    {/* describe */}
                    <div className="my-10">
                        {/* title */}
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold text-navy-900 mb-4">Giới thiệu</h1>
                            <p className="text-xl text-gray-600">Nhìn qua những thành viên trong nhóm chúng tôi</p>
                            <div className="w-24 h-1 bg-yellow-500 mx-auto mt-4"></div>
                        </div>

                        {/* list */}
                        <div className="grid grid-cols-3 gap-10 my-10">
                            {team.map((item, index) => (
                                <div className="" key={index}>
                                    <div className="border-black border-2">
                                        <img src={`${item.image}`} className='w-full h-[450px] object-cover' alt="" />
                                    </div>
                                    <div className="mt-3 space-y-1">
                                        <div className="text-2xl font-bold">
                                            <span>{item.name}</span>
                                        </div>
                                        <div className="text-xl">
                                            <p>{item.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* slider */}
                    <div className="my-10">
                        <div className=" mx-auto ">

                            {/* title */}
                            <div className="text-center mb-12">
                                <h1 className="text-4xl font-bold text-navy-900 mb-4">Hành trình</h1>
                                <p className="text-xl text-gray-600">Những cột mốc đánh dấu kỉ niệm của chúng tôi</p>
                                <div className="w-24 h-1 bg-yellow-500 mx-auto mt-4"></div>
                            </div>

                            {/* slider */}
                            <div className="relative h-[600px] overflow-hidden">
                                <div className="absolute w-full h-full">
                                    {slides.map((slide, index) => (
                                        <div key={index} className="absolute top-0 left-1/2 w-[600px] transition-all duration-500" style={{ ...getSlideStyle(index), transformOrigin: 'center center', }}>
                                            <Card className="overflow-hidden shadow-xl">
                                                <CardContent className="p-0">

                                                    <img src={slide.image} alt={slide.title} className="w-full h-[600px] object-cover" />
                                                    <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 to-transparent text-white">
                                                        <h2 className="text-3xl font-bold mb-2">{slide.title}</h2>
                                                        <p className="text-lg">{slide.subtitle}</p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    ))}
                                </div>

                                <Button variant="secondary" size="icon" className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white z-10" onClick={prevSlide} disabled={isTransitioning}>
                                    <ChevronLeft className="h-6 w-6" />
                                </Button>

                                <Button variant="secondary" size="icon" className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white z-10" onClick={nextSlide} disabled={isTransitioning}>
                                    <ChevronRight className="h-6 w-6" />
                                </Button>

                                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                    {slides.map((_, index) => (
                                        <button key={index} className={`w-3 h-3 rounded-full transition-colors duration-200 ${currentSlide === index ? 'bg-black' : 'bg-gray-300'}`} onClick={() => !isTransitioning && setCurrentSlide(index)} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* talk */}
                    <div className="my-10">
                        {/* title */}
                        <div className="text-center ">
                            <h1 className="text-4xl font-bold text-navy-900 mb-4">Đôi lời</h1>
                            <p className="text-xl text-gray-600">Những cảm xúc mà chúng tôi đã và đang có</p>
                            <div className="w-24 h-1 bg-yellow-500 mx-auto mt-4"></div>
                        </div>
                        {/* Nhũng gì chúng tôi làm */}
                        <div className=" shadow-lg px-10 py-16 rounded-xl">

                            {/* first grid */}
                            <div className="grid grid-cols-2 gap-5">

                                {/* grid left */}
                                <div className="mt-10">

                                    {/* left header */}
                                    <div className="">
                                        <div className="text-lg font-semibold text-yellow-600">
                                            <span>Antlearn team</span>
                                        </div>
                                        <div className="text-7xl font-bold leading-tight mt-10">
                                            <h1>Khi mọi giấc mơ cùng hội tụ chung một con đường</h1>
                                        </div>
                                    </div>

                                    {/* left footer */}
                                    <div className="mt-28 leading-8">
                                        <p>Từ những công đoạn chuẩn bị sớm trước vài tuần cho dự án, từ khâu thiết kế, nêu ý tưởng, định kiến kế hoạch và kết quả đạt được. cho đến những buổi họp mặt online và các thảo luận qua tin nhắn. Cùng với những nỗ lực không ngừng của team, dự án được thực hiện vượt quá mong đợi của cả nhóm. Chúng tôi học hỏi được nhiều thứ, cùng nhau tiến bộ, cùng nhau hỗ trợ, giúp đỡ nhau khi gặp khó khăn. Chúng tôi tự hào vì chúng tôi đã có một hành trình đầy thử thách nhưng mọi công sức của đã được đền đáp. Chúng tôi tin rằng cả nhóm đã có một hành trình không ít gian nan những thành quả thì vô cùng xứng đáng.</p>
                                    </div>
                                </div>

                                {/* grid right */}
                                <div className="">

                                    {/* right header */}
                                    <div className="rounded-xl">
                                        <img src="/src/assets/images/team1.jpg" className='rounded-xl' alt="" />
                                    </div>

                                    {/* right footer */}
                                    <div className="mt-10">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-gray-100 rounded-xl ">
                                                <div className="space-y-2 p-8">
                                                    <span className='text-3xl font-bold'>3 tháng +</span>
                                                    <p>Thời gian thực hiện</p>
                                                </div>
                                            </div>
                                            <div className="bg-gray-100 rounded-xl ">
                                                <div className="space-y-2 p-8">
                                                    <span className='text-3xl font-bold'>20 +</span>
                                                    <p>Cuộc họp / gặp mặt</p>
                                                </div>
                                            </div>
                                            <div className="bg-gray-100 rounded-xl ">
                                                <div className="space-y-2 p-8">
                                                    <span className='text-3xl font-bold'>1500 +</span>
                                                    <p>Số lần commit</p>
                                                </div>
                                            </div>
                                            <div className="bg-gray-100 rounded-xl ">
                                                <div className="space-y-2 p-8">
                                                    <span className='text-3xl font-bold'>1</span>
                                                    <p>Mục tiêu</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Truyền cảm hứng */}
                            <div className="flex justify-center my-20 font-polite">
                                <div className="">
                                    <div className="text-center font-medium w-[700px] text-3xl " >
                                        &quot;Đừng quan tâm ước mơ của bạn lớn lao như thế nào, hay là bạn nhỏ nhoi như thế nào, bởi vì
                                        <br />Ai cũng phải bắt đầu từ đâu đó&quot;
                                    </div>
                                    <div className="text-right mt-5">
                                        <p>~HIEUTHUHAI</p>
                                    </div>
                                </div>
                            </div>

                            {/* second grid */}
                            <div className="grid grid-cols-2 gap-10">

                                {/* grid left */}
                                <div className="bg-gray-100 p-3  w-full">
                                    <img src="/src/assets/images/aboutus.png" className='rounded-xl object-cover h-96' alt="" />
                                </div>

                                {/* grid right */}
                                <div className="space-y-10 mt-5">
                                    <span className='text-yellow-600 font-bold text-7xl'>From zero to hero</span>
                                    <p className='text-xl leading-relaxed'>Chúng tôi chỉ đặt những tiêu chí đơn giản khi bắt đầu dự án, những gì khó quá có thể bỏ qua. Nhưng sau những gì chúng tôi thảo luận và lên ý tưởng, cùng nhau xây dựng, đến bây giờ chúng tôi đã đạt được những thành quả mà chúng tôi không ngờ đến.</p>
                                    <p className='text-xl leading-relaxed'>Đứa con tinh thần Antlearn này sẽ là bàn đạp và bước tiến nối tiếp những thành công sau này của từng thành viên trong nhóm.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Link */}
                    <div className="my-10 ">

                        {/* title */}
                        <div className="text-center ">
                            <h1 className="text-4xl font-bold text-navy-900 mb-4">Những liên kết</h1>
                            <p className="text-xl text-gray-600">Biết thêm nhiều hơn về chúng tôi</p>
                            <div className="w-24 h-1 bg-yellow-500 mx-auto mt-4"></div>
                        </div>

                        {/* Button */}
                        <div className="flex justify-center mt-10 ">
                            <div className="grid grid-cols-2 gap-5 ">
                                <div className="bg-gray-100 p-10 text-center  rounded-lg hover:bg-black duration-300 hover:text-white cursor-pointer">
                                    <Link  className='space-y-3'>
                                        <div className="flex justify-center">
                                            <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/facebook.svg" className='w-8' alt="" />
                                        </div>
                                        <div className="">
                                            <span className='text-lg font-semibold'>Facebook</span>
                                        </div>
                                        <div>
                                            <p className=' '>Fanpage của chúng tôi</p>
                                        </div>
                                    </Link>

                                </div>
                                <div className="bg-gray-100 p-10 text-center  rounded-lg hover:bg-black duration-300 hover:text-white cursor-pointer">
                                    <Link className='space-y-3'>
                                        <div className="flex justify-center">
                                            <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/github.svg" className='w-8' alt="" />
                                        </div>
                                        <div >
                                            <span className="text-lg font-semibold">Github</span>
                                        </div>
                                        <div>
                                            <p>Github của chúng tôi</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </section>
        </>
    )
}
