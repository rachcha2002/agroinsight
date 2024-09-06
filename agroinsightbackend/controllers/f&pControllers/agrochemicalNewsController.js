const AgrochemicalNews = require("../../models/f&pModels/AgrochemicalNewsSchema");
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
const upload = multer({ storage: multer.memoryStorage() }).single("newsImage"); // The field name should match the one in the form

// Create a new Agrochemical News
exports.createAgrochemicalNews = (req, res) => {
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
        `agrochemicalNews/${req.file.originalname}_${dateTime}`
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

      // Create a new agrochemical news document with the received form data and the image URL
      const newNewsData = {
        title: req.body.title,
        description: req.body.description,
        imageURL: downloadURL, // Save the Firebase Storage URL
        details: req.body.details,
        source: req.body.source,
      };

      // Save the agrochemical news to MongoDB
      const newNews = new AgrochemicalNews(newNewsData);
      const savedNews = await newNews.save();

      const response = {
        message: "Agrochemical news created successfully.",
        savedNews,
      };
      console.log("Response:", response);
      return res.status(201).json(response);
    } catch (error) {
      console.error("Error creating agrochemical news:", error);
      return res.status(500).send(error.message);
    }
  });
};

// Get all Agrochemical News
exports.getAllAgrochemicalNews = async (req, res) => {
  try {
    const news = await AgrochemicalNews.find();
    res.status(200).json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single Agrochemical News by ID
exports.getAgrochemicalNewsById = async (req, res) => {
  try {
    const news = await AgrochemicalNews.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ error: "AgrochemicalNews not found" });
    }

    res.status(200).json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an Agrochemical News by ID
exports.updateAgrochemicalNews = async (req, res) => {
  try {
    const { title, imageURL, description, details, source } = req.body;

    const updatedNews = await AgrochemicalNews.findByIdAndUpdate(
      req.params.id,
      {
        title,
        imageURL,
        description,
        details,
        source,
      },
      { new: true } // Return the updated document
    );

    if (!updatedNews) {
      return res.status(404).json({ error: "AgrochemicalNews not found" });
    }

    res.status(200).json(updatedNews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete an Agrochemical News by ID
exports.deleteAgrochemicalNews = async (req, res) => {
  try {
    const deletedNews = await AgrochemicalNews.findByIdAndDelete(req.params.id);

    if (!deletedNews) {
      return res.status(404).json({ error: "AgrochemicalNews not found" });
    }

    res.status(200).json({ message: "AgrochemicalNews deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
