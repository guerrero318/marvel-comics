const ErrRes = require("../res/errRes");

const errorMiddleware = (err, req, res, next) => {
  let error = { ...err };
  error.msg = err.message;

  //Log to console for dev
  console.log(err);

  //Mongoose bad ObjectId
  if (err.name === "CastError") {
    const msg = `Comic not found with id of ${err.value}`;
    error = new ErrRes(msg, 404);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const msg = Object.values(err.errors).map((value) => value.msg);
    error = new ErrRes(msg, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.msg || "Server Error",
  });
};

module.exports = errorMiddleware;
