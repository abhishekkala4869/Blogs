const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  author: {
    type: String,
    required: [true, "Pleas enter product name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, ["Please Enter description"]],
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
    },
    {
      url: {
        type: String,
        required: true,
      },
    },
  ],
  numOfComments: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      user: { type: mongoose.Schema.ObjectId, ref: "user", required: true },
      name: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      allow: {
        type: Boolean,
        required: true,
        default: true,
      },
    },
  ],
  user: { type: mongoose.Schema.ObjectId, ref: "user", required: true },
  createdAt: { type: Date, dafault: Date.now },
});

module.exports = mongoose.model("post", postSchema);
