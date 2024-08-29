import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Form, Row, Col, Toast } from "react-bootstrap";
import { DateRange } from "react-date-range";

export default function AddFertilizer() {
  //to redirect after success
  const navigate = useNavigate();
  return (
    <main>
      <Button
        variant="dark"
        onClick={() => navigate("/agriadmin/fertilizers")}
        style={{ margin: "10px" }}
      >
        <BsArrowLeft /> Back
      </Button>
      <Card>
        <Card.Header style={{ backgroundColor: "black", color: "white" }}>
          Add New Fertilizer
        </Card.Header>
        <Card.Body
          style={{ padding: "20px", backgroundColor: "white" }}
        ></Card.Body>
      </Card>
    </main>
  );
}
