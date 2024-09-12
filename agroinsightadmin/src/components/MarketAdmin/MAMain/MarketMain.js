import React from "react";
import "./MarketMain.css";
import PageTitle from "./MMPageTitle";
import MMDashboard from "./MMDashboard";

function MarketMain() {
  return (
    <>
      <main id="main" className="main">
        <PageTitle title="Market Manager Dashboard" url="market"/>
     <MMDashboard/>
        <br/>
      </main>
    </>
  );
}

export default MarketMain;
