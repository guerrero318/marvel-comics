const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

const { ensureAuthenticated } = require("../config/authentication");
// /add-comic => GET
router.get("/add-comic", ensureAuthenticated, adminController.getAddComic);
router.get(
  "/update-comic",
  ensureAuthenticated,
  adminController.getUpdateComic
);
router.get("/comics", adminController.getAllComics);
module.exports = router;
