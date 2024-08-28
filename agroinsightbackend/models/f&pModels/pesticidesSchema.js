const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Pesticide Schema
const PesticideSchema = new Schema({
  pesticideId: { type: String, required: true },
  name: { type: String, required: true },
  targetPests: [String], // Array of pest IDs that the pesticide targets
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
  instructions: { type: String, required: true }, // General instructions
  region: [{ type: String, required: true }], // Array of regions
  imageUrl: { type: String }, // URL for pesticide image
  brands: [{ type: String }], // Array to store different brands
});

// Create the Pesticide model from the schema
const Pesticide = mongoose.model("Pesticide", PesticideSchema);

module.exports = Pesticide;
