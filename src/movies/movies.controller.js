const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//validation middleware

async function movieExists(req, res, next) {
  const { movieId } = req.params;
  const foundmovie = await moviesService.read(movieId);
  if (foundmovie) {
    res.locals.movie = foundmovie;
    return next();
  }
  return next({
    status: 404,
    message: `Movie cannot be found.`,
  });
}

async function list(req, res) {
  const { is_showing } = req.query;
  if(is_showing) {
    const data = await (await moviesService.listShowing()).splice(0, 15);
    return res.json({ data })
  }
  const data = await moviesService.list();
  res.json({ data });
}


async function read(req, res, next) {
  res.json({ data: res.locals.movie });
}


async function listTheaters(req, res, next) {
  const { movieId } = req.params;
  const data = await moviesService.listTheaters(movieId);
  res.json({ data });
}

async function listReviews(req, res) {
  const { movieId } = req.params;
  const data = await moviesService.listReviews(movieId);
  res.json({ data });
}

module.exports = {
  list,
  read: [asyncErrorBoundary(movieExists), read],
  listTheaters: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(listTheaters),
  ],
  listReviews: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(listReviews),
  ],
};
