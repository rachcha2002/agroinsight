import {React, useState} from "react";
import {
    Card,
    Tab,
    Tabs
  } from "react-bootstrap";
  import PageTitle from "../AgriPageTitle";
  import RotatorModel from "./Pages/RotatorModel";
  import FarmerRegion from "./Pages/Farmer&Region";
  import Reports from "./Pages/Reports";
  import NewsLetter from "./Pages/NewsLetter";

export default function CropRotatorTabs() {
    const [key, setKey] = useState("details");

    return(
        <main id="main" className="main">
        <PageTitle 
        title="Crop Management Dashboard" 
        url="/agriadmin/crops"
        />
         <section style={{ position: "relative" }}>
       
            <Tabs
              id="controlled-tab-example"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mb-3"
            >
              <Tab eventKey="details" title="Farmer & Region Management">
                <FarmerRegion/>
              </Tab>
              <Tab eventKey="models" title="Crop Rotation Models">
                <RotatorModel/>
              </Tab>
              <Tab eventKey="news" title="Educational Resources & Alerts">
                <NewsLetter/>
              </Tab>
            </Tabs>
        
      </section>
        </main>
    );
}
