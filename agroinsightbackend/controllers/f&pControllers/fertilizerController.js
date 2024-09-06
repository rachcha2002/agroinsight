const { Fertilizer } = require("../../models/f&pModels/fertilizerSchema");
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} = require("firebase/storage");
const multer = require("multer");
const { firebaseConfig } = require("../../config/firebase-config");

// Initialize a Firebase application
const firebaseApp = initializeApp(firebaseConfig);
// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(firebaseApp);

// Setting up multer as a middleware to handle image uploads
const upload = multer({ storage: multer.memoryStorage() }).single(
  "fertilizerImage"
); // The field name should match the one in the form frontend

// Generate the next fertilizer ID based on the last inserted one
const generateFertilizerId = async () => {
  const lastFertilizer = await Fertilizer.findOne().sort({ fertilizerId: -1 }); // Find the last inserted fertilizer by ID
  if (!lastFertilizer) {
    return "F0001"; // If no fertilizers exist, start with F0001
  }

  const lastIdNumber = parseInt(lastFertilizer.fertilizerId.substring(1)); // Extract the numeric part of the last ID
  const newIdNumber = lastIdNumber + 1;
  return `F${newIdNumber.toString().padStart(4, "0")}`; // Generate the new ID, e.g., F0002
};

// Generate the current date and time for file naming
const giveCurrentDateTime = () => {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
  const dateTime = date + "_" + time;
  return dateTime;
};

// Create a new Fertilizer
exports.createFertilizer = async (req, res) => {
  upload(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError) {
        console.error("Multer error occurred:", err);
        throw new Error("Multer error occurred");
      } else if (err) {
        console.error("Unknown error occurred:", err);
        throw new Error("Unknown error occurred");
      }

      if (!req.file) {
        console.error("No file uploaded");
        throw new Error("No file uploaded");
      }

      // Generate a unique filename using the current date and time
      const dateTime = giveCurrentDateTime();
      const storageRef = ref(
        storage,
        `fertilizer_images/${req.file.originalname}_${dateTime}`
      );

      const metadata = {
        contentType: req.file.mimetype,
      };

      // Upload the file to Firebase Storage
      const snapshot = await uploadBytesResumable(
        storageRef,
        req.file.buffer,
        metadata
      );

      // Get the download URL of the uploaded file
      const imageUrl = await getDownloadURL(snapshot.ref);

      console.log("File successfully uploaded to Firebase Storage.");

      const fertilizerId = await generateFertilizerId(); // Generate the unique fertilizerId

      // Parse suitableCrops if it's a string
      if (typeof req.body.suitableCrops === "string") {
        try {
          req.body.suitableCrops = JSON.parse(req.body.suitableCrops);
        } catch (error) {
          return res.status(400).json({
            message:
              "Invalid format for suitableCrops. It should be a valid JSON array.",
            error: error.message,
          });
        }
      }

      // Parse brands if it's a string (comma-separated)
      if (typeof req.body.brands === "string") {
        req.body.brands = req.body.brands
          .split(",")
          .map((brand) => brand.trim());
      }

      // Parse region if it's a string (comma-separated)
      if (typeof req.body.region === "string") {
        req.body.region = req.body.region
          .split(",")
          .map((region) => region.trim());
      }

      const newFertilizer = new Fertilizer({
        ...req.body,
        fertilizerId,
        imageUrl,
      });
      const savedFertilizer = await newFertilizer.save();
      res.status(201).json({
        message: "Fertilizer created successfully",
        fertilizer: savedFertilizer,
      });
    } catch (error) {
      console.error("Error creating fertilizer:", error.message);
      res.status(500).json({ error: error.message });
    }
  });
};

