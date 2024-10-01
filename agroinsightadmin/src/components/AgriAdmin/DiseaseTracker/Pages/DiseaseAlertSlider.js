import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';

const DiseaseAlertSlider = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetching the first 6 alerts from the backend
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/disease/disease-alerts`);
        setAlerts(response.data.slice(0, 6)); // Limiting to the first 6 alerts
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  if (loading) {
    return (
      <Container className="text-center my-4">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center my-4">
        <p>Error: {error}</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h3>Recent Disease Alerts</h3>
      <Row className="d-flex flex-nowrap overflow-auto mt-3" style={{ whiteSpace: 'nowrap' }}>
        {alerts.map((alert) => (
          <Col key={alert._id} className="col-auto">
            <Card className="mb-4" style={{ minWidth: '250px', maxWidth: '300px' }}>
              <Card.Img
                variant="top"
                src={alert.imageURL}
                alt={alert.title}
                style={{ height: '150px', objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title>{alert.title}</Card.Title>
                <Card.Text className="text-truncate" style={{ maxWidth: '200px' }}>
                  {alert.description}
                </Card.Text>
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
    </Container>
  );
};

export default DiseaseAlertSlider;
