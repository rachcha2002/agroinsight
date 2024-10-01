import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";

const MarketAdminCommon = () => {
  const [highestPriceCrop, setHighestPriceCrop] = useState(null);

  useEffect(() => {
    function getCrops() {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/crop/croplist`)
        .then((res) => {
          const crops = res.data;
          if (crops.length > 0) {
            const highestCrop = crops.reduce((prev, current) => {
              return prev.Price > current.Price ? prev : current;
            });
            setHighestPriceCrop(highestCrop);
          }
        })
        .catch((err) => {
          alert("Error fetching crops");
        });
    }
    getCrops();
  }, []);

  return (
    <div className="col-lg-4">
      {highestPriceCrop && (
        <Card bg="white" text="black" className="shadow-lg">
          <Card.Body>
            <Card.Title className="text-success">
              Today Market Trend
              <span className="text-success">| Islandwide </span>
              <i className="bi bi-calendar-event float-end"></i>
            </Card.Title>
            <Card.Text>
              <h2 className="mb-2 text-body-dark">
                {highestPriceCrop.Crop_name}
              </h2>
              <h3 className="mb-2 text-body-secondary">
                Price Per 1kg: Rs.{highestPriceCrop.Price}.00
              </h3>
            </Card.Text>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default MarketAdminCommon;
