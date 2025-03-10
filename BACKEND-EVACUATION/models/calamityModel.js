const mongoose = require("mongoose");

const calamitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["typhoon", "earthquake", "flood", "fire", "other"],
      required: true,
    },
    description: { type: String },
    date: { type: Date, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "inactive" },
  },
  {
    collection: "calamities", // Ensure this refers to the correct collection
  }
);

module.exports = mongoose.model("Calamity", calamitySchema);  // Correct export here
