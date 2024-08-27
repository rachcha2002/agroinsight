import React, { useState, useEffect } from 'react';
import { Table, Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment'; // For formatting dates

const PestManagement = () => {
  const [complaintData, setComplaintData] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = (complaint) => {
    setSelectedComplaint(complaint);
    setShow(true);
  };

  useEffect(() => {
    // Fetch data from the provided endpoint
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/disease/complaints`)
      .then(response => {
        setComplaintData(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the complaint data!', error);
      });
  }, []);

  return (
    <div className='mt-6'>
      <h2 className='mb-3'>Pest and Disease Management</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Farmer ID</th>
            <th>Area</th>
            <th>Crop Affected</th>
            <th>Complaint Description</th>
            <th>Date of Complaint</th>
            <th>Disease Status</th>
            <th>Control Method</th>
            <th>Solution</th>
            <th>Officer Remarks</th>
          </tr>
        </thead>
        <tbody>
          {complaintData.map((complaint) => (
            <tr key={complaint._id} onClick={() => handleShow(complaint)} style={{ cursor: 'pointer' }}>
              <td>{complaint.farmerID}</td>
              <td>{complaint.area}</td>
              <td>{complaint.cropAffected}</td>
              <td>{complaint.complaintDescription}</td>
              <td>{moment(complaint.dateOfComplaint).format('YYYY-MM-DD')}</td>
              <td>{complaint.diseaseStatus}</td>
              <td>{complaint.controlMethod}</td>
              <td>{complaint.solution}</td>
              <td>{complaint.officerRemarks}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {selectedComplaint && (
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Complaint Details</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#fff' }}>
            <h5><strong>Farmer ID:</strong> {selectedComplaint.farmerID}</h5>
            <h5><strong>Area:</strong> {selectedComplaint.area}</h5>
            <h5><strong>Crop Affected:</strong> {selectedComplaint.cropAffected}</h5>
            <h5><strong>Complaint Description:</strong> {selectedComplaint.complaintDescription}</h5>
            <h5><strong>Date of Complaint:</strong> {moment(selectedComplaint.dateOfComplaint).format('YYYY-MM-DD')}</h5>
            <h5><strong>Disease Status:</strong> {selectedComplaint.diseaseStatus}</h5>
            <h5><strong>Control Method:</strong> {selectedComplaint.controlMethod}</h5>
            <h5><strong>Solution:</strong> {selectedComplaint.solution}</h5>
            <h5><strong>Officer Remarks:</strong> {selectedComplaint.officerRemarks}</h5>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default PestManagement;
