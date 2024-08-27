import React, { useState } from 'react';
import { Table, Modal, Button } from 'react-bootstrap';

const PestManagement = () => {
  // Dummy data array
  const complaintData = [
    {
      id: 1,
      farmerID: 'F123',
      area: 'Western Province',
      cropAffected: 'Tomatoes',
      complaintDescription: 'Unknown pest damaging tomatoes',
      dateOfComplaint: '2024-08-20',
      diseaseStatus: 'Unknown',
      controlMethod: 'Pending Investigation',
      solution: 'Under Review',
      officerRemarks: 'Sample collected for lab testing.',
    },
    {
      id: 2,
      farmerID: 'F456',
      area: 'Central Province',
      cropAffected: 'Cucumbers',
      complaintDescription: 'Whiteflies on cucumbers',
      dateOfComplaint: '2024-08-18',
      diseaseStatus: 'Identified',
      controlMethod: 'Yellow Sticky Traps',
      solution: 'Effective',
      officerRemarks: 'Traps distributed to farmer.',
    },
    // Additional dummy records...
  ];

  // State for handling modal visibility and selected complaint data
  const [show, setShow] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = (complaint) => {
    setSelectedComplaint(complaint);
    setShow(true);
  };

  return (
    <div className='mt-6'>
      <h2 className='mb-3'>Pest and Disease Management</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
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
            <tr key={complaint.id} onClick={() => handleShow(complaint)} style={{ cursor: 'pointer' }}>
              <td>{complaint.id}</td>
              <td>{complaint.farmerID}</td>
              <td>{complaint.area}</td>
              <td>{complaint.cropAffected}</td>
              <td>{complaint.complaintDescription}</td>
              <td>{complaint.dateOfComplaint}</td>
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
            <h5><strong>Date of Complaint:</strong> {selectedComplaint.dateOfComplaint}</h5>
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
