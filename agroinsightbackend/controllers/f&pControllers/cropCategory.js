const CropCategory = require("../../models/f&pModels/cropCategorySchema");

// Utility function to generate a new category ID
const generateCategoryId = async () => {
  const lastCategory = await CropCategory.findOne().sort({ categoryId: -1 });
  if (!lastCategory) return "CC000001"; // First category ID if none exist

  const lastId = parseInt(lastCategory.categoryId.slice(2), 10); // Extract number part
  const newId = lastId + 1;
  return `CC${newId.toString().padStart(6, "0")}`; // Format as 'CC000000'
};

// Create a new CropCategory
exports.createCropCategory = async (req, res) => {
  try {
    const { name, description, crops } = req.body;

    // Check if a category with the same name already exists
    const existingCategory = await CropCategory.findOne({ name });
    if (existingCategory) {
      return res
        .status(400)
        .json({ error: "A category with this name already exists." });
    }

    // Generate a new categoryId
    const categoryId = await generateCategoryId();

    // Create a new CropCategory
    const newCategory = new CropCategory({
      categoryId,
      name,
      description,
      crops,
    });

    // Save the new category to the database
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all CropCategories
exports.getAllCropCategories = async (req, res) => {
  try {
    const categories = await CropCategory.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single CropCategory by ID
exports.getCropCategoryById = async (req, res) => {
  try {
    const category = await CropCategory.findById(req.params.id);
    if (!category)
      return res.status(404).json({ error: "CropCategory not found" });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a CropCategory by ID
exports.updateCropCategory = async (req, res) => {
  try {
    const updatedCategory = await CropCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCategory)
      return res.status(404).json({ error: "CropCategory not found" });
    res.status(200).json(updatedCategory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a CropCategory by ID
exports.deleteCropCategory = async (req, res) => {
  try {
    const deletedCategory = await CropCategory.findByIdAndDelete(req.params.id);
    if (!deletedCategory)
      return res.status(404).json({ error: "CropCategory not found" });
    res.status(200).json({ message: "CropCategory deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Function to get crops by category ID
exports.getCropsByCategoryId = async (req, res) => {
  try {
    const categoryId = req.params.id; // Extract categoryId from path parameters
    console.log("Received categoryId:", categoryId);

    if (!categoryId) {
      return res.status(400).json({ error: "Category ID is required" });
    }

    // Find the CropCategory by ObjectId
    const cropCategory = await CropCategory.findById(categoryId);

    if (!cropCategory) {
      return res.status(404).json({ error: "CropCategory not found" });
    }

    // Return the crops array from the found CropCategory
    console.log(cropCategory.crops);
    res.status(200).json(cropCategory.crops);
  } catch (error) {
    console.error("Error fetching crops:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getCropById = async (req, res) => {
  const cropId = req.params.cropId;

  try {
    // Find all crop categories
    const cropCategories = await CropCategory.find();

    // Iterate over each crop category to find the crop
    for (const category of cropCategories) {
      const crop = category.crops.id(cropId);
      if (crop) {
        return res.status(200).json(crop);
      }
    }

    // If crop not found
    return res.status(404).json({ message: "Crop not found" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
