const mongoose = require("mongoose");

// Define the schema for the admin
let adminSchema = mongoose.Schema(
  {
    adminusername: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contact_info_1: { type: String },
    contact_info_2: { type: String },
    password: { type: String, required: true }, // Hashed password
    profileImage: { type: String, default: ""  }, // URL to the admin's profile image
    isActive: { type: Boolean, default: true }, // To activate or deactivate admin
    lastLogin: { type: Date }, // Track the admin's last login
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create the model for the admin
let adminModel =
  mongoose.model.adminTable || mongoose.model("adminTable", adminSchema);

// Export the model
module.exports = adminModel;
