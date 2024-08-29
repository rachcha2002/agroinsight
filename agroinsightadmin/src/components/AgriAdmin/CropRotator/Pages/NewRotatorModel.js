import {React, useState} from "react";
import axios from "axios";
import {
    Card,
    Row,
    Col,
    Tab,
    Tabs,
    Button,
    Form
  } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

import PageTitle from "../../AgriPageTitle";

const NewRotatorModel = () => {
  console.log("NewRotatorModel component rendered");
    const [key, setKey] = useState("models");

    const [modelId, setmodelId] = useState('');
    const [zone, setZone] = useState('');
    const [year, setYear] = useState('');
    const [season, setSeason] = useState('');
    const [climateDescription, setclimateDescription] = useState('');
    const [soilDescription, setsoilDescription] = useState('');
    const [climateSuitability, setclimateSuitability] = useState('');
    const [soilSuitability, setsoilSuitability] = useState('');
    const [crop, setCrop] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
      event.preventDefault();
  
      const formData = {
        modelId: modelId,
        year: year,
        zone: zone,
        climateDescription: climateDescription,
        soilDescription: soilDescription,
        season: season,
        crop: crop,
        climateSuitability: climateSuitability,
        soilSuitability: soilSuitability,
      };
      
  
      try {
        await axios.post('http://localhost:5000/api/crop-rotator/model', formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log(formData);
        // Reset the form after successful submission
        setmodelId('');
        setZone('');
        setYear('');
        setSeason('');
        setclimateDescription('');
        setsoilDescription('');
        setclimateSuitability('');
        setsoilSuitability('');
        setCrop('');
  
        alert('New model added successfully');
        navigate(-1)
      }catch (error) {
        console.log(formData);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);
          console.error('Error response headers:', error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Error request:', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error message:', error.message);
        }
      }
    };
       

    return(
        <main id="main" className="main">
        <PageTitle 
        title="Add New Crop Rotation Model" 
        url="/agriadmin/crops/addmodel"
        />
        <section style={{ position: "relative" }}>
        <Card>
          <Card.Body style={{ backgroundColor: "white", padding: "25px" }}>
            <Tabs
              id="controlled-tab-example"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mb-3"
              mountOnEnter
              unmountOnExit
            >
              <Tab eventKey="details" title="Farmer & Region Management">
              </Tab>
              <Tab eventKey="models" title="Crop Rotation Models">
              </Tab>
              <Tab eventKey="reports" title="Analysis & Reports">
              </Tab>
              <Tab eventKey="news" title="Educational Resources">
              </Tab>
            </Tabs>
            <h4 style={{fontWeight:"bold"}}>Create New Model</h4>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col>
            <Form.Group controlId="formModelId" className="mb-3">
            <Form.Label>Model ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Model Id"
              value={modelId}
              onChange={(e) => setmodelId(e.target.value)}
              required
            />
            </Form.Group>
              </Col>
              <Col>
            <Form.Group controlId="formZone" className="mb-3">
            <Form.Label>Zone</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter zone"
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              required
            />
            </Form.Group>
              </Col>
              </Row>
              <Row>
                <Col>
            <Form.Group controlId="formYear" className="mb-3">
            <Form.Label>Year</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            />
            </Form.Group>
              </Col>
              <Col>
            <Form.Group controlId="formSeason" className="mb-3">
            <Form.Label>Season</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter season"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              required
            />
            </Form.Group>
              </Col>
              </Row>
              <Row>
                <Col>
            <Form.Group controlId="formClimatedes" className="mb-3">
            <Form.Label>Climate Description</Form.Label>
            <Form.Control
              type="textarea"
              placeholder="Enter climate description"
              value={climateDescription}
              onChange={(e) => setclimateDescription(e.target.value)}
              required
            />
            </Form.Group>
              </Col>
              <Col>
            <Form.Group controlId="formSoiledes" className="mb-3">
            <Form.Label>Soil Description</Form.Label>
            <Form.Control
              type="textarea"
              placeholder="Enter soil description"
              value={soilDescription}
              onChange={(e) => setsoilDescription(e.target.value)}
              required
            />
            </Form.Group>
              </Col>
              </Row>
              <Row>
              <Col>
            <Form.Group controlId="formClimatesuit" className="mb-3">
            <Form.Label>Climate Suitability</Form.Label>
            <Form.Control
              type="textarea"
              placeholder="Enter climate suitability"
              value={climateSuitability}
              onChange={(e) => setclimateSuitability(e.target.value)}
              required
            />
            </Form.Group>
              </Col>
              <Col>
            <Form.Group controlId="formSoilksuit" className="mb-3">
            <Form.Label>Soil Suitability</Form.Label>
            <Form.Control
              type="textarea"
              placeholder="Enter soil suitability"
              value={soilSuitability}
              onChange={(e) => setsoilSuitability(e.target.value)}
              required
            />
            </Form.Group>
              </Col>
              </Row>
              <Row>
                <Col>
            <Form.Group controlId="formCrop" className="mb-3">
            <Form.Label>Suggested Crop</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter suggested crop"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              required
            />
            </Form.Group>
              </Col>
              <Col>
              </Col>
              </Row>
      <Button variant="primary" type="submit" style={{marginTop:"10px",marginLeft:"20px",marginBottom:"20px"}} >
        Submit
      </Button>
      <Button variant="secondary"  style={{marginTop:"10px",marginLeft:"25px",marginBottom:"19px"}}
      onClick={() => navigate(-1)}>
        Cancel
      </Button>
            </Form>
            </Card.Body>
          </Card>
      </section>
        </main>
    );
};

export default NewRotatorModel;