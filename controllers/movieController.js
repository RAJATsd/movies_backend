const MovieModel = require("../models/movie");

exports.getAllMovies = async (req, res) => {
  try {
    const { sortBy, genre, year, page } = req.query;
    const pageNumber = parseInt(page);
    const dbQuery = MovieModel.find({
      ...(year && { year: parseInt(year) }),
      ...(genre && { genres: { $in: [genre] } }),
    });

    if (sortBy && (sortBy === "rating" || sortBy === "release")) {
      dbQuery = dbQuery.sort({
        ...(sortBy === "rating" ? { "imdb.rating": -1 } : { release: -1 }),
      });
    }

    const allMovies = await dbQuery
      .skip(pageNumber > 1 ? 100 * (pageNumber - 1) : 0)
      .limit(100)
      .exec();
    return res.send({
      page: pageNumber > 1 ? pageNumber : 1,
      total_pages: 3,
      results: allMovies,
    });
  } catch (err) {
    return res.status(500).send("INTERNAL SERVER ERROR");
  }
};

exports.getMovieDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await MovieModel.findById(id);
    return res.send(movie);
  } catch (err) {
    return res.send(err);
  }
};
