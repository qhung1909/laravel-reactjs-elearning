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
import Dashboard from "./pages/admin/Dashboard/admin.jsx";
import { Courses } from "./pages/courses/course.jsx";
import { Blog } from "./pages/blog/blog.jsx";
import { Blogdetail } from "./pages/blogdetail/blogdetail.jsx";
import { Contact } from "./pages/contact/contact.jsx";
import { Home } from "./pages/home/home.jsx";
import { Header } from "./pages/header/header.jsx";
import { Footer } from "./pages/footer/footer.jsx";
// import AdminRole from "./pages/role/adminRole.jsx";
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
import { UserOrderHistory } from "./pages/userprofile/userorderhistory.jsx";
import { UserNoti } from "./pages/userprofile/usernoti.jsx";
import ScrollToTop from "./pages/scrollToTop/scrollToTop.jsx";
import { Quizzes } from './pages/quizzes/quizzes.jsx';
import { NewPassword } from "./pages/recoverPassword/newPassword.jsx";
import { ResetPassword } from "./pages/recoverPassword/resetPassword.jsx";
import { VerifyEmail } from "./pages/recoverPassword/verifyEmail.jsx";
import { UserContext, UserProvider } from "./pages/context/usercontext.jsx";
import { CategoriesContext, CategoriesProvider } from "./pages/context/categoriescontext.jsx";
import { CoursesContext, CoursesProvider } from "./pages/context/coursescontext.jsx";
import { Example } from "./pages/admin/example.jsx";
import CourseList from "./pages/admin/ManageCourses/courseList.jsx";
import { BrowseNewCourses } from "./pages/admin/ManageCourses/browseNewCourses.jsx";
import InformationCourse from "./pages/admin/ManageCourses/informationCourse.jsx";
import { CategoriesList } from "./pages/admin/ManageCategories/CategoriesList.jsx";


function AppContent() {
    const location = useLocation();
    const isAdminPage = location.pathname === "/admin";
    const isPageNotFound =
        ![
            "/blogs/:slug",
            "/blog",
            "/contact",
            "/",
            "/courses",
            "/payment-result",
            "/payment",
            "/cart",
            "/user/profile",
            "/user/orderhistory",
            "/user/noti",
        ].includes(location.pathname) &&
        !location.pathname.startsWith("/detail/") &&
        !location.pathname.startsWith("/blogs/");

    return (
        <>
            <ScrollToTop />
            {!isAdminPage && !isPageNotFound && <Header />}
            <Routes>
                <Route path="/demo" element={<Demo />}></Route>
                <Route path="/user/orderhistory" element={<UserOrderHistory />}></Route>
                <Route path="/user/profile" element={<UserProfile />}></Route>
                <Route path="/user/noti" element={<UserNoti />}></Route>
                <Route path="/instructor" element={<Instructor />}></Route>
                <Route
                    path="/instructor/history"
                    element={<InstructorHistory />}
                ></Route>
                <Route
                    path="/instructor/lessson"
                    element={<InstructorLesson />}
                ></Route>
                <Route
                    path="/instructor/profile"
                    element={<InstructorProfile />}
                ></Route>

                <Route path="/contact" element={<Contact />}></Route>
                {/* <Route
                    path="/admin"
                    element={<AdminRole element={<Dashboard />} />}
                ></Route> */}
                <Route
                    path="/admin"
                    element={<Dashboard />}
                ></Route>
                {/* <Route path="/admin/course-list" element={<AdminCourseList />}></Route> */}
                <Route path="/admin/example" element={<Example />}></Route>
                <Route path="/admin/course-list" element={<CourseList />}></Route>
                <Route path="/admin/information-course" element={<InformationCourse />}></Route>
                <Route path="/admin/browse-new-courses" element={<BrowseNewCourses />}></Route>

                <Route path="/admin/categories-list" element={<CategoriesList />}></Route>


                <Route path="/" element={<Home />}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/register" element={<Signup />}></Route>
                <Route path="/reset-password" element={<ResetPassword />}></Route>
                <Route path="/new-password" element={<NewPassword />}></Route>
                <Route path="/verify-email" element={<VerifyEmail />}></Route>
                <Route path="/courses" element={<Courses />}></Route>
                <Route path="/lessons/:slug" element={<Lesson />}></Route>
                <Route path="/blogs/:slug" element={<Blogdetail />}></Route>
                <Route path="/blog" element={<Blog />}></Route>
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
                    path="/quizzes"
                    element={<Quizzes />}
                ></Route>
                <Route
                    path="/quizzes/:quiz_id"
                    element={<Quizzes />}
                ></Route>
            </Routes>
            {!isAdminPage && !isPageNotFound && <Footer />}
        </>
    );
}

function App() {
    return (
        <Router>
            <UserProvider>
                <CoursesProvider>
                    <CategoriesProvider>
                        <AppContent />
                    </CategoriesProvider>
                </CoursesProvider>
            </UserProvider>
        </Router>

    );
}

export default App;
