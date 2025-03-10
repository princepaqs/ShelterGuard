const mongoose = require('mongoose');

const evacueeAssignmentSchema = new mongoose.Schema({
  evacuee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  center: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EvacuationCenter",
    required: true,
  },
  calamity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Calamity",
    required: false,
  },
  resourcesAccepted: [
    {
      resource: { type: mongoose.Schema.Types.ObjectId, ref: "Resource" },
      quantity: { type: Number, required: true },
    },
  ],
  status: {
    attendance: {
      type: String,
      enum: ["en route", "checked in", "checked out"],
      default: "en route",
    },
    health: {
      isWounded: { type: Boolean, default: false },
      woundDescription: { type: String },
      isCritical: { type: Boolean, default: false },
    },
    time: {
      enRoute: { type: Date, default: null },
      checkIn: { type: Date, default: null },
      checkOut: { type: Date, default: null },
    },
  },
});

const EvacueeAssignment = mongoose.model(
  "EvacueeAssignment",
  evacueeAssignmentSchema
);

module.exports = EvacueeAssignment;
