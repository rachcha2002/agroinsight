import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col, Spinner, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const DiseaseAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/disease/disease-alerts');
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
      const response = await axios.get(`http://localhost:5000/api/disease/disease-alerts/${id}`);
      setSelectedAlert(response.data);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching alert details:", err.message);
    }
  };

  const handleDeleteAlert = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/disease/disease-alerts/${id}`);
      setAlerts(alerts.filter(alert => alert._id !== id));
    } catch (err) {
      console.error("Error deleting alert:", err.message);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAlert(null);
  };

  const handleAddNewAlert = () => {
    navigate('addalert')
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
        {alerts.map(alert => (
          <Col key={alert._id} md={6} lg={4}>
            <Card className="mb-4">
              <Card.Img variant="top" src={alert.imageURL} alt={alert.title} style={{ height: '300px', width: '100%', objectFit: 'cover' }} />
              <Card.Body>
                <Card.Title>{alert.title}</Card.Title>
                <Card.Text>{alert.description}</Card.Text>
                <Button variant="success" onClick={() => handleShowDetails(alert._id)}>
                  View Details
                </Button>
                {' '}
                <Button variant="danger" onClick={() => handleDeleteAlert(alert._id)}>
                  Delete
                </Button>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">Date: {new Date(alert.date).toLocaleDateString()}</small>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal for displaying detailed information */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedAlert?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAlert && (
            <>
              <Card.Img 
                variant="top" 
                src={selectedAlert.imageURL} 
                alt={selectedAlert.title} 
                style={{ height: '200px', width: '100%', objectFit: 'cover' }} 
              />
              <p className="mt-4">{selectedAlert.description}</p>
              <p className="text-muted">Date: {new Date(selectedAlert.date).toLocaleDateString()}</p>
              {selectedAlert.details && (
                <p className="mt-4">
                  <strong>Details:</strong> {selectedAlert.details}
                </p>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default DiseaseAlerts;
