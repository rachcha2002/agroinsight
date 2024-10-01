// routes/complaintRoutes.js
const express = require("express");
const {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  getComplaintsByFarmerId
} = require("../controllers/diseaseControllers/disease");

const {
  createDiseaseAlert,
  getDiseaseAlertById,
  updateDiseaseAlert,
  deleteDiseaseAlert,
  getAllDiseaseAlerts,
} = require("../controllers/diseaseControllers/diseaseAlert");
const router = express.Router();

//Disease Routes//

// Route to create a new complaint
router.post("/complaints", createComplaint);

// Route to get all complaints
router.get("/complaints", getAllComplaints);


// Route to get a specific complaint by ID
router.get("/complaints/:id", getComplaintById);

// Route to update a specific complaint by ID
router.put("/complaints/:id", updateComplaint);

// Route to delete a specific complaint by ID
router.delete("/complaints/:id", deleteComplaint);

// Route to get complaints by Farmer ID

router.get('/complaints/farmer/:farmerID',getComplaintsByFarmerId )
//Disease Alerts Routes//

// Create a new DiseaseAlert
router.post("/disease-alerts", createDiseaseAlert);

// Get all DiseaseAlerts
router.get("/disease-alerts", getAllDiseaseAlerts);

// Get a single DiseaseAlert by ID
router.get("/disease-alerts/:id", getDiseaseAlertById);

// Update a DiseaseAlert by ID
router.put("/disease-alerts/:id", updateDiseaseAlert);

// Delete a DiseaseAlert by ID
router.delete("/disease-alerts/:id", deleteDiseaseAlert);




module.exports = router;
