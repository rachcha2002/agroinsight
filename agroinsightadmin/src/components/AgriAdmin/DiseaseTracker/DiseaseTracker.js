import React from "react";
import PageTitle from "../AgriPageTitle";
import "../Main/Main.css";

export default function DiseaseTracker() {
  return (
    <main id="main" className="main">
      <PageTitle
        title="Diseases Management Dashboard"
        url="/agriadmin/diseases"
      />
      <div>
        <h1>Hello, Diseases Dashoard</h1>
      </div>
    </main>
  );
}
