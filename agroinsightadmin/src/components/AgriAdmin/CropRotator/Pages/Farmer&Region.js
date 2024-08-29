import React from "react";
import Table from 'react-bootstrap/Table';

function FarmerRegion({ columns, data }) {
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
          <tr>
            <td>F01</td>
            <td>Nimal</td>
            <td>Wet zone</td>
            <td>Yala Season</td>
            <td>Pending</td>
            <td>Root vegetables</td>
            <td>Oil crops</td>
          </tr>
          <tr>
          <td>F02</td>
            <td>Saman</td>
            <td>Intermediate zone</td>
            <td>Yala Season</td>
            <td>Started</td>
            <td>Sorghum</td>
            <td>Millet</td>
          </tr>
          <tr>
          <td>F03</td>
            <td>Piyal</td>
            <td>Dry zone</td>
            <td>Yala Season</td>
            <td>Started</td>
            <td>Paddy</td>
            <td>Millet</td>
          </tr>
          <tr>
          <td>F04</td>
            <td>Kamal</td>
            <td>Dry zone</td>
            <td>Yala Season</td>
            <td>Started</td>
            <td>Paddy</td>
            <td>Millet</td>
          </tr>
          <tr>
          <td>F05</td>
            <td>Perera</td>
            <td>Dry zone</td>
            <td>Yala Season</td>
            <td>Started</td>
            <td>Paddy</td>
            <td>Millet</td>
          </tr>
        </tbody>
      </Table>
  
  );
}

export default FarmerRegion;