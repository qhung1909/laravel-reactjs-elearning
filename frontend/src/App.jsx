import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./pages/login/login.jsx";
import { Lession } from "./pages/lession/lession.jsx";
import { Detail } from "./pages/detail/detail.jsx";
import { Dashboard } from "./pages/admin/admin.jsx";
import Home from "./pages/home/home.jsx";
import Header from "./pages/header/header.jsx";
import Footer from "./pages/footer/footer.jsx";

function App() {
    return (
        <>
            <Router>
                <Header />
                <Routes>

                    <Route path="/admin" element={<Dashboard />}></Route>
                    
                    <Route path="/" element={<Home />}></Route>

                    <Route path="/login" element={<Login />}></Route>
                    <Route path="/lession" element={<Lession />}></Route>
                    <Route path="/detail" element={<Detail />}></Route>

                </Routes>
                <Footer />
            </Router>
        </>
    );
}

export default App;
