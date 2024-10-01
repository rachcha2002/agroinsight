import React from "react";
import "./Main.css";
import PageTitle from "../AgriPageTitle";
import AgrochemicalOverview from "../FertilizerTracker/AgrochemicalOverview";
import DiseaseAlertSlider from "../DiseaseTracker/Pages/DiseaseAlertSlider";
import SuperAdminDBCard from "../../SuperAdmin/Main/SuperAdmindbCard";

function AgriMain() {
  return (
    <main id="main" className="main">
      <PageTitle title="Agriculture Admin Dashboard" url="/agriadmin/" />
      <div>
        <SuperAdminDBCard />
        <AgrochemicalOverview />
        <DiseaseAlertSlider />
      </div>
    </main>
  );
}

export default AgriMain;
