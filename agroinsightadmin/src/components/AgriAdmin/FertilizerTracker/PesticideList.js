import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ListGroup,
  Modal,
} from "react-bootstrap";
import axios from "axios";
import { FaChevronLeft, FaChevronRight, FaEdit, FaTrash } from "react-icons/fa";
import logo from "../../../images/logoNoBack.png";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useNavigate } from "react-router-dom";

const PesticideList = () => {
  const navigate = useNavigate();
  const [pesticides, setPesticides] = useState([]);
  const [expandedPesticideId, setExpandedPesticideId] = useState(null);
  const [cropCategories, setCropCategories] = useState({});
  const [crops, setCrops] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePesticideId, setDeletePesticideId] = useState(null);

  useEffect(() => {
    // Fetch pesticides from the backend
    axios
      .get("http://localhost:5000/api/f&p/pesticides") // Adjust the endpoint as needed
      .then((response) => {
        setPesticides(response.data);
      })
      .catch((error) => {
        console.error("Error fetching pesticides:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch crop categories and crops when pesticide data is available
    const fetchDetails = async () => {
      try {
        const categoryIds = [
          ...new Set(
            pesticides.flatMap((pesticide) =>
              pesticide.suitableCrops.map((crop) => crop.cropCategoryId)
            )
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

        const cropPromises = pesticides.flatMap((pesticide) =>
          pesticide.suitableCrops.map((crop) =>
            axios.get(`http://localhost:5000/api/f&p/cropbyid/${crop.cropId}`)
          )
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

    if (pesticides.length) {
      fetchDetails();
    }
  }, [pesticides]);

  const handleToggleExpand = (pesticideId) => {
    setExpandedPesticideId(
      expandedPesticideId === pesticideId ? null : pesticideId
    );
  };

  const handleScroll = (direction, pesticideId) => {
    const container = document.querySelector(
      `#scroll-container-${pesticideId}`
    );
    const scrollAmount = 300; // Adjust scroll amount as needed
    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else if (direction === "right") {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/f&p/delete-pesticides/${deletePesticideId}`
      );
      setPesticides(pesticides.filter((p) => p._id !== deletePesticideId)); // Update local state
      setShowDeleteConfirm(false);
      alert("Pesticide deleted successfully");
    } catch (error) {
      console.error("Error deleting pesticide:", error);
      alert("Failed to delete pesticide");
    }
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
    doc.text("Pesticide Recommendations", 14, 40);

    // Add list of properties before the table
    doc.setFontSize(10); // Smaller font size for properties
    const propertyData = pesticides
      .map((pesticide) => {
        return [
          `Name: ${pesticide.name}`,
          `Regions: ${pesticide.region.join(", ")}`,
          `Target Pests: ${pesticide.targetPests.join(", ")}`,
          `Instructions: ${pesticide.instructions}`,
          `Brands: ${pesticide.brands.join(", ")}`,
        ];
      })
      .flat();

    // Add each property as a line in the PDF
    yOffset = 50; // Start below the title
    propertyData.forEach((item) => {
      doc.text(item, 14, yOffset);
      yOffset += 5; // Move down for next line
    });

    // Prepare table data
    const tableData = [];

    for (const pesticide of pesticides) {
      // Extract crop details
      const cropsInfo = pesticide.suitableCrops.map((crop) => {
        const category = cropCategories[crop.cropCategoryId] || "Unknown";
        const cropName = crops[crop.cropId] || "Unknown";
        return [category, cropName, crop.recommendedUsage];
      });

      tableData.push(...cropsInfo);
    }

    // Add table
    doc.setFontSize(8); // Reset font size for table
    doc.autoTable({
      head: [["Category", "Crop", "Usage"]],
      body: tableData,
      startY: yOffset,
      theme: "grid",
      headStyles: { fillColor: [0, 128, 0] }, // Green header color
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
    doc.save("pesticide_report.pdf");
  };

  const generateCSV = () => {
    // Prepare CSV data
    let csvContent = "data:text/csv;charset=utf-8,";

    // Add header for properties and crops
    csvContent +=
      "Name,Regions,Target Pests,Instructions,Brands,Category,Crop,Usage\n";

    // Add data for each pesticide
    pesticides.forEach((pesticide) => {
      const regions = pesticide.region.join(", ");
      const targetPests = pesticide.targetPests.join(", ");
      const brands = pesticide.brands.join(", ");

      // For each pesticide, include crop details
      pesticide.suitableCrops.forEach((crop) => {
        const category = cropCategories[crop.cropCategoryId] || "Unknown";
        const cropName = crops[crop.cropId] || "Unknown";
        const usage = crop.recommendedUsage;

        csvContent += `${pesticide.name},${regions},${targetPests},${pesticide.instructions},${brands},${category},${cropName},${usage}\n`;
      });
    });

    // Encode CSV data
    const encodedUri = encodeURI(csvContent);

    // Create a download link and trigger the download
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "pesticide_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container>
      <Button
        onClick={generatePDF}
        style={{ marginLeft: "20px" }}
        variant="secondary"
      >
        Generate PDF Report
      </Button>
      <Button
        onClick={generateCSV}
        style={{ marginLeft: "8px" }}
        variant="primary"
      >
        Generate CSV Report
      </Button>
      {pesticides.map((pesticide) => (
        <Row key={pesticide.pesticideId}>
          <Col>
            <Card
              style={{
                margin: "1rem",
                boxShadow: "0 4px 8px rgba(0.4, 0.4, 0.4, 0.4)",
              }}
            >
              <Row
                style={{
                  padding: "0.5rem",
                }}
              >
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
                      marginLeft: "2rem",
                      marginTop: "2rem",
                    }}
                  />
                </Col>
                <Col md={4}>
                  <Card.Body>
                    <Card.Title
                      style={{
                        fontSize: "1.5rem", // Adjust the font size as needed
                        color: "#006400", // Dark green color
                      }}
                    >
                      {pesticide.name}
                    </Card.Title>
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
                  <Card.Body style={{ marginTop: "0.5rem" }}>
                    <strong>Instructions:</strong> {pesticide.instructions}{" "}
                    <br />
                    <strong>Brands:</strong>
                    <ul>
                      {pesticide.brands.map((brand, index) => (
                        <li key={index}>{brand}</li>
                      ))}
                    </ul>
                    <Button
                      variant="success"
                      onClick={() => handleToggleExpand(pesticide.pesticideId)}
                    >
                      {expandedPesticideId === pesticide.pesticideId
                        ? "See Less"
                        : "See More"}
                    </Button>
                    {/* Edit and Delete Icons */}
                    <Button
                      variant="outline-secondary"
                      className="mx-1"
                      onClick={() =>
                        navigate(
                          `/agriadmin/fertilizers&pesticides/updatepesticide/${pesticide._id}`
                        )
                      }
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      className="mx-1"
                      onClick={() => {
                        setDeletePesticideId(pesticide._id);
                        setShowDeleteConfirm(true);
                      }}
                    >
                      <FaTrash />
                    </Button>
                  </Card.Body>
                </Col>
              </Row>
              {expandedPesticideId === pesticide.pesticideId && (
                <div className="mt-3">
                  <div className="d-flex align-items-center">
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        handleScroll("left", pesticide.pesticideId)
                      }
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
                            {cropCategories[crop.cropCategoryId] || "Unknown"}{" "}
                            <br />
                            <strong>Crop Name:</strong>{" "}
                            {crops[crop.cropId] || "Unknown"} <br />
                            <strong>Recommended Usage:</strong>{" "}
                            {crop.recommendedUsage}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </div>

                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        handleScroll("right", pesticide.pesticideId)
                      }
                      className="ml-2"
                    >
                      <FaChevronRight />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      ))}

      {/* Confirmation Modal for Delete */}
      <Modal
        show={showDeleteConfirm}
        onHide={() => setShowDeleteConfirm(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this pesticide?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteConfirm(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PesticideList;
