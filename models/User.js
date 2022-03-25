// // installed mongoose so we can create schemas and define the structure of the document, default values, validators, etc
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// // All users will be made based off of this model
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    default: null,
  },
  lastName: {
    type: String,
    required: true,
    default: null,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  password2: {
    type: String,
    required: true,
    minlength: 6,
  },
});
//   ,role: {
//     type: String,
//     enum: ["user", "admin"],
//     default: "user",
//   },
// })

// here I hash my hash my confirm password to encrypt it using bcrypt and gensalt
// I pass in 10 rounds through gensalt. The higher the salt round, the more time the hashing algorithm takes so you
//want to select a number that is high enough to prevent attacks but not high enough that it slows everything down
UserSchema.pre("save", async function (next) {
  const gensalt = await bcrypt.genSalt(10);
  this.password2 = await bcrypt.hash(this.password2, gensalt);
});

module.exports = mongoose.model("User", UserSchema);
