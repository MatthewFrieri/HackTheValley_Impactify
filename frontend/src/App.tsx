import "./App.css";
import LiveChart from "./components/charts/LiveChart.tsx";
import LandingPage from "./components/Pages/LandingPage.tsx";
import Login from "./components/UserForms /login.tsx";
import Register from "./components/UserForms /register.tsx";
// import ProtectedRoute from "./components/UserForms /protected.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        {/* Wrap the /dashboard route with ProtectedRoute */}
        <Route path="/dashboard" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chart" element={<LiveChart />} />
      </Routes>
    </Router>
  );
}

export default App;
