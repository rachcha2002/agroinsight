import React, {useState,useEffect} from "react";
import axios from "axios"
import Button from "react-bootstrap/Button";
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "./PriceCard.css";
import "./Form.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../../../../images/logoNoBack.png";
import { Link } from "react-router-dom";


function GallePriceCard() {
  const [Crops, setCrops] = useState([]);
  const [searchCrop, setSearchCrop] = useState(""); 

  useEffect(() => {
    function getCrops() {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/crop/croplist`)
        .then((res) => {
          const filteredCrops = res.data.filter((crop) => crop.Market === "Galle");
          setCrops(filteredCrops);
          console.log(filteredCrops);
        })
        .catch((err) => {
          alert("error");
        });
    }
    getCrops();
  }, []);


  const Delete = (id) => {
    const shouldDelete = window.confirm("Confirm Delete");
    if (shouldDelete) {
      axios
        .delete(`${process.env.REACT_APP_BACKEND_URL}/crop/deletecrop/${id}`)
        .then((response) => {
          console.log(response);
          window.location.reload();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handlePriceChange = (id, value) => {
    if (value > 0 && Number.isInteger(Number(value))) {
    setCrops(prevCrops =>
      prevCrops.map(Crop =>
        Crop._id === id ? { ...Crop, Price: value } : Crop
      )
    );
  }
  };

  const update = (id) => {
    const CropToUpdate = Crops.find(Crop => Crop._id === id);
    axios
      .put(`${process.env.REACT_APP_BACKEND_URL}/crop/updateprice/${id}`, CropToUpdate)
      .then((response) => {
        console.log(response);
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    const imgWidth = 50; 
    const imgHeight = 20; 
    doc.addImage(logo, "PNG", 14, 10, imgWidth, imgHeight);

    doc.setFontSize(10);
    doc.text("AgroInsight (By OctagonIT)", 150, 12);
    doc.text("Email: teamoctagonit@gmail.com", 150, 18);
    doc.text("Phone: +94711521161", 150, 24);
    doc.text("By Market Admin", 150, 30);

    doc.setFontSize(16);
    doc.text("Today Price List - Galle", 14, 40);

    const tableData = Crops.map((Crop) => [
      Crop.Crop_name,
      `Rs. ${Crop.Price}`,
    ]);
    doc.autoTable({
      head: [["Crop Name", "Price per 1kg"]],
      body: tableData,
      startY: 50,
      theme: "grid",
      headStyles: { fillColor: [0, 128, 0] }, 
    });
    const currentDate = new Date();
    const dateString = currentDate.toLocaleDateString();
    const timeString = currentDate.toLocaleTimeString();
    doc.setFontSize(10);
    doc.text(
      `Report generated on: ${dateString} at ${timeString}`,
      14,
      doc.internal.pageSize.height - 10
    );
    doc.save("Today_price_list.pdf");
  };

  const addToHistory = () => {
    Crops.forEach((crop) => {
      axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/crop/addhistory`, {
          Crop_name: crop.Crop_name,
          Price: crop.Price,
          Market: crop.Market || "Galle",
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error adding crop to history:", error);
        });
    });
  };

  const filteredCrops = Crops.filter((Crop) =>
    Crop.Crop_name.includes(searchCrop) 
  );


  return (
    <main className="mainproduct">
         <Row>
        <Col sm={3}>
    <InputGroup className="mb-2">
        <Form.Control
          placeholder="Search Crop"
          value={searchCrop}onChange={(e) =>
            setSearchCrop(
              e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
            )
          }
        />
         <Button
              variant="secondary"
              id="button-addon2"
              onClick={() => setSearchCrop("")}
            >
              Clear
            </Button>
      </InputGroup>
      </Col>
        <Col>
        <Link to="addcrop">
          <button type="button" className="btn-add">
            Add Crop
            <span class="bi bi-plus-circle"></span>
          </button>
        </Link>
       <Button
        onClick={generatePDF}
        variant="danger"
        style={{ marginLeft: "20px" }}
      >
        Generate PDF
        <span class="bi bi-file-earmark-pdf"></span>
      </Button>
      <Button
            onClick={addToHistory}
            variant="primary"
            style={{ marginLeft: "20px" }}
          >
            Add to History
            <span class="bi bi-clock-history"></span>
          </Button>
      </Col>
      </Row>
      <div className="container-Product">
      {filteredCrops.map((Crop) => (
          <div key={Crop._id} className="product-card-container">
            <div className="product-card">
              <center>
                <img
                  src={`${Crop.image}`}
                  className="product-image"
                  alt={Crop}
                  style={{
                    marginTop: "3%",
                    width: "200px",
                    height: "200px",
                  }}
                />
              </center>
              <h4 className="product-header">{Crop.Crop_name}</h4>
              <div className="product-name">
                <label htmlFor={`price-${Crop._id}`}>
                  Price Per 1kg :&nbsp;&nbsp;Rs.
                </label>
                <input
                  className="product-price"
                  id={`price-${Crop._id}`}
                  type="number"
                  value={Crop.Price}
                  onChange={(e) =>
                    handlePriceChange(Crop._id, e.target.value)
                  }
                  style={{
                    border: "none",
                    outline: "none",
                    width: "50%",
                  }}
                />
              </div>
              <Button
                variant="danger"
                className="btnproductdel"
                onClick={() => Delete(Crop._id)}
              >
                Delete Product
              </Button>
              <Button
                variant="warning"
                className="btnproductup"
                onClick={() => update(Crop._id)}
              >
                Update Product
              </Button>
            </div>
          </div>
          ))}
      </div>
    </main>
  );
}

export default GallePriceCard;
