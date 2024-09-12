import React from "react";
import "./Main.css";
import PageTitle from "./PageTitle";

function SuperMain() {
  return (
    <main id="main" className="main">
      <PageTitle
        title="Super Admin Dashboard"
        url="/superadmin"
      />
      <div>
        <h1>Hello, Super Admin</h1>
      </div>
    </main>
  );
}

export default SuperMain;
