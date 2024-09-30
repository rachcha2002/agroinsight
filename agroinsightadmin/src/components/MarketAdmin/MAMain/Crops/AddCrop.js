import React, { useState, useEffect } from "react";
import PageTitle from "../MMPageTitle";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "../../../../data/MarketAdmin/form-hook";
import InputGroup from 'react-bootstrap/InputGroup';

const AddCrop = ()=>{

    const navigate = useNavigate();
    const [previewUrl, setPreviewUrl] = useState("");
    const [fileError, setFileError] = useState("");
    const [formState, inputHandler] = useForm(
      {
        Crop_name: {
          value: "",
          isValid: false,
        },
        Price: {
          value: "",
          isValid: false,
        }, 
        Market: {
          value: "",
          isValid: false,
        },
        image: {
          value: "",
          isValid: false,
        },
      },
      false
    );
  
    const CropSubmitHandler = async (event) => {
      event.preventDefault();
      const imgData = new FormData();
      imgData.append("image", formState.inputs.image.value);
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/crop/imgupload`, imgData)
      .then((res) => {
        const Url = res.data.downloadURL
        console.log(Url)
      try {
        const formData = {
       Crop_name: formState.inputs.Crop_name.value,
       Price: parseFloat(formState.inputs.Price.value),
       Market: formState.inputs.Market.value,
       image: Url
        }
        const response = axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/crop/addcrop`,
          formData
        );
  
        navigate("market/pricelist");
        console.log(response);
        console.log(formState.inputs);
      } catch (err) {
        console.log(err);
      }})
      .catch((err) => {
        alert("error");
      }).finally(() => {
      });
    };
    useEffect(() => {
      if (formState.inputs.image.value instanceof Blob) {
        const fileReader = new FileReader();
        fileReader.onload = () => {
          setPreviewUrl(fileReader.result);
        };
        fileReader.onerror = () => {
          console.error("Error reading the file");
        };
        fileReader.readAsDataURL(formState.inputs.image.value);
  
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!allowedTypes.includes(formState.inputs.image.value.type)) {
          setFileError("Please select a valid image file (JPEG, JPG, or PNG).");
        } else {
          setFileError("");
        }
      }
    }, [formState.inputs.image.value]);
  
    return (
      <main id="main" className="main">
      <PageTitle
        title="Add Crop"
        url="/market/pricelist/addcrop/"
      />
    
      <Form onSubmit={CropSubmitHandler}>
        <Row className="mb-3">
        <Form.Group as={Col} md="5" controlId="validationCustom01">
          <Form.Label>Crop Name</Form.Label>
          <Form.Control
          id="Crop_name"
          type="text"
          placeholder="Enter Crop name"
          maxLength={100}
          onInput={(event) => {
            let input = event.target.value.replace(/[^a-zA-Z\s]/g, ''); // Remove non-letter characters
            event.target.value = input;
            inputHandler("Crop_name", input, true);
          }}
          required
          />
        </Form.Group>
        <Form.Group as={Col} md="5" controlId="validationCustom01">
          <Form.Label>Price Per 1kg</Form.Label>
          <InputGroup>
          <InputGroup.Text>Rs.</InputGroup.Text>
          <Form.Control
          className="remove-spinner"
          id="Price"
          type="number"
          placeholder="Enter unit price"
          min="1"
          onInput={(event) =>{
            let input = event.target.value.replace(/[^\d]/g, ''); // Remove non-digit characters
            event.target.value = input;
            inputHandler("Price", input, true);
          }}
          required
          />
          </InputGroup>
        </Form.Group>
        </Row>
        <Row className="mb-3">
        <Form.Group as={Col} md="5" controlId="validationCustom01">
          <Form.Label>Market</Form.Label>
          <Form.Control
          id="Market"
          type="text"
          placeholder="Enter Market name"
          maxLength={100}
          onInput={(event) => {
            let input = event.target.value.replace(/[^a-zA-Z\s]/g, ''); // Remove non-letter characters
            event.target.value = input;
            inputHandler("Market", input, true);
          }}
          required
          />
        </Form.Group>
        <Form.Group as={Col} md="5" controlId="validationCustom01">
          <Form.Label>Image</Form.Label>
          <Form.Control
          id="image"
          type="file"
          accept=".jpg,.png,.jpeg"
          placeholder="add image"
          onInput={(event) =>
            inputHandler("image", event.target.files[0], true)
          }
          required
          />
          {fileError && (
          <Form.Text className="text-danger">{fileError}</Form.Text>
          )}
        </Form.Group>
    
        {previewUrl && (
          <img
          src={previewUrl}
          alt="Crop image"
          style={{ marginTop: "3%", width: "20%", height: "20%" }}
          />
        )}
        </Row>
        <Button variant="primary" type="submit" disabled={!formState.isValid}>
        Submit
        </Button>
      </Form>
      </main>
    );
  };
  
  export default AddCrop;