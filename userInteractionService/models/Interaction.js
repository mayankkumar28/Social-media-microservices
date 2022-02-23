const mongoose = require("mongoose");

const interactionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    likedContents: {
      type: Array,
      default: [],
    },
    readContents: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Interaction", interactionSchema);
