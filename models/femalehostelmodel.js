const mongoose = require("mongoose");

// Define the schema for the Female Hostel
let FemaleHostelSchema = mongoose.Schema(
  {
    roomNumber: { type: String, required: true }, // Room number
    bunkerSpace: { type: Number, required: true }, // Number of bunk beds (e.g., 2 bunk beds)
    rent: { type: Number, required: true }, // Rent for the room
    availability: { type: Boolean, default: true }, // Whether the room is available
    bunkerDetails: {
      type: Array,
      default: function () {
        // Automatically generate the bunk details array based on the bunkerSpace
        let bunkDetailsArray = [];
        
        if (this.bunkerSpace >= 1) {
          bunkDetailsArray.push({ id: "A", occupant: null });
          bunkDetailsArray.push({ id: "B", occupant: null });
        }
        if (this.bunkerSpace >= 2) {
          bunkDetailsArray.push({ id: "C", occupant: null });
          bunkDetailsArray.push({ id: "D", occupant: null });
        }
        if (this.bunkerSpace >= 3) {
          bunkDetailsArray.push({ id: "E", occupant: null });
          bunkDetailsArray.push({ id: "F", occupant: null });
        }
        if (this.bunkerSpace >= 4) {
          bunkDetailsArray.push({ id: "G", occupant: null });
          bunkDetailsArray.push({ id: "H", occupant: null });
        }
        if (this.bunkerSpace >= 5) {
          bunkDetailsArray.push({ id: "I", occupant: null });
          bunkDetailsArray.push({ id: "J", occupant: null });
        }

        return bunkDetailsArray;
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the model for Female Hostel
let FemaleHostelModel =
  mongoose.model.FemaleHostelTable || mongoose.model("FemaleHostelTable", FemaleHostelSchema);

// Export the model
module.exports = FemaleHostelModel;
