const mongoose = require("mongoose");

// Define the schema for storing farmer pesticides data
const FarmerPesticidesSchema = new mongoose.Schema({
  farmerId: {
    type: String,
    //required: true,
    default: "F00000001", // Default farmer ID, can be changed as needed
  },
  email: {
    type: String,
    //required: true,
    match: [/.+\@.+\..+/, "Please enter a valid email address"], // Simple email validation
    default: "abc@gmail.com", // Default email
  },
  region: {
    type: String,
    required: true,
    default: "Unknown", // Default region is 'Unknown'
  },
  crop: {
    type: String,
    required: true,
  },
  pesticide: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: [0, "Amount cannot be negative"], // Ensures that the amount is non-negative
  },
  targetPest: {
    type: String,
    required: true, // New field for the target pest
    default: "Unknown Pest",
  },
  comment: {
    type: String,
    default: "", // Optional comment field
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the current date on record creation
  },
});

// Create the FarmerPesticides model from the schema
const FarmerPesticides = mongoose.model(
  "FarmerPesticides",
  FarmerPesticidesSchema
);

module.exports = FarmerPesticides;
