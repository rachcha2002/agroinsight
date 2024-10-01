import {React, useEffect, useState} from "react";
import axios from "axios";
import { Card, Row, Col, Button, Modal, Form } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../../../../images/logoNoBack.png";

export default function RotatorModel() {
    const [models, setModels] = useState([]);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [currentModel, setCurrentModel] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        // Fetch data from the backend
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/crop-rotator/model`)
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
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/crop-rotator/model/${id}`);
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
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/crop-rotator/model/${currentModel._id}`, currentModel);
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

    const generatePDF = async () => {
      const doc = new jsPDF();
  
      // Add the image to the PDF
      const imgWidth = 50; // Set the desired width
      const imgHeight = 20; // Set the desired height
      const xOffset = 14; // Horizontal offset from the left edge
      let yOffset = 10; // Vertical offset from the top edge
      doc.addImage(logo, "PNG", xOffset, yOffset, imgWidth, imgHeight);
  
      // Add the name, email, and phone number
      doc.setFontSize(10);
      doc.text("AgroInsight(By OctagonIT)", 150, 12); // Adjust the position as needed
      doc.text("Email: teamoctagonit@gmail.com", 150, 18);
      doc.text("Phone: +94711521161", 150, 24);
      doc.text("By Agriculture Admin", 150, 30);
  
      // Title for the PDF
      doc.setFontSize(16); // Title font size
      doc.text("Crop Rotator Recommendations", 14, 40);

       // Set the initial vertical offset for model details
       yOffset = 50; // Start below the title
  
      // Add list of properties before the table
      models.forEach((model) => {
      // Add the model's details as text
      doc.setFontSize(10); // Smaller font size for properties
      const propertyData = [
        `ModelID: ${model.modelId}`,
        `Zone: ${model.zone}`,
        `Year: ${model.year}`,
        `Crop: ${model.crop}`,
      ];
  
      propertyData.forEach((item) => {
        doc.text(item, 14, yOffset);
        yOffset += 5; // Move down for each line of model details
      });
  
      // Prepare table data for this specific model
      const tableData = [
        [
          model.climateDescription || '',
          model.soilDescription || '',
          model.climateSuitability || '',
          model.soilSuitability || '',
        ],
      ];
  
      // Add the table under each model's details
      doc.setFontSize(8); // Reset font size for table
      doc.autoTable({
        head: [["Climate Description", "Soil Description", "Climate Suitability", "Soil Suitability"]],
        body: tableData,
        startY: yOffset,
        theme: "grid",
        headStyles: { fillColor: [0, 128, 0] }, // Green header color
        columnStyles: {
          0: { cellWidth: 45 }, //setting same width for all columns
          1: { cellWidth: 45 },
          2: { cellWidth: 45 },
          3: { cellWidth: 45 },
        },
      });
  
      // Update yOffset to move below the table for the next model
      yOffset = doc.lastAutoTable.finalY + 10; // Add some space below the table
    });
  
    
      // Get the current date and time
      const currentDate = new Date();
      const dateString = currentDate.toLocaleDateString();
      const timeString = currentDate.toLocaleTimeString();
  
      // Add the date and time at the bottom of the PDF
      doc.setFontSize(10);

      doc.text(
        `Report generated on: ${dateString} at ${timeString}`,
        14,
        doc.internal.pageSize.height - 10
      );
  
      // Save the PDF
      doc.save("rotatormodel_report.pdf");
      };
  
    return (
      <div>
        <Card>
          <Card.Body style={{padding:"20px"}}>
        <h4>Crop Rotation Models</h4>
        <Button variant="primary" onClick={handleAddModel} style={{ paddingBottom: "10px" }}>
          Add New Model
        </Button>
        <Button variant="success" onClick={generatePDF} style={{ marginLeft: "10px" }}>
          Generate PDF
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
   </Card.Body>
        </Card>
   </div>
    );
  };