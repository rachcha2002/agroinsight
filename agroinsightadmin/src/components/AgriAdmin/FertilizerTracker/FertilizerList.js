import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import FertilizerCard from "./FertilizerCard";
import axios from "axios";

const FertilizerList = () => {
  const [fertilizers, setFertilizers] = useState([]);

  useEffect(() => {
    // Fetch fertilizers from the backend
    axios.get("http://localhost:5000/api/f&p/fertilizers").then((response) => {
      setFertilizers(response.data);
    });
  }, []);

  const handleDeleteFertilizer = async () => {
    // Refetch the updated list of categories from the server
    const response = await axios.get(
      "http://localhost:5000/api/f&p/fertilizers"
    );
    setFertilizers(response.data);
  };

  return (
    <Container>
      <Col>
        {fertilizers.map((fertilizer) => (
          <Row key={fertilizer.fertilizerId}>
            <FertilizerCard
              fertilizer={fertilizer}
              onDelete={() => handleDeleteFertilizer()}
            />
          </Row>
        ))}
      </Col>
    </Container>
  );
};

export default FertilizerList;
