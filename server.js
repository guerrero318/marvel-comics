const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const bodyParser = require("body-parser");
const errMiddleware = require("./middleware/err");
const connectMongoDB = require("./config/mongodb");
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
app.use(require("body-parser").urlencoded({ extended: true }));

app.use(errMiddleware);

// Connect to database
connectMongoDB();

// Route files
const comics = require("./routes/comicsRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Mount routers
app.use("/api/v1/marvelcomics", comics);
app.use("/admin", adminRoutes);

// Middleware logger
if (process.env.NODE_ENV === "dev") {
  app.use(morgan("dev"));
}

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
