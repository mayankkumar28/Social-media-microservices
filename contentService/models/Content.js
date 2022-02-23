const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 1,
    },
    story: {
      type: String,
      required: true,
      minlength: 1,
    },
    publishedDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    userId: {
      type: String,
      required: true,
    },
    reads: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Content", contentSchema);
