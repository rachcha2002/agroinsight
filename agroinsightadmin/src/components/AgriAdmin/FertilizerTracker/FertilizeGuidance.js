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
import AgrochemicalNews from "./AgrochemicalNews";
import AddNewNews from "./AddNewNews";

function FertilizeGuidance({ toggleLoading }) {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<FertilizerDashboard toggleLoading={toggleLoading} />}
        />
        <Route
          path="/addcropcategory"
          element={<CropCategoryForm toggleLoading={toggleLoading} />}
        />
        <Route
          path="/addpesticide"
          element={<PesticideForm toggleLoading={toggleLoading} />}
        />
        <Route
          path="/addfertilizer"
          element={<FertilizerForm toggleLoading={toggleLoading} />}
        />
        <Route
          path="/updatecropcategory/:categoryId"
          element={<CropCategoryUpdateForm toggleLoading={toggleLoading} />}
        />
        <Route
          path="/updatefertilizer/:id"
          element={<UpdateFertilizerForm toggleLoading={toggleLoading} />}
        />
        <Route
          path="/updatepesticide/:id"
          element={<UpdatePesticideForm toggleLoading={toggleLoading} />}
        />
        <Route
          path="/addnews"
          element={<AddNewNews toggleLoading={toggleLoading} />}
        />
      </Routes>
    </>
  );
}

export default FertilizeGuidance;
