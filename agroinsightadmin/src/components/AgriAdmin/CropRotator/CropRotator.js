import React from "react";
import PageTitle from "../AgriPageTitle";
import "../Main/Main.css";

export default function CropRotator() {
  return (
    <main id="main" className="main">
      <PageTitle title="Crop Management Dashboard" url="/agriadmin/crops" />
      <div>
        <h1>Hello, Crop Dashoard</h1>
      </div>
    </main>
  );
}
