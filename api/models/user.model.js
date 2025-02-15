const mongoose = require("mongoose");
const { rolesEnum } = require("../../util/enum");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: Object.values(rolesEnum), // Convert enum object to an array
    default: rolesEnum.CUSTOMER, // Use the constant from rolesEnum
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  googleId: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
