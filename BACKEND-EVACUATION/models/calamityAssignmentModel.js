const mongoose = require('mongoose');
const calamityAssignmentSchema = new mongoose.Schema({
  center: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EvacuationCenter",
    required: true,
  },
  calamity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Calamity",
    required: true,
  },
  resources: [
    {
      resource: { type: mongoose.Schema.Types.ObjectId, ref: "Resource" },
      quantity: { type: Number, required: true },
    },
  ],
  dateAssigned: { type: Date, default: Date.now },
});
const CalamityAssignment = mongoose.model(
    "CalamityAssignment",
    calamityAssignmentSchema
);

module.exports = CalamityAssignment;

