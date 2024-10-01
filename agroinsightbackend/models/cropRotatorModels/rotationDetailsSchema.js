const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for a crop rotator details
const rotatorDetailsSchema = new Schema({
  farmerId:{
    type: String,
    required: true,
  },
  region:{
    type: String,
    required: true,
  },
    season:{
      type: String,
      required: true,
    },
    currentCrop: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      //enum: ['Ongoing', 'Completed', 'Started'],
      //default: 'Ongoing',
      required: true,
    },
    recommendedCrop: {
      type: String,
      default: 'Recommendation Pending...',
    },
  });
  
  // Create the rotation Details from the schema
  const RotationDetails = mongoose.model('RotationDetails', rotatorDetailsSchema);
  
  module.exports = RotationDetails;