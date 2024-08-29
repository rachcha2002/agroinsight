import React from "react";
import "./Main.css";
import PageTitle from "./PageTitle";
import Header from "../Header/Header";
import SideBar from "../Sidebar/SideBar";

function SuperMain() {
  return (
    <>
      <Header />
      <SideBar />
      <main id="main" className="main">
        <PageTitle />
        <div>
          <h1>Hello, Super Admin</h1>
        </div>
      </main>
    </>
  );
}

export default SuperMain;