// Controller to get all fertilizers
exports.getAllFertilizers = async (req, res) => {
  try {
    const fertilizers = await Fertilizer.find();
    res.status(200).json(fertilizers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to get a fertilizer by ID
exports.getFertilizerById = async (req, res) => {
  try {
    const fertilizer = await Fertilizer.findById(req.params.id);
    if (!fertilizer) {
      return res.status(404).json({ error: "Fertilizer not found" });
    }
    res.status(200).json(fertilizer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to update a fertilizer by ID and handle image update in Firebase
exports.updateFertilizer = async (req, res) => {
  upload(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError) {
        console.error("Multer error occurred:", err);
        throw new Error("Multer error occurred");
      } else if (err) {
        console.error("Unknown error occurred:", err);
        throw new Error("Unknown error occurred");
      }

      // Find the fertilizer by ID
      const fertilizer = await Fertilizer.findById(req.params.id);
      if (!fertilizer) {
        return res.status(404).json({ error: "Fertilizer not found" });
      }

      let imageUrl = fertilizer.imageUrl; // Keep the current image URL unless it's changed

      // If a new image is uploaded, delete the old image and upload the new one
      if (req.file) {
        console.log("Image update detected, processing new image...");

        // Delete the existing photo from Firebase Storage
        if (imageUrl) {
          const oldPhotoRef = ref(storage, imageUrl);
          await deleteObject(oldPhotoRef);
          console.log("Previous image deleted from Firebase.");
        }

        // Generate a unique filename using the current date and time
        const dateTime = giveCurrentDateTime();
        const storageRef = ref(
          storage,
          `fertilizer_images/${req.file.originalname}_${dateTime}`
        );

        const metadata = {
          contentType: req.file.mimetype,
        };

        // Upload the new image to Firebase Storage
        const snapshot = await uploadBytesResumable(
          storageRef,
          req.file.buffer,
          metadata
        );

        // Get the download URL of the newly uploaded image
        imageUrl = await getDownloadURL(snapshot.ref);
        console.log("New image successfully uploaded to Firebase Storage.");
      }

      // Parse suitableCrops if it's a string
      if (typeof req.body.suitableCrops === "string") {
        try {
          req.body.suitableCrops = JSON.parse(req.body.suitableCrops);
        } catch (error) {
          return res.status(400).json({
            message:
              "Invalid format for suitableCrops. It should be a valid JSON array.",
            error: error.message,
          });
        }
      }

      // Parse brands if it's a string (comma-separated)
      // Make sure to remove any unwanted characters like brackets or quotes
      if (typeof req.body.brands === "string") {
        req.body.brands = req.body.brands
          .replace(/[\[\]"]+/g, "") // Remove brackets and quotes
          .split(",") // Split by commas
          .map((brand) => brand.trim()); // Trim whitespace from each brand
      }
      // Just use req.body.region as it's already expected to be an array
      console.log("Regions received from frontend:", req.body.region);
      // Parse region if it's a string (comma-separated)
      /*if (typeof req.body.region === "string") {
        req.body.region = req.body.region
          .split(",")
          .map((region) => region.trim());
      }*/

      // Update fertilizer with new data, including the new image URL (if changed)
      const updatedFertilizer = await Fertilizer.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
          imageUrl, // If the image URL has changed, this will update it
        },
        { new: true, runValidators: true }
      );

      if (!updatedFertilizer) {
        return res.status(404).json({ error: "Fertilizer not found" });
      }

      res.status(200).json({
        message: "Fertilizer updated successfully",
        fertilizer: updatedFertilizer,
      });
    } catch (error) {
      console.error("Error updating fertilizer:", error.message);
      res.status(500).json({ error: error.message });
    }
  });
};

// Controller to delete a fertilizer by ID
exports.deleteFertilizer = async (req, res) => {
  try {
    console.log("Initiate delete");
    console.log(req.params.id);

    // Find the fertilizer by ID
    const fertilizer = await Fertilizer.findById(req.params.id);

    if (!fertilizer) {
      return res.status(404).json({ error: "Fertilizer not found" });
    }
    console.log("Fertilizer found:", fertilizer);
    // Extract the image URL from the fertilizer record
    const imageUrl = fertilizer.imageUrl; // Adjust this based on your schema
    console.log("Image URL:", imageUrl);
    // Delete the existing photo from Firebase Storage if it exists
    if (imageUrl) {
      const photoRef = ref(storage, imageUrl);
      await deleteObject(photoRef);
    }

    // Delete the fertilizer from the database
    await Fertilizer.findByIdAndDelete(req.params.id).exec();

    res.status(200).json({ message: "Fertilizer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
