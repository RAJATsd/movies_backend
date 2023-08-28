require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const {
  getAllMovies,
  getMovieDetails,
  getWatchListAndLikes,
  addMovieToLikeOrWatchList,
  removeWatchlistOrLike,
} = require("./controllers/movieController");

const app = express();
const API_PORT = process.env.PORT || "3001";

app.use(cors());

app.get("/", (_req, res) => {
  res.send({ success: true });
});

app.get("/movies", getAllMovies);

app.get("/movie/:id", getMovieDetails);

app.get("/watchlistandlike", getWatchListAndLikes);

app.post("/watchlistandlike/:movieId/:entity", addMovieToLikeOrWatchList);

app.delete("/watchlistandlike/:movieId/:entity", removeWatchlistOrLike);

const uri = `mongodb+srv://rajatSharma:${process.env.MONGO_PW}@moviecluster.r4mjtxv.mongodb.net/sample_mflix?retryWrites=true&w=majority`;

mongoose
  .connect(uri)
  .then(() => console.log("connected to the db"))
  .catch((err) => console.log("db connection error", err));

app.listen(API_PORT, () => console.log("Connected to 3001"));
