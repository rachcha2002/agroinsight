const Pesticide = require("../../models/f&pModels/pesticidesSchema"); // Import the Pesticide model

const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
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

// Generate the next pesticide ID based on the last inserted one
const generatePesticideId = async () => {
  const lastPesticide = await Pesticide.findOne().sort({ pesticideId: -1 }); // Find the last inserted pesticide by ID
  if (!lastPesticide) {
    return "P0001"; // If no pesticides exist, start with F0001
  }

  const lastIdNumber = parseInt(lastPesticide.pesticideId.substring(1)); // Extract the numeric part of the last ID
  const newIdNumber = lastIdNumber + 1;
  return `P${newIdNumber.toString().padStart(4, "0")}`; // Generate the new ID, e.g., F0002
};

//generate current date and time
const giveCurrentDateTime = () => {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
  const dateTime = date + "_" + time;
  return dateTime;
};

// Create a new Pesticide
exports.createPesticide = async (req, res) => {
  //console.log("Came dta", req.body);
  // Call the multer middleware before proceeding
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
        `pesticide_images/${req.file.originalname}_${dateTime}`
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

      const pesticideId = await generatePesticideId(); // Generate the unique pesticideId

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

      const newPesticide = new Pesticide({
        ...req.body,
        pesticideId,
        imageUrl,
      });
      const savedPesticide = await newPesticide.save();
      res.status(201).json({
        message: "Pesticide created successfully",
        pesticide: savedPesticide,
      });
    } catch (error) {
      console.error("Error creating pesticide:", error.message);
      res.status(500).json({ error: error.message });
    }
  });
};

// Get all Pesticides
exports.getAllPesticides = async (req, res) => {
  try {
    const pesticides = await Pesticide.find();
    res.status(200).json(pesticides);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a Pesticide by ID
exports.getPesticideById = async (req, res) => {
  try {
    const pesticide = await Pesticide.findById(req.params.id);
    if (!pesticide) {
      return res.status(404).json({ message: "Pesticide not found" });
    }
    res.status(200).json(pesticide);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a Pesticide by ID
exports.updatePesticide = async (req, res) => {
  try {
    const updatedPesticide = await Pesticide.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated document
    );
    if (!updatedPesticide) {
      return res.status(404).json({ message: "Pesticide not found" });
    }
    res.status(200).json(updatedPesticide);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a Pesticide by ID
exports.deletePesticide = async (req, res) => {
  try {
    const deletedPesticide = await Pesticide.findByIdAndDelete(req.params.id);
    if (!deletedPesticide) {
      return res.status(404).json({ message: "Pesticide not found" });
    }
    res.status(200).json({ message: "Pesticide deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
