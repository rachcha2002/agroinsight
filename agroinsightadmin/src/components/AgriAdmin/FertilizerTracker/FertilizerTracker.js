import React from "react";
import PageTitle from "../AgriPageTitle";
import "../Main/Main.css";

function FertilizerTracker() {
  return (
    <main id="main" className="main">
      <PageTitle
        title="Fertilizer & Pesticides Dashboard"
        url="/agriadmin/fertilizers"
      />
      <div>
        <h1>Hello, Fertilizers Dashoard</h1>
      </div>
    </main>
  );
}

export default FertilizerTracker;
