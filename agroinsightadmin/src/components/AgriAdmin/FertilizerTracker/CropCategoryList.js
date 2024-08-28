import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Container, Row, Col, ListGroup } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight, FaEdit, FaTrash } from "react-icons/fa"; // Icons for scrolling

const CropCategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/f&p/cropcategories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  const handleToggleCrops = (categoryId) => {
    setExpandedCategoryId(
      expandedCategoryId === categoryId ? null : categoryId
    );
  };

  const handleEdit = (categoryId) => {
    console.log("Edit category:", categoryId);
    // Add logic to handle editing the category
  };

  const handleDelete = (categoryId) => {
    console.log("Delete category:", categoryId);
    // Add logic to handle deleting the category
  };

  return (
    <Container>
      <Row>
        {categories.map((category) => (
          <Col key={category.categoryId} sm={12} className="mb-4">
            <Card style={{ boxShadow: "0 4px 8px rgba(0.4, 0.4, 0.4, 0.4)" }}>
              <Card.Body>
                <Card.Title>{category.name}</Card.Title>
                <Card.Text>{category.description}</Card.Text>
                <Col>
                  <Button
                    variant="success"
                    onClick={() => handleToggleCrops(category.categoryId)}
                    style={{ marginRight: "8px" }}
                  >
                    {expandedCategoryId === category.categoryId
                      ? "Hide Crops"
                      : "See Crops"}
                  </Button>
                  <Button
                    variant="outline-dark"
                    onClick={() => handleEdit(category.categoryId)}
                    style={{ marginRight: "8px" }}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="outline-dark"
                    onClick={() => handleDelete(category.categoryId)}
                  >
                    <FaTrash />
                  </Button>
                </Col>

                {expandedCategoryId === category.categoryId && (
                  <div className="mt-3">
                    <div className="d-flex align-items-center">
                      <Button
                        variant="outline-secondary"
                        onClick={() => handleScroll("left")}
                        className="mr-2"
                      >
                        <FaChevronLeft />
                      </Button>

                      <div
                        className="d-flex flex-nowrap overflow-auto"
                        style={{ maxWidth: "100%", whiteSpace: "nowrap" }}
                      >
                        <ListGroup horizontal className="flex-nowrap">
                          {category.crops.map((crop, index) => (
                            <ListGroup.Item
                              key={index}
                              className="m-2 p-3 border"
                              style={{
                                minWidth: "200px",
                                backgroundColor: "#f9f9f9",
                              }}
                            >
                              <strong>Name:</strong> {crop.name} <br />
                              <strong>Soil Type:</strong> {crop.soilType} <br />
                              <strong>Growth Stage:</strong> {crop.growthStage}{" "}
                              <br />
                              <strong>Weather Condition:</strong>{" "}
                              {crop.weatherCondition}
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </div>

                      <Button
                        variant="outline-secondary"
                        onClick={() => handleScroll("right")}
                        className="ml-2"
                      >
                        <FaChevronRight />
                      </Button>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );

  function handleScroll(direction) {
    const container = document.querySelector(".overflow-auto");
    const scrollAmount = 300; // Adjust scroll amount as needed
    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else if (direction === "right") {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  }
};

export default CropCategoryList;
