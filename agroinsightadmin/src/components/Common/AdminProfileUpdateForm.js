import React, { useState, useEffect } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import "./Main.css";
import PageTitle from "./PageTitle";
import { BsArrowLeft } from "react-icons/bs";

const AdminProfileUpdateForm = () => {
  const { adminId } = useParams(); // Get the adminId from URL parameters
  const [adminProfile, setAdminProfile] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    designation: "",
  });

  // Add state for password fields
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(""); // To store validation errors
  const [success, setSuccess] = useState(""); // To store success messages
  const navigate = useNavigate();

  // Fetch the current admin profile to prefill the form
  const fetchAdminProfile = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin-profile/adminbyId/${adminId}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch admin profile");
      }

      setAdminProfile(data); // Prefill the form with fetched data
    } catch (error) {
      setError("Error fetching admin profile. Please try again.");
    }
  };

  useEffect(() => {
    fetchAdminProfile();
  }, [adminId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminProfile({
      ...adminProfile,
      [name]: value,
    });
    setError(""); // Clear any existing errors when user types
  };

  // Handle password field changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({
      ...passwords,
      [name]: value,
    });
    setError(""); // Clear any existing errors when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match before proceeding
    if (
      passwords.password &&
      passwords.password !== passwords.confirmPassword
    ) {
      setError("Passwords do not match!");
      return;
    }

    try {
      // Combine admin profile data and password if provided
      const updatedProfile = { ...adminProfile };
      if (passwords.password) {
        updatedProfile.password = passwords.password; // Only include password if it was entered
      }

      // Send the updated profile data to the backend
      const response = await fetch(
        `http://localhost:5000/api/admin-profile/update-admin/${adminId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProfile),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update admin profile");
      }

      const data = await response.json(); // Parse the response JSON
      setSuccess("Admin profile updated successfully!");

      // Redirect back to the admin profiles page
      navigate("/superadmin/admin-profiles");
    } catch (error) {
      console.error("Error updating admin profile:", error);
      setError("Error updating admin profile. Please try again.");
    }
  };

  return (
    <main id="main" className="main">
        <PageTitle title="Admin Profiles" url="/superadmin/admin-profiles/update" />
      <Container className="mt-2">
        <h3><Button
            variant="dark"
            onClick={() =>
              navigate("/superadmin/admin-profiles")
            }
            style={{ margin: "10px" }}
          >
            <BsArrowLeft /> Back
          </Button>Update Admin Profile</h3>
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

          {/* Add password and confirm password fields */}
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter new password"
              value={passwords.password}
              onChange={handlePasswordChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="Re-enter new password"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Update Admin Profile
          </Button>
        </Form>
      </Container>
    </main>
  );
};

export default AdminProfileUpdateForm;
