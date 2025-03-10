const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    unit: { type: String, required: true },
    quantity: { type: Number, required: true },
    source: { type: String, required: true },
    dateReceived: { type: Date, default: Date.now },
    },
  {
    collection: "resources", // Ensure this refers to the correct collection
  }
);

module.exports = mongoose.model("Resource", resourceSchema);  // Correct export here

