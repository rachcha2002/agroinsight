const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Fertilizer Schema
const FertilizerSchema = new Schema({
  fertilizerId: { type: String, required: true },
  name: { type: String, required: true },
  type: {
    type: String,
    required: true,
    //enum: ["Organic", "Chemical"], // Restrict to "Organic" or "Chemical"
  },
  suitableCrops: [
    {
      cropCategoryId: { type: String, required: true },
      cropId: { type: String, required: true },
      recommendedUsage: {
        type: String,
        required: true,
      },
    },
  ],
  instructions: { type: String, required: true },
  region: [{ type: String }], // Array of regions
  imageUrl: { type: String }, // URL for fertilizer image
  brands: [{ type: String }], // Array to store different brands
});

// Create models from the schemas
const Fertilizer = mongoose.model("Fertilizer", FertilizerSchema);

module.exports = { Fertilizer };
