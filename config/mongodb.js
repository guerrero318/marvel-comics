const mongoose = require("mongoose");

const connectDB = async () => {
  // conn connects to the connection string in the confiv.env file
  const conn = await mongoose.connect(process.env.MONGO_URI);
  // Console logs the string when app is connected to db
  console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
};

module.exports = connectDB;
