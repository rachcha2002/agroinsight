const FarmerFertilizers = require("../../models/f&pModels/FarmerFertilizerSchema");

// Create a new record without email, farmerId, region, and comment
exports.createFarmerFertilizer = async (req, res) => {
  try {
    const { crop, fertilizer, amount, email, region } = req.body;

    const newFarmerFertilizer = new FarmerFertilizers({
      email,
      crop,
      fertilizer,
      amount,
      region,
    });

    await newFarmerFertilizer.save();
    res.status(201).json({
      message: "Farmer fertilizer record created successfully",
      data: newFarmerFertilizer,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error creating farmer fertilizer record",
      details: error.message,
    });
  }
};

// Update region, crop, fertilizer, and amount
exports.updateFarmerFertilizer = async (req, res) => {
  try {
    const { id } = req.params;
    const { region, crop, fertilizer, amount } = req.body;

    const updatedFarmerFertilizer = await FarmerFertilizers.findByIdAndUpdate(
      id,
      { region, crop, fertilizer, amount },
      { new: true } // Return the updated record
    );

    if (!updatedFarmerFertilizer) {
      return res
        .status(404)
        .json({ message: "Farmer fertilizer record not found" });
    }

    res.status(200).json({
      message: "Farmer fertilizer record updated successfully",
      data: updatedFarmerFertilizer,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error updating farmer fertilizer record",
      details: error.message,
    });
  }
};

// Update only the comment field using PATCH
exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params; // Get the farmer fertilizer record ID
    const { comment } = req.body; // Get the updated comment from the request body
    console.log(comment);
    console.log(id);
    console.log(req.body);
    // Find the record by ID and update only the comment field
    const updatedFarmerFertilizer = await FarmerFertilizers.findByIdAndUpdate(
      id,
      { $set: { comment } }, // Use $set to update only the comment field
      { new: true } // Return the updated document
    );

    if (!updatedFarmerFertilizer) {
      return res
        .status(404)
        .json({ message: "Farmer fertilizer record not found" });
    }

    res.status(200).json({
      message: "Comment updated successfully",
      data: updatedFarmerFertilizer,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating comment", details: error.message });
  }
};

// Delete a record by id
exports.deleteFarmerFertilizer = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedFarmerFertilizer = await FarmerFertilizers.findByIdAndDelete(
      id
    );

    if (!deletedFarmerFertilizer) {
      return res
        .status(404)
        .json({ message: "Farmer fertilizer record not found" });
    }

    res
      .status(200)
      .json({ message: "Farmer fertilizer record deleted successfully" });
  } catch (error) {
    res.status(500).json({
      error: "Error deleting farmer fertilizer record",
      details: error.message,
    });
  }
};

// Get all records by email
exports.getAllByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const records = await FarmerFertilizers.find({ email });

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
    const records = await FarmerFertilizers.find();
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

    const record = await FarmerFertilizers.findById(id);

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
