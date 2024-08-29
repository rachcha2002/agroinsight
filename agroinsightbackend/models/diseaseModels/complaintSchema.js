const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for a farmer's complaint
const complaintSchema = new Schema({
  farmerID: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  cropAffected: {
    type: String,
    required: true,
  },
  complaintDescription: {
    type: String,
   
  },
  dateOfComplaint: {
    type: Date,
    default: Date.now,
    
  },
  diseaseStatus: {
    type: String,
    enum: ['Unknown', 'Identified', 'Resolved'],
    default: 'Unknown',
    required: true,
  },
  controlMethod: {
    type: String,
    default: 'Pending Investigation',
  },
  solution: {
    type: String,
    default: 'Under Review',
  },
  officerRemarks: {
    type: String,
  },
  imageURL: {
    type: String,
    
  },
});

// Create the model from the schema
const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
