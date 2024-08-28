import React, { useState, useEffect } from "react";
import { Card, Button, Container, Row, Col, ListGroup } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const PesticideCard = ({ pesticide }) => {
  const [expanded, setExpanded] = useState(false);
  const [cropCategories, setCropCategories] = useState({});
  const [crops, setCrops] = useState({});

  useEffect(() => {
    // Fetch crop categories, crops, and pests by their IDs
    const fetchDetails = async () => {
      try {
        // Fetch crop categories
        const categoryIds = [
          ...new Set(
            pesticide.suitableCrops.map((crop) => crop.cropCategoryId)
          ),
        ];
        const categoryPromises = categoryIds.map((id) =>
          axios.get(`http://localhost:5000/api/f&p/cropcategories/${id}`)
        );
        const categoryResults = await Promise.all(categoryPromises);
        const categories = {};
        categoryResults.forEach((result) => {
          categories[result.data._id] = result.data.name;
        });
        setCropCategories(categories);

        // Fetch crops
        const cropPromises = pesticide.suitableCrops.map((crop) =>
          axios.get(`http://localhost:5000/api/f&p/cropbyid/${crop.cropId}`)
        );
        const cropResults = await Promise.all(cropPromises);
        const cropDetails = {};
        cropResults.forEach((result) => {
          cropDetails[result.data._id] = result.data.name;
        });
        setCrops(cropDetails);
      } catch (error) {
        console.error("Error fetching details", error);
      }
    };

    if (pesticide.suitableCrops.length || pesticide.targetPests.length) {
      fetchDetails();
    }
  }, [pesticide]);

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleScroll = (direction) => {
    const container = document.querySelector(
      `#scroll-container-${pesticide.pesticideId}`
    );
    const scrollAmount = 300; // Adjust scroll amount as needed
    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else if (direction === "right") {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleEdit = () => {
    // Implement edit functionality
    console.log("Edit clicked");
  };

  const handleDelete = () => {
    // Implement delete functionality
    console.log("Delete clicked");
  };

  return (
    <Card
      style={{
        margin: "1rem",
        boxShadow: "0 4px 8px rgba(0.4, 0.4, 0.4, 0.4)",
      }}
    >
      <Row>
        <Col md={4}>
          <Card.Img
            variant="left"
            src={pesticide.imageUrl || "placeholder-image-url"}
            alt={pesticide.name}
            style={{
              width: "150px", // Set the desired width
              height: "150px", // Set the desired height
              objectFit: "cover", // Ensures the image covers the entire area without distortion
              borderRadius: "8px", // Optional: Adds rounded corners to the image
            }}
          />
        </Col>
        <Col md={4}>
          <Card.Body>
            <Card.Title>{pesticide.name}</Card.Title>

            <strong>Regions:</strong>
            <ul>
              {pesticide.region.map((region, index) => (
                <li key={index}>{region}</li>
              ))}
            </ul>
            <strong>Target Pests:</strong>
            <ul>
              {pesticide.targetPests.map((pest, index) => (
                <li key={index}>{pest || "Unknown"}</li>
              ))}
            </ul>
          </Card.Body>
        </Col>
        <Col md={4}>
          <Card.Body>
            <strong>Instructions:</strong> {pesticide.instructions} <br />
            <strong>Brands:</strong>
            <ul>
              {pesticide.brands.map((brand, index) => (
                <li key={index}>{brand}</li>
              ))}
            </ul>
            <Button variant="primary" onClick={handleToggleExpand}>
              {expanded ? "See Less" : "See More"}
            </Button>
            {/* Edit and Delete Icons */}
            <Button
              variant="outline-secondary"
              className="mx-1"
              onClick={handleEdit}
            >
              <FaEdit />
            </Button>
            <Button
              variant="outline-danger"
              className="mx-1"
              onClick={handleDelete}
            >
              <FaTrash />
            </Button>
          </Card.Body>
        </Col>
      </Row>
      {expanded && (
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
              id={`scroll-container-${pesticide.pesticideId}`}
              className="d-flex flex-nowrap overflow-auto"
              style={{ maxWidth: "100%", whiteSpace: "nowrap" }}
            >
              <ListGroup horizontal className="flex-nowrap">
                {pesticide.suitableCrops.map((crop, index) => (
                  <ListGroup.Item
                    key={index}
                    className="m-2 p-3 border"
                    style={{
                      minWidth: "200px",
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    <strong>Category:</strong>{" "}
                    {cropCategories[crop.cropCategoryId] || "Unknown"} <br />
                    <strong>Crop Name:</strong>{" "}
                    {crops[crop.cropId] || "Unknown"} <br />
                    <strong>Recommended Usage:</strong> {crop.recommendedUsage}
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
    </Card>
  );
};

export default PesticideCard;
