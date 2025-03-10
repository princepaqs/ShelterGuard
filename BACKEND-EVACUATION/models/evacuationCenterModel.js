const mongoose = require("mongoose");

const evacuationCenterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: {
        address: String,
        coordinates: {
        lat: Number,
        lng: Number,
        },
    },
    capacity: { type: Number, required: true },
  },
  {
    collection: "evacuationcenters", // Ensure this refers to the correct collection
  }
);

module.exports = mongoose.model("EvacuationCenter", evacuationCenterSchema);  // Correct export here

