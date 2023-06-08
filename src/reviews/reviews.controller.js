const service = require("./reviews.service");

async function destroy(req, res) {
  const { review } = res.locals;
  await service.delete(review.review_id);
  res.sendStatus(204);
}

async function reviewExists(req, res, next) {
  const { reviewId } = req.params;
  const review = await service.read(reviewId);
  if (review) {
    res.locals.review = review;
    return next();
  }
  res.status(404).send({ error: "Review cannot be found." });
}

async function update(req, res, next) {
  const updatedReview = {
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };
  const data = await service.update(updatedReview, res.locals.review.review_id);
  res.json({ data });
}

module.exports = {
  delete: [reviewExists, destroy],
  update: [reviewExists, update],
};