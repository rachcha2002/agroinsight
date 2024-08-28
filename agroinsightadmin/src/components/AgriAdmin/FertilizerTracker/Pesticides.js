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
import PesticideList from "./PesticideList";

export default function Pesticides() {
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
              onClick={() => navigate("addpesticide")}
              style={{ margin: "10px" }}
            >
              Add New Pesticide
            </Button>
          </div>
        </Stack>
        <PesticideList />
      </Row>
    </>
  );
}
