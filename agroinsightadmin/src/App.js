// Import icons and Bootstrap
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import React, { useState, useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import "./App.css";
import AgriAdmin from "./components/AgriAdmin/AgriAdmin";
import MarketManager from "./components/MarketAdmin/MAPages/MarketManager";
import SuperAdmin from "./components/SuperAdmin/Main/SuperAdmin";
import AdminLogin from "./components/SuperAdmin/AdminLogin";
import Loader from "./components/util/Loader";
import {
  AdminAuthProvider,
  AdminAuthContext,
} from "./context/AdminAuthContext"; // Import AuthProvider and Context
import RestrictedPage from "./components/util/RestrictedPage"; // Import Restricted page if user is not authorized
import AlreadyLogIn from "./components/util/AlreadyLogIn"; // Import Already Logged In page

function App() {
  const [isLoading, setIsLoading] = useState(false);

  // toggleLoading function to pass to components
  const toggleLoading = (isLoadingState) => {
    setIsLoading(isLoadingState);
  };

  // AdminRoute component to manage authorization
  const AdminRoute = ({ element, requiredRole }) => {
    const { isLoggedIn, designation } = useContext(AdminAuthContext);

    if (!isLoggedIn) {
      // Redirect to login if not authenticated
      return <Navigate to="/" />;
    }

    // Allow Super Admin to access other admin routes
    if (designation !== requiredRole && designation !== "Super Admin") {
      // Redirect to RestrictedPage if the user does not have the required role
      return <RestrictedPage />;
    }

    // If the user has the required role or is a Super Admin, render the component
    return element;
  };

  // Extract isLoggedIn from AdminAuthContext
  const { isLoggedIn } = useContext(AdminAuthContext);
  return (
    <>
      <Router>
        <AdminAuthProvider>
          {isLoading && <Loader />} {/* Show loader when isLoading is true */}
          <Routes>
            {/* Conditional Route for Login */}
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  <AlreadyLogIn /> // If logged in, show Already Logged In page
                ) : (
                  <AdminLogin toggleLoading={toggleLoading} /> // If not logged in, show login
                )
              }
            />
            {/* Protected Routes with Role-based Authorization */}
            <Route
              path="/superadmin/*"
              element={
                <AdminRoute
                  requiredRole="Super Admin"
                  element={<SuperAdmin toggleLoading={toggleLoading} />}
                />
              }
            />
            <Route
              path="/market/*"
              element={
                <AdminRoute
                  requiredRole="Market Admin"
                  element={<MarketManager toggleLoading={toggleLoading} />}
                />
              }
            />
            <Route
              path="/agriadmin/*"
              element={
                <AdminRoute
                  requiredRole="Agri Admin"
                  element={<AgriAdmin toggleLoading={toggleLoading} />}
                />
              }
            />
          </Routes>
        </AdminAuthProvider>
      </Router>
    </>
  );
}

export default App;
