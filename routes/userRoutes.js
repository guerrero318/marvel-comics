const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  userauth,
  protectRoute,
} = require("../controllers/userController");
router.post("/register", register);
router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/register", (req, res) => {
  res.render("register");
});
router.post("/login", login);
router.get("/auth", protectRoute, userauth);
router.get("/logout", logout);

module.exports = router;
