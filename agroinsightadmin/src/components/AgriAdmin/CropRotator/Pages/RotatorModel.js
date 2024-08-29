import {React, useEffect, useState} from "react";
import axios from "axios";
import { Card, Row, Col, Button, Modal, Form } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';


export default function RotatorModel() {
    const [models, setModels] = useState([]);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [currentModel, setCurrentModel] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch data from the backend
        axios.get('http://localhost:5000/api/crop-rotator/model')
          .then(response => {
            const arrayData = Object.values(response.data);
            setModels(arrayData);
           // setModels(response.data);
           console.log(response.data);
          })
          .catch(error => {
            console.error('There was an error fetching the data!', error);
          });
      }, []);

  // Function to chunk the models into groups of three
  const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const modelChunks = chunkArray(Object.values(models), 3);

  const handleAddModel = () =>{
    navigate('addmodel');
  }

  
  const handleDelete = async (id) => {
      try {
        // Send DELETE request to backend API using axios
        await axios.delete(`http://localhost:5000/api/crop-rotator/model/${id}`);
        alert("Model deleted successfully!");
        navigate("/agriadmin"); // Redirect to home page or any other desired page
      } catch (error) {
        console.error("Error deleting model:", error);
        // Handle error (e.g., display error message)
      }
    };

    const handleUpdate = (model) => {
      setCurrentModel(model);
      setShowUpdateModal(true); // Show update modal
    };
  
    const handleUpdateSubmit = async () => {
      try {
        // Send PUT request to update the model
        await axios.put(`http://localhost:5000/api/crop-rotator/model/${currentModel._id}`, currentModel);
        alert("Model updated successfully!");
        setModels(models.map(model => model._id === currentModel._id ? currentModel : model));
        setShowUpdateModal(false);
      } catch (error) {
        console.error("Error updating model:", error);
      }
    };
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setCurrentModel({ ...currentModel, [name]: value });
    };

    return (
      <div>
        <h4>Crop Rotation Models</h4>
        <Button variant="primary" onClick={handleAddModel} style={{ paddingBottom: "10px" }}>
          Add New Model
        </Button>
        {modelChunks.length > 0 ? (
          modelChunks.map((chunck, rowIndex) => (
            <Row key={rowIndex}>
              {chunck.map((model, colIndex) => (
                <Col key={colIndex}>
                  <Card>
                    <Card.Body>
                      <Card.Title>{model.modelId}</Card.Title>
                      <Card.Text>
                        <strong>Zone:</strong> {model.zone}<br />
                        <strong>Season:</strong> {model.season}<br />
                        <strong>Year:</strong> {model.year}<br />
                        <strong>Crop:</strong> {model.crop}<br />
                        <strong>Climate Description:</strong> {model.climateDescription}<br />
                        <strong>Soil Description:</strong> {model.soilDescription}<br />
                        <strong>Climate Suitability:</strong> {model.climateSuitability}<br />
                        <strong>Soil Suitability:</strong> {model.soilSuitability}

                        <Row className="mb-3">
                          <Button variant="success" type="submit"
                            style={{ marginTop: "1px", marginLeft: "10px", width: "90%" }}
                            onClick={() => handleUpdate(model)}>
                            Update Model
                          </Button>
                        </Row>
                        <Row className="mb-3">
                          <Button variant="danger" type="submit"
                            style={{ marginTop: "1px", marginLeft: "10px", width: "90%" }}
                            onClick={() => handleDelete(model._id)}>
                            Delete Model
                          </Button>
                        </Row>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ))
        ) : (
          <p>Loading...</p>
        )}
    
 {/* Update Model Modal */}
 <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
 <Modal.Header closeButton>
   <Modal.Title>Update Model</Modal.Title>
 </Modal.Header>
 <Modal.Body>
   {currentModel && (
     <Form>
       <Form.Group controlId="formModelId">
         <Form.Label>Model ID</Form.Label>
         <Form.Control
           type="text"
           name="modelId"
           value={currentModel.modelId}
           onChange={handleInputChange}
         />
       </Form.Group>
       <Form.Group controlId="formZone">
         <Form.Label>Zone</Form.Label>
         <Form.Control
           type="text"
           name="zone"
           value={currentModel.zone}
           onChange={handleInputChange}
         />
       </Form.Group>
       <Form.Group controlId="formSeason">
         <Form.Label>Season</Form.Label>
         <Form.Control
           type="text"
           name="season"
           value={currentModel.season}
           onChange={handleInputChange}
         />
       </Form.Group>
       <Form.Group controlId="formYear">
         <Form.Label>Year</Form.Label>
         <Form.Control
           type="text"
           name="year"
           value={currentModel.year}
           onChange={handleInputChange}
         />
       </Form.Group>
       <Form.Group controlId="formCrop">
         <Form.Label>Crop</Form.Label>
         <Form.Control
           type="text"
           name="crop"
           value={currentModel.crop}
           onChange={handleInputChange}
         />
       </Form.Group>
       <Form.Group controlId="formClimateDescription">
         <Form.Label>Climate Description</Form.Label>
         <Form.Control
           type="text"
           name="climateDescription"
           value={currentModel.climateDescription}
           onChange={handleInputChange}
         />
       </Form.Group>
       <Form.Group controlId="formSoilDescription">
         <Form.Label>Soil Description</Form.Label>
         <Form.Control
           type="text"
           name="soilDescription"
           value={currentModel.soilDescription}
           onChange={handleInputChange}
         />
       </Form.Group>
       <Form.Group controlId="formClimateSuitability">
         <Form.Label>Climate Suitability</Form.Label>
         <Form.Control
           type="text"
           value={currentModel.soilDescription}
           onChange={handleInputChange}
         />
          </Form.Group>
          <Form.Group controlId="formSoilksuit" className="mb-3">
            <Form.Label>Soil Suitability</Form.Label>
            <Form.Control
              type="textarea"
              placeholder="Enter soil suitability"
              value={currentModel.soilSuitability}
              onChange={handleInputChange}
            />
            </Form.Group>
      <Button variant="primary" type="submit" style={{marginTop:"10px",marginLeft:"20px",marginBottom:"20px"}} 
      onClick={() => handleUpdateSubmit()}>
        Save Changes
      </Button>
      <Button variant="secondary"  style={{marginTop:"10px",marginLeft:"25px",marginBottom:"19px"}}
      onClick={() => navigate(-1)}>
        Cancel
      </Button>
            </Form>
            
   )}
   </Modal.Body>
   </Modal>
   </div>
    );
};