
import './App.css'
import LandingPage from './components/Pages/LandingPage.tsx';
import Login from "./components/UserForms /login.tsx";
import Register from "./components/UserForms /register.tsx";

function App() {

  return <>
    <Register/>
    <Login/>
    <LandingPage userId='1' username='Will' />
  </>
}

export default App
