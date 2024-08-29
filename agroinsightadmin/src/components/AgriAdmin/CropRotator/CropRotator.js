import {React} from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "../Main/Main.css";

import CropRotatorTabs from "./CropRotatorTabs";


export default function CropRotator() {
  
  return (
    <>
    <Routes>
      <Route path="/" element={<CropRotatorTabs />} />
    </Routes>
    </>
  );
}
