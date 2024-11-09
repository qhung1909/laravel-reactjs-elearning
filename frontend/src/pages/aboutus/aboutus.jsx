const people = [
    {
        name: 'Quốc Hưng',
        role: 'Leader / Backend Developer',
        imageUrl:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
        name: 'Huy Hoàng',
        role: 'Frontend Developer',
        imageUrl:
            'https://images.unsplash.com/photo-1502767089023-4d9f95b03a61?crop=faces&fit=crop&h=256&w=256',
    },
    {
        name: 'Bảo Hưng',
        role: 'Frontend Developer',
        imageUrl:
            'https://images.unsplash.com/photo-1502230319004-65a6bcad11fd?crop=faces&fit=crop&h=256&w=256',
    },
    {
        name: 'Chấn Toàn',
        role: 'Frontend Developer',
        imageUrl:
            'https://images.unsplash.com/photo-1468464647861-d56a75265873?crop=faces&fit=crop&h=256&w=256',
    },
    {
        name: 'Ngọc Phương',
        role: 'Frontend Developer',
        imageUrl:
            'https://images.unsplash.com/photo-1502764618675-cb5f1ca4d4e2?crop=faces&fit=crop&h=256&w=256',
    },
    // More people...
];
export const Aboutus = () => {
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
                    <h1 className="lg:text-5xl md:text-4xl text-3xl font-title">
                        Về<span className="italic font-title text-yellow-500"> Chúng tôi</span>

                    </h1>
                </div>
            </section>

            {/* Aboutus */}
            <section className="aboutus">
                <div className="bg-white py-24 sm:py-32">
                    <div className="mx-auto grid max-w-7xl gap-20 px-6 lg:px-8 xl:grid-cols-3">
                        <div className="max-w-xl">
                            <h2 className="text-pretty text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                                Meet our leadership
                            </h2>
                            <p className="mt-6 text-lg/8 text-gray-600">
                                We’re a dynamic group of individuals who are passionate about what we do and dedicated to delivering the best results for our clients.
                            </p>
                        </div>
                        <ul role="list" className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
                            {people.map(({ name, imageUrl, role }) => (
                                <li key={name}>
                                    <div className="flex items-center gap-x-6">
                                        <img alt={name} src={imageUrl} className="h-16 w-16 rounded-full" />
                                        <div>
                                            <h3 className="text-base/7 font-semibold tracking-tight text-gray-900">{name}</h3>
                                            <p className="text-sm/6 font-semibold text-indigo-600">{role}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
        </>
    )
}
