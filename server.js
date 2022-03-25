const express = require("express");
// const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const dotenv = require("dotenv");
const morgan = require("morgan");
//Installed colors package to easily find msgs in terminal
const colors = require("colors");
const bodyParser = require("body-parser");
const connectMongoDB = require("./config/mongodb");

// Load environment variables
dotenv.config({ path: "./config/config.env" });

const app = express();

// Passport Config
require("./config/passport")(passport);

// This tells Express we're using EJS as the template engine.
// Needs to be placed before an app.use, app.get or app.post methods
// app.use(expressLayouts);
app.set("view engine", "ejs");

// use static file
app.use(express.static(__dirname + "/public"));

// Body Parser
app.use(require("body-parser").json());
app.use(require("body-parser").urlencoded({ extended: true }));

app.use(
  session({
    secret: "comiclabs",
    resave: true,
    saveUninitialized: true,
  })
);

// Middleware for Passport
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Connect to database
connectMongoDB();

// Route files
const comics = require("./routes/comicsRoutes");
const adminRoutes = require("./routes/adminRoutes");
const user = require("./routes/userRoutes");

// Mount routers
app.use("/api/v1/marvelcomics", comics);
app.use("/", adminRoutes);
app.use("/", user);

// Middleware logger (installed morgan to make it look cleaner)
if (process.env.NODE_ENV === "dev") {
  app.use(morgan("dev"));
}

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Port is equal to the port set in config.env file but also given || 5003 in case it fails or can't read it
const PORT = process.env.PORT || 5003;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.magenta
      .bold
  )
);
