const mongoose = require("mongoose");
const { Schema } = mongoose;

const watchListSchema = new Schema({
  userId: String,
  watchlist: [{ type: Schema.Types.ObjectId, ref: "movie" }],
  like: [{ type: Schema.Types.ObjectId, ref: "movie" }],
});

module.exports = mongoose.model("watchListAndLike", watchListSchema);
