// installed mongoose so we can create schemas and define the structure of the document, default values, validators, etc
const mongoose = require("mongoose");

// All comics will be made based off of this model
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
