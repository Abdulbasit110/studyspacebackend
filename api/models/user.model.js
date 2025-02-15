const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, default: null }, // Nullable
    authType: { type: String, enum: ["google", "password"], default: null }, // Nullable
    profilePicture: { type: String, default: null },
    bio: { type: String, default: null },
    followers: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
    ],
    following: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
    ],
    firstName: { type: String, default: null }, // Nullable
    lastName: { type: String, default: null }, // Nullable
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Ensures the unique index ignores documents without googleId
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
