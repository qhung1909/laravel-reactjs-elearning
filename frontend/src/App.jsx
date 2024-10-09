import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Login } from "./pages/login/login.jsx";
import { Signup } from "./pages/signup/signup.jsx";
import { Lession } from "./pages/lession/lession.jsx";
import { Detail } from "./pages/detail/detail.jsx";
import { Dashboard } from "./pages/admin/admin.jsx";
import { Courses } from "./pages/courses/course.jsx";
import { PaymentComponent } from "./pages/testing/payment-vnpay.jsx";
import { PaymentResult } from "./pages/testing/redicted-vnpay.jsx";
import Blog from './pages/blog/blog.jsx';
import Blogdetail from "./pages/blogdetail/blogdetail.jsx";
import Contact from './pages/contact/contact.jsx';
import { Home } from "./pages/home/home.jsx";
import Header from "./pages/header/header.jsx";
import Footer from "./pages/footer/footer.jsx";
import AdminRole from "./pages/role/adminRole.jsx";
import { PageNotFound } from "./pages/pageNotFound/pageNotFound.jsx";
import { Payment } from "./pages/payment/payment.jsx";
import { Cart } from "./pages/cart/cart.jsx";
function AppContent() {
    const location = useLocation();
    const isAdminPage = location.pathname === '/admin';
    const isPageNotFound = !['/blogdetail', '/blog', '/contact', '/admin', '/', '/login', '/register', '/courses', '/lession', '/tests', '/tests-payment','/payment','/cart'].includes(location.pathname) && !location.pathname.startsWith('/detail/');

    return (
        <>
            {!isAdminPage && !isPageNotFound && <Header />}
            <Routes>
                <Route path="/blogdetail" element={<Blogdetail/>}></Route>
                <Route path="/blog" element={<Blog/>}></Route>
                <Route path="/contact" element={<Contact/>}></Route>
                <Route path="/admin" element={<AdminRole element={<Dashboard />} />}></Route>
                <Route path="/" element={<Home />}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/register" element={<Signup />}></Route>
                <Route path="/courses" element={<Courses/>}></Route>
                <Route path="/lession" element={<Lession />}></Route>
                <Route path="/detail" element={<Detail />}></Route>
                <Route path="*" element={<PageNotFound />}></Route>
                <Route path="/404" element={<PageNotFound />}></Route>
                <Route path="/detail/:slug" element={<Detail />}></Route>
                <Route path="/tests" element={<PaymentComponent />}></Route>
                <Route path="/tests-payment" element={<PaymentResult />}></Route>
                <Route path="/payment" element={<Payment />}></Route>
                <Route path="/cart" element={<Cart />}></Route>
            </Routes>
            {!isAdminPage && !isPageNotFound && <Footer />}
        </>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
