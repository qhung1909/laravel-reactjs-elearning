import { Link } from "react-router-dom";

export const VerificationEmail = () => {
    return (
        <>
            <link
                href="https://fonts.googleapis.com/css?family=Lato:300,400|Montserrat:700"
                rel="stylesheet"
                type="text/css"
            />
            <style
                dangerouslySetInnerHTML={{
                    __html:
                        `
                        @import url(//cdnjs.cloudflare.com/ajax/libs/normalize/3.0.1/normalize.min.css);
                        @import url(//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css);

                        .main-content__checkmark {
                            color: #FACC15 !important;
                            font-size: 72px;
                        }
                    `
                }}
            />
            <link
                rel="stylesheet"
                href="https://2-22-4-dot-lead-pages.appspot.com/static/lp918/min/default_thank_you.css"
            />
            <header className="site-header" id="header">
                <h1 className="site-header__title" data-lead-id="site-header-title">
                    XIN CẢM ƠN!
                </h1>
            </header>
            <div className="main-content">
                <i className="fa fa-check main-content__checkmark" id="checkmark" />
                <p className="main-content__body pb-6" data-lead-id="main-content-body">
                    Cảm ơn bạn đã xác nhận email, vui lòng quay về trang đăng nhập để truy cập vào tài khoản của bạn
                </p>
                <Link to="/login" className=" underline underline-offset-2">
                 <button className=" w-56 h-12 bg-yellow-400 text-white font-medium rounded-full hover:bg-yellow-500">
                    <p className="font-bold text-slate-900">Trở về trang đăng nhập</p>
                </button>

                </Link>
            </div>
            <footer className="site-footer" id="footer">
                <p className="site-footer__fineprint pt-12 lg:pt-0" id="fineprint">
                    Copyright ©2024 | All Rights Reserved
                </p>
            </footer>
        </>
    );
};
