import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";

const UpdateFertilizerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [fertilizerName, setFertilizerName] = useState(""); // Renamed from 'name'
  const [cropCategories, setCropCategories] = useState([]);
  const [crops, setCrops] = useState([]);
  const [selectedCrops, setSelectedCrops] = useState([]);
  const [regions, setRegions] = useState([]);
  const [brands, setBrands] = useState([]);
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [type, setType] = useState("");
  const [cropsByCategory, setCropsByCategory] = useState({});

  useEffect(() => {
    // Fetch the fertilizer details for the given ID
    axios
      .get(`http://localhost:5000/api/f&p/fertilizers/${id}`)
      .then((response) => {
        const fertilizer = response.data;
        setFertilizerName(fertilizer.name); // Updated to use 'fertilizerName'
        setSelectedCrops(fertilizer.suitableCrops);
        setRegions(fertilizer.region);
        setBrands(fertilizer.brands);
        setInstructions(fertilizer.instructions);
        setImagePreview(fertilizer.imageUrl);
        setType(fertilizer.type);
      })
      .catch((error) =>
        console.error("Error fetching fertilizer data:", error)
      );

    // Fetch crop categories from the backend
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
    setSelectedCrops(updatedCrops);

    // Fetch crops based on selected category
    axios
      .get(`http://localhost:5000/api/f&p/cropcategories/${cropCategoryId}`)
      .then((response) => {
        setCropsByCategory((prev) => ({
          ...prev,
          [cropCategoryId]: response.data.crops,
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

    const formData = new FormData();
    formData.append("name", fertilizerName); // Updated to use 'fertilizerName'
    formData.append("type", type);
    formData.append("instructions", instructions);
    formData.append("image", image);

    formData.append("suitableCrops", JSON.stringify(selectedCrops));
    formData.append("regions", JSON.stringify(regions));
    formData.append("brands", JSON.stringify(brands));

    try {
      await axios.put(
        `http://localhost:5000/api/f&p/update-fertilizer/${id}`,
        formData
      );
      alert("Fertilizer updated successfully");
      navigate("/fertilizers");
    } catch (error) {
      console.error("Error updating fertilizer:", error);
      alert("Failed to update fertilizer");
    }
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
                  disabled
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
              <Form.Control
                type="text"
                value={region}
                onChange={(e) => handleRegionChange(index, e.target.value)}
                required
                key={index}
                style={{ marginBottom: "10px" }}
              />
            ))}
            <Button
              variant="outline-secondary"
              onClick={() => setRegions([...regions, ""])}
            >
              Add Region
            </Button>
          </Form.Group>
          {/* Brands */}
          <Form.Group controlId="formFertilizerBrands">
            <Form.Label>Brands</Form.Label>
            {brands.map((brand, index) => (
              <Form.Control
                type="text"
                value={brand}
                onChange={(e) => handleBrandChange(index, e.target.value)}
                required
                key={index}
                style={{ marginBottom: "10px" }}
              />
            ))}
            <Button
              variant="outline-secondary"
              onClick={() => setBrands([...brands, ""])}
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
                    value={crop.cropCategoryId}
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
                    value={crop.cropId}
                    onChange={(e) => handleCropChange(index, e.target.value)}
                    required
                  >
                    <option value="">Select Crop</option>
                    {cropsByCategory[crop.cropCategoryId]?.map((crop) => (
                      <option key={crop._id} value={crop._id}>
                        {crop.name}
                      </option>
                    ))}
                  </Form.Control>
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    value={crop.recommendedUsage}
                    onChange={(e) =>
                      handleRecommendedUsageChange(index, e.target.value)
                    }
                    placeholder="Recommended Usage"
                    required
                  />
                </Col>
              </Row>
            ))}
            <Button
              variant="outline-secondary"
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
