const rotatorAlert = require('../../models/cropRotatorModels/rotatorAlertSchema');
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
    "rotatorImage"
  ); // The field name should match the one in the form

  exports.createRotatorAlert = (req, res) => {
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
          `cropRotator/rotator_alerts/${req.file.originalname}_${dateTime}`
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
          zone: req.body.zone,
          imageURL: downloadURL, // Save the Firebase Storage URL
          details: req.body.details,
        };
  
        // Save the disease alert to MongoDB
        const newAlert = new rotatorAlert(newAlertData);
        const savedAlert = await newAlert.save();
  
        const response = {
          message: "Rotator alert created successfully.",
          savedAlert,
        };
        console.log("Response:", response);
        return res.status(201).json(response);
      } catch (error) {
        console.error("Error creating rotator alert:", error);
        return res.status(500).send(error.message);
      }
    });
  };

// Get all RotatorAlerts
exports.getAllRotatorAlerts = async (req, res) => {
  try {
    const alerts = await rotatorAlert.find();
    res.status(200).json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single RotatorAlert by ID
exports.getRotatorAlertById = async (req, res) => {
  try {
    const alert = await rotatorAlert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({ error: "RotatorAlert not found" });
    }

    res.status(200).json(alert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a RotatorAlert by ID
exports.updateRotatorAlertById = async (req, res) => {
  try {
    const { title, imageURL, description, zone, details } = req.body;

    const updatedAlert = await rotatorAlert.findByIdAndUpdate(
      req.params.id,
      {
        title,
        imageURL,
        description,
        zone,
        details,
      },
      { new: true } // Return the updated document
    );

    if (!updatedAlert) {
      return res.status(404).json({ error: "RotatorAlert not found" });
    }

    res.status(200).json(updatedAlert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a RotatorAlert by ID
exports.deleteRotatorAlertById = async (req, res) => {
  try {
    const deletedAlert = await rotatorAlert.findByIdAndDelete(req.params.id);

    if (!deletedAlert) {
      return res.status(404).json({ error: "RotatorAlert not found" });
    }

    res.status(200).json({ message: "RotatorAlert deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};