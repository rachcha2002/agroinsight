import React, { useState, useEffect } from "react";
import MMDBCard from "./MMDBCard";

function MMDashboard() {
  return (
    <section>
      <div className="col">
        <div className="row">
          <MMDBCard
            title="Total Products"
            value1={` Tires`}
            value2={`lubricants`}
            iconClass="bi bi-bag-check-fill"
            duration="In Stock"
          />
          <MMDBCard
            title="Pending Orders"
            value1={` Orders`}
            value2=""
            iconClass="bi bi-cart-dash"
            duration="This month"
          />
          <MMDBCard
            title="Total Income"
            value1={`Products: Rs.`}
            value2={`Spare parts: Rs.`}
            iconClass="bi bi-cash-coin"
            duration="All the time"
          />
        </div>
      </div>
    </section>
  );
}

export default MMDashboard;
