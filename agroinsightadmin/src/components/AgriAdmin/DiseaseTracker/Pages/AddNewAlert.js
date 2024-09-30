import React, { useState } from 'react';
import { Form, Button, Container, Image, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddNewAlert = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [details, setDetails] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors = {};

    // Title validation
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    // Description validation
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    // Image validation
    if (!image) {
      newErrors.image = 'Image is required';
    }

    // Details validation
    if (!details.trim()) {
      newErrors.details = 'Details are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate the form before submitting
    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('diseaseImage', image);
    formData.append('details', details);

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/disease/disease-alerts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Reset the form after successful submission
      setTitle('');
      setDescription('');
      setImage(null);
      setImagePreview(null);
      setDetails('');

      alert('New alert added successfully');
      navigate('/agriadmin/diseases');
    } catch (error) {
      console.error('There was an error adding the alert!', error);
      alert('Failed to add the alert');
    }
  };

  return (
    <main id="main" className="main">
      <Container>
        <h1>Add New Disease Alert</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formTitle" className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              isInvalid={!!errors.title}
            />
            {errors.title && <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>}
          </Form.Group>

          <Form.Group controlId="formDescription" className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              isInvalid={!!errors.description}
            />
            {errors.description && <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>}
          </Form.Group>

          <Form.Group controlId="formImage" className="mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              isInvalid={!!errors.image}
            />
            {errors.image && <Form.Control.Feedback type="invalid">{errors.image}</Form.Control.Feedback>}
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
              isInvalid={!!errors.details}
            />
            {errors.details && <Form.Control.Feedback type="invalid">{errors.details}</Form.Control.Feedback>}
          </Form.Group>

          <Button variant="primary" type="submit">
            Add Alert
          </Button>
        </Form>
      </Container>
    </main>
  );
};

export default AddNewAlert;
