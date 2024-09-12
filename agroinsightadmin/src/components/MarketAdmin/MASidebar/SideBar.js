import React from "react";
import "./SideBar.css";
import navList from "../../../data/MarketAdmin/navItem";
import NavItem from "./NavItem";
import { BsArrowLeft } from "react-icons/bs";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function SideBar() {
  // To redirect after success
  const navigate = useNavigate();
  return (
    <aside id="sidebar" className="sidebar">
      <ul className="sidebar-nav" id="sidebar-nav">
        {navList.map((nav) => (
          <NavItem key={nav._id} nav={nav} />
        ))}
      </ul>
      <Button
        variant="dark"
        onClick={() => navigate("/")}
        style={{ margin: "10px" }}
      >
        <BsArrowLeft /> Back
      </Button>
    </aside>
  );
}

export default SideBar;
