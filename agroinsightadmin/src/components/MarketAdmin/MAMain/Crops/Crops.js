import React, { useState,useEffect } from "react";
import PageTitle from "../MMPageTitle";
import "./Crops.css";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/tab";
import CPriceCard from "./ColomboPriceCard";
import DPriceCard from "./DambullaPriceCard";
import JPriceCard from "./JaffnaPriceCard";
import GPriceCard from "./GallePriceCard";

function Crops() {
  const [key, setKey] = useState(localStorage.getItem("activeTab") || "Colombo");
  useEffect(() => {
    localStorage.setItem("activeTab", key);
  }, [key]); 

  return (
    <>
      <main id="main" className="main">
        <PageTitle title="Current Price Lists" url="market/pricelist" />
        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-3"
        >
          <Tab eventKey="Colombo" title="Colombo Market"><CPriceCard /></Tab>
          <Tab eventKey="Dambulla" title="Dambulla Market"><DPriceCard/></Tab>
          <Tab eventKey="Jaffna" title="Jaffna Market"><JPriceCard/></Tab>
          <Tab eventKey="Galle" title="Galle Market"><GPriceCard/></Tab>
        </Tabs>
      </main>
    </>
  );
}

export default Crops;
