const reviewsService = require("./reviews.service");
const asyncErrorBoundary = require("..//errors/asyncErrorBoundary");

//check if review exists
async function reviewExists(req, res, next) {
  const { reviewId } = req.params;
  const foundReview = await reviewsService.read(reviewId);

  if (foundReview) {
    res.locals.review = foundReview;
    return next();
  }
  return next({ status: 404, message: `Reviews cannot be found.` });
}

async function list(req, res) {
  const data = await reviewsService.list(req.params.movieId);
  res.json({ data });
}


async function update(req, res) {
  console.log(req.body)
  const updatedReview = {
    ...req.body.data,
    review_id: res.locals.review.review_id, 
  };
  const data = await reviewsService.update(updatedReview);
  res.status(201).json({ data });
}

async function destroy(req, res){
const { review } = res.locals;
  await reviewsService.delete(review.review_id);
  res.sendStatus(204);
};


module.exports = {
    list: asyncErrorBoundary(list),
    update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
    delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
  };