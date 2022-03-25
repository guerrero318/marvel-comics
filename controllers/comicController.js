const asyncWrap = require("../middleware/async");
const Comic = require("../models/Comic");
const ErrRes = require("../res/errRes");

exports.getComics = asyncWrap(async (req, res, next) => {
  const comics = await Comic.find();
  // res.status(200).render("store", { pageTitle: "Comic Store", data: comics });

  //returns a status of 200 and then JSON that says it was succesful, the amount of comics, and all the data for the comics
  res.status(200).json({
    success: true,
    count: comics.length,
    data: comics,
  });
});

exports.getComic = asyncWrap(async (req, res, next) => {
  const comic = await Comic.findById(req.params.id);
  //returns a status of 200 and then JSON that says it was succesful, and all the data for that targeted comic. If a comic doesnt match that id then it will return a msg with 404 which used the inherited Error class
  if (!comic) {
    return next(new ErrRes(`Comic not found with id: ${req.params.id}`, 404));
  }
  res.status(200).json({
    success: true,
    data: comic,
  });
});

exports.createComic = asyncWrap(async (req, res, next) => {
  // req.body.user = req.user.id;
  const comic = await Comic.create(req.body);

  //returns a status of 201 and then JSON that says it was succesful, and all the data for that created comic.
  res.redirect("/comics");
});

exports.updateComic = asyncWrap(async (req, res, next) => {
  let comic = await Comic.findOneAndUpdate(req.params.id);
  //returns a status of 200 and then JSON that says it was succesful, and all the data for that targeted comic. If a comic doesnt match that id then it will return a msg with 404 which used the inherited Error class
  if (!comic) {
    return next(new ErrRes(`Comic not found with id: ${req.params.id}`, 404));
  }

  // Only comics creator can update
  // if (comic.user.toString() !== req.user.id && req.user.role !== "admin") {
  //   return res.status(401).send("Not authorized to access this comic");
  // }
  comic = await Comic.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: comic,
  });
});

exports.deleteComic = asyncWrap(async (req, res, next) => {
  const comic = await Comic.findByIdAndDelete(req.params.id);
  //returns a status of 200 and then JSON that says it was succesful with no data since it was deleted. If a comic doesnt match that id then it will return a msg with 404 which used the inherited Error class
  if (!comic) {
    return res.status(404).send(`Comic not found with id: ${req.params.id}`);
  }
  // Only comics creator can update
  // if (comic.user.toString() !== req.user.id && req.user.role !== "admin") {
  //   return res.status(401).send("Not authorized to access this comic");
  // }
  comic.remove();
  res.status(200).json({
    success: true,
  });
});
