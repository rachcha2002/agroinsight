import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import "../Main/Main.css";
import PageTitle from "../AgriPageTitle";
import { useNavigate } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";

const FertilizerForm = () => {
  // To redirect after success
  const navigate = useNavigate();

  const [cropCategories, setCropCategories] = useState([]);
  const [crops, setCrops] = useState([]);
  const [selectedCrops, setSelectedCrops] = useState([
    { cropCategoryId: "", cropId: "", recommendedUsage: "" },
  ]);
  const [regions, setRegions] = useState([""]);
  const [brands, setBrands] = useState([""]);
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [type, setType] = useState("");

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
    formData.append("instructions", instructions);

    // Append regions and brands without stringifying
    regions.forEach((region, index) => {
      formData.append(`appregions[${index}]`, region);
    });

    brands.forEach((brand, index) => {
      formData.append(`brands[${index}]`, brand);
    });

    /*if (image) {
      formData.append("fertilizerImage", image);
    }*/
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      await axios.post(
        "http://localhost:5000/api/f&p/add-fertilizer",
        formData
      );
      alert("Fertilizer submitted successfully");
      navigate("/agriadmin/fertilizers&pesticides");
    } catch (error) {
      console.error("Error submitting fertilizer:", error);
      alert("Failed to submit fertilizer");
    }
  };

  return (
    <main id="main" className="main">
      <PageTitle
        title="Fertilizers & Pesticides"
        url="/agriadmin/fertilizers&pesticides/addfertilizer"
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
          Add Fertilizer
        </h3>
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <Form.Group controlId="name">
            <Form.Label>Fertilizer Name</Form.Label>
            <Form.Control type="text" name="name" required />
          </Form.Group>
          <br />
          <Form.Group controlId="fertilizerImage">
            <Form.Label>Fertilizer Image</Form.Label>
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
          <Form.Group controlId="type">
            <Form.Label>Fertilizer Type</Form.Label>
            <Form.Control
              as="select"
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="">Select Type</option>
              <option value="Organic">Organic</option>
              <option value="Chemical">Chemical</option>
            </Form.Control>
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
          </Row>

          <br />

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

          <br />

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Container>
    </main>
  );
};

export default FertilizerForm;
