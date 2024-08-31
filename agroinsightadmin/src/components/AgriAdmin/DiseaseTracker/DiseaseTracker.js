import React from "react";
import PageTitle from "../AgriPageTitle";
import "../Main/Main.css";
import { Tabs, Tab } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import PestManagement from "./Pages/PestManagement";
import AITool from "./Pages/AITool";
import DiseaseAlerts from "./Pages/DiseaseAlerts"; // Import the new component

export default function DiseaseTracker() {
  return (
    <main id="main" className="main">
      <PageTitle
        title="Diseases Management Dashboard"
        url="/agriadmin/diseases"
      />
      <br />
      <Tabs
        defaultActiveKey="disease-alerts"
        id="disease-tracker-tabs"
        className="mb-3"
      >
        <Tab eventKey="disease-alerts" title="Disease Alerts">
          <DiseaseAlerts />
        </Tab>
        <Tab eventKey="pest-management" title="Pest and Disease Complaints">
          <PestManagement />
        </Tab>
        <Tab eventKey="ai-tool" title="AI Tool">
          <AITool />
        </Tab>
      </Tabs>
    </main>
  );
}
