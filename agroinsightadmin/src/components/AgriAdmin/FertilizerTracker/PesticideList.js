import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import PesticideCard from "./PesticideCard";
import axios from "axios";

const PesticideList = () => {
  const [pesticides, setPesticides] = useState([]);

  useEffect(() => {
    // Fetch pesticides from the backend
    axios
      .get("http://localhost:5000/api/f&p/pesticides") // Adjust the endpoint as needed
      .then((response) => {
        setPesticides(response.data);
      })
      .catch((error) => {
        console.error("Error fetching pesticides:", error);
      });
  }, []);

  return (
    <Container>
      <Col>
        {pesticides.map((pesticide) => (
          <Row key={pesticide.pesticideId}>
            <PesticideCard pesticide={pesticide} />
          </Row>
        ))}
      </Col>
    </Container>
  );
};

export default PesticideList;
