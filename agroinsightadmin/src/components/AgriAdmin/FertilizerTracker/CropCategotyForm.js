import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Main/Main.css";
import { BsArrowLeft } from "react-icons/bs";
import { Form, Button, Container, Row, Col, ListGroup } from "react-bootstrap";
import PageTitle from "../AgriPageTitle";
import { BiPlus } from "react-icons/bi"; // Assuming you're using react-icons

const CropCategoryForm = () => {
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

  const [errors, setErrors] = useState({}); // Track validation errors

  const handleChange = (e) => {
    const { name, value } = e.target;
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

  const validateForm = () => {
    const newErrors = {};

    if (!category.name.trim()) {
      newErrors.name = "Category name is required.";
    }
    if (!category.description.trim()) {
      newErrors.description = "Category description is required.";
    }

    category.crops.forEach((crop, index) => {
      if (!crop.name.trim()) {
        newErrors[`crop-${index}-name`] = "Crop name is required.";
      }
      if (!crop.soilType.trim()) {
        newErrors[`crop-${index}-soilType`] = "Soil type is required.";
      }
      if (!crop.growthStage.trim()) {
        newErrors[`crop-${index}-growthStage`] = "Growth stage is required.";
      }
      if (!crop.weatherCondition.trim()) {
        newErrors[`crop-${index}-weatherCondition`] =
          "Weather condition is required.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/api/f&p/add-cropcategory`,
        category
      )
      .then((response) => {
        console.log("Category saved successfully!", response.data);
        navigate("/agriadmin/fertilizers&pesticides?tab=cropcategory");
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
            onClick={() =>
              navigate("/agriadmin/fertilizers&pesticides?tab=cropcategory")
            }
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
                  isInvalid={!!errors.name} // Bootstrap validation styling
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
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
                  isInvalid={!!errors.description}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.description}
                </Form.Control.Feedback>
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
                    isInvalid={!!errors[`crop-${cropIndex}-name`]}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors[`crop-${cropIndex}-name`]}
                  </Form.Control.Feedback>
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
                    isInvalid={!!errors[`crop-${cropIndex}-soilType`]}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors[`crop-${cropIndex}-soilType`]}
                  </Form.Control.Feedback>
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
                    isInvalid={!!errors[`crop-${cropIndex}-growthStage`]}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors[`crop-${cropIndex}-growthStage`]}
                  </Form.Control.Feedback>
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
                    isInvalid={!!errors[`crop-${cropIndex}-weatherCondition`]}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors[`crop-${cropIndex}-weatherCondition`]}
                  </Form.Control.Feedback>
                </Form.Group>
                <br />
                <Button
                  variant="dark"
                  className="text-danger d-flex align-items-center"
                  onClick={() => handleRemoveCrop(cropIndex)}
                >
                  Remove Crop
                  <i
                    className="bi bi-dash-circle-fill ml-2"
                    style={{ marginLeft: "8px" }}
                  ></i>{" "}
                </Button>
              </ListGroup.Item>
            </ListGroup>
          ))}
          <Col className="d-flex justify-content-between">
            <Button
              variant="dark"
              className="text-primary d-flex align-items-center"
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
