import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./pages/login/login.jsx";
import { Lession } from "./pages/lession/lession.jsx";
import { Detail } from "./pages/detail/detail.jsx";

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />}></Route>
                    <Route path="/lession" element={<Lession />}></Route>
                    <Route path="/detail" element={<Detail />}></Route>

                </Routes>
            </Router>
        </>
    );
}

export default App;
