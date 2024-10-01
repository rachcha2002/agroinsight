import React, { useEffect, useState} from "react";
import axios from "axios";
import Carousel from 'react-bootstrap/Carousel';


const SuperAdmindbCard = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAlerts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/crop-rotator/rotator-alerts`);
      setAlerts(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  if (loading) {
    return (
      <p>Loading...</p>
    );
  }

  if (error) {
    return (
      <p>Error: {error}</p>
    );
  }

  return(
    <div style={{ height: '50vh', overflow: 'hidden',position: 'relative'}}>
      <Carousel  style={{ height: '100%', paddingBottom:"100px"}}>
      {alerts.map((alert, index) => (
      <Carousel.Item key={index} interval={1000} style={{ height: '100%',position: 'relative'}}>
          <img
              src={alert.imageURL}
              alt={`Slide ${index + 1}`}
              className="d-block w-100"
              style={{
                objectFit: "cover", // Ensure the image covers the entire carousel space
                height: '100%'
              }}
          />
          <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              textAlign: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Optional background for better contrast
              padding: '10px',
              borderRadius: '8px'
            }}>
              <h3>{alert.title}</h3>
              <p>{alert.description}</p>
            </div>
          <Carousel.Caption>
              <h3>{alert.title}</h3>
              <p>{alert.description}</p>
          </Carousel.Caption>
      </Carousel.Item>
      ))} 
  </Carousel>
</div>
);
};

export default SuperAdmindbCard;