const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
//Installed colors package to easily find msgs in terminal
const colors = require("colors");
const bodyParser = require("body-parser");
const connectMongoDB = require("./config/mongodb");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");
// Load env vars
dotenv.config({ path: "./config/config.env" });

const app = express();
// This tells Express we're using EJS as the template engine.
// Needs to be placed before an app.use, app.get or app.post methods
app.set("view engine", "ejs");

// use static file
app.use(express.static(__dirname + "/public"));

// Body Parser
app.use(require("body-parser").json());
app.use(require("body-parser").urlencoded({ extended: false }));

// Cookie parser
app.use(cookieParser());

// Connect to database
connectMongoDB();

// Route files
const comics = require("./routes/comicsRoutes");
const adminRoutes = require("./routes/adminRoutes");
const user = require("./routes/userRoutes");

// Mount routers
app.use("/api/v1/marvelcomics", comics);
app.use("/admin", adminRoutes);
app.use("/users", user);

// Middleware logger (installed morgan to make it look cleaner)
if (process.env.NODE_ENV === "dev") {
  app.use(morgan("dev"));
}

// Port is equal to the port set in config.env file but also given || 5003 in case it fails or can't read it
const PORT = process.env.PORT || 5003;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.magenta
      .bold
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server and exit process
  server.close(() => process.exit(1));
});
