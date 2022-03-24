const asyncWrap = require("../middleware/async");
const User = require("../models/User");
const ErrRes = require("../res/errRes");
const jwt = require("jsonwebtoken");

exports.register = asyncWrap(async (req, res, next) => {
  const { firstName, lastName, email, password, password2, role } = req.body;

  //   Validate user input
  if (!(email && password && password2 && firstName && lastName)) {
    res.status(400).send("All inputs are required");
    // return next(new ErrRes("All input is required", 400));
  }
  if (req.body.password !== req.body.password2) {
    return res.status(400).send("Passwords do not match");
  }

  // Check if user in db already
  const oldUser = await User.findOne({ email });

  if (oldUser) {
    return res.status(409).send("User Already Exists. Please Login");
    //   &&
    //   next(new ErrRes("User Already Exist. Please Login", 409))
  }

  // Create the user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    password2,
    role,
  });

  tokenRes(user, 200, res);
});

exports.login = asyncWrap(async (req, res, next) => {
  const { email, password } = req.body;

  //   Validate user input
  if (!(email && password)) {
    res.status(400).send("All inputs are required");
    // return next(new ErrRes("All input is required", 400));
  }

  // Validate if user already in db
  const user = await User.findOne({ email }).select("+password");

  if (user && (await user.passwordMatch(password))) {
    tokenRes(user, 200, res);
  } else {
    res.status(401).send("Invalid Credentials");
  }
});

exports.protectRoute = asyncWrap(async (req, res, next) => {
  let token;
  if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).send("Not authorized to access this route");
  }
  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = await User.findById(decodedToken.id);
    next();
  } catch (error) {
    return res.status(401).send("Not authorized to access this route");
  }
});

const tokenRes = (user, statusCode, res) => {
  const token = user.signJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 3600 * 1000
    ),
    httpOnly: true,
  };
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};

exports.logout = asyncWrap(async (req, res, next) => {
  res
    .cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    })
    .status(200)
    .json({
      success: true,
    });
});

exports.userauth = asyncWrap(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.authorization = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .send(
          `User role ${req.user.role} is not authorized to access this route`
        );
    }
    next();
  };
};
