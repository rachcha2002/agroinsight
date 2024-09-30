// routes/adminUserProfileRoutes.js

const express = require("express");
const router = express.Router();
const UserProfileController = require("../controllers/common/adminUserProfileController");

// Route to create a new admin profile
router.post("/create-admin", UserProfileController.createProfile);

// Route to update an admin profile by adminId
router.put("/update-admin/:adminId", UserProfileController.updateProfile);

// Route to delete an admin profile by adminId
router.delete("/delete-admin/:adminId", UserProfileController.deleteProfile);

// Route to get all admin profiles
router.get("/all-admins", UserProfileController.getAllProfiles);

// Route to get an admin profile by adminId
router.get("/adminbyId/:adminId", UserProfileController.getProfileById);

// Route for admin login
router.post("/admin/login", UserProfileController.login);

module.exports = router;
