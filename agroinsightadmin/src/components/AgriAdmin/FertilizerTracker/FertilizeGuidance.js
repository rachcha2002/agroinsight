import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import FertilizerDashboard from "./FertilizerDasboard";
import CropCategoryForm from "./CropCategotyForm";

function FertilizeGuidance() {
  return (
    <>
      <Routes>
        <Route path="/" element={<FertilizerDashboard />} />
        <Route path="/addcropcategory" element={<CropCategoryForm />} />
      </Routes>
    </>
  );
}

export default FertilizeGuidance;
