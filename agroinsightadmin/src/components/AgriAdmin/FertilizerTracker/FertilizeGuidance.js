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
import CropCategoryUpdateForm from "./CropCategoryUpdateForm";
import UpdateFertilizerForm from "./UpdateFertilizerForm";
import UpdatePesticideForm from "./UpdatePesticidesForm";

function FertilizeGuidance() {
  return (
    <>
      <Routes>
        <Route path="/" element={<FertilizerDashboard />} />
        <Route path="/addcropcategory" element={<CropCategoryForm />} />
        <Route path="/addpesticide" element={<PesticideForm />} />
        <Route path="/addfertilizer" element={<FertilizerForm />} />
        <Route
          path="/updatecropcategory/:categoryId"
          element={<CropCategoryUpdateForm />}
        />
        <Route
          path="/updatefertilizer/:id"
          element={<UpdateFertilizerForm />}
        />
        <Route path="/updatepesticide/:id" element={<UpdatePesticideForm />} />
      </Routes>
    </>
  );
}

export default FertilizeGuidance;
