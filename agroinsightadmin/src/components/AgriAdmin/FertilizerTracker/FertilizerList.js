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

  return (
    <Container>
      <Col>
        {fertilizers.map((fertilizer) => (
          <Row key={fertilizer.fertilizerId}>
            <FertilizerCard fertilizer={fertilizer} />
          </Row>
        ))}
      </Col>
    </Container>
  );
};

export default FertilizerList;
