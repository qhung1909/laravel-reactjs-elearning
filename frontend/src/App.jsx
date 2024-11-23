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
import { Terms } from "./pages/terms/terms.jsx";
import { Aboutus } from "./pages/aboutus/aboutus.jsx";
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
import { InstructorSchedule } from "./pages/instructor/instructorSchedule.jsx";
import { PaymentResult } from "./pages/payment/payment-result.jsx";
import { VerificationEmail } from "./pages/verification/verification-email.jsx";
import { UserProfile } from "./pages/userprofile/userprofile.jsx";
import { UserOrderHistory } from "./pages/userprofile/userorderhistory.jsx";
import { UserNoti } from "./pages/userprofile/usernoti.jsx";
import { UserFavorite } from "./pages/userprofile/userfavorite.jsx";
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
import { CategoryCrud } from "./pages/admin/ManageCategories/categoryCrud.jsx";
import { CategoryList } from "./pages/admin/ManageCategories/CategoryList.jsx";
import { BlogCrud } from "./pages/admin/ManageContent/BlogCrud.jsx";
import { PriorityCategory } from "./pages/admin/ManageCategories/PriorityCategory.jsx";
import CourseStatus from "./pages/admin/ManageCourses/courseStatus.jsx";
import { CoursesOfCategory } from "./pages/admin/ManageCategories/CoursesOfCategory.jsx";
import ClassifyCourse from "./pages/admin/ManageCourses/classifyCourses.jsx";
import PageCoupons from "./pages/admin/ManageCourses/pageCoupons.jsx";
import BrowseNewCourses from "./pages/admin/ManageCourses/browseNewCourses.jsx";
import TaskList from "./pages/notifications/notification.jsx";
import { InstructorNotification } from "./pages/instructor/instuctorNotification.jsx";
import { CourseOverview } from "./pages/CreateCourse/courseOverview.jsx";
import { Curriculum } from "./pages/CreateCourse/curriculum.jsx";
import Demo from "./pages/demo/Demo.jsx";
import { CreateQuiz } from "./pages/CreateCourse/CreateQuiz.jsx";
import ListStudents from "./pages/admin/ManageAcount/ListStudents.jsx";
import ListTeachers from "./pages/admin/ManageAcount/ListTeachers.jsx";
import ClassifyUsers from "./pages/admin/ManageAcount/ClassifyUsers.jsx";
import { ThemeProvider } from "./components/ui/theme-provider.jsx";
import PersonalInformation from "./pages/admin/ManageAcount/PersonalInformation.jsx";
import { ManageHeader } from "./pages/admin/ManageHeaderFooter/ManageHeader.jsx";
import Draft from "./pages/admin/ManageCourses/draft.jsx";
import ManageFooter from "./pages/admin/ManageHeaderFooter/ManageFooter.jsx";
import DetailCourse from "./pages/admin/ManageCourses/detailCourse.jsx";
import { CmtCrud } from "./pages/admin/ManageComments/cmtCrud.jsx";
import JitsiMeeting from "./pages/jitsi/jitsi.jsx";
import ScheduleList from "./pages/admin/ManageScheduleList/ScheduleList.jsx";
import ManageMeetRoom from "./pages/admin/ManageScheduleList/ManageMeetRoom.jsx";
import CertificateDetailPage from "./pages/certificate/certificatePage.jsx";
import ManageCertificate from "./pages/certificate/ManageCertificate.jsx";
import ScheduleManagement from "./pages/schedule/template.jsx";
import PersonalPage from "./pages/personalPage/personal.jsx";
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
            "/user/favorite",
            "/user/noti/:id",
            "/terms",
            "/aboutus",
            "/certificate/:id",
            "/user/certificate",
            "/user/schedule",
            "/teacher/:id"
        ].includes(location.pathname) &&
        !location.pathname.startsWith("/detail/") &&
        !location.pathname.startsWith("/user/noti/") &&
        !location.pathname.startsWith("/blogs/") &&
        !location.pathname.startsWith("/user/schedule")&&
        !location.pathname.startsWith("/certificate/")&&
        !location.pathname.startsWith("/teacher/");



    return (
        <>
            <ScrollToTop />
            {!isAdminPage && !isPageNotFound && <Header />}
            <Routes>
            
                <Route path="/teacher/:id" element={<PersonalPage />}></Route>
                <Route path="/demo" element={<Demo />}></Route>
                <Route path="/user/certificate" element={<ManageCertificate />}></Route>
                <Route path="/user/orderhistory" element={<UserOrderHistory />}></Route>
                <Route path="/user/profile" element={<UserProfile />}></Route>
                <Route path="/user/noti" element={<UserNoti />}></Route>
                <Route path="/user/favorite" element={<UserFavorite />}></Route>
                <Route path="/instructor" element={<Instructor />}></Route>
                <Route path="/instructor/history" element={<InstructorHistory />}></Route>
                <Route path="/instructor/lessson" element={<InstructorLesson />}></Route>
                <Route path="/instructor/notification" element={<InstructorNotification />}></Route>
                <Route path="/instructor/profile" element={<InstructorProfile />}></Route>
                <Route path="/instructor/schedule" element={<InstructorSchedule />}></Route>
                <Route path="/contact" element={<Contact />}></Route>

                <Route path="/course/manage/:course_id/course-overview" element={<CourseOverview />}></Route>
                <Route path="/course/manage/:course_id/curriculum" element={<Curriculum />}></Route>
                <Route path="/course/manage/:course_id/create-quiz/:content_id/quiz/:quiz_id" element={<CreateQuiz />}></Route>

                {/* <Route path="/admin" element={<AdminRole element={<Dashboard />} />}></Route> */}
                <Route path="/admin" element={<Dashboard />}></Route>
                <Route path="/admin/example" element={<Example />}></Route>
                <Route path="/admin/course-list" element={<CourseList />}></Route>
                <Route path="/admin/browse-new-courses" element={<BrowseNewCourses />}></Route>
                <Route path="/admin/course-status" element={<CourseStatus />}></Route>
                <Route path="/admin/classify-course" element={<ClassifyCourse />}></Route>
                <Route path="/admin/page-coupons" element={<PageCoupons />}></Route>
                <Route path="/admin/category-list" element={<CategoryList />}></Route>
                <Route path="/admin/category-crud" element={<CategoryCrud />}></Route>
                <Route path="/admin/priority-category" element={<PriorityCategory />}></Route>
                <Route path="/admin/courses-of-category" element={<CoursesOfCategory />}></Route>
                <Route path="/admin/blogs" element={<BlogCrud />}></Route>
                <Route path="/admin/comments" element={<CmtCrud />}></Route>
                <Route path="/admin/list-students" element={<ListStudents />}></Route>
                <Route path="/admin/list-teachers" element={<ListTeachers />}></Route>
                <Route path="/admin/classify-users" element={<ClassifyUsers />}></Route>
                <Route path="/admin/personal-information" element={<PersonalInformation />}></Route>
                <Route path="/admin/manage-footer" element={<ManageFooter />}></Route>
                <Route path="/admin/manage-header" element={<ManageHeader />}></Route>
                <Route path="/admin/teaching-schedule-list" element={<ScheduleList />}></Route>
                <Route path="/admin/manage-meet-room" element={<ManageMeetRoom />}></Route>


                <Route path="/admin/draft" element={<Draft />}></Route>
                <Route path="/admin/courses/:course_id" element={<DetailCourse />} />


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
                <Route path="/terms" element={<Terms />}></Route>
                <Route path="/aboutus" element={<Aboutus />}></Route>
                <Route path="/detail" element={<Detail />}></Route>
                <Route path="*" element={<PageNotFound />}></Route>
                <Route path="/404" element={<PageNotFound />}></Route>
                <Route path="/detail/:slug" element={<Detail />}></Route>
                <Route path="/payment-result" element={<PaymentResult />}></Route>
                <Route path="/payment" element={<Payment />}></Route>
                <Route path="/cart" element={<Cart />}></Route>
                <Route path="/verification-success" element={<VerificationEmail />}></Route>
                <Route path="/quizzes" element={<Quizzes />}></Route>
                <Route path="/quizzes/:quiz_id" element={<Quizzes />}></Route>
                <Route path="/notifications" element={<TaskList />}></Route>
                <Route path="/lesson/meeting/:id" element={<JitsiMeeting />}></Route>
                <Route path="/certificate/:id" element={<CertificateDetailPage />}></Route>
                <Route path="/user/schedule" element={<ScheduleManagement />}></Route>
                
            </Routes>
            {!isAdminPage && !isPageNotFound && <Footer />}
        </>
    );
}

function App() {
    return (
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <Router>
                <UserProvider>
                    <CategoriesProvider>
                        <CoursesProvider>
                            <AppContent />
                        </CoursesProvider>
                    </CategoriesProvider>
                </UserProvider>
            </Router>
        </ThemeProvider>


    );
}

export default App;
