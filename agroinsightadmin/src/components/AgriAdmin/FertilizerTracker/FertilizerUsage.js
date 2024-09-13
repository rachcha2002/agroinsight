import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../../../images/logoNoBack.png";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const FertilizerUsage = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [comment, setComment] = useState("");

  const [regionSearch, setRegionSearch] = useState("");
  const [cropSearch, setCropSearch] = useState("");
  const [fertilizerSearch, setFertilizerSearch] = useState("");

  // Fetch all farmer fertilizers records
  const fetchRecords = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/f&p/getallff`
      );
      setRecords(response.data.data); // Assuming the response has a data field with records
      setFilteredRecords(response.data.data); // Initially set filtered records to all records
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Filter records based on search criteria
  const filterRecords = () => {
    const filtered = records.filter((record) => {
      return (
        (!regionSearch ||
          record.region.toLowerCase().includes(regionSearch.toLowerCase())) &&
        (!cropSearch ||
          record.crop.toLowerCase().includes(cropSearch.toLowerCase())) &&
        (!fertilizerSearch ||
          record.fertilizer
            .toLowerCase()
            .includes(fertilizerSearch.toLowerCase()))
      );
    });
    setFilteredRecords(filtered);
  };

  // Re-filter records whenever the search fields change
  useEffect(() => {
    filterRecords();
  }, [regionSearch, cropSearch, fertilizerSearch]);

  // Clear search fields
  const clearSearch = () => {
    setRegionSearch("");
    setCropSearch("");
    setFertilizerSearch("");
    setFilteredRecords(records); // Reset to all records
  };

  // Helper function to count the occurrences of each value in a column
  const countOccurrences = (column) => {
    return filteredRecords.reduce((acc, record) => {
      acc[record[column]] = (acc[record[column]] || 0) + 1;
      return acc;
    }, {});
  };

  // Pie chart configuration
  const preparePieChartData = (column) => {
    const counts = countOccurrences(column);
    const labels = Object.keys(counts);
    const data = Object.values(counts);
    const total = data.reduce((acc, value) => acc + value, 0);

    return {
      labels,
      datasets: [
        {
          label: `${column} distribution`,
          data,
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
          ],
        },
      ],
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                const count = tooltipItem.raw;
                const percentage = ((count / total) * 100).toFixed(2);
                return `${tooltipItem.label}: ${percentage}%`;
              },
            },
          },
          datalabels: {
            color: "white",
            formatter: (value, ctx) => {
              const percentage = ((value / total) * 100).toFixed(2);
              return `${percentage}%`; // Return percentage label
            },
            font: {
              weight: "bold",
              size: 14,
            },
          },
        },
      },
    };
  };
  // Handle opening the modal and setting the selected record
  const handleEditComment = (record) => {
    setSelectedRecord(record);
    setComment(record.comment); // Pre-fill the modal with the current comment
    setShowModal(true);
  };

  const handleSaveComment = async () => {
    try {
      // Send a PATCH request to update only the comment field
      await axios.patch(
        `http://localhost:5000/api/f&p/updatecommentff/${selectedRecord._id}`,
        { comment }
      );

      // Update the local records with the new comment
      const updatedRecords = records.map((record) =>
        record._id === selectedRecord._id ? { ...record, comment } : record
      );
      setRecords(updatedRecords); // Update the state with the modified records
      setFilteredRecords(updatedRecords); // Update filtered records
      setShowModal(false); // Close modal on successful update
    } catch (err) {
      console.error("Error updating comment:", err.message);
    }
  };

  const generatePDF = async () => {
    const doc = new jsPDF();

    // Add the logo
    const imgWidth = 50; // Logo width
    const imgHeight = 20; // Logo height
    const xOffset = 14; // Horizontal offset from the left edge
    let yOffset = 10; // Initial vertical offset from the top edge

    doc.addImage(logo, "PNG", xOffset, yOffset, imgWidth, imgHeight); // Place the logo

    // Add the contact details on the right
    doc.setFontSize(10);
    doc.text("AgroInsight (By OctagonIT)", 150, 15); // Adjusted position for details
    doc.text("Email: teamoctagonit@gmail.com", 150, 21);
    doc.text("Phone: +94711521161", 150, 27);
    doc.text("By Agriculture Admin", 150, 33);

    // Move yOffset down to start the next section after the header and logo
    yOffset = 50; // Adjust this as needed to ensure space between header and content

    // Add title for the PDF
    doc.setFontSize(16); // Title font size
    doc.text("Farmer Fertilizer Records", 10, yOffset);

    // Adjust yOffset for pie chart row
    yOffset += 10;

    // Add Pie Charts in a Row
    const chartElements = document.querySelectorAll(".chart-container canvas");
    const chartsImages = await Promise.all(
      Array.from(chartElements).map((chart) =>
        html2canvas(chart).then((canvas) => canvas.toDataURL("image/png"))
      )
    );

    // Place the pie charts in a row (xOffset changes for each chart)
    const chartWidth = 60; // Width of each chart
    const chartHeight = 60; // Height of each chart
    const chartSpacing = 10; // Spacing between charts

    chartsImages.forEach((chartImage, idx) => {
      const xPos = 10 + (idx % 3) * (chartWidth + chartSpacing); // X-position for each chart
      const yPos = yOffset + Math.floor(idx / 3) * (chartHeight + chartSpacing); // Y-position for each row
      doc.addImage(chartImage, "PNG", xPos, yPos, chartWidth, chartHeight);
    });

    // Adjust yOffset for table after the pie charts
    yOffset += chartHeight + chartSpacing + 20;

    // Add table
    doc.autoTable({
      head: [["Email", "Region", "Crop", "Fertilizer", "Amount", "Comment"]],
      body: filteredRecords.map((record) => [
        record.email,
        record.region,
        record.crop,
        record.fertilizer,
        record.amount,
        record.comment,
      ]),
      startY: yOffset, // Start the table after the pie charts
      margin: { top: 10 }, // Add some margin
    });

    // Adjust yOffset for the footer (date and time) after the table
    const finalY = doc.autoTable.previous.finalY + 20; // Position for the footer
    const currentDateTime = new Date().toLocaleString(); // Get the current date and time

    // Add the generated date and time at the bottom
    doc.setFontSize(10);
    doc.text(`Generated on: ${currentDateTime}`, 10, finalY);

    // Save the PDF
    doc.save("farmer_fertilizer_records.pdf");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Farmer Fertilizers Usage</h2>

      {/* Search Fields */}
      <Row className="mb-3">
        <Col md={3}>
          <Form.Control
            type="text"
            placeholder="Search by Region"
            value={regionSearch}
            onChange={(e) => setRegionSearch(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Control
            type="text"
            placeholder="Search by Crop"
            value={cropSearch}
            onChange={(e) => setCropSearch(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Control
            type="text"
            placeholder="Search by Fertilizer"
            value={fertilizerSearch}
            onChange={(e) => setFertilizerSearch(e.target.value)}
          />
        </Col>
        <Col md={3}>
          {/* Clear Search Button */}
          <Button variant="success" onClick={clearSearch} className="mb-3">
            Clear Search
          </Button>
        </Col>
      </Row>

      {/* Generate PDF Button */}
      <Button variant="primary" onClick={generatePDF} className="mb-3 ml-2">
        Generate PDF
      </Button>
      <h3 className="mt-2 mb-2">Graphical Representation</h3>

      {/* Pie Charts Row */}
      <Row className="chart-container">
        <Col md={4}>
          <h4>Region Distribution</h4>
          <Pie
            data={preparePieChartData("region")}
            options={preparePieChartData("region").options}
          />
        </Col>
        <Col md={4}>
          <h4>Crop Distribution</h4>
          <Pie
            data={preparePieChartData("crop")}
            options={preparePieChartData("crop").options}
          />
        </Col>
        <Col md={4}>
          <h4>Fertilizer Distribution</h4>
          <Pie
            data={preparePieChartData("fertilizer")}
            options={preparePieChartData("fertilizer").options}
          />
        </Col>
      </Row>
      <h3 className="mt-2 mb-2">Usage Records</h3>
      {/* Table with records */}
      <Table striped bordered hover className="mt-5">
        <thead>
          <tr>
            <th>Email</th>
            <th>Region</th>
            <th>Crop</th>
            <th>Fertilizer</th>
            <th>Amount</th>
            <th>Comment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((record) => (
            <tr key={record._id}>
              <td>{record.email}</td>
              <td>{record.region}</td>
              <td>{record.crop}</td>
              <td>{record.fertilizer}</td>
              <td>{record.amount}</td>
              <td>{record.comment}</td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => handleEditComment(record)}
                >
                  Edit Comment
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for editing comment */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formComment">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="success" onClick={handleSaveComment}>
            Save Comment
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FertilizerUsage;
