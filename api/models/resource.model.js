const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: null },
    type: { type: String, enum: ["pdf", "video", "link", "notes"], required: true },
    contentUrl: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    collectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Collection", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resource", ResourceSchema);
