import React, { useState, useEffect } from "react";
import { Table, Modal, Button, Form, Image, Row, Col } from "react-bootstrap";
import axios from "axios";
import moment from "moment"; // For formatting dates
import { jsPDF } from "jspdf"; // Import jsPDF
import "jspdf-autotable"; // Import the autoTable plugin
import logo from "../../../../images/logoNoBack.png"; // Adjust the path to your logo

const PestManagement = () => {
  const [complaintData, setComplaintData] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [formData, setFormData] = useState({
    diseaseStatus: "",
    controlMethod: "",
    solution: "",
    officerRemarks: "",
  });

  const handleClose = () => setShow(false);

  const handleShow = (complaint) => {
    setSelectedComplaint(complaint);
    setFormData({
      diseaseStatus: complaint.diseaseStatus,
      controlMethod: complaint.controlMethod,
      solution: complaint.solution,
      officerRemarks: complaint.officerRemarks,
    });
    setShow(true);
  };

  const fetchComplaints = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/disease/complaints`
      );
      setComplaintData(response.data);
    } catch (error) {
      console.error("There was an error fetching the complaint data!", error);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleEdit = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/disease/complaints/${selectedComplaint._id}`,
        formData
      );
      if (response.status === 200) {
        setComplaintData((prevData) =>
          prevData.map((complaint) =>
            complaint._id === selectedComplaint._id
              ? { ...complaint, ...formData }
              : complaint
          )
        );
        setShow(false);
        alert("Complaint updated successfully.");
      } else {
        alert("Failed to update the complaint.");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update the complaint.");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this complaint?');
  
    if (!confirmDelete) {
      return; // If the user cancels, stop the deletion process
    }
  
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/disease/complaints/${selectedComplaint._id}`
      );
      if (response.status === 200) {
        setComplaintData(
          complaintData.filter(
            (complaint) => complaint._id !== selectedComplaint._id
          )
        );
        setShow(false);
        alert('Complaint deleted successfully.');
      } else {
        alert('Failed to delete the complaint.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete the complaint.');
    }
  };
  

  // PDF generation function
  const generatePDF = () => {
    convertToBase64(logo, (imgData) => {
      const doc = new jsPDF();

      // Add the logo
      doc.addImage(imgData, "PNG", 14, 10, 70, 30); // x, y, width, height

      // Add the name, email, and phone number
      doc.setFontSize(12);
      doc.text("AgroInsight(By OctagonIT)", 100, 20); // Adjust the position as needed
      doc.text("Email: teamoctagonit@gmail.com", 100, 26);
      doc.text("Phone: +94711521161", 100, 32);

      // Add the document title below the header
      doc.setFontSize(16);
      doc.text("Pest and Disease Complaints", 14, 50);

      // Generate table for complaints
      const complaints = complaintData.map((complaint) => [
        complaint.farmerID,
        complaint.area,
        complaint.cropAffected,
        moment(complaint.dateOfComplaint).format("YYYY-MM-DD"),
        complaint.diseaseStatus,
        complaint.controlMethod,
        complaint.solution,
        complaint.officerRemarks,
      ]);

      doc.autoTable({
        head: [
          [
            "Farmer ID",
            "Area",
            "Crop Affected",
            "Date of Complaint",
            "Disease Status",
            "Control Method",
            "Solution",
            "Officer Remarks",
          ],
        ],
        body: complaints,
        startY: 60,
        theme: "striped",
        headStyles: { fillColor: [22, 160, 133] },
        margin: { left: 14, right: 14 },
      });

      const currentDate = new Date();
      const dateString = currentDate.toLocaleDateString();
      const timeString = currentDate.toLocaleTimeString();

      // Add the date and time at the bottom of the PDF
      doc.setFontSize(10);
      doc.text(
        `Report generated on: ${dateString} at ${timeString}`,
        14,
        doc.internal.pageSize.height - 10
      );

      doc.save("pest-management-report.pdf");
    });
  };

  const convertToBase64 = (url, callback) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  };

  return (
    <div className="mt-6">
      <h2 className="mb-3">Pest and Disease Complaints</h2>
      <Button onClick={generatePDF} variant="secondary" className="mb-3">
        Generate PDF Report
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Farmer ID</th>
            <th>Area</th>
            <th>Crop Affected</th>
            <th>Complaint Description</th>
            <th>Date of Complaint</th>
            <th>Disease Status</th>
            <th>Control Method</th>
            <th>Solution</th>
            <th>Officer Remarks</th>
          </tr>
        </thead>
        <tbody>
          {complaintData.map((complaint) => (
            <tr
              key={complaint._id}
              onClick={() => handleShow(complaint)}
              style={{ cursor: "pointer" }}
            >
              <td>{complaint.farmerID}</td>
              <td>{complaint.area}</td>
              <td>{complaint.cropAffected}</td>
              <td>{complaint.complaintDescription}</td>
              <td>{moment(complaint.dateOfComplaint).format("YYYY-MM-DD")}</td>
              <td>{complaint.diseaseStatus}</td>
              <td>{complaint.controlMethod}</td>
              <td>{complaint.solution}</td>
              <td>{complaint.officerRemarks}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {selectedComplaint && (
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Complaint Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3 text-center">
              {selectedComplaint.imageURL && (
                <Image
                  src={selectedComplaint.imageURL}
                  fluid
                  rounded
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
              )}
            </div>

            <Row>
              <Col md={6}>
                <Form.Group controlId="farmerID">
                  <Form.Label>Farmer ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedComplaint.farmerID}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="area">
                  <Form.Label>Area</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedComplaint.area}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="cropAffected" className="mt-3">
                  <Form.Label>Crop Affected</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedComplaint.cropAffected}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="dateOfComplaint" className="mt-3">
                  <Form.Label>Date of Complaint</Form.Label>
                  <Form.Control
                    type="text"
                    value={moment(selectedComplaint.dateOfComplaint).format(
                      "YYYY-MM-DD"
                    )}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="diseaseStatus" className="mt-3">
                  <Form.Label>Disease Status</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.diseaseStatus}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        diseaseStatus: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="controlMethod" className="mt-3">
                  <Form.Label>Control Method</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.controlMethod}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        controlMethod: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="solution" className="mt-3">
                  <Form.Label>Solution</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.solution}
                    onChange={(e) =>
                      setFormData({ ...formData, solution: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="officerRemarks" className="mt-3">
                  <Form.Label>Officer Remarks</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.officerRemarks}
                    onChange={(e) =>
                      setFormData({ ...formData, officerRemarks: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
            <Button variant="primary" onClick={handleEdit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default PestManagement;
