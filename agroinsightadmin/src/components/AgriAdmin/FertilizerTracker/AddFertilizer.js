import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Form,
  Row,
  Col,
  Toast,
  Container,
} from "react-bootstrap";
import { DateRange } from "react-date-range";
import axios from "axios";

export default function AddFertilizer() {
  //to redirect after success
  const navigate = useNavigate();

  const [cropCategories, setCropCategories] = useState([]);
  const [crops, setCrops] = useState([]);
  const [selectedCrops, setSelectedCrops] = useState([
    { cropCategoryId: "", cropId: "", recommendedUsage: "" },
  ]);
  const [targetPests, setTargetPests] = useState([""]);
  const [regions, setRegions] = useState([""]);
  const [brands, setBrands] = useState([""]);

  useEffect(() => {
    // Fetch crop categories from the backend
    axios.get("/api/cropcategories").then((response) => {
      setCropCategories(response.data);
    });
  }, []);

  const handleAddCrop = () => {
    setSelectedCrops([
      ...selectedCrops,
      { cropCategoryId: "", cropId: "", recommendedUsage: "" },
    ]);
  };

  const handleCropCategoryChange = (index, value) => {
    const updatedCrops = [...selectedCrops];
    updatedCrops[index].cropCategoryId = value;
    setSelectedCrops(updatedCrops);

    // Fetch crops for the selected category
    axios.get(`/api/crops?categoryId=${value}`).then((response) => {
      setCrops(response.data);
    });
  };

  const handleCropChange = (index, field, value) => {
    const updatedCrops = [...selectedCrops];
    updatedCrops[index][field] = value;
    setSelectedCrops(updatedCrops);
  };

  const handleAddTargetPest = () => {
    setTargetPests([...targetPests, ""]);
  };

  const handleTargetPestChange = (index, value) => {
    const updatedPests = [...targetPests];
    updatedPests[index] = value;
    setTargetPests(updatedPests);
  };

  const handleAddRegion = () => {
    setRegions([...regions, ""]);
  };

  const handleRegionChange = (index, value) => {
    const updatedRegions = [...regions];
    updatedRegions[index] = value;
    setRegions(updatedRegions);
  };

  const handleAddBrand = () => {
    setBrands([...brands, ""]);
  };

  const handleBrandChange = (index, value) => {
    const updatedBrands = [...brands];
    updatedBrands[index] = value;
    setBrands(updatedBrands);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Append dynamically added fields to formData
    formData.append("suitableCrops", JSON.stringify(selectedCrops));
    formData.append("targetPests", JSON.stringify(targetPests));
    formData.append("regions", JSON.stringify(regions));
    formData.append("brands", JSON.stringify(brands));

    try {
      await axios.post("/api/f8p/add-pesticides", formData);
      alert("Pesticide submitted successfully");
    } catch (error) {
      console.error("Error submitting pesticide:", error);
      alert("Failed to submit pesticide");
    }
  };

  return (
    <main>
      <Button
        variant="dark"
        onClick={() => navigate("/agriadmin/fertilizers")}
        style={{ margin: "10px" }}
      >
        <BsArrowLeft /> Back
      </Button>
      <Card>
        <Card.Header style={{ backgroundColor: "black", color: "white" }}>
          Add New Fertilizer
        </Card.Header>
        <Card.Body style={{ padding: "20px", backgroundColor: "white" }}>
          <Container>
            <h1>Add Pesticide</h1>
            <Form onSubmit={handleSubmit} encType="multipart/form-data">
              <Form.Group controlId="name">
                <Form.Label>Pesticide Name</Form.Label>
                <Form.Control type="text" name="name" required />
              </Form.Group>

              <Form.Group controlId="fertilizerImage">
                <Form.Label>Pesticide Image</Form.Label>
                <Form.Control type="file" name="fertilizerImage" />
              </Form.Group>

              <Form.Group controlId="suitableCrops">
                <Form.Label>Suitable Crops</Form.Label>
                {selectedCrops.map((crop, index) => (
                  <Row key={index}>
                    <Col>
                      <Form.Control
                        as="select"
                        onChange={(e) =>
                          handleCropCategoryChange(index, e.target.value)
                        }
                        value={crop.cropCategoryId}
                        required
                      >
                        <option value="">Select Crop Category</option>
                        {cropCategories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col>
                      <Form.Control
                        as="select"
                        onChange={(e) =>
                          handleCropChange(index, "cropId", e.target.value)
                        }
                        value={crop.cropId}
                        required
                      >
                        <option value="">Select Crop</option>
                        {crops
                          .filter((c) => c.categoryId === crop.cropCategoryId)
                          .map((crop) => (
                            <option key={crop._id} value={crop._id}>
                              {crop.name}
                            </option>
                          ))}
                      </Form.Control>
                    </Col>
                    <Col>
                      <Form.Control
                        type="text"
                        placeholder="Recommended Usage"
                        value={crop.recommendedUsage}
                        onChange={(e) =>
                          handleCropChange(
                            index,
                            "recommendedUsage",
                            e.target.value
                          )
                        }
                        required
                      />
                    </Col>
                  </Row>
                ))}
                <Button
                  variant="secondary"
                  onClick={handleAddCrop}
                  className="mt-2"
                >
                  Add More Crops
                </Button>
              </Form.Group>

              <Form.Group controlId="targetPests">
                <Form.Label>Target Pests</Form.Label>
                {targetPests.map((pest, index) => (
                  <Form.Control
                    key={index}
                    type="text"
                    placeholder="Target Pest"
                    value={pest}
                    onChange={(e) =>
                      handleTargetPestChange(index, e.target.value)
                    }
                    required
                    className="mb-2"
                  />
                ))}
                <Button variant="secondary" onClick={handleAddTargetPest}>
                  Add More Pests
                </Button>
              </Form.Group>

              <Form.Group controlId="regions">
                <Form.Label>Regions</Form.Label>
                {regions.map((region, index) => (
                  <Form.Control
                    key={index}
                    type="text"
                    placeholder="Region"
                    value={region}
                    onChange={(e) => handleRegionChange(index, e.target.value)}
                    required
                    className="mb-2"
                  />
                ))}
                <Button variant="secondary" onClick={handleAddRegion}>
                  Add More Regions
                </Button>
              </Form.Group>

              <Form.Group controlId="brands">
                <Form.Label>Brands</Form.Label>
                {brands.map((brand, index) => (
                  <Form.Control
                    key={index}
                    type="text"
                    placeholder="Brand"
                    value={brand}
                    onChange={(e) => handleBrandChange(index, e.target.value)}
                    required
                    className="mb-2"
                  />
                ))}
                <Button variant="secondary" onClick={handleAddBrand}>
                  Add More Brands
                </Button>
              </Form.Group>

              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Container>
        </Card.Body>
      </Card>
    </main>
  );
}
