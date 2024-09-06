const express = require('express');
const {
  createModel,
  getAllmodels,
  getModelById,
  updateModelById,
  deleteModelById,
} = require('../controllers/cropRotatorControllers/cropRotator');

const{
  createRotatorAlert,
  getAllRotatorAlerts,
  getRotatorAlertById,
  updateRotatorAlertById,
  deleteRotatorAlertById,
} = require('../controllers/cropRotatorControllers/rotatorAlert');


const router = express.Router();

// Route to create a new crop rotator model
router.post('/model', createModel);
// Route to get all crop rotator models
router.get('/model', getAllmodels);
// Route to get a specific crop rotator model by ID
router.get('/model/:id', getModelById);
// Route to update a specific crop rotator model by ID
router.put('/model/:id', updateModelById);
// Route to delete a specific crop rotator model by ID
router.delete('/model/:id', deleteModelById); 

//Route to create a new crop rotator alert
router.post('/rotator-alerts', createRotatorAlert);
// Route to get all crop rotator alerts
router.get('/rotator-alerts', getAllRotatorAlerts);
// Route to get a specific crop rotator alert by ID
router.get('/rotator-alerts/:id', getRotatorAlertById);
// Route to update a specific crop rotator alert by ID
router.put('/rotator-alerts/:id', updateRotatorAlertById);
// Route to delete a specific crop rotator alert by ID
router.delete('/rotator-alerts/:id', deleteRotatorAlertById);

module.exports = router;