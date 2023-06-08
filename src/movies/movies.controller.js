const service = require("./movies.service");

async function list(req, res, next) {
  const showing = req.query.is_showing;
  if (showing) {
    const data = await service.isShowing();
    return res.json({ data });
  }
  const data = await service.list();
  res.json({ data });
}

async function read(req, res, next) {
  return res.json({ data: res.locals.movie });
}

async function movieExists(req, res, next) {
  const { movieId } = req.params;
  const movie = await service.read(movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  res.status(404).send({ error: "Movie cannot be found." });
}

async function listReviews(req, res, next) {
  const movieId = res.locals.movie.movie_id;
  const data = await service.readReviews(movieId);
  res.json({ data });
}

async function listTheaters(req, res, next) {
  const movieId = res.locals.movie.movie_id;
  const data = await service.readTheaters(movieId);
  res.json({ data });
}

module.exports = {
  list,
  read: [movieExists, read],
  listTheaters: [movieExists, listTheaters],
  listReviews: [movieExists, listReviews],
};