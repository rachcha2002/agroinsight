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
  const [cropsByCategory, setCropsByCategory] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Fetch crop categories from the backend
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/f&p/cropcategories`)
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
    updatedCrops[index].cropId = ""; // Reset crop ID when category changes
    setSelectedCrops(updatedCrops);

    // Fetch crops for the selected category
    fetchCrops(value);
  };

  const fetchCrops = (categoryId) => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/f&p/crops/${categoryId}`)
      .then((response) => {
        setCropsByCategory((prevCrops) => ({
          ...prevCrops,
          [categoryId]: response.data,
        }));
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

  const validateForm = () => {
    const newErrors = {};
    if (!image) newErrors.image = "Fertilizer image is required.";
    if (!type) newErrors.type = "Fertilizer type is required.";
    if (!instructions) newErrors.instructions = "Instructions are required.";
    if (
      selectedCrops.some(
        (crop) => !crop.cropCategoryId || !crop.cropId || !crop.recommendedUsage
      )
    ) {
      newErrors.selectedCrops = "All crop fields are required.";
    }
    if (regions.some((region) => !region))
      newErrors.regions = "All regions are required.";
    if (brands.some((brand) => !brand))
      newErrors.brands = "All brands are required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData(e.target);

    // Append dynamically added fields to formData
    formData.append("suitableCrops", JSON.stringify(selectedCrops));
    formData.append("instructions", instructions);

    // Append regions and brands without stringifying
    regions.forEach((region, index) => {
      formData.append(`region[${index}]`, region);
    });

    brands.forEach((brand, index) => {
      formData.append(`brands[${index}]`, brand);
    });

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/f&p/add-fertilizer`,
        formData
      );
      alert("Fertilizer submitted successfully");
      navigate("/agriadmin/fertilizers&pesticides?tab=fertilizers");
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
            onClick={() =>
              navigate("/agriadmin/fertilizers&pesticides?tab=fertilizers")
            }
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
              required
              isInvalid={!!errors.image}
            />
            <Form.Control.Feedback type="invalid">
              {errors.image}
            </Form.Control.Feedback>
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
              isInvalid={!!errors.type}
            >
              <option value="">Select Type</option>
              <option value="Organic">Organic</option>
              <option value="Chemical">Chemical</option>
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.type}
            </Form.Control.Feedback>
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
                      isInvalid={!!errors.selectedCrops}
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
                      isInvalid={!!errors.selectedCrops}
                    >
                      <option value="">Select Crop</option>
                      {cropsByCategory[crop.cropCategoryId]?.map((crop) => (
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
                      isInvalid={!!errors.selectedCrops}
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
              {errors.selectedCrops && (
                <div className="text-danger mt-2">{errors.selectedCrops}</div>
              )}
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
                        isInvalid={!!errors.regions}
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
                  {errors.regions && (
                    <div className="text-danger mt-2">{errors.regions}</div>
                  )}
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
                        isInvalid={!!errors.brands}
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
                  {errors.brands && (
                    <div className="text-danger mt-2">{errors.brands}</div>
                  )}
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
              isInvalid={!!errors.instructions}
            />
            <Form.Control.Feedback type="invalid">
              {errors.instructions}
            </Form.Control.Feedback>
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
