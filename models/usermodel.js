const mongoose = require("mongoose");

// Define the schema for the user
let UserSchema = mongoose.Schema(
  {
    matric_number: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    contact_info_1: { type: String },
    contact_info_2: { type: String },
    password: { type: String, required: true }, // Hashed password
    profileImage: { type: String , default: ""}, // URL to the user's profile image
    currentRoomType: {
      type: String,
      enum: ["school_hostel", "private_hostel"],
      default: null, // Allow for no room type initially
    }, // Enum to determine the type of room
    roomDetails: {
      type: Array, // Default empty a rray for room details
      default: [], // Empty array by default
    },
    isActive: { type: Boolean, default: true }, // To activate or deactivate user
    lastLogin: { type: Date }, // Track the user's last login
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create the model for the user
let UserModel =
  mongoose.model.UserTable || mongoose.model("UserTable", UserSchema);

// Export the model
module.exports = UserModel;
