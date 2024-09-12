import React from "react";
import "./Main.css";

import Header from "../../Header/Header";
import SideBar from "../Sidebar/SideBar";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import SuperMain from "./SuperMain";
import AdminProfileForm from "../../Common/AdminProfileForm";
import AdminProfiles from "../../Common/AdminProfiles";
import AdminProfileUpdateForm from "../../Common/AdminProfileUpdateForm";

function SuperAdmin() {
  return (
    <>
      <Header />
      <SideBar />
      <Routes>
        <Route path="/" element={<SuperMain />} />

        <Route path="/admin-profiles" element={<AdminProfiles />} />
        <Route path="/admin-profile/update/:adminId" element={<AdminProfileUpdateForm />} />
        <Route path="/add-profile" element={<AdminProfileForm />} />
      </Routes>
    </>
  );
}

export default SuperAdmin;
