const express = require("express");
const {addCrop, updatePrice, Croplist, deleteCrop} = require("../controllers/CropPriceController/Crops");
const {ImageUpload,DeleteImage} = require("../controllers/CropPriceController/firebase-Controller")

const router = express.Router();

router.post("/addcrop", addCrop);
router.put("/updateprice/:id", updatePrice);
router.get("/croplist", Croplist);
router.delete("/deletecrop/:id", deleteCrop);
// // Route to get a specific complaint by ID
// router.get("/complaints/:id", getComplaintById);





router.post("/imgupload",ImageUpload)
router.delete("/deleteimg",DeleteImage)

module.exports = router;
