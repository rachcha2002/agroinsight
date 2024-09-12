import React, { useContext } from "react";
import "./SideBar.css";
import navList from "../../../data/MarketAdmin/navItem";
import NavItem from "./NavItem";
import { BsArrowLeft } from "react-icons/bs";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AdminAuthContext } from "../../../context/AdminAuthContext"; // Import the context

function SideBar() {
  // To redirect after success
  const navigate = useNavigate();
  // Get the designation from context
  const { designation } = useContext(AdminAuthContext);

  return (
    <aside id="sidebar" className="sidebar">
      <ul className="sidebar-nav" id="sidebar-nav">
        {navList.map((nav) => (
          <NavItem key={nav._id} nav={nav} />
        ))}
      </ul>
     {/* Conditionally render the button if designation is "Super Admin" */}
      {designation === "Super Admin" && (
        <Button
          variant="dark"
          onClick={() => navigate("/superadmin")}
          style={{ margin: "10px" }}
        >
          <BsArrowLeft /> Back
        </Button>
      )}
    </aside>
  );
}

export default SideBar;
