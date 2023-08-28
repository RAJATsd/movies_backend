const MovieModel = require("../models/movie");
const WatchlistAndLikeModel = require("../models/watchlist");
const DUMMY_USERID = "asuhdiuh6923487qwohdoh23i2i3rhipd";

exports.getAllMovies = async (req, res) => {
  try {
    const { sortBy, genre, year, page, query } = req.query;
    const regexPattern = new RegExp(`\\b${query}\\b`, "i");
    const pageNumber = parseInt(page);

    const findObject = {
      ...(year && { year: parseInt(year) }),
      ...(genre && { genres: { $in: [genre] } }),
      ...(query && { title: { $regex: regexPattern } }),
    };
    const dbQuery = MovieModel.find(findObject);

    if (sortBy && (sortBy === "rating" || sortBy === "release")) {
      dbQuery = dbQuery.sort({
        ...(sortBy === "rating" ? { "imdb.rating": -1 } : { release: -1 }),
      });
    }

    const allMovies = await dbQuery
      .skip(pageNumber > 1 ? 100 * (pageNumber - 1) : 0)
      .limit(100)
      .exec();
    const moviesCount = await MovieModel.countDocuments(findObject);

    return res.send({
      page: pageNumber > 1 ? pageNumber : 1,
      total_pages: Math.ceil(moviesCount / 100),
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

exports.getWatchListAndLikes = async (_req, res) => {
  try {
    const userId = DUMMY_USERID;
    const watchListAndLikes = await WatchlistAndLikeModel.findOne({ userId });

    return res.send(watchListAndLikes);
  } catch (err) {
    return res.send(err);
  }
};

exports.addMovieToLikeOrWatchList = async (req, res) => {
  try {
    const userId = DUMMY_USERID;
    const { movieId, entity } = req.params;

    if (!movieId || !entity || !(entity === "watchlist" || entity === "like")) {
      throw "required params were not sent correctly";
    }

    let document = await WatchlistAndLikeModel.findOne({ userId });

    if (!document) {
      document = new WatchlistAndLikeModel({ userId });
    }

    if (entity === "watchlist") {
      document.watchlist.push(movieId);
    } else {
      document.like.push(movieId);
    }

    const updatedData = await document.save();

    return res.send({ message: "Saved successully", ...updatedData });
  } catch (err) {
    return res.send(err);
  }
};

exports.removeWatchlistOrLike = async (req, res) => {
  try {
    const userId = DUMMY_USERID;
    const { movieId, entity } = req.params;

    if (!movieId || !entity) {
      throw "MovieId or entity missing";
    }

    const updateOperation =
      entity === "watchlist"
        ? { $pull: { watchlist: movieId } }
        : entity === "like"
        ? { $pull: { like: movieId } }
        : null;

    if (!updateOperation) {
      throw "Invalid entity type";
    }

    await WatchlistAndLikeModel.updateOne({ userId }, updateOperation);

    return res.json({
      message: "Movie removed successfully",
      movieId,
      entity,
    });
  } catch (err) {
    return res.send(err);
  }
};
