import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Main/Main.css";
import { BsArrowLeft } from "react-icons/bs";
import { Form, Button, Container, Row, Col, ListGroup } from "react-bootstrap";
import PageTitle from "../AgriPageTitle";
import { BiPlus } from "react-icons/bi"; // Assuming you're using react-icons

const CropCategoryForm = () => {
  //to redirect after success
  const navigate = useNavigate();

  const [category, setCategory] = useState({
    name: "",
    description: "",
    crops: [
      {
        name: "",
        soilType: "",
        growthStage: "",
        weatherCondition: "",
      },
    ],
  });

  const handleChange = (e) => {
    const { name, value, dataset } = e.target;
    const [level, index, field] = name.split("-");

    setCategory((prevState) => {
      const updatedState = { ...prevState };

      if (level === "crop") {
        updatedState.crops[index][field] = value;
      } else {
        updatedState[name] = value;
      }

      return updatedState;
    });
  };

  const handleAddCrop = () => {
    setCategory((prevState) => ({
      ...prevState,
      crops: [
        ...prevState.crops,
        {
          name: "",
          soilType: "",
          growthStage: "",
          weatherCondition: "",
        },
      ],
    }));
  };

  const handleRemoveCrop = (index) => {
    const newCrops = category.crops.filter((_, i) => i !== index);
    setCategory((prevState) => ({
      ...prevState,
      crops: newCrops,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/f&p/add-cropcategory", category)
      .then((response) => {
        console.log("Category saved successfully!", response.data);
        // Redirect or show a success message
        navigate("/agriadmin/fertilizers&pesticides");
      })
      .catch((error) => {
        console.error("Error saving category:", error);
      });
  };

  return (
    <main id="main" className="main">
      <PageTitle
        title="Fertilizers & Pesticides"
        url="/agriadmin/fertilizers&pesticides/addcropcategory"
      />
      <Container>
        <h3>
          <Button
            variant="dark"
            onClick={() => navigate("/agriadmin/fertilizers&pesticides")}
            style={{ margin: "10px" }}
          >
            <BsArrowLeft /> Back
          </Button>
          Create Crop Category
        </h3>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formCategoryName">
                <Form.Label>Category Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={category.name}
                  onChange={handleChange}
                  placeholder="Enter Category Name"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formCategoryDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={category.description}
                  onChange={handleChange}
                  placeholder="Enter Category Description"
                />
              </Form.Group>
            </Col>
          </Row>
          {category.crops.map((crop, cropIndex) => (
            <ListGroup key={cropIndex} className="mb-4">
              <ListGroup.Item>
                <h5>Crop {cropIndex + 1}</h5>
                <Form.Group controlId={`formCropName-${cropIndex}`}>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name={`crop-${cropIndex}-name`}
                    value={crop.name}
                    onChange={handleChange}
                    placeholder="Enter Crop Name"
                  />
                </Form.Group>
                <br />
                <Form.Group controlId={`formCropSoilType-${cropIndex}`}>
                  <Form.Label>Soil Type</Form.Label>
                  <Form.Control
                    type="text"
                    name={`crop-${cropIndex}-soilType`}
                    value={crop.soilType}
                    onChange={handleChange}
                    placeholder="Enter Soil Type"
                  />
                </Form.Group>
                <br />
                <Form.Group controlId={`formCropGrowthStage-${cropIndex}`}>
                  <Form.Label>Growth Stage</Form.Label>
                  <Form.Control
                    type="text"
                    name={`crop-${cropIndex}-growthStage`}
                    value={crop.growthStage}
                    onChange={handleChange}
                    placeholder="Enter Growth Stage"
                  />
                </Form.Group>
                <br />
                <Form.Group controlId={`formCropWeatherCondition-${cropIndex}`}>
                  <Form.Label>Weather Condition</Form.Label>
                  <Form.Control
                    type="text"
                    name={`crop-${cropIndex}-weatherCondition`}
                    value={crop.weatherCondition}
                    onChange={handleChange}
                    placeholder="Enter Weather Condition"
                  />
                </Form.Group>
                <br />
                <Button
                  variant="dark"
                  className="text-danger d-flex align-items-center" // Red text
                  onClick={() => handleRemoveCrop(cropIndex)}
                >
                  Remove Crop
                  <i
                    className="bi bi-dash-circle-fill ml-2"
                    style={{ marginLeft: "8px" }}
                  ></i>{" "}
                  {/* Minus-circle icon */}
                </Button>
              </ListGroup.Item>
            </ListGroup>
          ))}
          <Col className="d-flex justify-content-between">
            <Button
              variant="dark" // Use 'dark' variant for a black background
              className="text-primary d-flex align-items-center" // Apply blue text and align items
              onClick={handleAddCrop}
            >
              Add Crop
              <i
                className="bi bi-plus-circle-fill ml-2"
                style={{ marginLeft: "8px" }}
              ></i>
            </Button>
            <Button variant="success" type="submit" className="ml-3">
              Add Category
            </Button>
          </Col>
        </Form>
      </Container>
    </main>
  );
};

export default CropCategoryForm;
