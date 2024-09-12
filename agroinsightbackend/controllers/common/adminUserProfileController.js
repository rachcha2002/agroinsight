const AdminUserProfile = require("../../models/common/adminUserProfileSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Utility function to generate a new admin ID
const generateAdminId = async () => {
    const lastAdmin = await AdminUserProfile.findOne().sort({ adminId: -1 });
    if (!lastAdmin) return "AD000001"; // First admin ID if none exist
  
    const lastId = parseInt(lastAdmin.adminId.slice(2), 10); // Extract number part
    const newId = lastId + 1;
    return `AD${newId.toString().padStart(6, "0")}`; // Format as 'AD000000'
  };
  
  exports.createProfile = async (req, res) => {
    console.log("Creating admin profile...");
    try {
      const { name, email, password, address, phone, designation } = req.body;
        console.log("Admin profile data:", req.body);
      // Check if admin with the same email already exists
      const existingAdmin = await AdminUserProfile.findOne({ email });
      console.log("Existing admin:", existingAdmin);
      if (existingAdmin) {
        return res.status(400).json({ error: "Admin with this email already exists" });
      }
      console.log("Creating new admin profile...");
      // Generate a new adminId
      const adminId = await generateAdminId();
      console.log("Admin ID:", adminId);

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newProfile = new AdminUserProfile({
        adminId,
        name,
        email,
        password: hashedPassword, // Store the hashed password
        address,
        phone,
        designation,
      });
  
      await newProfile.save();
      res.status(201).json({ message: "Admin profile created", profile: newProfile });
    } catch (error) {
      console.error("Error creating admin profile:", error.message);
      res.status(500).json({ error: "Error creating admin profile" });
    }
  };
// Update admin user profile (including password if provided)
exports.updateProfile = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const profileData = { ...rest };

    if (password) {
      // Hash the new password before updating
      const hashedPassword = await bcrypt.hash(password, 10);
      profileData.password = hashedPassword;
    }

    const updatedProfile = await AdminUserProfile.findOneAndUpdate(
      { adminId: req.params.adminId },
      profileData,
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Admin profile updated", profile: updatedProfile });
  } catch (error) {
    res.status(500).json({ error: "Error updating admin profile" });
  }
};

// Delete an admin user profile
exports.deleteProfile = async (req, res) => {
  try {
    const deletedProfile = await AdminUserProfile.findOneAndDelete({
      adminId: req.params.adminId,
    });
    if (!deletedProfile) {
      return res.status(404).json({ error: "Admin profile not found" });
    }
    res.status(200).json({ message: "Admin profile deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting admin profile" });
  }
};

// Get all admin user profiles
exports.getAllProfiles = async (req, res) => {
  try {
    const profiles = await AdminUserProfile.find();
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ error: "Error fetching admin profiles" });
  }
};

// Get an admin user profile by adminId
exports.getProfileById = async (req, res) => {
  try {
    const profile = await AdminUserProfile.findOne({
      adminId: req.params.adminId,
    });
    if (!profile) {
      return res.status(404).json({ error: "Admin profile not found" });
    }
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: "Error fetching admin profile" });
  }
};

// Admin login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the admin by email
    const admin = await AdminUserProfile.findOne({ email });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

     // Generate JWT token, including name and designation in the payload
     const token = jwt.sign(
      {
        adminId: admin.adminId,
        name: admin.name,
        designation: admin.designation, // Include these fields in the token
        email: admin.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );


    // Successful login
    res.status(200).json({ message: "Login successful", token, admin });
  } catch (error) {
    res.status(500).json({ error: "Error during login" });
  }
};
