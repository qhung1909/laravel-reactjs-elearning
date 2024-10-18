import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";
import { Login } from "./pages/login/login.jsx";
import { Signup } from "./pages/signup/signup.jsx";
import { Lesson } from "./pages/lession/lession.jsx";
import { Detail } from "./pages/detail/detail.jsx";
import { Dashboard } from "./pages/admin/admin.jsx";
import { Courses } from "./pages/courses/course.jsx";
import { Blog } from "./pages/blog/blog.jsx";
import { Blogdetail } from "./pages/blogdetail/blogdetail.jsx";
import { Contact } from "./pages/contact/contact.jsx";
import { Home } from "./pages/home/home.jsx";
import { Header } from "./pages/header/header.jsx";
import { Footer } from "./pages/footer/footer.jsx";
import AdminRole from "./pages/role/adminRole.jsx";
import { PageNotFound } from "./pages/pageNotFound/pageNotFound.jsx";
import { Payment } from "./pages/payment/payment.jsx";
import { Cart } from "./pages/cart/cart.jsx";
import { Instructor } from "./pages/instructor/instructor.jsx";
import { InstructorHistory } from "./pages/instructor/instructorHistory.jsx";
import { InstructorLesson } from "./pages/instructor/instructorLesson.jsx";
import { InstructorProfile } from "./pages/instructor/instructorProfile.jsx";
import { PaymentResult } from "./pages/payment/payment-result.jsx";
import { VerificationEmail } from "./pages/verification/verification-email.jsx";
import Demo from "./pages/teacher/demo.jsx";
import { UserProfile } from "./pages/userprofile/userprofile.jsx";
import { UserAccount } from "./pages/userprofile/useraccount.jsx";
import { UserNoti } from "./pages/userprofile/usernoti.jsx";
import ScrollToTop from "./pages/scrollToTop/scrollToTop.jsx";
import { QuizSingleChoice } from './pages/quizzes/quizSingleChoice';
import { QuizFillInBlank } from "./pages/quizzes/quizFillInBlank.jsx";
import { QuizMultipleChoice } from "./pages/quizzes/quizMultipleChoice.jsx";
import { QuizTrueFalse } from "./pages/quizzes/quizTrueFalse.jsx";

function AppContent() {
    const location = useLocation();
    const isAdminPage = location.pathname === "/admin";
    const isPageNotFound =
        ![
            "/blogdetail",
            "/blog",
            "/contact",
            "/",
            "/courses",
            "/payment-result",
            "/payment",
            "/cart",
            "/userprofile",
            "/useraccount",
            "/usernoti",
        ].includes(location.pathname) &&
        !location.pathname.startsWith("/detail/");

    return (
        <>
            <ScrollToTop />
            {!isAdminPage && !isPageNotFound && <Header />}
            <Routes>
                <Route path="/demo" element={<Demo />}></Route>
                <Route path="/useraccount" element={<UserAccount />}></Route>
                <Route path="/userprofile" element={<UserProfile />}></Route>
                <Route path="/usernoti" element={<UserNoti />}></Route>
                <Route path="/instructor" element={<Instructor />}></Route>
                <Route
                    path="/instructorhistory"
                    element={<InstructorHistory />}
                ></Route>
                <Route
                    path="/instructorlessson"
                    element={<InstructorLesson />}
                ></Route>
                <Route
                    path="/instructorprofile"
                    element={<InstructorProfile />}
                ></Route>
                <Route path="/blogdetail" element={<Blogdetail />}></Route>
                <Route path="/blog" element={<Blog />}></Route>
                <Route path="/contact" element={<Contact />}></Route>
                <Route
                    path="/admin"
                    element={<AdminRole element={<Dashboard />} />}
                ></Route>
                <Route path="/" element={<Home />}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/register" element={<Signup />}></Route>
                <Route path="/courses" element={<Courses />}></Route>
                <Route path="/lesson" element={<Lesson />}></Route>
                <Route path="/detail" element={<Detail />}></Route>
                <Route path="*" element={<PageNotFound />}></Route>
                <Route path="/404" element={<PageNotFound />}></Route>
                <Route path="/detail/:slug" element={<Detail />}></Route>
                <Route
                    path="/payment-result"
                    element={<PaymentResult />}
                ></Route>
                <Route path="/payment" element={<Payment />}></Route>
                <Route path="/cart" element={<Cart />}></Route>
                <Route
                    path="/verification-success"
                    element={<VerificationEmail />}
                ></Route>
                <Route
                    path="/quizSingleChoice"
                    element={<QuizSingleChoice />}
                ></Route>
                <Route
                    path="/quizFillInBlank"
                    element={<QuizFillInBlank />}
                ></Route>
                <Route
                    path="/quizMultipleChoice"
                    element={<QuizMultipleChoice />}
                ></Route>
                <Route
                    path="/quizTrueFlase"
                    element={<QuizTrueFalse />}
                ></Route>
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
