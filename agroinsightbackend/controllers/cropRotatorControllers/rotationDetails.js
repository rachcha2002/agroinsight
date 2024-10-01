// controllers/cropRotatorControllers.js
const RotationDetails = require("../../models/cropRotatorModels/rotationDetailsSchema")

// Create a new Rotation details
exports.createRotationDetail = async (req, res) => {
  try {
    const model = new RotationDetails(req.body);
    await model.save();
    res.status(201).json(model);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

  // Get all Rotation details
exports.getAllRotationDetails = async (req, res) => {
  try {
    const models = await RotationDetails.find();
    res.status(200).json(models);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single Rotattion Detail by ID
exports.getRotationDetailById = async (req, res) => {
  const email = req.params.email;
    try {
      const detail = await RotationDetails.find({ farmerId: email });
  
      if (!detail) {
        return res.status(404).json({ error: "Rotation Detail not found" });
      }
  
      res.status(200).json(detail);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  // Update a Rotation Detail by ID
  exports.updateRecommendedCrop = async (req, res) => {
    try {
      const { id } = req.params;
      const { recommendedCrop } = req.body;
  
      const updatedDetail = await RotationDetails.findByIdAndUpdate(
        id,
        { recommendedCrop },
        { new: true, runValidators: true }
      );
  
      if (!updatedDetail) {
        return res.status(404).json({ error: "Rotation Detail not found" });
      }
  
      res.status(200).json(updatedDetail);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  // Delete a Rotation Detail by ID
  exports.deleteRotationDetailById = async (req, res) => {
    try {
      const deletedDetail = await RotationDetails.findByIdAndDelete(req.params.id);
  
      if (!deletedDetail) {
        return res.status(404).json({ error: "Rotation Detail not found" });
      }
  
      res.status(200).json({ message: "Rotation Detail deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
