import "./App.css";
import Login from "./components/UserForms/login.tsx";
import Register from "./components/UserForms/register.tsx";
import LandingPage from "./components/Pages/LandingPage.tsx";
import SessionPage from "./components/Pages/SessionPage.tsx";
// import ProtectedRoute from "./components/UserForms /protected.tsx";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function App() {
  // Attempt to get the userId from localStorage
  // If it exists, the user is logged in
  const userId = localStorage.getItem("user_id");

  const RequireAuth = ({ children }: { children: JSX.Element }) => {
    return userId ? children : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={
          <RequireAuth>
            <LandingPage />
          </RequireAuth>
        } />
        <Route path="/dashboard" element={
          <RequireAuth>
            <LandingPage />
          </RequireAuth>
        } />
        <Route path="/chart" element={
          <RequireAuth>
            <SessionPage />
          </RequireAuth>
        } />
      </Routes>
    </Router>
  );
}

export default App;
