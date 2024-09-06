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

const AgrochemicalNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    details: "",
    source: "", // New source field
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/f&p/news");
        setNews(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleShowDetails = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/f&p/news/${id}`
      );
      setSelectedNews(response.data);
      setFormData({
        title: response.data.title,
        description: response.data.description,
        details: response.data.details || "",
        source: response.data.source || "", // Set source from response
      });
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching news details:", err.message);
    }
  };

  const handleDeleteNews = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/f&p/delete-news/${id}`);
      setNews(news.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Error deleting news:", err.message);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedNews(null);
  };

  const handleAddNewNews = () => {
    navigate("addnews");
  };

  const handleEditNews = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/f&p/update-news/${selectedNews._id}`,
        formData
      );
      if (response.status === 200) {
        // Update the news item in the list with the new data
        setNews(
          news.map((item) =>
            item._id === selectedNews._id ? { ...item, ...formData } : item
          )
        );
        setShowModal(false);
        alert("News updated successfully.");
      } else {
        alert("Failed to update the news.");
      }
    } catch (err) {
      console.error("Error updating news:", err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
          <Button variant="primary" onClick={handleAddNewNews}>
            Add New News
          </Button>
        </Col>
      </Row>
      <Row>
        {news.map((item) => (
          <Col key={item._id} md={6} lg={4}>
            <Card className="mb-4">
              <Card.Img
                variant="top"
                src={item.imageURL}
                alt={item.title}
                style={{ height: "300px", width: "100%", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>{item.title}</Card.Title>
                <Card.Text>{item.description}</Card.Text>
                <Button
                  variant="success"
                  onClick={() => handleShowDetails(item._id)}
                >
                  View Details
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => handleDeleteNews(item._id)}
                >
                  Delete
                </Button>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">
                  Date: {new Date(item.date).toLocaleDateString()}
                </small>
                <br />
                <small className="text-muted">Source: {item.source}</small>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal for displaying and editing news information */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit News</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedNews && (
            <>
              <Card.Img
                variant="top"
                src={selectedNews.imageURL}
                alt={selectedNews.title}
                style={{ height: "200px", width: "100%", objectFit: "cover" }}
              />
              <Form>
                <Form.Group controlId="newsTitle" className="mt-4">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="newsDescription" className="mt-4">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="newsDetails" className="mt-4">
                  <Form.Label>Details</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="newsSource" className="mt-4">
                  <Form.Label>Source</Form.Label>
                  <Form.Control
                    type="text"
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                  />
                </Form.Group>
                <p className="text-muted mt-4">
                  Date: {new Date(selectedNews.date).toLocaleDateString()}
                </p>
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditNews}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AgrochemicalNews;
