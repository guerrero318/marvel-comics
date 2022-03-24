const axios = require("axios");

exports.getAllComics = (req, res) => {
  // make a get request to /api/users
  axios
    .get("http://localhost:5003/api/v1/marvelcomics")
    .then((response) => {
      const data = response.data.data;
      res.render("store", { pageTitle: "Comic Store", data: data });
    })
    .catch((err) => console.log(err));
};

exports.getAddComic = (req, res) => {
  res.render("addComic", {
    pageTitle: "Add Comic",
  });
};

exports.getUpdateComic = (req, res) => {
  const id = req.query.id;
  axios
    .get(`http://localhost:5003/api/v1/marvelcomics/${id}`)
    .then((comicData) => {
      res.render("updateComic", {
        pageTitle: "Update Comic",
        data: comicData.data.data,
      });
    })
    .catch((err) => console.log(`ADIMIN CONTROLLER ${err}`));
};
