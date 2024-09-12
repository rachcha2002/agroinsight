import React, { useContext }  from "react";
import "./Logo.css";
import logo from "../../images/logoNoBack.png";
import { useNavigate } from "react-router-dom";
import { AdminAuthContext } from "../../context/AdminAuthContext"; 

export default function Logo() {
  const { designation } = useContext(AdminAuthContext); // Get the user's designation
  const navigate = useNavigate(); // Use the useNavigate hook to programmatically navigate

  const handleToggleSideBar = () => {
    document.body.classList.toggle("toggle-sidebar");
  };

  // Handle logo click based on designation
  const handleLogoClick = () => {
    if (designation === "Super Admin") {
      navigate("/superadmin");
    } else if (designation === "Market Admin") {
      navigate("/market");
    } else if (designation === "Agri Admin") {
      navigate("/agriadmin");
    } else {
      navigate("/"); // Default fallback if no valid designation
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-between">
      <a
        onClick={handleLogoClick} // Use the handleLogoClick function instead of href
        className="logo d-flex align-items-center"
        style={{ cursor: "pointer" }} // Make sure it's clickable
      >
        <img src={logo} alt="Logo" />
      </a>
      <i
        className="bi bi-list toggle-sidebar-btn"
        onClick={handleToggleSideBar}
      ></i>
    </div>
  );
}
