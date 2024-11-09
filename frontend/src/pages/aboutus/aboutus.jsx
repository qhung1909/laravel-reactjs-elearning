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
                
            </section>
        </>
    )
}
