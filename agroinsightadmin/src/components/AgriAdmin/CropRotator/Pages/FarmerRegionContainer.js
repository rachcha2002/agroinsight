import React, { useEffect, useState } from "react";
import FarmerRegion from './Farmer&Region';

function FarmerRegionContainer() {
  const [farmerData, setFarmerData] = useState([]);

  useEffect(() => {
    // Fetch the data from backend API
    fetch("http://localhost:5000/api/crop-rotator/rotator-detail")
      .then((response) => response.json())
      .then((data) => {
        setFarmerData(data); // Set the fetched data into state
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      <FarmerRegion data={farmerData} />
    </div>
  );
}

export default FarmerRegionContainer;