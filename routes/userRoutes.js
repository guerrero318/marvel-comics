const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");

const { ensureAuthenticated } = require("../config/authentication");

const { register, login, logout } = require("../controllers/userController");

router.get("/comics", ensureAuthenticated, (req, res) =>
  res.render("/comics", {
    user: req.user,
  })
);
// Renders the login Page
router.get("/login", (req, res) => res.render("login"));

// Renders the register Page
router.get("/register", (req, res) => res.render("register"));

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Logout
router.get("/logout", logout);

module.exports = router;
