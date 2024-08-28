import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import FertilizerDashboard from "./FertilizerDasboard";
import CropCategoryForm from "./CropCategotyForm";
import PesticideForm from "./PesticideForm";
import FertilizerForm from "./FertilizerForm";

function FertilizeGuidance() {
  return (
    <>
      <Routes>
        <Route path="/" element={<FertilizerDashboard />} />
        <Route path="/addcropcategory" element={<CropCategoryForm />} />
        <Route path="/addpesticide" element={<PesticideForm />} />
        <Route path="/addfertilizer" element={<FertilizerForm />} />
      </Routes>
    </>
  );
}

export default FertilizeGuidance;
