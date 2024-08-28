import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import "../Main/Main.css";
import PageTitle from "../AgriPageTitle";
import { useNavigate } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";

const PesticideForm = () => {
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
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    // Fetch crop categories from the backend
    axios
      .get("http://localhost:5000/api/f&p/cropcategories")
      .then((response) => {
        setCropCategories(response.data);
      });
  }, []);

  const handleAddCrop = () => {
    setSelectedCrops([
      ...selectedCrops,
      { cropCategoryId: "", cropId: "", recommendedUsage: "" },
    ]);
  };

  const handleRemoveCrop = (index) => {
    setSelectedCrops(selectedCrops.filter((_, i) => i !== index));
  };

  const handleCropCategoryChange = (index, value) => {
    const updatedCrops = [...selectedCrops];
    updatedCrops[index].cropCategoryId = value;
    setSelectedCrops(updatedCrops);

    // Fetch crops for the selected category
    fetchCrops(value);
  };

  const fetchCrops = (categoryId) => {
    axios
      .get(`http://localhost:5000/api/f&p/crops/${categoryId}`)
      .then((response) => {
        setCrops(response.data);
        console.log("Crops fetched successfully!", response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the crops!", error);
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

  const handleRemoveTargetPest = () => {
    setTargetPests(targetPests.slice(0, -1));
  };

  const handleTargetPestChange = (index, value) => {
    const updatedPests = [...targetPests];
    updatedPests[index] = value;
    setTargetPests(updatedPests);
  };

  const handleAddRegion = () => {
    setRegions([...regions, ""]);
  };

  const handleRemoveRegion = () => {
    setRegions(regions.slice(0, -1));
  };

  const handleRegionChange = (index, value) => {
    const updatedRegions = [...regions];
    updatedRegions[index] = value;
    setRegions(updatedRegions);
  };

  const handleAddBrand = () => {
    setBrands([...brands, ""]);
  };

  const handleRemoveBrand = () => {
    setBrands(brands.slice(0, -1));
  };

  const handleBrandChange = (index, value) => {
    const updatedBrands = [...brands];
    updatedBrands[index] = value;
    setBrands(updatedBrands);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Append dynamically added fields to formData
    formData.append("suitableCrops", JSON.stringify(selectedCrops));
    formData.append("targetPests", JSON.stringify(targetPests));
    formData.append("regions", JSON.stringify(regions));
    formData.append("brands", JSON.stringify(brands));
    formData.append("instructions", instructions);

    if (image) {
      formData.append("fertilizerImage", image);
    }

    try {
      await axios.post(
        "http://localhost:5000/api/f&p/add-pesticides",
        formData
      );
      alert("Pesticide submitted successfully");
    } catch (error) {
      console.error("Error submitting pesticide:", error);
      alert("Failed to submit pesticide");
    }
  };

  return (
    <main id="main" className="main">
      <PageTitle
        title="Fertilizers & Pesticides"
        url="/agriadmin/fertilizers&pesticides/addpesticide"
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
          Add Pesticide
        </h3>
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <Form.Group controlId="name">
            <Form.Label>Pesticide Name</Form.Label>
            <Form.Control type="text" name="name" required />
          </Form.Group>
          <br />
          <Form.Group controlId="fertilizerImage">
            <Form.Label>Pesticide Image</Form.Label>
            <Form.Control
              type="file"
              name="fertilizerImage"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                style={{ width: "150px", marginTop: "10px" }}
              />
            )}
          </Form.Group>
          <br />
          <Card style={{ padding: "18px" }}>
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
                      {crops.map((crop) => (
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
                  <Col>
                    {selectedCrops.length > 1 && (
                      <Button
                        variant="danger"
                        onClick={() => handleRemoveCrop(index)}
                        className="mt-2"
                        style={{ marginLeft: "8px" }}
                      >
                        Remove
                      </Button>
                    )}
                  </Col>
                </Row>
              ))}
              <Button
                variant="success"
                onClick={handleAddCrop}
                className="mt-2"
              >
                Add More Crops
              </Button>
            </Form.Group>
          </Card>

          <Row>
            <Col>
              <Card style={{ padding: "18px" }}>
                <Form.Group controlId="targetPests">
                  <Form.Label>Target Pests</Form.Label>
                  {targetPests.map((pest, index) => (
                    <div key={index} className="d-flex align-items-center">
                      <Form.Control
                        type="text"
                        placeholder="Target Pest"
                        value={pest}
                        onChange={(e) =>
                          handleTargetPestChange(index, e.target.value)
                        }
                        required
                        className="mb-2 flex-grow-1"
                      />
                      {targetPests.length > 1 && (
                        <Button
                          variant="danger"
                          onClick={handleRemoveTargetPest}
                          className="ml-2"
                          style={{ marginLeft: "8px" }}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="success" onClick={handleAddTargetPest}>
                    Add More Pests
                  </Button>
                </Form.Group>
              </Card>
            </Col>

            <Col>
              <Card style={{ padding: "18px" }}>
                <Form.Group controlId="regions">
                  <Form.Label>Regions</Form.Label>
                  {regions.map((region, index) => (
                    <div key={index} className="d-flex align-items-center">
                      <Form.Control
                        type="text"
                        placeholder="Region"
                        value={region}
                        onChange={(e) =>
                          handleRegionChange(index, e.target.value)
                        }
                        required
                        className="mb-2 flex-grow-1"
                      />
                      {regions.length > 1 && (
                        <Button
                          variant="danger"
                          onClick={handleRemoveRegion}
                          className="ml-2"
                          style={{ marginLeft: "8px" }}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="success" onClick={handleAddRegion}>
                    Add More Regions
                  </Button>
                </Form.Group>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card style={{ padding: "18px" }}>
                <Form.Group controlId="brands">
                  <Form.Label>Brands</Form.Label>
                  {brands.map((brand, index) => (
                    <div key={index} className="d-flex align-items-center">
                      <Form.Control
                        type="text"
                        placeholder="Brand"
                        value={brand}
                        onChange={(e) =>
                          handleBrandChange(index, e.target.value)
                        }
                        required
                        className="mb-2 flex-grow-1"
                      />
                      {brands.length > 1 && (
                        <Button
                          variant="danger"
                          onClick={handleRemoveBrand}
                          className="ml-2"
                          style={{ marginLeft: "8px" }}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="success" onClick={handleAddBrand}>
                    Add More Brands
                  </Button>
                </Form.Group>
              </Card>
            </Col>

            <Col>
              <Form.Group controlId="instructions">
                <Form.Label>Instructions</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end">
            <Button
              variant="primary"
              type="submit"
              style={{ marginTop: "10px" }}
            >
              Submit
            </Button>
          </div>
        </Form>
      </Container>
    </main>
  );
};

export default PesticideForm;
