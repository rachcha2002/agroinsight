import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// Import Bootstrap Icons
import { BsDroplet, BsShield, BsNewspaper } from "react-icons/bs";

const AgrochemicalOverview = () => {
  const [totalFertilizers, setTotalFertilizers] = useState(0);
  const [totalPesticides, setTotalPesticides] = useState(0);
  const navigate = useNavigate();

  // Fetch fertilizers and pesticides on component mount
  useEffect(() => {
    // Fetch all fertilizers and count them
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/f&p/fertilizers`)
      .then((response) => setTotalFertilizers(response.data.length))
      .catch((error) => console.error("Error fetching fertilizers:", error));

    // Fetch all pesticides and count them
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/f&p/pesticides`)
      .then((response) => setTotalPesticides(response.data.length))
      .catch((error) => console.error("Error fetching pesticides:", error));
  }, []);

  return (
    <Container>
      {/* Add a title inside the container */}
      <h2 className="text-left my-4">Agrochemical Overview</h2>

      <Row className="my-4">
        {/* Fertilizers Card */}
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>
                <BsDroplet size={30} className="mb-2" />{" "}
                {/* Icon for Fertilizers */}
                <br />
                Total Fertilizers
              </Card.Title>
              <Card.Text className="display-6">
                {totalFertilizers}
              </Card.Text>{" "}
              {/* Larger text for information */}
            </Card.Body>
          </Card>
        </Col>

        {/* Pesticides Card */}
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>
                <BsShield size={30} className="mb-2" />{" "}
                {/* Icon for Pesticides */}
                <br />
                Total Pesticides
              </Card.Title>
              <Card.Text className="display-6">
                {totalPesticides}
              </Card.Text>{" "}
              {/* Larger text for information */}
            </Card.Body>
          </Card>
        </Col>

        {/* Add Agrochemical News Card */}
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>
                <BsNewspaper size={30} className="mb-2" />{" "}
                {/* Icon for Add News */}
                <br />
                Add Agrochemical News
              </Card.Title>
              <Button
                variant="primary"
                onClick={() =>
                  navigate("/agriadmin/fertilizers&pesticides/addnews")
                }
              >
                Add News
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AgrochemicalOverview;
