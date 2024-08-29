import React from "react";
import {
  Button,
  Card,
  Col,
  Modal,
  Row,
  Stack,
  Tab,
  Tabs,
  Toast,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FertilizerList from "./FertilizerList";

export default function Fertilizers() {
  //to add employee button part
  const navigate = useNavigate();
  return (
    <>
      <Row>
        <Stack direction="horizontal">
          <div className="p-2">
            <Button
              variant="dark"
              size="md"
              onClick={() => navigate("addfertilizer")}
              style={{ margin: "10px" }}
            >
              Add New Fertilizer
            </Button>
          </div>
        </Stack>
        <FertilizerList />
      </Row>
    </>
  );
}
