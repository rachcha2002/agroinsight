import React, { useEffect, useState } from "react";
import {
  Card,
  Container,
  Row,
  Col,
  Spinner,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DiseaseAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    details: "",
  });
  const [editErrors, setEditErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/disease/disease-alerts`
        );
        setAlerts(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const handleShowDetails = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/disease/disease-alerts/${id}`
      );
      setSelectedAlert(response.data);
      setFormData({
        title: response.data.title,
        description: response.data.description,
        details: response.data.details || "",
      });
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching alert details:", err.message);
    }
  };

  const handleDeleteAlert = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this alert?"
    );

    if (!confirmDelete) {
      return; // If the user cancels, do nothing
    }

    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/disease/disease-alerts/${id}`
      );
      setAlerts(alerts.filter((alert) => alert._id !== id));
      alert("Alert deleted successfully.");
    } catch (err) {
      console.error("Error deleting alert:", err.message);
      alert("Failed to delete the alert.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAlert(null);
    setEditErrors({});
  };

  const handleAddNewAlert = () => {
    navigate("addalert");
  };

  const validateEditForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.details.trim()) {
      newErrors.details = "Details are required";
    }

    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditAlert = async () => {
    if (!validateEditForm()) {
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/disease/disease-alerts/${selectedAlert._id}`,
        formData
      );
      if (response.status === 200) {
        // Update the alert in the list with the new data
        setAlerts(
          alerts.map((alert) =>
            alert._id === selectedAlert._id ? { ...alert, ...formData } : alert
          )
        );
        setShowModal(false);
        alert("Alert updated successfully.");
      } else {
        alert("Failed to update the alert.");
      }
    } catch (err) {
      console.error("Error updating alert:", err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Validate the form after each change
    validateEditForm();
  };

  if (loading) {
    return (
      <Container className="text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center">
        <p>Error: {error}</p>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col className="text-end">
          <Button variant="primary" onClick={handleAddNewAlert}>
            Add New Alert
          </Button>
        </Col>
      </Row>
      <Row>
        {alerts.map((alert) => (
          <Col key={alert._id} md={6} lg={4}>
            <Card className="mb-4">
              <Card.Img
                variant="top"
                src={alert.imageURL}
                alt={alert.title}
                style={{ height: "300px", width: "100%", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>{alert.title}</Card.Title>
                <Card.Text>{alert.description}</Card.Text>
                <Button
                  variant="success"
                  onClick={() => handleShowDetails(alert._id)}
                >
                  View Details
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => handleDeleteAlert(alert._id)}
                >
                  Delete
                </Button>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">
                  Date: {new Date(alert.date).toLocaleDateString()}
                </small>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal for displaying and editing alert information */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Alert</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAlert && (
            <>
              <Card.Img
                variant="top"
                src={selectedAlert.imageURL}
                alt={selectedAlert.title}
                style={{ height: "200px", width: "100%", objectFit: "cover" }}
              />
              <Form>
                <Form.Group controlId="alertTitle" className="mt-4">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    isInvalid={!!editErrors.title}
                  />
                  {editErrors.title && (
                    <Form.Control.Feedback type="invalid">
                      {editErrors.title}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
                <Form.Group controlId="alertDescription" className="mt-4">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    isInvalid={!!editErrors.description}
                  />
                  {editErrors.description && (
                    <Form.Control.Feedback type="invalid">
                      {editErrors.description}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
                <Form.Group controlId="alertDetails" className="mt-4">
                  <Form.Label>Details</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    isInvalid={!!editErrors.details}
                  />
                  {editErrors.details && (
                    <Form.Control.Feedback type="invalid">
                      {editErrors.details}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
                <p className="text-muted mt-4">
                  Date: {new Date(selectedAlert.date).toLocaleDateString()}
                </p>
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditAlert}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DiseaseAlerts;
