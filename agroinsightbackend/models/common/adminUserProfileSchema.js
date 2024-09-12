// models/UserProfile.js

const mongoose = require("mongoose");

const adminUserProfileSchema = new mongoose.Schema({
  adminId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: String,
  phone: String,
  designation: {
    type: String,
    default: "Admin",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const adminUserProfile = mongoose.model(
  "AdminUserProfile",
  adminUserProfileSchema
);

module.exports = adminUserProfile;
