import React from "react";
import "./SideBar.css";
import navList from "../../../data/AgriAdmin/navItem";
import NavItem from "./AgriNavItem";

function SideBar() {
  return (
    <aside id="sidebar" className="sidebar">
      <ul className="sidebar-nav" id="sidebar-nav">
        {navList.map((nav) => (
          <NavItem key={nav._id} nav={nav} />
        ))}
      </ul>
    </aside>
  );
}

export default SideBar;
