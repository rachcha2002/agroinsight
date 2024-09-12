import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Card, Form, Image } from 'react-bootstrap';
import { jsPDF } from 'jspdf'; // Import jsPDF
import 'jspdf-autotable'; // Import the autoTable plugin
import logo from '../../../../images/logoNoBack.png'; // Assuming you have the logo image path here

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

  // Function to generate PDF report with the OctagonIT header
  const generatePDF = () => {
    convertToBase64(logo, (imgData) => {
      const doc = new jsPDF();

      // Add the OctagonIT logo and header
      doc.addImage(imgData, 'PNG', 14, 10, 70, 30); // x, y, width, height
      doc.setFontSize(12);
      doc.text('AgroInsight (By OctagonIT)', 100, 20); // Adjust position as needed
      doc.text('Email: teamoctagonit@gmail.com', 100, 26);
      doc.text('Phone: +94711521161', 100, 32);

      // Add title
      doc.setFontSize(16);
      doc.text('AI Health Assessment Report', 14, 50);

      // Add plant assessment results
      doc.setFontSize(12);
      doc.text('Is Plant:', 14, 60);
      doc.text(`Probability: ${(response.result.is_plant.probability * 100).toFixed(2)}%`, 14, 66);
      doc.text(`Threshold: ${(response.result.is_plant.threshold * 100).toFixed(2)}%`, 14, 72);
      doc.text(`Binary: ${response.result.is_plant.binary ? 'Yes' : 'No'}`, 14, 78);

      // Add diseases identified
      doc.text('Diseases Identified:', 14, 88);
      response.result.disease.suggestions.forEach((disease, index) => {
        doc.setFontSize(14);
        doc.text(disease.name, 14, 98 + index * 40);

        doc.setFontSize(12);
        doc.text(`Probability: ${(disease.probability * 100).toFixed(2)}%`, 14, 104 + index * 40);
        
        // Add similar images for each disease
        const imageRows = disease.similar_images.map((image) => [
          image.url_small,
          `${(image.similarity * 100).toFixed(2)}%`,
          image.citation,
        ]);

        doc.autoTable({
          head: [['Image URL', 'Similarity', 'Citation']],
          body: imageRows,
          startY: 110 + index * 40,
          theme: 'striped',
        });
      });

      // Get the current date and time
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

      // Save the PDF
      doc.save('health-assessment-report.pdf');
    });
  };

  // Convert image to base64 for the PDF logo
  const convertToBase64 = (url, callback) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
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
          <Button variant="primary" onClick={handleSendRequest} className="w-100">Submit</Button>
        </Col>
      </Row>

      {response && (
        <Row className="mt-5 justify-content-center">
          <Col md={8}>
            <h2 className="mb-4 text-success text-center">Health Assessment Results</h2>

            <Card className="mb-4">
              <Card.Body className="text-center">
                <Card.Title>Is Plant:</Card.Title>
                <Card.Text>Probability: {(response.result.is_plant.probability * 100).toFixed(2)}%</Card.Text>
                <Card.Text>Threshold: {(response.result.is_plant.threshold * 100).toFixed(2)}%</Card.Text>
                <Card.Text>Binary: {response.result.is_plant.binary ? 'Yes' : 'No'}</Card.Text>
              </Card.Body>
            </Card>

            <h3 className="mb-3 text-center">Diseases Identified:</h3>
            {response.result.disease.suggestions.map((disease, index) => (
              <Card key={index} className="mb-4">
                <Card.Body>
                  <Card.Title className="text-center">{disease.name}</Card.Title>
                  <Card.Text className="text-center">Probability: {(disease.probability * 100).toFixed(2)}%</Card.Text>
                  <Row className="justify-content-center">
                    {disease.similar_images.map((image, imgIndex) => (
                      <Col xs={12} md={6} lg={4} key={imgIndex} className="mb-3 d-flex justify-content-center">
                        <Card>
                          <Image src={image.url_small} alt={`similarity-${imgIndex}`} rounded fluid />
                          <Card.Body className="text-center">
                            <Card.Text>Similarity: {(image.similarity * 100).toFixed(2)}%</Card.Text>
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

            <Button variant="secondary" className="w-100 mt-4" onClick={generatePDF}>
              Download PDF Report
            </Button>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default AITool;
