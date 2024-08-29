// routes/complaintRoutes.js
const express = require('express');
const {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
} = require('../controllers/diseaseControllers/disease');

const router = express.Router();

// Route to create a new complaint
router.post('/complaints', createComplaint);

// Route to get all complaints
router.get('/complaints', getAllComplaints);

// Route to get a specific complaint by ID
router.get('/complaints/:id', getComplaintById);

// Route to update a specific complaint by ID
router.put('/complaints/:id', updateComplaint);

// Route to delete a specific complaint by ID
router.delete('/complaints/:id', deleteComplaint);

module.exports = router;
