import React from "react";
import "./Main.css";
import PageTitle from "./PageTitle";
import AgrochemicalOverview from "../../AgriAdmin/FertilizerTracker/AgrochemicalOverview";
import DiseaseAlertSlider from "../../AgriAdmin/DiseaseTracker/Pages/DiseaseAlertSlider";
import SuperAdminDBCard from "./SuperAdmindbCard";
import MarketCommon from "../../Common/marketadmincommon";

function SuperMain() {
  return (
    <main id="main" className="main">
      <PageTitle title="Super Admin Dashboard" url="/superadmin" />
      <div>
        <SuperAdminDBCard />
        <MarketCommon />
        <AgrochemicalOverview />
        <DiseaseAlertSlider />
      </div>
    </main>
  );
}

export default SuperMain;
