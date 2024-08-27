import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Card, Form, Alert, Image } from 'react-bootstrap';

const AITool = () => {
  const [response, setResponse] = useState(null);
  const [imageData, setImageData] = useState(null);

  // Function to handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onloadend = () => {
      setImageData(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file); // Convert the file to base64 string
    }
  };

  // Function to send the request
  const handleSendRequest = async () => {
    if (!imageData) {
      alert('Please upload an image first');
      return;
    }

    const requestData = {
      images: [imageData],
      similar_images: true,
    };

    try {
      const res = await axios.post('https://plant.id/api/v3/health_assessment', requestData, {
        headers: {
          'Api-Key': 'qv4jW90ey4LU7zxE3NSjEFYd7iuQRyReYcTNfXc3RJClr0Q4X8',
          'Content-Type': 'application/json',
        },
      });

      setResponse(res.data);
      console.log('Response:', res.data);
    } catch (error) {
      console.error('Error making request:', error);
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">AI Tool</h1>
      <Row className="justify-content-center">
        <Col md={6}>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Upload an Image</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
          </Form.Group>
          <Button variant="primary" onClick={handleSendRequest} className="w-100">Send Request</Button>
        </Col>
      </Row>

      {response && (
        <Row className="mt-5">
          <Col>
            <h2 className="mb-4 text-success">Health Assessment Results</h2>

            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Is Plant:</Card.Title>
                <Card.Text>Probability: {response.result.is_plant.probability}</Card.Text>
                <Card.Text>Threshold: {response.result.is_plant.threshold}</Card.Text>
                <Card.Text>Binary: {response.result.is_plant.binary ? 'Yes' : 'No'}</Card.Text>
              </Card.Body>
            </Card>

            <h3 className="mb-3">Diseases Identified:</h3>
            {response.result.disease.suggestions.map((disease, index) => (
              <Card key={index} className="mb-4">
                <Card.Body>
                  <Card.Title>{disease.name}</Card.Title>
                  <Card.Text>Probability: {disease.probability}</Card.Text>
                  <Row>
                    {disease.similar_images.map((image, imgIndex) => (
                      <Col xs={6} md={4} lg={3} key={imgIndex} className="mb-3">
                        <Card>
                          <Image src={image.url_small} alt={`similarity-${imgIndex}`} rounded fluid />
                          <Card.Body>
                            <Card.Text className="text-center">Similarity: {image.similarity}</Card.Text>
                            <Card.Text className="text-muted" style={{ fontSize: '12px' }}>
                              Citation: {image.citation}
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default AITool;
