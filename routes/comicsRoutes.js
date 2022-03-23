// created router to make it look cleaner. All methods will require the controller. GETALL and POST will have same route and getOne, PUT, and Delete will all have a route ending in ID to target that specific comic
const express = require("express");
const router = express.Router();

const {
  protectRoute,
  authorization,
} = require("../controllers/userController");

const {
  getComics,
  getComic,
  createComic,
  updateComic,
  deleteComic,
} = require("../controllers/comicController");
router
  .route("/")
  .get(getComics)
  .post(protectRoute, authorization("admin"), createComic);

router
  .route("/:id")
  .get(getComic)
  .delete(protectRoute, authorization("admin"), deleteComic);

router.route("/").put(protectRoute, authorization("admin"), updateComic);

module.exports = router;
