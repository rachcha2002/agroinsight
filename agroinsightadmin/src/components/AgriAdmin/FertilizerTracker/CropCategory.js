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

export default function CropCategory() {
  return (
    <>
      <Row>
        <Stack direction="horizontal">
          <div className="p-2">
            <Button
              variant="dark"
              size="md"
              onClick={() => {
                console.log("Create new Fertilizer");
              }}
              style={{ margin: "10px" }}
            >
              Add New Category
            </Button>
          </div>
        </Stack>
      </Row>
    </>
  );
}
