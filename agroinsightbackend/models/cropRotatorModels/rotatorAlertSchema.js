const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the rotatorAlertSchema
const rotatorAlertSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    required: false,
  },
  zone: {
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
    immutable: true,   // Makes the field immutable, so it cannot be changed after creation
  },
  details:{
    type:String,
    default:'No Additional Details'
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

// Create the model from the schema and export it
const rotatorAlert = mongoose.model('rotatorAlert', rotatorAlertSchema);

module.exports = rotatorAlert;
