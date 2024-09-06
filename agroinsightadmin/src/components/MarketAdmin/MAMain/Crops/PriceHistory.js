import React, { useState } from "react";
import PageTitle from "../MMPageTitle";
import "./Crops.css";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/tab";
function PriceHistory() {
    const [key, setKey] = useState("Colombo");
  return (
    <>
    <main id="main" className="main">
      <PageTitle title="Price History" url="market/pricehistory" />
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab eventKey="Colombo" title="Colombo Market"></Tab>
        <Tab eventKey="Dambulla" title="Dambulla Market"></Tab>
        <Tab eventKey="Jaffna" title="Jaffna Market"></Tab>
        <Tab eventKey="Galle" title="Galle Market"></Tab>
      </Tabs>
    </main>
  </>
  )
}

export default PriceHistory