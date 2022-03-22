const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const bodyParser = require("body-parser");
const errMiddleware = require("./middleware/err");
const connectMongoDB = require("./config/mongodb");

const app = express();

// Body Parser
app.use(require("body-parser").json());
app.use(require("body-parser").urlencoded({ extended: true }));

app.use(errMiddleware);

app.set("view enginer", "ejs");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectMongoDB();

// Route files
const comics = require("./routes/comicsRoutes");

// Mount routers
app.use("/api/v1/marvelcomics", comics);

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
