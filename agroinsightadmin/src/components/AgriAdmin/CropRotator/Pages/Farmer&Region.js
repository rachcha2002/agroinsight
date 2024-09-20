import React, { useEffect, useState } from "react";
import {Table, Button, Modal, Form} from 'react-bootstrap';

function FarmerRegion() {
  const [farmerData, setFarmerData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [newCrop, setNewCrop] = useState("");

  useEffect(() => {
    // Fetch the data from backend API
    fetch("http://localhost:5000/api/crop-rotator/rotator-detail")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Data:", data);
        setFarmerData(data); // Set the fetched data into state
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleRecommendCrop = (farmer) => {
    setSelectedFarmer(farmer);
    setShowModal(true);
  };

  const handleSave = () => {
    // Update the recommended crop for the selected farmer in the state
    const updatedData = farmerData.map((farmer) =>
      farmer._id === selectedFarmer._id ? { ...farmer, recommendedCrop: newCrop } : farmer
    );
    setFarmerData(updatedData);

  // Close modal
  setShowModal(false);
  setNewCrop("");
  
//backend API call to update the recommended crop
fetch(`http://localhost:5000/api/crop-rotator/rotator-detail/${selectedFarmer._id}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ recommendedCrop: newCrop }),
})
  .then((response) => response.json())
  .then((updatedFarmer) => {
    console.log("Successfully updated:", updatedFarmer);
  })
  .catch((error) => console.error("Error updating recommended crop:", error));
};

  return (
    <>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Farmer ID</th>
            <th>Farmer Name</th>
            <th>Region / Zone</th>
            <th>Season</th>
            <th>Status</th>
            <th>Current Crop</th>
            <th>Recommended Crop</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        {farmerData.length > 0 ? (
          farmerData.map((farmer, index) => (
          <tr key={index}>
            <td>{`F0${index + 1}`}</td>
            <td>{"Unknown"}</td>
            <td>{"Unknown"}</td>
            <td>{farmer.season}</td>
            <td>{farmer.status}</td>
            <td>{farmer.currentCrop}</td>
            <td>{farmer.recommendedCrop}</td>
            <td>
                  {farmer.recommendedCrop === "Recommendation Pending..." ? (
                    <Button variant="success" onClick={() => handleRecommendCrop(farmer)}>
                      Recommend Crop
                    </Button>
                  ) : (
                    "Already Recommended"
                  )}
                </td>
          </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </Table>

       {/* Modal for recommending a new crop */}
       <Modal show={showModal} onHide={() => setShowModal(false)}>
       <Modal.Header closeButton>
         <Modal.Title>Recommend Crop for next Season</Modal.Title>
       </Modal.Header>
       <Modal.Body>
         <Form>
           <Form.Group controlId="formRecommendedCrop">
             <Form.Label>New Recommended Crop</Form.Label>
             <Form.Control
               type="text"
               value={newCrop}
               onChange={(e) => setNewCrop(e.target.value)}
               placeholder="Enter recommended crop"
             />
           </Form.Group>
         </Form>
       </Modal.Body>
       <Modal.Footer>
         <Button variant="secondary" onClick={() => setShowModal(false)}>
           Close
         </Button>
         <Button variant="primary" onClick={handleSave}>
           Save Changes
         </Button>
       </Modal.Footer>
     </Modal>
     </>
  );
}

export default FarmerRegion;