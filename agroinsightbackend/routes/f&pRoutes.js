const express = require("express");
const router = express.Router();
const cropCategoryController = require("../controllers/f&pControllers/cropCategory");

// Route to create a new CropCategory
router.post("/add-cropcategory", cropCategoryController.createCropCategory);

// Route to get all CropCategories
router.get("/cropcategories", cropCategoryController.getAllCropCategories);

// Route to get a single CropCategory by ID
router.get("/cropcategories/:id", cropCategoryController.getCropCategoryById);

// Route to update a CropCategory by ID
router.put("/cropcategories/:id", cropCategoryController.updateCropCategory);

// Route to delete a CropCategory by ID
router.delete("/cropcategories/:id", cropCategoryController.deleteCropCategory);

module.exports = router;
