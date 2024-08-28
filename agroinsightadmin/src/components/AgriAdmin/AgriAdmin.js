import React from "react";
import Header from "./Header/Header";
import SideBar from "./AgriSidebar/AgriSideBar";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import AgriMain from "./Main/AgriMain";
import CropRotator from "./CropRotator/CropRotator";
import DiseaseTracker from "./DiseaseTracker/DiseaseTracker";
import FertilizerTracker from "./FertilizerTracker/FertilizerTracker";
import AddNewAlert from "./DiseaseTracker/Pages/AddNewAlert";

export default function AgriAdmin() {
  return (
    <div>
      <>
        <Header />
        <SideBar />
        <Routes>
          <Route path="/" element={<AgriMain />} />
          <Route path="crops" element={<CropRotator />} />
          <Route path="fertilizers" element={<FertilizerTracker />} />

          {/* Disease Routes */}
          <Route path="diseases" element={<DiseaseTracker />} />
          <Route path="diseases/addalert" element={<AddNewAlert />} />
           {/* Disease Routes */}
        </Routes>
      </>
    </div>
  );
}
