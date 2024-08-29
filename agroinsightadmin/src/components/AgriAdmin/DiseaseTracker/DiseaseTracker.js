import React from "react";
import PageTitle from "../AgriPageTitle";
import "../Main/Main.css";
import { Tabs, Tab } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import PestManagement from "./Pages/PestManagement";
import AITool from "./Pages/AITool";

export default function DiseaseTracker() {
  return (
    <main id="main" className="main">
      <PageTitle
        title="Diseases Management Dashboard"
        url="/agriadmin/diseases"
      />
      <br></br>
      <Tabs defaultActiveKey="pest-management" id="disease-tracker-tabs" className="mb-3">
        <Tab eventKey="pest-management" title="Pest and Disease Management">
          <PestManagement/>
        </Tab>
        <Tab eventKey="ai-tool" title="AI Tool">
          <AITool/>
        </Tab>
      </Tabs>
    </main>
  );
}
