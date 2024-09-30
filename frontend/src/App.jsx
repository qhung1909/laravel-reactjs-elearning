import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./pages/login/login.jsx";
import { Lession } from "./pages/lession/lession.jsx";
import { Detail } from "./pages/detail/detail.jsx";
import { Dashboard } from "./pages/admin/admin.jsx";
import { Courses } from "./pages/courses/course.jsx";
import { PaymentComponent } from "./pages/testing/payment-vnpay.jsx";
import Home from "./pages/home/home.jsx";
import Header from "./pages/header/header.jsx";
import Footer from "./pages/footer/footer.jsx";
import Blog from './pages/blog/blog.jsx';
import Blogdetail from './pages/blogdetail/blogdetail.jsx'
function App() {
    return (
        <>
            <Router>
                <Header />
                <Routes>
                    <Route path="/blog" element={<Blog/>}></Route>
                    <Route path="/blogdetail" element={<Blogdetail/>}></Route>
                    <Route path="/admin" element={<Dashboard />}></Route>
                    <Route path="/" element={<Home />}></Route>
                    <Route path="/login" element={<Login />}></Route>
                    <Route path="/courses" element={<Courses/>}></Route>
                    <Route path="/lession" element={<Lession />}></Route>
                    <Route path="/detail/:slug" element={<Detail />}></Route>
                    <Route path="/tests" element={<PaymentComponent />}></Route>
                </Routes>
                <Footer />
            </Router>
        </>
    );
}

export default App;
