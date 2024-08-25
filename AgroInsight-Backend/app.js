const express = require("express");
const app = express();
const dotenv = require("dotenv");
const db = require("./db/db");

const PORT = 5000;
dotenv.config();
app.use(express.json());

const server = () => {
  db();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

server();
