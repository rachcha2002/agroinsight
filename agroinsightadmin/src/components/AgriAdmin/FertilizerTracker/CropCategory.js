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
import CropCategoryList from "./CropCategoryList";

export default function CropCategory() {
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
              onClick={() => navigate("addcropcategory")}
              style={{ margin: "10px" }}
            >
              Add New Category
            </Button>
          </div>
        </Stack>
        <CropCategoryList />
      </Row>
    </>
  );
}
