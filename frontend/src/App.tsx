// App.tsx
import './App.css';
import Login from './components/UserForms/login';
import Register from './components/UserForms/register';
import LandingPage from './components/Pages/LandingPage';
import SessionPage from './components/Pages/SessionPage';
import About from './components/Pages/about.tsx';
import Layout from './components/layout.tsx';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {

  const RequireAuth = ({ children }: { children: JSX.Element }) => {
    return localStorage.getItem('user_id') ? children : <Navigate to="/login" replace />;
  };

  return (
    <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <Layout>
                    <LandingPage />
                  </Layout>
                </RequireAuth>
              }
          />
          <Route
              path="/chart"
              element={
                <RequireAuth>
                  <Layout>
                    <SessionPage />
                  </Layout>
                </RequireAuth>
              }
          />
            <Route
                path="/about"
                element={
                    <RequireAuth>
                        <Layout>
                            <About />
                        </Layout>
                    </RequireAuth>
                }
            />

            {/* Redirect all other routes */}
          <Route
              path="*"
              element={<Navigate to="/dashboard" replace />}
          />
        </Routes>
      </Router>
    </SnackbarProvider>
  );
}

export default App;
