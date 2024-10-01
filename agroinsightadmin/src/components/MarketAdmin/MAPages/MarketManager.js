import React from "react";
import Header from "../../Header/Header";
import SideBar from "../MASidebar/SideBar";
import MarketMain from "../MAMain/MarketMain";
import {BrowserRouter as Router,Route,Routes,Navigate,} from "react-router-dom";
import Crops from "../MAMain/Crops/Crops";
import PriceHistory from "../MAMain/Crops/PriceHistory";
import AddCrop from "../MAMain/Crops/AddCrop";

function MarketManager() {
  return (
    <>
      <Header />
      <SideBar />
      <Routes>
        <Route path="/*" element={<MarketMain/>} />
        <Route path="/pricelist/*" element={<Crops/>} />
       <Route path="/pricehistory" element={<PriceHistory/>}/>
        <Route path="/pricelist/addcrop" element={<AddCrop/>} />
      </Routes>
    </>
  );
}

export default MarketManager;
