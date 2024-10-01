import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  ListGroup,
  Modal,
} from "react-bootstrap";
import { FaChevronLeft, FaChevronRight, FaEdit, FaTrash } from "react-icons/fa"; // Icons for scrolling
import { jsPDF } from "jspdf"; // Import jsPDF
import "jspdf-autotable"; // Import the autoTable plugin
import logo from "../../../images/logoNoBack.png";
import { useNavigate } from "react-router-dom";

const CropCategoryList = () => {
  //to redirect after success
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);

  //for delete operations
  const [show, setShow] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);

  const handleClose = () => setShow(false);

  const handleShow = (categoryId) => {
    setCategoryIdToDelete(categoryId);
    setShow(true);
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/f&p/cropcategories`)
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
    // Navigate to the update form
    navigate(
      `/agriadmin/fertilizers&pesticides/updatecropcategory/${categoryId}`
    );
  };

  const handleDelete = async () => {
    try {
      console.log("Delete category:", categoryIdToDelete);

      // Make an API call to delete the category
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/f&p/delete-cropcategories/${categoryIdToDelete}`
      );

      // Refetch the updated list of categories from the server
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/f&p/cropcategories`
      );
      setCategories(response.data);

      handleClose();
      alert("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category");
    }
  };

  const generatePDF = () => {
    convertToBase64(logo, (imgData) => {
      const doc = new jsPDF();

      // Add the logo
      doc.addImage(imgData, "PNG", 14, 10, 70, 30); // x, y, width, height

      // Add the name, email, and phone number
      doc.setFontSize(12);
      doc.text("AgroInsight(By OctagonIT)", 100, 20); // Adjust the position as needed
      doc.text("Email: teamoctagonit@gmail.com", 100, 26);
      doc.text("Phone: +94711521161", 100, 32);

      // Add the document title below the header
      doc.setFontSize(16);
      doc.text(
        "Crop Categories For Fertilizer and Pesticide Recommendation",
        14,
        50
      );

      categories.forEach((category, i) => {
        doc.setFontSize(14);
        doc.text(`Category: ${category.name}`, 14, 60 + i * 80);
        doc.setFontSize(12);

        // Wrap description text into multiple lines
        const descriptionLines = doc.splitTextToSize(category.description, 180);
        doc.text(descriptionLines, 14, 66 + i * 80);

        // Generate table for crops
        const crops = category.crops.map((crop) => [
          crop.name,
          crop.soilType,
          crop.growthStage,
          crop.weatherCondition,
        ]);

        doc.autoTable({
          head: [
            ["Crop Name", "Soil Type", "Growth Stage", "Weather Condition"],
          ],
          body: crops,
          startY: 72 + i * 80,
          theme: "striped",
          headStyles: { fillColor: [22, 160, 133] },
          margin: { left: 14, right: 14 },
        });
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

      doc.save("crop-categories-report.pdf");
    });
  };

  const convertToBase64 = (url, callback) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  };

  const generateCSV = () => {
    // Define the headers for the CSV file
    const headers = [
      "Category Name",
      "Category Description",
      "Crop Name",
      "Soil Type",
      "Growth Stage",
      "Weather Condition",
    ];

    // Prepare CSV content
    let csvContent = headers.join(",") + "\n"; // Add headers

    // Loop through each category and its crops to build the CSV rows
    categories.forEach((category) => {
      category.crops.forEach((crop) => {
        const row = [
          category.name,
          category.description.replace(/,/g, ""), // Remove commas from descriptions to avoid CSV formatting issues
          crop.name,
          crop.soilType,
          crop.growthStage,
          crop.weatherCondition,
        ];
        csvContent += row.join(",") + "\n"; // Add the row to the CSV content
      });
    });

    // Trigger the CSV download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "crop-categories-report.csv";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container>
      <Button
        variant="secondary"
        onClick={generatePDF}
        style={{ marginLeft: "20px" }}
      >
        Generate PDF Report
      </Button>
      <Button
        variant="primary"
        onClick={generateCSV}
        style={{ marginLeft: "8px" }}
      >
        Download CSV Report
      </Button>
      <br />
      <br />
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
                    onClick={() => handleEdit(category._id)}
                    style={{ marginRight: "8px" }}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="outline-danger"
                    onClick={() => handleShow(category._id)}
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
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this category? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
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
