// import React, { useEffect, useState } from 'react';
// import { Navigate } from 'react-router-dom';
// import api from '../../utils/api'; // Axios or Fetch API configuration
//
// interface ProtectedRouteProps {
//     children: React.ReactNode;
// }
//
// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
//     const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
//
//     useEffect(() => {
//         // Make an API call to check if the session is valid
//         const checkAuth = async () => {
//             try {
//                 const response = await api.get('/users/check-auth/', { withCredentials: true }); // API to check authentication status
//                 if (response.status === 200) {
//                     setIsAuthenticated(true); // User is authenticated
//                 }
//             } catch (error) {
//                 setIsAuthenticated(false); // User is not authenticated
//             }
//         };
//
//         checkAuth();
//     }, []);
//
//     // Wait for the authentication check to complete
//     if (isAuthenticated === null) {
//         return <div>Loading...</div>;
//     }
//
//     // If not authenticated, redirect to login
//     if (!isAuthenticated) {
//         return <Navigate to="/login" replace />;
//     }
//
//     // If authenticated, render the requested page
//     return <>{children}</>;
// };
//
// export default ProtectedRoute;
