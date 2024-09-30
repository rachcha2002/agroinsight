import React, { useState, useEffect } from "react";
import PageTitle from "../AgriPageTitle";
import "../Main/Main.css";
import {
  Button,
  Card,
  Col,
  Modal,
  Row,
  Stack,
  Tab,
  Tabs,
  Toast,
} from "react-bootstrap";
import Fertilizers from "./Fertilizers";
import Pesticides from "./Pesticides";
import CropCategory from "./CropCategory";
import { useLocation } from "react-router-dom"; // Import useLocation
import AgrochemicalNews from "./AgrochemicalNews";
import FertilizerUsage from "./FertilizerUsage";
import PesticideUsage from "./PesticideUsage";

function FertilizerDashboard({ toggleLoading }) {
  const location = useLocation();
  const [key, setKey] = useState("fertilizers");
  useEffect(() => {
    // Extract the tab parameter from the URL query or pathname
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab) {
      setKey(tab);
    }
  }, [location.search]);

  return (
    <main id="main" className="main">
      <PageTitle
        title="Fertilizers & Pesticides"
        url="/agriadmin/fertilizers&pesticides"
      />
      <section style={{ position: "relative" }}>
        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-3"
        >
          <Tab eventKey="fertilizers" title="Fertilizer Recomendations">
            <Fertilizers toggleLoading={toggleLoading} />
          </Tab>
          <Tab eventKey="pesticides" title="Pesticide Recommendations">
            <Pesticides toggleLoading={toggleLoading} />
          </Tab>
          <Tab eventKey="cropcategory" title="Crop Categories">
            <CropCategory toggleLoading={toggleLoading} />
          </Tab>
          <Tab eventKey="agrochemicalnews" title="Agrochemical News">
            <AgrochemicalNews toggleLoading={toggleLoading} />
          </Tab>
          <Tab eventKey="fertilizerusage" title="Fertilizer Usage">
            <FertilizerUsage toggleLoading={toggleLoading} />
          </Tab>
          <Tab eventKey="pesticideusage" title="Pesticide Usage">
            <PesticideUsage toggleLoading={toggleLoading} />
          </Tab>
        </Tabs>
      </section>
    </main>
  );
}

export default FertilizerDashboard;
