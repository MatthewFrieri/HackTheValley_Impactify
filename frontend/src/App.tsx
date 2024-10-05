
import './App.css'
import LandingPage from './components/Pages/LandingPage.tsx';
import Login from "./components/UserForms /login.tsx";

function App() {

  return <>
    <Login/>
    <LandingPage userId='1' username='Will' />
  </>
}

export default App
