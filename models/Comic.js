const mongoose = require("mongoose");

const ComicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
    unique: true,
    trim: true,
    maxlength: [50, "Title can not be more than 50 characters"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
    maxlength: [500, "Name can not be more than 50 characters"],
  },
  cost: Number,
  photo: {
    type: String,
    default: "no-photo.jpg",
  },
});

module.exports = mongoose.model("Comic", ComicSchema);
