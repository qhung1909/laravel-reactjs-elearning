import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Login } from '../public/hhoang/public/login'
import { Signup } from '../public/hhoang/public/signup';
import { Lession } from '../public/hhoang/public/lession';
function App() {

    return (
        <>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/lession" element={<Lession />} />

                </Routes>
            </Router>
        </>
    )
}

export default App
