import React, { useState, useEffect } from "react";
import { Table, Modal, Button, Form, Image, Row, Col } from "react-bootstrap";
import axios from "axios";
import moment from "moment"; // For formatting dates

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
        // Update the complaint data in the table
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
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/disease/complaints/${selectedComplaint._id}`
      );
      if (response.status === 200) {
        // Remove the complaint from the table
        setComplaintData(
          complaintData.filter(
            (complaint) => complaint._id !== selectedComplaint._id
          )
        );
        setShow(false);
        alert("Complaint deleted successfully.");
      } else {
        alert("Failed to delete the complaint.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete the complaint.");
    }
  };

  return (
    <div className="mt-6">
      <h2 className="mb-3">Pest and Disease Complaints</h2>
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
                <Form.Group controlId="complaintDescription" className="mt-3">
                  <Form.Label>Complaint Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={selectedComplaint.complaintDescription}
                    readOnly
                  />
                </Form.Group>
              </Col>
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
            </Row>

            <Row>
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
            </Row>

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
