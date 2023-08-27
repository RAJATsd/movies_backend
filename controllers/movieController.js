const MovieModel = require("../models/movie");

exports.getAllMovies = async (_req, res) => {
  const allMovies = await MovieModel.find().limit(20);
  return res.send({ movies: allMovies });
};
