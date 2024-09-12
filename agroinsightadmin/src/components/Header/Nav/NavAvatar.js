import React, { useState, useEffect, useContext } from "react";
import profileImg from "../../../images/user.png";
import { AdminAuthContext } from "../../../context/AdminAuthContext"; // Import the context to get the logged-in adminId
import { useNavigate } from "react-router-dom";

function NavAvatar() {
  const [adminProfile, setAdminProfile] = useState({ name: "", designation: "" });
  const { adminId,designation,logout } = useContext(AdminAuthContext); // Get the adminId from context
  const navigate = useNavigate(); // To navigate after logout

  useEffect(() => {
    // Fetch the admin profile from the backend using the adminId
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/admin-profile/adminbyId/${adminId}`
        );
        if (response.ok) {
          const profileData = await response.json();
          console.log("Profile data:", profileData);
          setAdminProfile({ name: profileData.name, designation: profileData.designation });
        } else {
          console.error("Error fetching profile:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (adminId) {
      fetchProfile(); // Only fetch profile if adminId exists
    }
  }, [adminId]); // Run effect when adminId changes

  const handleLogout = () => {
    logout(); // Clear the authentication state and tokens
    navigate("/"); // Redirect to the login page after logout
  };

  return (
    <li className="nav-item dropdown pe-3">
      <a
        className="nav-link nav-profile d-flex align-items-center pe-0"
        href="#"
        data-bs-toggle="dropdown"
      >
        <img src={profileImg} alt="Profile" className="rounded-circle" />
        <span
          className="d-none d-md-block dropdown-toggle ps-2"
          style={{ color: "#004d00" }}
        >
          {adminProfile.name || "User Name"}
        </span>
      </a>

      <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
        <li className="dropdown-header">
          <h6>{adminProfile.name || "User Name"}</h6>
          <span>{designation || "Designation"}</span>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>

        <li>
          <a
            className="dropdown-item d-flex align-items-center"
            href="users-profile.html"
          >
            <i className="bi bi-person"></i>
            <span>My Profile</span>
          </a>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>

        <li>
          <a className="dropdown-item d-flex align-items-center" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i>
            <span>Sign Out</span>
          </a>
        </li>
      </ul>
    </li>
  );
}

export default NavAvatar;
