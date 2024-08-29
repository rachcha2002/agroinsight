const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for a crop rotator model
const rotatorSchema = new Schema({
  modelId:{
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  zone: {
    type: String,
    //enum: ['Dry zone', 'Intermediate zone', 'Wet zone'],
    //default: 'Intermediate zone',
    required: true,
  },
  climateDescription: {
    type: String,
    required: true,
  },
  soilDescription: {
    type: String,
    required: true,
  },
  season: {
    type: String,
    //enum: ['Yala Season', 'Maha Season'],
    //default: 'Yala Season',
    required: true,
  },
  crop: {
    type: String,
    required: true,
  },
  climateSuitability: {
    type: String,
    required: true,
  },
  soilSuitability: {
    type: String,
    required: true,
  },
});

// Create the model from the schema
const Rotator = mongoose.model('RotatorModels', rotatorSchema);

module.exports = Rotator;