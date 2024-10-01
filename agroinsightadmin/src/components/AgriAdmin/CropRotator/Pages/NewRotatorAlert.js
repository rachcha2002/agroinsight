import React, { useState } from 'react';
import { Form, Button, Container, Image, Card, Col, Row} from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import PageTitle from '../../AgriPageTitle';

const NewRotatorAlert = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [zone, setZone] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // State for image preview
  const [details, setDetails] = useState('');
  const navigate=useNavigate()

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file); // Save the selected file to the state

    // Generate a preview of the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result); // Set the preview URL
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('zone', zone);
    formData.append('rotatorImage', image); // Append the image file to the form data
    formData.append('details', details);

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/crop-rotator/rotator-alerts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Reset the form after successful submission
      setTitle('');
      setDescription('');
      setZone('');
      setImage(null);
      setImagePreview(null);
      setDetails('');

      alert('New alert added successfully');
      navigate(-1)
    } catch (error) {
      console.error('There was an error adding the alert!', error);
      alert('Failed to add the alert');
    }
  };

  return (
    <main id="main" className="main">
         <PageTitle 
        title="Add New Crop Rotation Alert" 
        url="/agriadmin/crops/rotator-alert"
        />
      <Container>
      <Card>
      <Card.Body style={{ backgroundColor: "white", padding: "25px" }}>
        <Form onSubmit={handleSubmit}>
        <Row>
            <Col>
          <Form.Group controlId="formTitle" className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>
          </Col>
          <Col>
          <Form.Group controlId="formTitle2" className="mb-3">
            <Form.Label>Zone</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter zone"
              value={zone}
              onChange={(e) => setZone(e.target.value)}
            />
          </Form.Group>
          </Col>
          </Row>
          
          <Form.Group controlId="formDescription" className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formImage" className="mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              required
            />
            {imagePreview && (
              <div className="mt-3">
                <Image src={imagePreview} thumbnail fluid alt="Image Preview" />
              </div>
            )}
          </Form.Group>

          <Form.Group controlId="formDetails" className="mb-3">
            <Form.Label>Details</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Enter details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Add Alert
          </Button>
        </Form>
        </Card.Body>
        </Card>
      </Container>
    </main>
  );
};

export default NewRotatorAlert;
