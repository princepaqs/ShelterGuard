// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ["evacuee", "admin", "worker"],
      default: "evacuee",
    },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    centerName: { type: String, required: true },
    centerID: { type: String, required: true },
    contactInfo: {
      phone: { type: String, unique: true },
      email: { type: String, unique: true },
    },
    additionalDetails: {
      headOfFamilyName: { type: String, required: true },
      isPWD: { type: Boolean, default: false },
      pwdType: {
        type: String,
        enum: [
          "none",
          "visual",
          "hearing",
          "mobility",
          "cognitive",
          "mental",
          "other",
        ],
        default: "none",
      },
    },
  },
  {
    collection: "users", // Fixed 'collation' to 'collection'
  }
);

module.exports = mongoose.model("User", UserSchema);
