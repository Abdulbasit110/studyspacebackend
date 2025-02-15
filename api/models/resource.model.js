const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      minlength: [2, "Title must be at least 2 characters"]
    },
    description: {
      type: String,
      trim: true
    },
    type: {
      type: String,
      enum: {
        values: ["Book", "Repository", "Video", "Website", "Bootcamp", "Youtube Channel", "Course", "Community"],
        message: "{VALUE} is not a valid resource type"
      }
    },
    level: {
      type: String,
      enum: {
        values: ["Beginner", "Intermediate", "Advanced", "Everyone"],
        message: "{VALUE} is not a valid level"
      }
    },
    contentUrl: {
      type: String,
      trim: true
    },
    createdBy: {
      type: String,
      trim: true
    },
    info: {
      category: {
        type: String,
        trim: true
      },
      link: {
        type: String,
        trim: true
      },
      published: {
        type: String
      }
    },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    collectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Collection", default: null },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Resource", ResourceSchema);
