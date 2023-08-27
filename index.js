require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { getAllMovies } = require("./controllers/movieController");

const app = express();
const API_PORT = process.env.PORT || "3001";

app.get("/", (req, res) => {
  res.send({ success: true });
});

app.get("/movies", getAllMovies);

const uri = `mongodb+srv://rajatSharma:${process.env.MONGO_PW}@moviecluster.r4mjtxv.mongodb.net/sample_mflix?retryWrites=true&w=majority`;

mongoose
  .connect(uri)
  .then(() => console.log("connected to the db"))
  .catch((err) => console.log("db connection error", err));

app.listen(API_PORT, () => console.log("Connected to 3001"));
