import React from 'react';
import { Link } from "react-router-dom";
import './MMpageTitle.css';

function MMPageTitle({ title, url }) {

  const segments = url ? url.split("/").filter(Boolean) : []; 

  return (
    <div className="pagetitle">
      <h1>{title}</h1>
      <nav>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">
              <i className="bi bi-house-door"></i>
            </Link>
          </li>
          {segments.map((segment, index) => (
            <li key={index} className="breadcrumb-item">
              <Link to={`/${segments.slice(0, index + 1).join("/")}`}>
                {segment}
              </Link>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}

export default MMPageTitle;
