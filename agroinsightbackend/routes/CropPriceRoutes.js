const express = require("express");
const {addCrop, updatePrice, Croplist, deleteCrop} = require("../controllers/CropPriceController/Crops");
const {ImageUpload,DeleteImage} = require("../controllers/CropPriceController/firebase-Controller");
const { addHistory, history } = require("../controllers/CropPriceController/Pricehistory");

const router = express.Router();

router.post("/addcrop", addCrop);
router.put("/updateprice/:id", updatePrice);
router.get("/croplist", Croplist);
router.delete("/deletecrop/:id", deleteCrop);

router.post("/addhistory", addHistory);
router.get("/gethistory",history );

router.post("/imgupload",ImageUpload)
router.delete("/deleteimg",DeleteImage)

module.exports = router;
