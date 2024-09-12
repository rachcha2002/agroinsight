import React, { createContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export const AdminAuthContext = createContext({
  isLoggedIn: false,
  adminId: null,
  designation: null,
  token: null,
  login: () => {},
  logout: () => {},
});

export const AdminAuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const logoutTimerRef = useRef(null);

  const [authState, setAuthState] = useState(() => {
    const storedAuth = localStorage.getItem("adminAuth");
    return storedAuth
      ? JSON.parse(storedAuth)
      : { isLoggedIn: false, adminId: null, designation: null, token: null };
  });

  const login = (adminId, token, designation) => {
    const timestamp = Date.now();
    setAuthState({
      isLoggedIn: true,
      adminId,
      designation,
      token,
      timestamp,
    });
    localStorage.setItem(
      "adminAuth",
      JSON.stringify({
        isLoggedIn: true,
        adminId,
        designation,
        token,
        timestamp,
      })
    );
    startLogoutTimer();
  };

  const logout = () => {
    setAuthState({
      isLoggedIn: false,
      adminId: null,
      designation: null,
      token: null,
      timestamp: null,
    });
    localStorage.removeItem("adminAuth");
    clearLogoutTimer();
    navigate("/admin/login");
  };

  const startLogoutTimer = () => {
    logoutTimerRef.current = setTimeout(logout, 30 * 60 * 1000); // 30 minutes
  };

  const clearLogoutTimer = () => {
    clearTimeout(logoutTimerRef.current);
  };

  const resetLogoutTimer = () => {
    clearLogoutTimer();
    startLogoutTimer();
  };

  useEffect(() => {
    const storedAuth = localStorage.getItem("adminAuth");
    if (storedAuth) {
      const { token, timestamp } = JSON.parse(storedAuth);
      if (token && timestamp) {
        const currentTime = Date.now();
        const twelveHoursInMillis = 12 * 60 * 60 * 1000;
        const timeElapsed = currentTime - timestamp;
        if (timeElapsed < twelveHoursInMillis) {
          setAuthState(JSON.parse(storedAuth));
          startLogoutTimer();
        } else {
          logout(); // Token has expired, log the user out
        }
      }
    }
  }, []);

  useEffect(() => {
    const handleUserActivity = () => {
      resetLogoutTimer();
    };

    const events = ["mousemove", "mousedown", "keypress"];
    events.forEach((event) => {
      window.addEventListener(event, handleUserActivity);
    });

    return () => {
      clearLogoutTimer();
      events.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, []);

  return (
    <AdminAuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
