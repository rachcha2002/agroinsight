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
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE,PATCH");
  res.setHeader("Access-Control-Allow-Headers", "authorization, Content-Type");

  next();
});

/*user management routes*/

/*fertilizer and pesticide management routes*/
app.use("/api/f&p", require("./routes/f&pRoutes"));

/*deasease management routes*/
app.use("/crop", require("./routes/CropPriceRoutes"));

app.use("/api/disease", require("./routes/diseaseRoutes"));

//crop rotator
app.use("/api/crop-rotator", require("./routes/cropRotatorRoutes"));

//admin user profile routes
app.use("/api/admin-profile", require("./routes/commonRoutes"));

const server = () => {
  db();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

server();
