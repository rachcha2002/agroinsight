import React from "react";
import "./Main.css";
import PageTitle from "../AgriPageTitle";
import AgrochemicalOverview from "../FertilizerTracker/AgrochemicalOverview";

function AgriMain() {
  return (
    <main id="main" className="main">
      <PageTitle title="Agriculture Admin Dashboard" url="/agriadmin/" />
      <div>
        <h1>Hello, Agri Admin Dashoard</h1>
        <AgrochemicalOverview />
      </div>
    </main>
  );
}

export default AgriMain;
