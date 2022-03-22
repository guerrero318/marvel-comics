const asyncWrap = require("../middleware/async");
const Comic = require("../models/Comic");

exports.getComics = asyncWrap(async (req, res, next) => {
  const comics = await Comic.find();
  // res.status(200).json({
  //   success: true,
  //   count: comics.length,
  //   data: comics,
  // });
  res.status(200).render("store", { pageTitle: "Comic Store", data: comics });
  next();
});

exports.getComic = asyncWrap(async (req, res, next) => {
  const comic = await Comic.findById(req.params.id);

  if (!comic) {
    return next(new ErrRes(`Comic not found with id of ${req.params.id}`, 404));
  }
  res.status(200).json({
    success: true,
    data: comic,
  });
});

exports.createComic = asyncWrap(async (req, res, next) => {
  const comic = await Comic.create(req.body);

  // res.status(201).json({
  //   success: true,
  //   data: comic,
  // });
  res.redirect("/api/v1/marvelcomics");
});

exports.updateComic = asyncWrap(async (req, res, next) => {
  const comic = await Comic.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!comic) {
    return next(new ErrRes(`Comic not found with id of ${req.params.id}`, 404));
  }
  res.status(200).json({
    success: true,
    data: comic,
  });
});

exports.deleteComic = asyncWrap(async (req, res, next) => {
  const comic = await Comic.findByIdAndDelete(req.params.id);

  if (!comic) {
    return next(new ErrRes(`Comic not found with id of ${req.params.id}`, 404));
  }
  res.status(200).json({
    success: true,
  });
});
