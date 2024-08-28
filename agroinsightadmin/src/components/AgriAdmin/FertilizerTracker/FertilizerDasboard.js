import React, { useState } from "react";
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

function FertilizerDashboard() {
  const [key, setKey] = useState("recomendations");
  return (
    <main id="main" className="main">
      <PageTitle
        title="Fertilizers & Pesticides"
        url="/agriadmin/fertilizers&pesticides"
      />
      <section style={{ position: "relative" }}>
        <Card>
          <Card.Body style={{ backgroundColor: "white", padding: "25px" }}>
            <Tabs
              id="controlled-tab-example"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mb-3"
            >
              <Tab eventKey="recomendations" title="Recomendations">
                <Fertilizers />
              </Tab>
              <Tab eventKey="fertilizers" title="Fertilizers">
                <Fertilizers />
              </Tab>
              <Tab eventKey="pesticides" title="Pesticides">
                <Pesticides />
              </Tab>
              <Tab eventKey="cropcategory" title="Crop Categories">
                <CropCategory />
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      </section>
    </main>
  );
}

export default FertilizerDashboard;
