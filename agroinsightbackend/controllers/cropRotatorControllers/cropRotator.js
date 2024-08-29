// controllers/cropRotatorControllers.js
const Rotator = require("../../models/cropRotatorModels/rotatorSchema")

// Create a new RotatorModel
exports.createModel = async (req, res) => {
    try {
      const model = new Rotator(req.body);
      await model.save();
      res.status(201).json(model);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  // Get all RotatorModels
exports.getAllmodels = async (req, res) => {
  try {
    const models = await Rotator.find();
    res.status(200).json(models);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a RotatorModel by id
exports.getModelById = async (req, res) => {
  try {
    const modelId = req.params.id;
    const model = await Rotator.findById(modelId);
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }
    res.status(200).json(model);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a RotatorModel by id
exports.updateModelById = async (req, res) => {
  try {
    const modelId = req.params.id;
    const model = await Rotator.findByIdAndUpdate(modelId, req.body, { new: true });
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }
    res.status(200).json(model);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a RotatorModel by id
exports.deleteModelById = async (req, res) => {
  try {
    const modelId = req.params.id;
    const model = await Rotator.findByIdAndDelete(modelId);
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }
    res.status(200).json({ message: 'Model deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
