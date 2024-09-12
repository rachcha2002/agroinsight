// components/AdminProfileForm.js
import "./Main.css";
import PageTitle from "./PageTitle";
import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";

const AdminProfileForm = () => {
  const [adminProfile, setAdminProfile] = useState({
    //adminId: "", // Remove adminId
    name: "",
    email: "",
    password: "",
    confirmPassword: "", // New field for re-enter password
    address: "",
    phone: "",
    designation: "", // New field for designation
  });
  const navigate = useNavigate();

  const [error, setError] = useState(""); // To store validation errors
  const [success, setSuccess] = useState(""); // To store success messages

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminProfile({
      ...adminProfile,
      [name]: value,
    });
    setError(""); // Clear any existing errors when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Check if passwords match
    if (adminProfile.password !== adminProfile.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const { confirmPassword, ...profileData } = adminProfile; // Exclude confirmPassword

      // Use the fetch API to send the profileData to the backend
      const response = await fetch(
        "http://localhost:5000/api/admin-profile/create-admin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create admin profile");
      }

      const data = await response.json(); // Parse the response JSON
      setSuccess("Admin profile created successfully!");

      // Use the response data to reset the form
      setAdminProfile(data.profile);
      // Redirect back to the admin profiles page
      navigate("/superadmin/admin-profiles");
    } catch (error) {
      console.error("Error creating admin profile:", error);
      setError("Error creating admin profile. Please try again.");
    }
  };

  return (
    <main id="main" className="main">
      <PageTitle title="Admin Profiles" url="/superadmin/admin-profiles/create" />
      <Container className="mt-2">
        <h3><Button
            variant="dark"
            onClick={() =>
              navigate("/superadmin/admin-profiles")
            }
            style={{ margin: "10px" }}
          >
            <BsArrowLeft /> Back
          </Button>Create Admin Profile</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter admin name"
              value={adminProfile.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter admin email"
              value={adminProfile.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter password"
              value={adminProfile.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Re-enter Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={adminProfile.confirmPassword}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="designation">
            <Form.Label>Designation</Form.Label>
            <Form.Control
              as="select"
              name="designation"
              value={adminProfile.designation}
              onChange={handleChange}
              required
            >
              <option value="">Select Designation</option>{" "}
              {/* Default placeholder */}
              <option value="Super Admin">Super Admin</option>
              <option value="Agri Admin">Agri Admin</option>
              <option value="Market Admin">Market Admin</option>
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              name="address"
              placeholder="Enter address"
              value={adminProfile.address}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="phone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={adminProfile.phone}
              onChange={handleChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Create Admin Profile
          </Button>
        </Form>
      </Container>
    </main>
  );
};

export default AdminProfileForm;
