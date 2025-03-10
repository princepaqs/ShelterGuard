const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contactInfo: { type: String },
  additionalDetails: { type: String }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
