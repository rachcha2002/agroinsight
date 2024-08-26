//import icons
import "bootstrap-icons/font/bootstrap-icons.css";
//import "remixicon/fonts/remixicon.css";

// Import Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import "./App.css";
import Header from "./components/Header/Header";
import SideBar from "./components/Sidebar/SideBar";
import Main from "./components/Main/Main";
import SuperMain from "./components/SuperAdmin/Main/SuperMain";
import MarketMain from "./components/MarketAdmin/Main/MarketMain";
import AgriMain from "./components/AgriAdmin/Main/AgriMain";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<SuperMain />} />

          <Route path="/market" element={<MarketMain />} />

          <Route path="/agri" element={<AgriMain />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
