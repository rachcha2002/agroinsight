const express = require("express");
const router = express.Router();
const cropCategoryController = require("../controllers/f&pControllers/cropCategory");
//const fertilizerController = require("../controllers/f&pControllers/fertilizer");
const pesticideController = require("../controllers/f&pControllers/pesticidesController");

/*-------------------------- CropCategory Routes --------------------------*/

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

// Route to get crops by category ID
router.get("/crops/:id", cropCategoryController.getCropsByCategoryId);

/*-------------------------- Fertilizer Routes --------------------------*/

/*-------------------------- Pesticide Routes --------------------------*/
// Create a new pesticide
router.post("/add-pesticides", pesticideController.createPesticide);

// Get all pesticides
router.get("/pesticides", pesticideController.getAllPesticides);

// Get a pesticide by ID
router.get("/pesticides/:id", pesticideController.getPesticideById);

// Update a pesticide by ID
router.put("/pesticides/:id", pesticideController.updatePesticide);

// Delete a pesticide by ID
router.delete("/pesticides/:id", pesticideController.deletePesticide);

module.exports = router;
