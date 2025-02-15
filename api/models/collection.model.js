const mongoose = require("mongoose");

const CollectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  tags: [String],
  visibility: { type: String, enum: ["public", "private"], default: "private" },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Collection", CollectionSchema);
