const express = require('express');
const {
  createModel,
  getAllmodels,
  getModelById,
  updateModelById,
  deleteModelById,
} = require('../controllers/cropRotatorControllers/cropRotator');

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

module.exports = router;