const FarmerPesticides = require("../../models/f&pModels/FarmerPesticidesSchema");

// Create a new record without email, farmerId, region, and comment
exports.createFarmerPesticide = async (req, res) => {
  try {
    const { crop, pesticide, amount, targetPest, email } = req.body;

    const newFarmerPesticide = new FarmerPesticides({
      email,
      crop,
      pesticide,
      amount,
      targetPest, // New field for target pest
    });

    await newFarmerPesticide.save();
    res.status(201).json({
      message: "Farmer pesticide record created successfully",
      data: newFarmerPesticide,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error creating farmer pesticide record",
      details: error.message,
    });
  }
};

// Update region, crop, pesticide, amount, and targetPest
exports.updateFarmerPesticide = async (req, res) => {
  try {
    const { id } = req.params;
    const { region, crop, pesticide, amount, targetPest } = req.body;

    const updatedFarmerPesticide = await FarmerPesticides.findByIdAndUpdate(
      id,
      { region, crop, pesticide, amount, targetPest },
      { new: true } // Return the updated record
    );

    if (!updatedFarmerPesticide) {
      return res
        .status(404)
        .json({ message: "Farmer pesticide record not found" });
    }

    res.status(200).json({
      message: "Farmer pesticide record updated successfully",
      data: updatedFarmerPesticide,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error updating farmer pesticide record",
      details: error.message,
    });
  }
};

// Update only the comment field using PATCH
exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from the URL parameters
    const { comment } = req.body; // Extract the comment from the request body

    // Use $set to update only the comment field
    const updatedFarmerPesticide = await FarmerPesticides.findByIdAndUpdate(
      id,
      { $set: { comment } }, // Use $set to update only the comment field
      { new: true } // Return the updated document
    );

    if (!updatedFarmerPesticide) {
      return res
        .status(404)
        .json({ message: "Farmer pesticide record not found" });
    }

    res.status(200).json({
      message: "Comment updated successfully",
      data: updatedFarmerPesticide,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error updating comment",
      details: error.message,
    });
  }
};


// Delete a record by id
exports.deleteFarmerPesticide = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedFarmerPesticide = await FarmerPesticides.findByIdAndDelete(id);

    if (!deletedFarmerPesticide) {
      return res
        .status(404)
        .json({ message: "Farmer pesticide record not found" });
    }

    res
      .status(200)
      .json({ message: "Farmer pesticide record deleted successfully" });
  } catch (error) {
    res.status(500).json({
      error: "Error deleting farmer pesticide record",
      details: error.message,
    });
  }
};

// Get all records by email
exports.getAllByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const records = await FarmerPesticides.find({ email });

    if (!records.length) {
      return res
        .status(404)
        .json({ message: "No records found for this email" });
    }

    res.status(200).json({ data: records });
  } catch (error) {
    res.status(500).json({
      error: "Error fetching records by email",
      details: error.message,
    });
  }
};

// Get all records
exports.getAllRecords = async (req, res) => {
  try {
    const records = await FarmerPesticides.find();
    res.status(200).json({ data: records });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching all records", details: error.message });
  }
};

// Get a record by id
exports.getRecordById = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await FarmerPesticides.findById(id);

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.status(200).json({ data: record });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching record by ID", details: error.message });
  }
};
