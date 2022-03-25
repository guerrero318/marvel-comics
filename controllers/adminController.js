const axios = require("axios");
const Comic = require("../models/Comic");
const asyncWrap = require("../middleware/async");

exports.getAllComics = asyncWrap(async (req, res) => {
  // make a get request to /api/users
  // axios
  //   .get("http://localhost:5003/api/v1/marvelcomics")
  //   .then((response) => {
  //     const data = response.data.data;
  //     res.render("store", { pageTitle: "Comic Labs", data: data });
  //   })
  //   .catch((err) => console.log(err));
  const comics = await Comic.find();
  res.render("store", { pageTitle: "Comic Labs", data: comics });
});

exports.getAddComic = (req, res) => {
  res.render("addComic", {
    pageTitle: "Add Comic",
  });
};

exports.getUpdateComic = asyncWrap(async (req, res) => {
  const id = req.query.id;
  // axios
  //   .get(`http://localhost:5003/api/v1/marvelcomics/${id}`)
  //   .then((comicData) => {
  //     res.render("updateComic", {
  //       pageTitle: "Update Comic",
  //       data: comicData.data.data,
  //     });
  //   })
  //   .catch((err) => console.log(`ADIMIN CONTROLLER ${err}`));
  let comic = await Comic.findOneAndUpdate(id);

  if (!comic) {
    return res.status(404).send(`Comic not found with id: ${req.params.id}`);
  }
  comic = await Comic.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.render("updateComic", {
    pageTitle: "Update Comic",
    data: comic,
  });
});
