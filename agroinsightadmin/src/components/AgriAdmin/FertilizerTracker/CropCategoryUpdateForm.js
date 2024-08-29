import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Form, Button, Container, Row, Col, ListGroup } from "react-bootstrap";
import { BsArrowLeft } from "react-icons/bs";
import PageTitle from "../AgriPageTitle";

const CropCategoryUpdateForm = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams(); // Get the category ID from the route params

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

  useEffect(() => {
    // Fetch the category details by ID
    axios
      .get(`http://localhost:5000/api/f&p/cropcategories/${categoryId}`)
      .then((response) => {
        setCategory(response.data);
      })
      .catch((error) => {
        console.error("Error fetching category:", error);
      });
  }, [categoryId]);

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
      .put(
        `http://localhost:5000/api/f&p/update-cropcategories/${categoryId}`,
        category
      )
      .then((response) => {
        console.log("Category updated successfully!", response.data);
        navigate("/agriadmin/fertilizers&pesticides?tab=cropcategory");
      })
      .catch((error) => {
        console.error("Error updating category:", error);
      });
  };

  return (
    <main id="main" className="main">
      <PageTitle
        title="Fertilizers & Pesticides"
        url={`/agriadmin/fertilizers&pesticides/updatecropcategory/${categoryId}`}
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
          Update Crop Category
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
                  disabled // Make name field disabled
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
                  className="text-danger d-flex align-items-center"
                  onClick={() => handleRemoveCrop(cropIndex)}
                >
                  Remove Crop
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
            </Button>
            <Button variant="success" type="submit" className="ml-3">
              Update Category
            </Button>
          </Col>
        </Form>
      </Container>
    </main>
  );
};

export default CropCategoryUpdateForm;
