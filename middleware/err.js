//  The Error class we inherited is required so we can create custom error handling by targeting the error name and then customizing it with conditionals
const ErrRes = require("../res/errRes");

const errorMiddleware = (err, req, res, next) => {
  let error = { ...err };
  error.msg = err.message;

  //Log to console for dev
  console.log(err);

  //Bad ObjectId
  if (err.name === "CastError") {
    const msg = `Comic not found with id: ${err.value}`;
    error = new ErrRes(msg, 404);
  }

  // Validation error
  if (err.name === "ValidationError") {
    const msg = Object.values(err.errors).map((value) => value.msg);
    error = new ErrRes(msg, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.msg || "Internal Server Error",
  });
};

module.exports = errorMiddleware;
