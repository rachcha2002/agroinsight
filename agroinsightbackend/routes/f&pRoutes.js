const express = require("express");
const router = express.Router();
const cropCategoryController = require("../controllers/f&pControllers/cropCategory");
const FertilizerController = require("../controllers/f&pControllers/fertilizerController");
const pesticideController = require("../controllers/f&pControllers/pesticidesController");

/*-------------------------- CropCategory Routes --------------------------*/

// Route to create a new CropCategory
router.post("/add-cropcategory", cropCategoryController.createCropCategory);

// Route to get all CropCategories
router.get("/cropcategories", cropCategoryController.getAllCropCategories);

// Route to get a single CropCategory by ID
router.get("/cropcategories/:id", cropCategoryController.getCropCategoryById);

// Route to update a CropCategory by ID
router.put(
  "/update-cropcategories/:id",
  cropCategoryController.updateCropCategory
);

// Route to delete a CropCategory by ID
router.delete(
  "/delete-cropcategories/:id",
  cropCategoryController.deleteCropCategory
);

// Route to get crops by category ID
router.get("/crops/:id", cropCategoryController.getCropsByCategoryId);

// Route to get crop by ID
router.get("/cropbyid/:cropId", cropCategoryController.getCropById);

/*-------------------------- Fertilizer Routes --------------------------*/
// Route to create a new fertilizer
router.post("/add-fertilizer", FertilizerController.createFertilizer);

// Route to get all fertilizers
router.get("/fertilizers", FertilizerController.getAllFertilizers);

// Route to get a fertilizer by ID
router.get("/fertilizers/:id", FertilizerController.getFertilizerById);

// Route to update a fertilizer by ID
router.put("/update-fertilizers/:id", FertilizerController.updateFertilizer);

// Route to delete a fertilizer by ID
router.delete("/delete-fertilizers/:id", FertilizerController.deleteFertilizer);

/*-------------------------- Pesticide Routes --------------------------*/
// Create a new pesticide
router.post("/add-pesticides", pesticideController.createPesticide);

// Get all pesticides
router.get("/pesticides", pesticideController.getAllPesticides);

// Get a pesticide by ID
router.get("/pesticides/:id", pesticideController.getPesticideById);

// Update a pesticide by ID
router.put("/update-pesticides/:id", pesticideController.updatePesticide);

// Delete a pesticide by ID
router.delete("/delete-pesticides/:id", pesticideController.deletePesticide);

module.exports = router;
