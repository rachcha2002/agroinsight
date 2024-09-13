import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import logo from "../../../images/logoNoBack.png";

const PesticideUsage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [comment, setComment] = useState("");

  // Fetch all farmer pesticides records
  const fetchRecords = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/f&p/getallfp`
      );
      setRecords(response.data.data); // Assuming the response has a data field with records
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Handle opening the modal and setting the selected record
  const handleEditComment = (record) => {
    setSelectedRecord(record);
    setComment(record.comment); // Pre-fill the modal with the current comment
    setShowModal(true);
  };

  const handleSaveComment = async () => {
    try {
      // Send a PATCH request to update only the comment field
      await axios.patch(`http://localhost:5000/api/f&p/updatecommentfp/${selectedRecord._id}`, {
        comment,
      });
  
      // Update the local records with the new comment
      const updatedRecords = records.map((record) =>
        record._id === selectedRecord._id ? { ...record, comment } : record
      );
      setRecords(updatedRecords); // Update the state with the modified records
      setShowModal(false); // Close modal on successful update
    } catch (err) {
      console.error("Error updating comment:", err.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Farmer Pesticides Records</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Email</th>
            <th>Region</th>
            <th>Crop</th>
            <th>Pesticide</th>
            <th>Amount</th>
            <th>Target Pest</th>
            <th>Comment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record._id}>
              <td>{record.email}</td>
              <td>{record.region}</td>
              <td>{record.crop}</td>
              <td>{record.pesticide}</td>
              <td>{record.amount}</td>
              <td>{record.targetPest}</td>
              <td>{record.comment}</td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => handleEditComment(record)}
                >
                  Edit Comment
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for editing comment */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formComment">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="success" onClick={handleSaveComment}>
            Save Comment
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PesticideUsage;
