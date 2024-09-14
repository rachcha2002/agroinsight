import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, InputGroup, Row, Col, Table } from "react-bootstrap";
import DatePicker from "react-datepicker";
import PageTitle from "../MMPageTitle";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./Crops.css";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../../../images/logoNoBack.png";

function PriceHistory() {
  const [Crops, setCrops] = useState([]);
  const [searchCrop, setSearchCrop] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const handleFromDateChange = (date) => {
    setFromDate(date);
  };

  const handleToDateChange = (date) => {
    setToDate(date);
  };

  useEffect(() => {
    function getCrops() {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/crop/gethistory`)
        .then((res) => {
          const filteredCrops = res.data;
          setCrops(filteredCrops);
          console.log(filteredCrops);
        })
        .catch((err) => {
          alert("error");
        });
    }
    getCrops();
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    const imgWidth = 50;
    const imgHeight = 20;

    doc.addImage(logo, "PNG", 14, 10, imgWidth, imgHeight);

    doc.setFontSize(10);
    doc.text("AgroInsight (By OctagonIT)", 150, 12);
    doc.text("Email: teamoctagonit@gmail.com", 150, 18);
    doc.text("Phone: +94711521161", 150, 24);
    doc.text("By Market Admin", 150, 30);

    doc.setFontSize(16);
    doc.text("Price History", 14, 40);

    const tableOptions = {
      theme: "grid",
      headStyles: { fillColor: [0, 128, 0] },
      margin: { top: 50 },
    };

    const formatDate = (dateString) => {
      const [day, month, year] = dateString.split("/");
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString("en-GB") || "Invalid Date";
    };
    if (table1Crops.length > 0) {
      doc.setFontSize(14);
      doc.text(
        "Colombo Market",
        14,
        doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 50
      );
      doc.autoTable({
        head: [["Crop Name", "Date", "Price"]],
        body: table1Crops.map((crop) => [
          crop.Crop_name,
          formatDate(crop.date),
          `Rs. ${crop.Price}`,
        ]),
        ...tableOptions,
        startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 60,
      });
    }
    if (table2Crops.length > 0) {
      doc.setFontSize(14);
      doc.text("Dambulla Market", 14, doc.lastAutoTable.finalY + 10);
      doc.autoTable({
        head: [["Crop Name", "Date", "Price"]],
        body: table2Crops.map((crop) => [
          crop.Crop_name,
          formatDate(crop.date),
          `Rs. ${crop.Price}`,
        ]),
        ...tableOptions,
        startY: doc.lastAutoTable.finalY + 20,
      });
    }
    if (table3Crops.length > 0) {
      doc.setFontSize(14);
      doc.text("Jaffna Market", 14, doc.lastAutoTable.finalY + 10);
      doc.autoTable({
        head: [["Crop Name", "Date", "Price"]],
        body: table3Crops.map((crop) => [
          crop.Crop_name,
          formatDate(crop.date),
          `Rs. ${crop.Price}`,
        ]),
        ...tableOptions,
        startY: doc.lastAutoTable.finalY + 20,
      });
    }
    if (table4Crops.length > 0) {
      doc.setFontSize(14);
      doc.text("Galle Market", 14, doc.lastAutoTable.finalY + 10);
      doc.autoTable({
        head: [["Crop Name", "Date", "Price"]],
        body: table4Crops.map((crop) => [
          crop.Crop_name,
          formatDate(crop.date),
          `Rs. ${crop.Price}`,
        ]),
        ...tableOptions,
        startY: doc.lastAutoTable.finalY + 20,
      });
    }
    const currentDate = new Date();
    const dateString = currentDate.toLocaleDateString("en-GB");
    const timeString = currentDate.toLocaleTimeString();
    doc.setFontSize(10);
    doc.text(
      `Report generated on: ${dateString} at ${timeString}`,
      14,
      doc.internal.pageSize.height - 10
    );
    doc.save("Price_history.pdf");
  };

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("/");
    const upDaate = new Date(`${year}-${month}-${day}`);
    console.log(upDaate);
    return upDaate;
  };

  const filteredCrops = Crops.filter((crop) => {
    const cropNameMatch = crop.Crop_name.includes(searchCrop);
    const cropDate = parseDate(crop.date);
    const fromDateMatch = !fromDate || cropDate >= fromDate;
    const toDateMatch = !toDate || cropDate <= toDate;
    return cropNameMatch && fromDateMatch && toDateMatch;
  }).sort((a, b) => parseDate(b.date) - parseDate(a.date));

  const table1Crops = filteredCrops.filter((crop) => crop.Market === "Colombo");
  const table2Crops = filteredCrops.filter(
    (crop) => crop.Market === "Dambulla"
  );
  const table3Crops = filteredCrops.filter((crop) => crop.Market === "Jaffna");
  const table4Crops = filteredCrops.filter((crop) => crop.Market === "Galle");

  const renderTable = (tableCrops, title) => (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Crop Name</th>
          <th>Date</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {tableCrops.map((crop, index) => (
          <tr key={index}>
            <td>{crop.Crop_name}</td>
            <td>
              {parseDate(crop.date)?.toLocaleDateString("en-GB") ||
                "Invalid Date"}
            </td>
            <td>Rs. {crop.Price}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  return (
    <>
      <main id="main" className="main">
        <PageTitle title="Price History" url="market/pricehistory" />
        <Row>
          <Col sm={3}>
            <InputGroup className="mb-2">
              <Form.Control
                placeholder="Select Crop"
                value={searchCrop}
                onChange={(e) =>
                  setSearchCrop(
                    e.target.value.charAt(0).toUpperCase() +
                      e.target.value.slice(1)
                  )
                }
              />
              <Button
                variant="secondary"
                id="button-addon2"
                onClick={() => setSearchCrop("")}
              >
                Clear
              </Button>
            </InputGroup>
          </Col>
          <Col sm={4}>
            <Form.Group>
              <Form.Label>From&nbsp;</Form.Label>
              <DatePicker
                selected={fromDate}
                onChange={handleFromDateChange}
                dateFormat="dd/MM/yyyy"
                className="form-control"
                placeholderText="Select From Date"
              />
              <Button
                variant="secondary"
                id="button-addon2"
                onClick={() => setFromDate(null)}
              >
                Clear
              </Button>
            </Form.Group>
          </Col>
          <Col sm={4}>
            <Form.Group>
              <Form.Label>To&nbsp;</Form.Label>
              <DatePicker
                selected={toDate}
                onChange={handleToDateChange}
                dateFormat="dd/MM/yyyy"
                className="form-control"
                placeholderText="Select To Date"
              />
              <Button
                variant="secondary"
                id="button-addon2"
                onClick={() => setToDate(null)}
              >
                Clear
              </Button>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              onClick={generatePDF}
              variant="danger"
              style={{ marginLeft: "20px" }}
            >
              Generate PDF
              <span className="bi bi-file-earmark-pdf"></span>
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <h3>Colombo Market</h3>
            {renderTable(table1Crops, "Type1 Crops")}
          </Col>
        </Row>
        <Row>
          <Col>
            <h3>Dambulla Market</h3>
            {renderTable(table2Crops, "Type2 Crops")}
          </Col>
        </Row>
        <Row>
          <Col>
            <h3>Jaffna Market</h3>
            {renderTable(table3Crops, "Type3 Crops")}
          </Col>
        </Row>
        <Row>
          <Col>
            <h3>Galle Market</h3>
            {renderTable(table4Crops, "Type4 Crops")}
          </Col>
        </Row>
      </main>
    </>
  );
}

export default PriceHistory;
