
import './App.css'
import LandingPage from './components/Pages/LandingPage.tsx';
import Login from "./components/UserForms /login.tsx";
import Register from "./components/UserForms /register.tsx";
import ProtectedRoute from "./components/UserForms /protected.tsx";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <Router>
            <Routes>
                {/* Wrap the /dashboard route with ProtectedRoute */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <LandingPage userId="1" username="Will" />
                        </ProtectedRoute>
                    }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    );
}

export default App
