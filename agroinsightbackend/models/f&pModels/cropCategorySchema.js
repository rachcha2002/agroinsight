const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Crop Schema (embedded within the CropCategory schema)
const CropSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  soilType: {
    type: String,
    required: true,
  },
  growthStage: {
    type: String,
    required: true,
  },
  weatherCondition: {
    type: String,
    required: true,
  },
});

// Define the CropCategory Schema
const CropCategorySchema = new Schema({
  categoryId: {
    type: String, // Use string for the custom identifier
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  crops: [CropSchema], // Embedding an array of CropSchema
});

// Create the model from the schema
const CropCategory = mongoose.model("CropCategoryF&P", CropCategorySchema);

module.exports = CropCategory;
