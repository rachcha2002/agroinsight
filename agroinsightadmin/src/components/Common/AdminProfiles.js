import React, { useEffect, useState } from "react";
import { Table, Button, Container, Alert } from "react-bootstrap";
import "./Main.css";
import PageTitle from "../Common/PageTitle";
import { useNavigate } from "react-router-dom";

const AdminProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Fetch all admin profiles from the backend
  const fetchAdminProfiles = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin-profile/all-admins`
      );
      const data = await response.json();

      if (response.ok) {
        setProfiles(data);
      } else {
        setError(data.error || "Failed to fetch profiles");
      }
    } catch (error) {
      setError("Error fetching admin profiles");
    }
  };

  // Delete an admin profile
  const handleDelete = async (adminId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin-profile/delete-admin/${adminId}`,
        { method: "DELETE" }
      );
      const data = await response.json();

      if (response.ok) {
        setSuccess("Admin profile deleted successfully");
        setProfiles(profiles.filter((profile) => profile.adminId !== adminId));
      } else {
        setError(data.error || "Failed to delete profile");
      }
    } catch (error) {
      setError("Error deleting admin profile");
    }
  };

  // Handle update (for now, we'll just log the adminId)
  const handleUpdate = (adminId) => {
    // Redirect to update form or handle update logic
    navigate(`/superadmin/admin-profile/update/${adminId}`);
  };

  useEffect(() => {
    fetchAdminProfiles();
  }, []);

  return (
    <main id="main" className="main">
      <PageTitle title="Admin Profiles" url="/superadmin/admin-profiles" />
      <Container className="mt-2">
        <h3>Admin Profiles</h3>
        <Button
          variant="dark"
          onClick={() => navigate("/superadmin/add-profile")}
          style={{ margin: "10px" }}
        >
          Add Profile
        </Button>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Admin ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Designation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {profiles.length > 0 ? (
              profiles.map((profile, index) => (
                <tr key={profile.adminId}>
                  <td>{index + 1}</td>
                  <td>{profile.adminId}</td>
                  <td>{profile.name}</td>
                  <td>{profile.email}</td>
                  <td>{profile.address}</td>
                  <td>{profile.phone}</td>
                  <td>{profile.designation}</td>
                  <td>
                    <Button
                      variant="warning"
                      className="me-1 mb-2"
                      onClick={() => handleUpdate(profile.adminId)}
                    >
                      Update
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(profile.adminId)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No admin profiles found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>
    </main>
  );
};

export default AdminProfiles;
