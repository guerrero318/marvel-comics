const express = require("express");
const router = express.Router();

const {
  getComics,
  getComic,
  createComic,
  updateComic,
  deleteComic,
} = require("../controllers/comicController");
router.route("/").get(getComics).post(createComic);

router.route("/:id").get(getComic).put(updateComic).delete(deleteComic);

module.exports = router;
