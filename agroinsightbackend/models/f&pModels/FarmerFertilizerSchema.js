const mongoose = require('mongoose');

// Define the schema for storing farmer data
const FarmerFertilizerSchema = new mongoose.Schema({
  farmerId: {
    type: String,
    required: true,
    //unique: true, // Ensures each farmer has a unique ID
    default:"F00000001"
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures that the email is unique
    match: [/.+\@.+\..+/, 'Please enter a valid email address'], // Simple email validation
    default: 'abc@gmail.com', // Default email is 'Unknown'
  },
  region: {
    type: String,
    required: true,
    default: 'Unknown', // Default region is 'Unknown'
  },
  crop: {
    type: String,
    required: true,
  },
  fertilizer: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'Amount cannot be negative'], // Ensures that the amount is non-negative
  },
  comment: {
    type: String,
    default: '', // Optional comment field, defaulting to an empty string
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the current date on record creation
  },
});

// Create the Farmer model from the schema
const FarmerFertilizers = mongoose.model('Farmer', FarmerFertilizerSchema);

module.exports = FarmerFertilizers;
