import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";

const UpdateFertilizerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [fertilizerName, setFertilizerName] = useState(""); // Fertilizer name state
  const [cropCategories, setCropCategories] = useState([]);
  const [cropsByCategory, setCropsByCategory] = useState({});
  const [selectedCrops, setSelectedCrops] = useState([
    { cropCategoryId: "", cropId: "", recommendedUsage: "" },
  ]);
  const [regions, setRegions] = useState([""]);
  const [brands, setBrands] = useState([""]); // Brands array state
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    // Fetch fertilizer details by ID
    axios
      .get(`http://localhost:5000/api/f&p/fertilizers/${id}`)
      .then((response) => {
        const fertilizer = response.data;
        setFertilizerName(fertilizer.name);
        setSelectedCrops(
          fertilizer.suitableCrops.length
            ? fertilizer.suitableCrops
            : [{ cropCategoryId: "", cropId: "", recommendedUsage: "" }]
        );
        setRegions(fertilizer.region.length ? fertilizer.region : [""]);
        setBrands(fertilizer.brands.length ? fertilizer.brands : [""]);
        setInstructions(fertilizer.instructions);
        setImagePreview(fertilizer.imageUrl);
        setType(fertilizer.type);

        // Fetch crops for each category of the selected crops
        fertilizer.suitableCrops.forEach((crop) => {
          fetchCrops(crop.cropCategoryId);
        });
      })
      .catch((error) =>
        console.error("Error fetching fertilizer data:", error)
      );

    // Fetch crop categories
    axios
      .get("http://localhost:5000/api/f&p/cropcategories")
      .then((response) => setCropCategories(response.data))
      .catch((error) =>
        console.error("Error fetching crop categories:", error)
      );
  }, [id]);

  const handleCropCategoryChange = (index, cropCategoryId) => {
    const updatedCrops = [...selectedCrops];
    updatedCrops[index].cropCategoryId = cropCategoryId;
    updatedCrops[index].cropId = ""; // Reset the cropId when category changes

    setSelectedCrops(updatedCrops);

    // Fetch crops for the new category
    fetchCrops(cropCategoryId);
  };

  const fetchCrops = (categoryId) => {
    axios
      .get(`http://localhost:5000/api/f&p/crops/${categoryId}`)
      .then((response) => {
        setCropsByCategory((prevCrops) => ({
          ...prevCrops,
          [categoryId]: response.data, // Store crops by category
        }));
      })
      .catch((error) => console.error("Error fetching crops:", error));
  };

  const handleCropChange = (index, cropId) => {
    const updatedCrops = [...selectedCrops];
    updatedCrops[index].cropId = cropId;
    setSelectedCrops(updatedCrops);
  };

  const handleRecommendedUsageChange = (index, usage) => {
    const updatedCrops = [...selectedCrops];
    updatedCrops[index].recommendedUsage = usage;
    setSelectedCrops(updatedCrops);
  };

  const handleRegionChange = (index, value) => {
    const updatedRegions = [...regions];
    updatedRegions[index] = value;
    setRegions(updatedRegions);
  };

  const handleBrandChange = (index, value) => {
    const updatedBrands = [...brands];
    updatedBrands[index] = value;
    setBrands(updatedBrands);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Ensure all crops have a valid cropId
    const invalidCrop = selectedCrops.find((crop) => !crop.cropId);
    if (invalidCrop) {
      alert("Please select a valid crop for each category.");
      return;
    }

    const formData = new FormData();
    formData.append("name", fertilizerName);
    formData.append("type", type);
    formData.append("instructions", instructions);
    formData.append("fertilizerImage", image);
    formData.append("suitableCrops", JSON.stringify(selectedCrops));
    regions.forEach((region, index) => {
      formData.append(`region[${index}]`, region);
    });
    formData.append("brands", JSON.stringify(brands));

    try {
      await axios.put(
        `http://localhost:5000/api/f&p/update-fertilizers/${id}`,
        formData
      );
      alert("Fertilizer updated successfully");
      navigate("/agriadmin/fertilizers&pesticides?tab=fertilizers");
    } catch (error) {
      console.error("Error updating fertilizer:", error);
      alert("Failed to update fertilizer");
    }
  };

  const handleRemoveCrop = (index) => {
    setSelectedCrops(selectedCrops.filter((_, i) => i !== index));
  };

  const handleRemoveRegion = (index) => {
    setRegions(regions.filter((_, i) => i !== index));
  };

  const handleRemoveBrand = (index) => {
    setBrands(brands.filter((_, i) => i !== index));
  };

  return (
    <main id="main" className="main">
      <Container>
        <Button variant="dark" onClick={() => navigate(-1)}>
          <BsArrowLeft /> Back
        </Button>
        <h2 className="text-center my-4">Update Fertilizer</h2>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Fertilizer Name"
                  value={fertilizerName}
                  onChange={(e) => setFertilizerName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formFertilizerType">
                <Form.Label>Type</Form.Label>
                <Form.Control
                  as="select"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Chemical">Chemical</option>
                  <option value="Organic">Organic</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formFertilizerInstructions">
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
            <Col md={6}>
              <Form.Group controlId="formFertilizerImage">
                <Form.Label>Image</Form.Label>
                <Form.Control type="file" onChange={handleImageChange} />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Fertilizer"
                    style={{ width: "60%", marginTop: "1rem" }}
                  />
                )}
              </Form.Group>
            </Col>
          </Row>

          {/* Regions */}
          <Form.Group controlId="formFertilizerRegions">
            <Form.Label>Regions</Form.Label>
            {regions.map((region, index) => (
              <Row key={index} className="mb-2">
                <Col>
                  <Form.Control
                    type="text"
                    value={region}
                    onChange={(e) => handleRegionChange(index, e.target.value)}
                    required
                  />
                </Col>
                <Col xs="auto">
                  {regions.length > 1 && (
                    <Button
                      variant="danger"
                      onClick={() => handleRemoveRegion(index)}
                      style={{ marginTop: "0.5rem" }}
                    >
                      Remove
                    </Button>
                  )}
                </Col>
              </Row>
            ))}
            <Button
              variant="success"
              onClick={() => setRegions([...regions, ""])}
              style={{ marginTop: "0.5rem" }}
            >
              Add Region
            </Button>
          </Form.Group>

          {/* Brands */}
          <Form.Group controlId="formFertilizerBrands">
            <Form.Label>Brands</Form.Label>
            {brands.map((brand, index) => (
              <Row key={index} className="mb-2">
                <Col>
                  <Form.Control
                    type="text"
                    value={brand}
                    onChange={(e) => handleBrandChange(index, e.target.value)}
                    required
                  />
                </Col>
                <Col xs="auto">
                  {brands.length > 1 && (
                    <Button
                      variant="danger"
                      onClick={() => handleRemoveBrand(index)}
                      style={{ marginTop: "0.5rem" }}
                    >
                      Remove
                    </Button>
                  )}
                </Col>
              </Row>
            ))}
            <Button
              variant="success"
              onClick={() => setBrands([...brands, ""])}
              style={{ marginTop: "0.5rem" }}
            >
              Add Brand
            </Button>
          </Form.Group>

          {/* Crops */}
          <Form.Group controlId="formFertilizerCrops">
            <Form.Label>Crops</Form.Label>
            {selectedCrops.map((crop, index) => (
              <Row key={index} className="mb-3">
                <Col md={4}>
                  <Form.Control
                    as="select"
                    value={crop.cropCategoryId || ""}
                    onChange={(e) =>
                      handleCropCategoryChange(index, e.target.value)
                    }
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
                <Col md={4}>
                  <Form.Control
                    as="select"
                    value={crop.cropId || ""}
                    onChange={(e) => handleCropChange(index, e.target.value)}
                    required
                    disabled={
                      !crop.cropCategoryId ||
                      !cropsByCategory[crop.cropCategoryId]
                    }
                  >
                    <option value="">Select Crop</option>
                    {cropsByCategory[crop.cropCategoryId]?.map(
                      (availableCrop) => (
                        <option
                          key={availableCrop._id}
                          value={availableCrop._id}
                        >
                          {availableCrop.name}
                        </option>
                      )
                    )}
                  </Form.Control>
                </Col>
                <Col md={3}>
                  <Form.Control
                    type="text"
                    value={crop.recommendedUsage || ""}
                    onChange={(e) =>
                      handleRecommendedUsageChange(index, e.target.value)
                    }
                    placeholder="Recommended Usage"
                    required
                  />
                </Col>
                <Col xs="auto">
                  {selectedCrops.length > 1 && (
                    <Button
                      variant="danger"
                      onClick={() => handleRemoveCrop(index)}
                      style={{ marginTop: "0.5rem" }}
                    >
                      Remove
                    </Button>
                  )}
                </Col>
              </Row>
            ))}
            <Button
              variant="success"
              onClick={() =>
                setSelectedCrops([
                  ...selectedCrops,
                  { cropCategoryId: "", cropId: "", recommendedUsage: "" },
                ])
              }
            >
              Add Crop
            </Button>
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-3">
            Update Fertilizer
          </Button>
        </Form>
      </Container>
    </main>
  );
};

export default UpdateFertilizerForm;
