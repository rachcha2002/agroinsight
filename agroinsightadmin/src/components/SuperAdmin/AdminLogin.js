import React, { useState, useContext } from "react";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Image,
} from "react-bootstrap";
import logo from "../../images/logoNoBack.png"; // Adjust path to your logo
import { useNavigate } from "react-router-dom";
import { AdminAuthContext } from "../../context/AdminAuthContext"; // Import AdminAuthContext

const AdminLogin = ({ toggleLoading }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = useContext(AdminAuthContext); // Access AdminAuthContext

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      toggleLoading(true); // Set loading to true before API call
      const response = await fetch(
        `http://localhost:5000/api/admin-profile/admin/login`, // Update the URL to your admin login endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }), // Send email and password
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      console.log("Login successful:", data);

      // Update context with user data received from the backend
      auth.login(data.admin.adminId, data.token, data.admin.designation); // Corrected this line

      // Navigate based on admin's designation
      if (data.admin.designation === "Super Admin") {
        navigate("/superadmin/");
      } else if (data.admin.designation === "Agri Admin") {
        navigate("/agriadmin/");
      } else if (data.admin.designation === "Market Admin") {
        navigate("/market/");
      } else {
        setError("Invalid designation. Please contact administrator.");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      setError("Login failed. Please check your email and password.");
    } finally {
      toggleLoading(false); // Set loading to false after API call
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
          <Card
            style={{ marginTop: "60px", marginBottom: "50px", padding: "30px" }}
          >
            <Card.Body>
              <Image
                src={logo}
                alt="logo"
                fluid
                className="w-50 mx-auto d-block"
              />
              <h2 className="text-center mb-2 mt-4">Login</h2>
              {error && <p className="text-danger">{error}</p>}
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email">
                  <Form.Label>Email:</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="password">
                  <Form.Label>Password:</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  block
                  style={{ marginTop: "20px" }}
                >
                  Login
                </Button>
              </Form>
            </Card.Body>
            <Card.Footer>
              <p className="forgot-password text-right">
                <a href="mailto:support@example.com">Forgot password?</a>
              </p>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLogin;
