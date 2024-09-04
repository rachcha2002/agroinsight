import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";

// Helper function to chunk an array into smaller groups
/*const chunkArray = (arr, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
};*/

const UpdateFertilizerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [fertilizerName, setFertilizerName] = useState(""); // Fertilizer name state
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
    // Fetch fertilizer details by ID
    axios
      .get(`http://localhost:5000/api/f&p/fertilizers/${id}`)
      .then((response) => {
        const fertilizer = response.data;
        setFertilizerName(fertilizer.name); // Setting fertilizer name
        setSelectedCrops(fertilizer.suitableCrops);
        setRegions(fertilizer.region);
        setBrands(fertilizer.brands);
        setInstructions(fertilizer.instructions);
        setImagePreview(fertilizer.imageUrl);
        setType(fertilizer.type);

        // Fetch crops for each category of the selected crops
        fertilizer.suitableCrops.forEach((crop) => {
          fetchCrops(crop.cropCategoryId);
        });

        // Log the brands after assigning
        console.log("Brands:", fertilizer.brands);
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

    // Reset the cropId since a new category was selected
    updatedCrops[index].cropId = "";

    setSelectedCrops(updatedCrops);

    //console.log(`Updated crop at index ${index}:`, updatedCrops[index]);

    // Fetch crops for selected category
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

  const fetchCrops = (categoryId) => {
    axios
      .get(`http://localhost:5000/api/f&p/crops/${categoryId}`)
      .then((response) => {
        setCropsByCategory((prevCrops) => ({
          ...prevCrops,
          [categoryId]: response.data, // Store crops per category
        }));
      })
      .catch((error) => {
        console.error("There was an error fetching the crops!", error);
      });
  };

  const handleCropChange = (index, cropId) => {
    console.log("handleCropChange triggered"); // Check if this logs
    const updatedCrops = [...selectedCrops];
    updatedCrops[index].cropId = cropId; // Update the cropId for the selected crop

    // Console log the cropId being assigned and the crop details
    console.log(`Crop at index ${index} updated:`);
    console.log(`  Selected Crop ID: ${cropId}`);
    console.log(`  Updated Crop Object:`, updatedCrops[index]);

    setSelectedCrops(updatedCrops);
  };

  useEffect(() => {
    console.log("selectedCrops state updated:", selectedCrops);
  }, [selectedCrops]);

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

    // Detailed console log for each crop in selectedCrops
    selectedCrops.forEach((crop, index) => {
      console.log(`Crop ${index + 1}:`);
      console.log(`  Crop Category ID: ${crop.cropCategoryId}`);
      console.log(`  Crop ID: ${crop.cropId}`);
      console.log(`  Recommended Usage: ${crop.recommendedUsage}`);
    });

    // Check if all crops have a valid cropId
    const invalidCrop = selectedCrops.find((crop) => !crop.cropId);
    if (invalidCrop) {
      alert("Please select a valid crop for each category.");
      return; // Prevent form submission if any crop is missing a cropId
    }

    const formData = new FormData();
    formData.append("name", fertilizerName); // Use fertilizerName for the form field
    formData.append("type", type);
    formData.append("instructions", instructions);
    formData.append("image", image);

    formData.append("suitableCrops", JSON.stringify(selectedCrops));
    // Append regions as an array (each item should be sent individually)
    regions.forEach((region, index) => {
      formData.append(`region[${index}]`, region); // Add each region separately
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

  // Render regions and brands in rows (split into chunks of 2 per row)
  //const regionsChunks = chunkArray(regions, 2);
  //const brandsChunks = chunkArray(brands, 2);

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
                      disabled={regions.length === 1}
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
                      disabled={brands.length === 1} // Disable if only one brand
                    >
                      Remove
                    </Button>
                  )}
                </Col>
              </Row>
            ))}
            <Button
              style={{ marginTop: "0.5rem" }}
              variant="success"
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
                    value={crop.cropId || ""}
                    onChange={(e) => handleCropChange(index, e.target.value)}
                    required
                    disabled={!crop.cropCategoryId}
                  >
                    {/* Ensure cropsByCategory is populated before mapping */}
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
                  {console.log(
                    "Crops available for category",
                    crop.cropCategoryId,
                    cropsByCategory[crop.cropCategoryId]
                  )}
                </Col>
                <Col md={3}>
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
                <Col xs="auto">
                  {selectedCrops.length > 1 && (
                    <Button
                      variant="danger"
                      onClick={() => handleRemoveCrop(index)}
                      disabled={selectedCrops.length === 1}
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
