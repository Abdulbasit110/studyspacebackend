const mongoose = require("mongoose");

const CollectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: null },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    visibility: { type: String, enum: ["public", "private"], default: "private" },
    tags: [{ type: String, default: null }],
    resources: [
      {
        resourceId: { type: mongoose.Schema.Types.ObjectId, ref: "Resource", default: null },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    comments: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
        comment: { type: String, default: null },
        commentedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Collection", CollectionSchema);
