import React from "react";
import "./Main.css";
import PageTitle from "./PageTitle";
import Header from "../Header/Header";
import SideBar from "../Sidebar/SideBar";

function MarketMain() {
  return (
    <>
      <Header />
      <SideBar />
      <main id="main" className="main">
        <PageTitle />
        <div>
          <h1>Hello, Market Admin</h1>
        </div>
      </main>
    </>
  );
}

export default MarketMain;
