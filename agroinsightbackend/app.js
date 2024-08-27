const express = require("express");
const app = express();
const dotenv = require("dotenv");
const db = require("./db/db");

const PORT = 5000;
dotenv.config();
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

//cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE,PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'authorization, Content-Type');

  next();
});



app.use("/api/disease", require("./routes/diseaseRoutes"));

const server = () => {
  db();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

server();
