const mongoose = require("mongoose");

const ComicsSchema = new mongoose.Schema({
  /*
Schema inside here

*/
});

module.exports = mongoose.model("Comic", ComicSchema);
