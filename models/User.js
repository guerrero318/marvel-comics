// installed mongoose so we can create schemas and define the structure of the document, default values, validators, etc
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// All users will be made based off of this model
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
    select: false,
  },
  password2: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
  token: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  const gensalt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, gensalt);
});
UserSchema.pre("save", async function (next) {
  const gensalt = await bcrypt.genSalt(10);
  this.password2 = await bcrypt.hash(this.password2, gensalt);
});

//Match password and user login password
UserSchema.methods.passwordMatch = async function (loginPassword) {
  return await bcrypt.compare(loginPassword, this.password);
};

UserSchema.methods.signJwtToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.TOKEN_KEY,
    { expiresIn: "30d" }
  );
};

module.exports = mongoose.model("User", UserSchema);
