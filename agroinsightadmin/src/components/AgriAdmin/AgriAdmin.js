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

export default function AgriAdmin() {
  return (
    <div>
      <>
        <Header />
        <SideBar />
        <Routes>
          <Route path="/" element={<AgriMain />} />
          <Route path="crops" element={<CropRotator />} />
          <Route path="diseases" element={<DiseaseTracker />} />
          <Route path="fertilizers" element={<FertilizerTracker />} />
        </Routes>
      </>
    </div>
  );
}
