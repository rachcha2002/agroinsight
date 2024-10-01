const Complaint = require("../../models/diseaseModels/complaintSchema");

const { initializeApp } = require("firebase/app");
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require("firebase/storage");
const multer = require("multer");
const { firebaseConfig } = require("../../config/firebase-config");

// Initialize a Firebase application
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(firebaseApp);

// Setting up multer as a middleware to handle image uploads
const upload = multer({ storage: multer.memoryStorage() }).single("diseaseImage"); // The field name should match the one in the form

exports.createComplaint = (req, res) => {
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
            const storageRef = ref(storage, `disease_images/${req.file.originalname}_${dateTime}`);

            const metadata = {
                contentType: req.file.mimetype,
            };

            // Upload the file to Firebase Storage
            const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);

            // Get the download URL of the uploaded file
            const downloadURL = await getDownloadURL(snapshot.ref);

            console.log('File successfully uploaded to Firebase Storage.');

            // Create a new complaint document with the received form data and the image URL
            const complaintData = {
                farmerID: req.body.farmerID ,  // Replace with actual farmerID from req.body
                area: req.body.area ,  // Replace with actual area from req.body
                cropAffected: req.body.cropAffected ,  // Replace with actual cropAffected from req.body
                complaintDescription: req.body.complaintDescription ,  // Replace with actual complaintDescription from req.body
                dateOfComplaint: req.body.dateOfComplaint,  // Replace with actual dateOfComplaint from req.body
                imageURL: downloadURL,  // Save the Firebase Storage URL
            };

            // Save the complaint to MongoDB
            const complaint = new Complaint(complaintData);
            await complaint.save();

            const response = {
                message: 'Complaint created successfully.',
                complaint,
            };
            console.log('Response:', response);
            return res.status(200).json(response);
        } catch (error) {
            console.error('Error creating complaint:', error);
            return res.status(400).send(error.message);
        }
    });
};

const giveCurrentDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
    const dateTime = date + '_' + time;
    return dateTime;
};



// Get all complaints
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single complaint by ID
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a complaint by ID
exports.updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.status(200).json(complaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a complaint by ID
exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.status(200).json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get complaints by farmerID
exports.getComplaintsByFarmerId = async (req, res) => {
  try {
    // Extract farmerID from the request parameters or query string
    const farmerID = req.params.farmerID 

    // Find complaints based on the farmerID
    const complaints = await Complaint.find({ farmerID: farmerID });

    if (!complaints || complaints.length === 0) {
      return res.status(404).json({ message: 'No complaints found for the given farmer Email' });
    }

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};