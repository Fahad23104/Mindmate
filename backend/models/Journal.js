const mongoose = require("mongoose");

const JournalSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    sentiment: String,
    score: Number,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
    ,
    createdAt: {
    type: Date,
    default: Date.now
  }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Journal", JournalSchema);
