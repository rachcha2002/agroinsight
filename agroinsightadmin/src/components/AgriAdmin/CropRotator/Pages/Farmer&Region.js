import React from "react";
import Table from 'react-bootstrap/Table';

function FarmerRegion({ data = [] }) {
  return (
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Farmer ID</th>
            <th>Farmer Name</th>
            <th>Region / Zone</th>
            <th>Season</th>
            <th>Status</th>
            <th>Current Crop</th>
            <th>Recommended Crop</th>
          </tr>
        </thead>
        <tbody>
        {data.length > 0 ? (
          data.map((farmer, index) => (
          <tr key={index}>
            <td>{`F0${index + 1}`}</td>
            <td>{"Unknown"}</td>
            <td>{"Unknown"}</td>
            <td>{farmer.season}</td>
            <td>{farmer.status}</td>
            <td>{farmer.currentCrop}</td>
            <td>{farmer.recommendedCrop}</td>
          </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </Table>
  );
}

export default FarmerRegion;