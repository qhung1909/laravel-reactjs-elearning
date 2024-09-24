import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./pages/login/login.jsx";
import { Lession } from "./pages/lession/lession.jsx";

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />}></Route>
                    <Route path="/lession" element={<Lession />}></Route>


                </Routes>
            </Router>
        </>
    );
}

export default App;
