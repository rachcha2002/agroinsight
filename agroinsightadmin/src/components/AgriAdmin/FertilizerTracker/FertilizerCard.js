import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  ListGroup,
  Modal,
} from "react-bootstrap";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const FertilizerCard = ({ fertilizer, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [cropCategories, setCropCategories] = useState({});
  const [crops, setCrops] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [deletingFertilizer, setDeletingFertilizer] = useState(null);
  const navigate = useNavigate();

  const handleDeleteClick = (id) => {
    setDeletingFertilizer(id);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
    // Fetch crop categories and crops by their IDs
    const fetchCropDetails = async () => {
      try {
        // Fetch crop categories
        const categoryIds = [
          ...new Set(
            fertilizer.suitableCrops.map((crop) => crop.cropCategoryId)
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
        const cropPromises = fertilizer.suitableCrops.map((crop) =>
          axios.get(`http://localhost:5000/api/f&p/cropbyid/${crop.cropId}`)
        );
        const cropResults = await Promise.all(cropPromises);
        const cropDetails = {};
        cropResults.forEach((result) => {
          cropDetails[result.data._id] = result.data.name;
        });
        setCrops(cropDetails);
      } catch (error) {
        console.error("Error fetching crop details", error);
      }
    };

    if (fertilizer.suitableCrops.length) {
      fetchCropDetails();
    }
  }, [fertilizer.suitableCrops]);

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleScroll = (direction) => {
    const container = document.querySelector(
      `#scroll-container-${fertilizer._id}`
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

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/f&p/delete-fertilizers/${deletingFertilizer}`
      );
      alert("Fertilizer deleted successfully");
      // Optionally, refresh the page or redirect
      onDelete();
    } catch (error) {
      console.error("Error deleting fertilizer:", error);
      alert("Failed to delete fertilizer");
    } finally {
      setShowModal(false);
    }
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
            src={fertilizer.imageUrl || "placeholder-image-url"}
            alt={fertilizer.name}
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
            <Card.Title>{fertilizer.name}</Card.Title>
            <strong>Type:</strong> {fertilizer.type} <br />
            <strong>Regions:</strong>
            <ul>
              {fertilizer.region.map((region, index) => (
                <li key={index}>{region}</li>
              ))}
            </ul>
            <strong>Instructions:</strong> {fertilizer.instructions} <br />
          </Card.Body>
        </Col>
        <Col md={4}>
          <Card.Body>
            <Card.Text className="mt-3">
              <strong>Brands:</strong>
              <ul>
                {fertilizer.brands.map((brand, index) => (
                  <li key={index}>{brand}</li>
                ))}
              </ul>
              <br />
              <Button variant="primary" onClick={handleToggleExpand}>
                {expanded ? "See Less" : "See More"}
              </Button>
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
                onClick={() => handleDeleteClick(fertilizer._id)}
              >
                <FaTrash />
              </Button>
            </Card.Text>
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
              id={`scroll-container-${fertilizer._id}`}
              className="d-flex flex-nowrap overflow-auto"
              style={{ maxWidth: "100%", whiteSpace: "nowrap" }}
            >
              <ListGroup horizontal className="flex-nowrap">
                {fertilizer.suitableCrops.map((crop, index) => (
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

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this fertilizer? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default FertilizerCard;
