const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

// /admin/add-comic => GET
router.get("/add-comic", adminController.getAddComic);
router.get("/update-comic", adminController.getUpdateComic);
router.get("/comics", adminController.getAllComics);
module.exports = router;
