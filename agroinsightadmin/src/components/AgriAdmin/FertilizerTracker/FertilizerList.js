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
import axios from "axios";
import { FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../../../images/logoNoBack.png";

const FertilizerList = () => {
  const [fertilizers, setFertilizers] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [cropCategories, setCropCategories] = useState({});
  const [crops, setCrops] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [deletingFertilizer, setDeletingFertilizer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch fertilizers from the backend
    axios.get("http://localhost:5000/api/f&p/fertilizers").then((response) => {
      setFertilizers(response.data);
    });
  }, []);

  const handleDeleteFertilizer = async () => {
    // Refetch the updated list of fertilizers from the server
    const response = await axios.get(
      "http://localhost:5000/api/f&p/fertilizers"
    );
    setFertilizers(response.data);
  };

  const handleDeleteClick = (id) => {
    setDeletingFertilizer(id);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleToggleExpand = (id) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [id]: !prevExpanded[id],
    }));
  };

  const handleScroll = (direction, fertilizerId) => {
    const container = document.querySelector(
      `#scroll-container-${fertilizerId}`
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
        `http://localhost:5000/api/f&p/delete-fertilizers/${deletingFertilizer}`
      );
      alert("Fertilizer deleted successfully");
      // Optionally, refresh the list
      handleDeleteFertilizer();
    } catch (error) {
      console.error("Error deleting fertilizer:", error);
      alert("Failed to delete fertilizer");
    } finally {
      setShowModal(false);
    }
  };

  const fetchCropDetails = async (fertilizer) => {
    try {
      // Fetch crop categories
      const categoryIds = [
        ...new Set(fertilizer.suitableCrops.map((crop) => crop.cropCategoryId)),
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

  const generatePDF = async () => {
    const doc = new jsPDF();

    // Add the logo
    const imgWidth = 50; // Set the desired width
    const imgHeight = 20; // Set the desired height
    const xOffset = 14; // Horizontal offset from the left edge
    let yOffset = 10; // Initial vertical offset from the top edge

    doc.addImage(logo, "PNG", xOffset, yOffset, imgWidth, imgHeight); // Place the logo

    // Add the contact details on the right
    doc.setFontSize(10);
    doc.text("AgroInsight(By OctagonIT)", 150, 15); // Adjusted position for details
    doc.text("Email: teamoctagonit@gmail.com", 150, 21);
    doc.text("Phone: +94711521161", 150, 27);
    doc.text("By Agriculture Admin", 150, 33);

    // Move yOffset down to start the next section after the header and logo
    yOffset = 50; // Adjust this as needed to ensure space between header and content

    // Title for the PDF
    doc.setFontSize(16); // Title font size
    doc.text("Fertilizer Recommendations", 14, yOffset);

    // Move yOffset further down to start adding fertilizer details
    yOffset += 10;

    // Fetch crop details for categories and crops
    const fetchCropDetails = async () => {
      const categoryIds = [
        ...new Set(
          fertilizers.flatMap((fertilizer) =>
            fertilizer.suitableCrops.map((crop) => crop.cropCategoryId)
          )
        ),
      ];
      const categoryPromises = categoryIds.map((id) =>
        axios.get(`http://localhost:5000/api/f&p/cropcategories/${id}`)
      );
      const cropPromises = fertilizers.flatMap((fertilizer) =>
        fertilizer.suitableCrops.map((crop) =>
          axios.get(`http://localhost:5000/api/f&p/cropbyid/${crop.cropId}`)
        )
      );

      const categoryResults = await Promise.all(categoryPromises);
      const cropResults = await Promise.all(cropPromises);

      const categories = {};
      categoryResults.forEach((result) => {
        categories[result.data._id] = result.data.name;
      });

      const crops = {};
      cropResults.forEach((result) => {
        crops[result.data._id] = result.data.name;
      });

      return { categories, crops };
    };

    const { categories, crops } = await fetchCropDetails();

    // For each fertilizer, add details and a corresponding table
    fertilizers.forEach((fertilizer) => {
      // Add fertilizer details
      doc.setFontSize(10);
      let details = [
        `Name: ${fertilizer.name}`,
        `Type: ${fertilizer.type}`,
        `Instructions: ${fertilizer.instructions}`,
        `Regions: ${fertilizer.region.join(", ")}`,
        `Brands: ${fertilizer.brands.join(", ")}`,
      ];

      details.forEach((line) => {
        doc.text(line, 14, yOffset);
        yOffset += 5; // Move down for the next line
      });

      // Prepare table data
      const tableData = fertilizer.suitableCrops.map((crop) => {
        const category = categories[crop.cropCategoryId] || "Unknown";
        const cropName = crops[crop.cropId] || "Unknown";
        return [category, cropName, crop.recommendedUsage];
      });

      // Add a table for crops under the current fertilizer
      doc.autoTable({
        head: [["Category", "Crop", "Usage"]],
        body: tableData,
        startY: yOffset + 5, // Ensure the table starts below the text
        theme: "grid",
        headStyles: { fillColor: [0, 128, 0] }, // Green header color
      });

      yOffset = doc.previousAutoTable.finalY + 10; // Update yOffset after the table
    });

    // Add the date and time at the bottom of the PDF
    const currentDate = new Date();
    const dateString = currentDate.toLocaleDateString();
    const timeString = currentDate.toLocaleTimeString();
    doc.setFontSize(10);
    doc.text(
      `Report generated on: ${dateString} at ${timeString}`,
      14,
      doc.internal.pageSize.height - 10
    );

    // Save the PDF
    doc.save("fertilizer_report.pdf");
  };

  const generateCSV = async () => {
    // Initialize CSV content
    let csvContent = "data:text/csv;charset=utf-8,";

    // Add CSV headers for properties and table
    csvContent += "Name,Type,Instructions,Regions,Brands,Category,Crop,Usage\n";

    // Iterate over each fertilizer
    for (const fertilizer of fertilizers) {
      // Fetch the crop details
      await fetchCropDetails(fertilizer);

      // Create properties row
      const regions = fertilizer.region.join(", ");
      const brands = fertilizer.brands.join(", ");

      // Iterate over each crop
      for (const crop of fertilizer.suitableCrops) {
        const category = cropCategories[crop.cropCategoryId] || "Unknown";
        const cropName = crops[crop.cropId] || "Unknown";
        const usage = crop.recommendedUsage;

        // Append a new row for each crop
        csvContent += `${fertilizer.name},${fertilizer.type},${fertilizer.instructions},${regions},${brands},${category},${cropName},${usage}\n`;
      }
    }

    // Encode CSV data
    const encodedUri = encodeURI(csvContent);

    // Create a download link and trigger the download
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "fertilizer_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container>
      <Button
        onClick={generatePDF}
        variant="secondary"
        style={{ marginLeft: "20px" }}
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
      <Col>
        {fertilizers.map((fertilizer) => (
          <Card
            key={fertilizer._id}
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
              <Col md={3}>
                <Card.Img
                  variant="left"
                  src={fertilizer.imageUrl || "placeholder-image-url"}
                  alt={fertilizer.name}
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
                    {fertilizer.name}
                  </Card.Title>
                  <strong>Type:</strong> {fertilizer.type} <br />
                  <strong>Regions:</strong>
                  <ul>
                    {fertilizer.region.map((region, index) => (
                      <li key={index}>{region}</li>
                    ))}
                  </ul>
                  <strong>Instructions:</strong> {fertilizer.instructions}{" "}
                  <br />
                </Card.Body>
              </Col>
              <Col md={4}>
                <Card.Body style={{ marginTop: "0.5 rem" }}>
                  <Card.Text className="mt-3">
                    <strong>Brands:</strong>
                    <ul>
                      {fertilizer.brands.map((brand, index) => (
                        <li key={index}>{brand}</li>
                      ))}
                    </ul>
                    <br />
                    <Button
                      variant="success"
                      onClick={() => {
                        handleToggleExpand(fertilizer._id);
                        fetchCropDetails(fertilizer);
                      }}
                    >
                      {expanded[fertilizer._id] ? "See Less" : "See More"}
                    </Button>
                    <Button
                      variant="outline-secondary"
                      className="mx-1"
                      onClick={() =>
                        navigate(
                          `/agriadmin/fertilizers&pesticides/updatefertilizer/${fertilizer._id}`
                        )
                      }
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
            {expanded[fertilizer._id] && (
              <div
                className="mt-3"
                style={{
                  padding: "0.5rem",
                }}
              >
                <div className="d-flex align-items-center">
                  <Button
                    variant="outline-secondary"
                    onClick={() => handleScroll("left", fertilizer._id)}
                    className="mr-2"
                  >
                    <FaChevronLeft />
                  </Button>

                  <div
                    id={`scroll-container-${fertilizer._id}`}
                    className="d-flex flex-nowrap overflow-auto"
                    style={{
                      maxWidth: "100%",
                      whiteSpace: "nowrap",
                    }}
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
                    onClick={() => handleScroll("right", fertilizer._id)}
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
                Are you sure you want to delete this fertilizer? This action
                cannot be undone.
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
        ))}
      </Col>
    </Container>
  );
};

export default FertilizerList;
