const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the AgrochemicalNews schema
const AgrochemicalNewsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageURL: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now, // Automatically sets the date to the current date and time
      immutable: true, // Makes the field immutable, so it cannot be changed after creation
    },
    details: {
      type: String,
      default: "No Additional Details",
    },
    source: {
      type: String,
      default: "Unknown Source", // New separate source field
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Create the model from the schema and export it
const AgrochemicalNews = mongoose.model(
  "AgrochemicalNews",
  AgrochemicalNewsSchema
);

module.exports = AgrochemicalNews;
