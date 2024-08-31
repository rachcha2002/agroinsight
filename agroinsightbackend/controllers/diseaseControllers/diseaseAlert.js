const DiseaseAlert = require("../../models/diseaseModels/diseaseAlertSchema");
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
  "diseaseImage"
); // The field name should match the one in the form

exports.createDiseaseAlert = (req, res) => {
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
      const dateTime = new Date().toISOString().replace(/:/g, "-");
      const storageRef = ref(
        storage,
        `diseaseManagement/disease_alerts/${req.file.originalname}_${dateTime}`
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
      const downloadURL = await getDownloadURL(snapshot.ref);

      console.log("File successfully uploaded to Firebase Storage.");

      // Create a new disease alert document with the received form data and the image URL
      const newAlertData = {
        title: req.body.title,
        description: req.body.description,
        imageURL: downloadURL, // Save the Firebase Storage URL
        details: req.body.details,
      };

      // Save the disease alert to MongoDB
      const newAlert = new DiseaseAlert(newAlertData);
      const savedAlert = await newAlert.save();

      const response = {
        message: "Disease alert created successfully.",
        savedAlert,
      };
      console.log("Response:", response);
      return res.status(201).json(response);
    } catch (error) {
      console.error("Error creating disease alert:", error);
      return res.status(500).send(error.message);
    }
  });
};

// Get all DiseaseAlerts
exports.getAllDiseaseAlerts = async (req, res) => {
  try {
    const alerts = await DiseaseAlert.find();
    res.status(200).json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single DiseaseAlert by ID
exports.getDiseaseAlertById = async (req, res) => {
  try {
    const alert = await DiseaseAlert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({ error: "DiseaseAlert not found" });
    }

    res.status(200).json(alert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a DiseaseAlert by ID
exports.updateDiseaseAlert = async (req, res) => {
  try {
    const { title, imageURL, description, details } = req.body;

    const updatedAlert = await DiseaseAlert.findByIdAndUpdate(
      req.params.id,
      {
        title,
        imageURL,
        description,
        details,
      },
      { new: true } // Return the updated document
    );

    if (!updatedAlert) {
      return res.status(404).json({ error: "DiseaseAlert not found" });
    }

    res.status(200).json(updatedAlert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a DiseaseAlert by ID
exports.deleteDiseaseAlert = async (req, res) => {
  try {
    const deletedAlert = await DiseaseAlert.findByIdAndDelete(req.params.id);

    if (!deletedAlert) {
      return res.status(404).json({ error: "DiseaseAlert not found" });
    }

    res.status(200).json({ message: "DiseaseAlert deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
