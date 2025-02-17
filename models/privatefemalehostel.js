const mongoose = require("mongoose");

// Define the schema for the Private female Hostel
let PrivatefemaleHostelSchema = mongoose.Schema(
  {
    img_array: {
      type: String, // link of image URLs
      required: false, // Images are optional
    },
    building_name: { type: String, required: true }, // Building name
    building_address: { type: String, required: true }, // Building address
    room_description: { type: String, required: true }, // Short description of the room
    building_amenities: { type: String }, // List of amenities (e.g., Wi-Fi, air conditioning)
    room_count: { type: Number, required: true }, // Total number of rooms in the hostel
    one_room_capacity: { type: Number, required: true }, // Capacity per room
    rent: { type: Number, required: true }, // Rent for each room
    is_furnished: { type: Boolean, default: false }, // Whether the room is furnished
    rules: { type: String }, // Specific rules or regulations for the hostel

    bank_name: { type: String , required: true }, // New field
    bank_account: { type: Number , required: true }, // New field
    whatsappcontact: { type: Number , required: true }, // New field

    rooms: {
      type: Array,
      default: function () {
        // Automatically generate room details based on room_count
        let roomsArray = [];
        for (let i = 1; i <= this.room_count; i++) {
          roomsArray.push({
            room_id: i, // Room ID (1, 2, 3, etc.)
            availability: false, // Default to available
            occupant: null , // Assigns matric_number of the user
            lease_start_date: { type: Date }, // Start date of the lease (if applicable)
            lease_end_date: { type: Date }, // End date of the lease (if applicable)
          });
        }
        return roomsArray;
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the model for Private female Hostel
let PrivatefemaleHostelModel =
  mongoose.model.PrivatefemaleHostelTable ||
  mongoose.model("PrivatefemaleHostelTable", PrivatefemaleHostelSchema);

// Export the model
module.exports = PrivatefemaleHostelModel;
